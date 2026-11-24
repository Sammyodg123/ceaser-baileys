<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=220&section=header&text=CEASER%20BAILYS&fontSize=62&fontColor=ffffff&animation=twinkling&fontAlignY=38&desc=The%20Cleanest%2C%20Most%20Stable%20WhatsApp%20API%20for%20Node.js&descSize=16&descAlignY=62" width="100%"/>

<a href="https://git.io/typing-svg">
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=00F7FF&center=true&vCenter=true&width=640&lines=No+spam.+No+channel+payloads.;Interactive+buttons+%26+list+menus+%F0%9F%8E%9B%EF%B8%8F;Music+%26+video+straight+from+URL+%F0%9F%8E%B5;Polls%2C+status%2C+groups%2C+newsletters+%F0%9F%93%A2;QR+code+%26+pairing+code+login+%F0%9F%94%91" alt="Typing SVG"/>
</a>

<br><br>

![npm](https://img.shields.io/npm/v/ceaser-bailys?style=for-the-badge&color=00f7ff&logo=npm&label=VERSION)
![downloads](https://img.shields.io/npm/dm/ceaser-bailys?style=for-the-badge&color=ff00c8&label=DOWNLOADS)
![made by](https://img.shields.io/badge/MADE%20BY-LORD%20CEASER-black?style=for-the-badge)
![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=for-the-badge&logo=node.js)
![license](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

**No spam. No channel payloads. Just pure Baileys, fixed & enhanced.**

</div>

---

## 🚀 What's New

- ✅ **Fixed Banner**: no more broken image, now uses a raw GitHub URL
- ✅ **GStatus Thumbnail Fix**: link previews with thumbnails now work in Status
- ✅ **Music & Video URL Import Fixed**: send audio/video directly from a URL without downloading
- ✅ **Clean Code**: all spam channel payloads removed permanently
- ✅ **Jimp 1.6.0**: fixed the `ResizeStrategy.BILINEAR` error

## 📦 Installation

```bash
npm install ceaser-bailys
```

## ⚡ Quick Start

```js
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('ceaser-bailys')
const { Boom } = require('@hapi/boom')

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const sock = makeWASocket({ auth: state, printQRInTerminal: true })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) start()
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    const jid = m.key.remoteJid
    const text = m.message.conversation || m.message.extendedTextMessage?.text

    if (text === 'ping') await sock.sendMessage(jid, { text: 'pong 🏓' })
  })
}

start()
```

## 🔥 Cool Things You Can Do

### 1. 🎛️ Interactive Buttons
```js
await sock.sendMessage(jid, {
  text: 'Choose an option',
  buttons: [
    { buttonId: 'id1', buttonText: { displayText: 'Option 1' }, type: 1 },
    { buttonId: 'id2', buttonText: { displayText: 'Option 2' }, type: 1 }
  ],
  headerType: 1
})
```

### 2. 📜 Interactive List Menu
```js
await sock.sendMessage(jid, {
  text: 'Pick from the menu',
  buttonText: 'Open Menu',
  sections: [{
    title: 'Main Menu',
    rows: [
      { title: '🎵 Music', rowId: 'music' },
      { title: '🎥 Video', rowId: 'video' },
      { title: '📊 Poll', rowId: 'poll' }
    ]
  }]
})
```

### 3. 📊 Polls & Voting
```js
await sock.sendMessage(jid, {
  poll: { name: 'Favorite Color?', values: ['Red', 'Blue', 'Green'], selectableCount: 1 }
})
```

### 4. 🎵 Music & Video from URL
```js
// Send music directly from a URL
await sock.sendMessage(jid, {
  audio: { url: 'https://example.com/song.mp3' },
  mimetype: 'audio/mpeg',
  ptt: false
})

// Send video directly from a URL
await sock.sendMessage(jid, {
  video: { url: 'https://example.com/video.mp4' },
  caption: 'Check this out 🎥'
})
```

### 5. 📸 Status with Link Preview
```js
await sock.sendMessage('status@broadcast', {
  text: 'https://www.npmjs.com/package/ceaser-bailys'
}, { statusJidList: [jid] })
```

### 6. 👥 Group Management
```js
await sock.groupCreate('My Group', [jid])
await sock.groupParticipantsUpdate(groupJid, [jid], 'promote')
await sock.groupInviteCode(groupJid)
```

### 7. 📰 Newsletter & Channels
```js
await sock.newsletterFollow('120363XXXXXXXXXX@newsletter')
await sock.newsletterUnfollow('120363XXXXXXXXXX@newsletter')
```

### 8. 💬 More Powerful Features

- ✅ **Messages:** Text, Image, Video, Audio, Document, Sticker, Voice Note
- ✅ **Interactive:** Buttons, List Menus, Polls, Template Messages
- ✅ **Media from URL:** no need to download, send directly from a link
- ✅ **Status:** Text, Image, Video Status with link previews
- ✅ **Groups:** Create, Manage, Admin controls, Invite links, Participants
- ✅ **Privacy:** Presence (typing, recording, online), Read receipts
- ✅ **Advanced:** Edit message, Delete message, Reactions, Star message
- ✅ **Auth:** QR Code & Pairing Code login

## 🛠️ Fixes in this Fork

| Issue | Original Baileys | Ceaser Bailys |
|---|---|---|
| Spam Channel Payloads | ❌ Has spam links | ✅ Removed completely |
| GStatus Thumbnail | ❌ Broken preview | ✅ Fixed with thumbnails |
| Music URL Import | ❌ Fails to send | ✅ Direct URL works |
| Video URL Import | ❌ Fails to send | ✅ Direct URL works |
| Jimp Error | ❌ BILINEAR error | ✅ Jimp 1.6.0 |
| Banner | ❌ Broken | ✅ Raw GitHub URL |

## 📱 Run on Termux

```bash
pkg update && pkg install nodejs git -y
npm install ceaser-bailys
node index.js
```

## 📄 License

MIT © Lord Ceaser

<div align="center">

Made with ❤️ for the Baileys community. Clean, Stable, Powerful.

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=100&section=footer" width="100%"/>

</div>
