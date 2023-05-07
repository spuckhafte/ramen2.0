import { Bot } from 'breezer.js';
import Bio from './data/bio.json' assert { type: "json" };
import nHandler, { reRegisterReminders } from './helpers/nHandler.js';
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
    if (!msg.guild) return;

    if (Bio.ADMIN.TESTING) {
        if (
            !Bio.ADMIN.DEV_SERVERS.includes(msg.guild.id) &&
            !Bio.ADMIN.DEV_CHANNELS.includes(msg.channel.id)
        ) return;
    }

    if (msg.content.toLowerCase().replace(/[ ]+/g, ' ').split(' ')[0].trim() == nPrefix) {
        await nHandler(msg);
    }
});

bot.go(async () => {
    console.log(`Logged in as ${bot.bot.user?.username}`);
    await reRegisterReminders();
    console.log('Reminders Re-registered!');
});
export const client = bot.bot;