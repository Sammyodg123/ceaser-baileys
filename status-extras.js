'use strict';
const https = require('https');
const http = require('http');

const PALETTE = ['#4A0E1C', '#0B3D2E', '#1B2A49', '#3D1A5C', '#5C2A0E', '#0E4A4A', '#4A1A3D', '#2B2B6B', '#5C1A1A', '#12433A'];
const EMOJIS = ['🔥', '✨', '💫', '🎉', '😍', '💥', '🌟', '👑', '💎', '🚀', '😎', '🥳', '🌈', '💯'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
function pickEmojis(n) {
  const s = new Set();
  while (s.size < n) s.add(pick(EMOJIS));
  return [...s].join('');
}

function fetchBuf(url, hops = 0) {
  return new Promise((resolve, reject) => {
    const get = url.startsWith('https') ? https.get : http.get;
    get(url, (r) => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location && hops < 4) {
        r.resume();
        return resolve(fetchBuf(new URL(r.headers.location, url).toString(), hops + 1));
      }
      if (r.statusCode !== 200) { r.resume(); return reject(new Error('HTTP ' + r.statusCode)); }
      const chunks = [];
      r.on('data', (d) => chunks.push(d));
      r.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function toThumb(buf) {
  try {
    const { Jimp } = require('jimp');
    const img = await Jimp.read(buf);
    img.resize({ w: 400 });
    return await img.getBuffer('image/jpeg', { quality: 70 });
  } catch (e) {
    return buf.length < 60000 ? buf : undefined;
  }
}

function argb(c, d) {
  if (typeof c === 'number') return c >>> 0;
  if (typeof c === 'string') {
    const h = c.replace('#', '');
    if (/^[0-9a-f]{6}$/i.test(h)) return parseInt('ff' + h, 16) >>> 0;
    if (/^[0-9a-f]{8}$/i.test(h)) return parseInt(h, 16) >>> 0;
  }
  return d;
}

function attach(sock) {
  if (!sock || sock.sendGroupInviteStatus) return;
  sock.sendGroupInviteStatus = async (link, opts = {}) => {
    const m = String(link).match(/chat\.whatsapp\.com\/([A-Za-z0-9]{20,24})/);
    if (!m) throw new Error('Not a valid group invite link');
    const url = 'https://chat.whatsapp.com/' + m[1];
    const lib = await import('./lib/index.js');
    const info = await sock.groupGetInviteInfo(m[1]);

    let raw = opts.thumbnail || null;
    if (!raw && opts.thumbnailUrl) raw = await fetchBuf(opts.thumbnailUrl).catch(() => null);
    if (!raw) {
      try { raw = await fetchBuf(await sock.profilePictureUrl(info.id, 'image')); } catch (e) {}
    }
    const jpegThumbnail = raw ? await toThumb(raw) : undefined;

    const me = String(sock.user.id || '').replace(/:\d+@/, '@');
    const jids = [...new Set([me, ...(opts.jids || [])].map((j) =>
      String(j).includes('@') ? String(j) : String(j).replace(/\D/g, '') + '@s.whatsapp.net'))];

    const deco = opts.emojis === false ? '' : pickEmojis(2);
    const body = opts.text ? (deco + ' ' + opts.text).trim() : deco;
    const text = body ? body + '\n' + url : url;
    const bg = opts.backgroundColor || (opts.randomColor === false ? '#4A0E1C' : pick(PALETTE));

    const msg = lib.generateWAMessageFromContent('status@broadcast', {
      extendedTextMessage: Object.assign({
        text,
        matchedText: url,
        canonicalUrl: url,
        title: info.subject,
        description: 'Group chat invite',
        previewType: 0,
        jpegThumbnail,
        inviteLinkGroupTypeV2: 0,
        backgroundArgb: argb(bg, 0xff4a0e1c),
        textArgb: 0xffffffff,
        font: opts.font != null ? opts.font : Math.floor(Math.random() * 5),
        contextInfo: opts.contextInfo
      }, opts.extendedFields || {})
    }, { userJid: me });

    await sock.relayMessage('status@broadcast', msg.message, {
      messageId: msg.key.id,
      statusJidList: jids
    });
    return msg;
  };
}

module.exports = { attach };
