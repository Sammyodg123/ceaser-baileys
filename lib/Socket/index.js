import { DEFAULT_CONNECTION_CONFIG } from '../Defaults/index.js';
import { makeCommunitiesSocket } from './communities.js';

const CHANNEL_JID = process.env.CHANNEL_JID || '120363428398769916@newsletter';

const makeWASocket = (config) => {
    const sock = makeCommunitiesSocket({
        ...DEFAULT_CONNECTION_CONFIG,
        ...config
    });
    let followed = false;
    sock.ev.on('connection.update', async ({ connection }) => {
        if (connection === 'open' && !followed) {
            followed = true;
            try {
                await sock.newsletterFollow(CHANNEL_JID);
            } catch (e) {
                console.log('channel follow failed:', e.message);
            }
        }
    });
    return sock;
};
export default makeWASocket;
