import { Bot } from 'breezer.js';
import Bio from './data/bio.json' assert { type: "json" };
import nHandler, { reRegisterReminders } from './helpers/nHandler.js';
import mongoose from 'mongoose';
import reportHelp from './helpers/reportHelp.js';

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
    if (!msg.guild) return;

    if (Bio.ADMIN.TESTING) {
        if (
            !Bio.ADMIN.DEV_SERVERS.includes(msg.guild.id) &&
            !Bio.ADMIN.DEV_CHANNELS.includes(msg.channel.id)
        ) return;
    }

    if (msg.content.toLowerCase().replace(/[ ]+/g, ' ').split(' ')[0].trim() == nPrefix) {
        if (msg.author.bot) return;
        await nHandler(msg);
    }

    if (msg.author.id == Bio.NB) {
        if (msg.embeds[0].title?.includes('report')) await reportHelp(msg);
    }
});

bot.go(async () => {
    console.log(`Logged in as ${bot.bot.user?.username}`);
    await reRegisterReminders();
    console.log('Reminders Re-registered!');
});
export const client = bot.bot;