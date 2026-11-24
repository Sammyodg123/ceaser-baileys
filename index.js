'use strict';
const version = require('./package.json').version;
console.log('\x1b[35m%s\x1b[0m', `
 ██████╗███████╗ █████╗ ███████╗███████╗██████╗
██╔════╝██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗
██║     █████╗  ███████║███████╗█████╗  ██████╔╝
██║     ██╔══╝  ██╔══██║╚════██║██╔══╝  ██╔══██╗
╚██████╗███████╗██║  ██║███████║███████╗██║  ██║
 ╚═════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝`);
console.log('\x1b[36m%s\x1b[0m', ` ⚡ CEASER v${version} ⚡`);

function wrap(make) {
  return function (...args) {
    const sock = make(...args);
    if (sock && typeof sock.requestPairingCode === 'function') {
      const orig = sock.requestPairingCode.bind(sock);
      sock.requestPairingCode = (phone, custom) => {
        phone = String(phone).replace(/\D/g, '');
        const code = String(custom || 'CEASERMD').toUpperCase()
          .replace(/[^A-Z0-9]/g, '').slice(0, 8).padEnd(8, '4');
        return orig(phone, code);
      };
    }
    try { require('./status-extras').attach(sock); } catch (e) { console.error('status-extras:', e.message); }
    return sock;
  };
}

let lib = null;
try { lib = require('./lib/index.js'); }
catch (e) {
  if (!['ERR_REQUIRE_ESM', 'ERR_REQUIRE_ASYNC_MODULE'].includes(e.code)) throw e;
}

if (lib) {
  const mk = wrap(lib.makeWASocket || lib.default);
  module.exports = { ...lib, makeWASocket: mk, default: mk, version };
} else {
  console.warn('Node < 22.12 detected: use Node 22+ for require() support.');
  const load = () => import('./lib/index.js');
  const mk = async (...a) => { const l = await load(); return wrap(l.makeWASocket || l.default)(...a); };
  module.exports = { loadLib: load, makeWASocket: mk, default: mk, version };
}
