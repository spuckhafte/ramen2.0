import { Bot } from 'breezer.js';
import Bio from './data/bio.json' assert { type: "json" };
import nHandler from './helpers/nHandler.js';
import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
mongoose.connect(Bio.DB, (e) => console.log(e ? "Error: "+e : "[connected to DB]"));

const bot = new Bot({
    commandsFolder: './dist/commands',
    token: Bio.BOT_TOKEN,
    prefix: "r+ ",
    lang: '.js'
});

const nPrefix = 'n';

bot.bot.on('messageCreate', async msg => {
    if (msg.author.bot) return;
    if (Bio.ADMIN.TESTING) if (msg.guild?.id != Bio.ADMIN.DEV_SERVER) return;

    if (msg.content.toLowerCase().replace(/[ ]+/g, ' ').split(' ')[0].trim() == nPrefix) {
        await nHandler(msg);
    }
});

bot.go(() => console.log('Logged In'));
export const client = bot.bot;