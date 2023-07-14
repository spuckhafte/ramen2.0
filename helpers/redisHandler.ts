import { createClient } from 'redis';
import Bio from '../data/bio.json' assert { type: "json" };

export const redi = createClient({
    ...Bio.REDIS.CONNECT,
    socket: {
        connectTimeout: 100 * 1000
    }
});