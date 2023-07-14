import { createClient } from 'redis';
import Bio from '../data/bio.json' assert { type: "json" };

export const redi = createClient(Bio.REDIS.CONNECT);