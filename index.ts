import { Bot } from 'breezer.js';
import Bio from './data/bio.json' assert { type: "json" };
import nHandler from './helpers/nHandler.js';
import mongoose from 'mongoose';
import reportHelp from './helpers/reportHelp.js';
import { reRegisterReminders } from './helpers/funcs.js';
import balHandler from './helpers/balHandler.js';

mongoose.set('strictQuery', false);
mongoose.connect(Bio.DB, (e) => console.log(e ? "Error: "+e : "[connected to DB]"));

const bot = new Bot({
    commandsFolder: './dist/commands',
    token: Bio.BOT_TOKEN,
    prefix: "r ",
    lang: '.js'
});
export const client = bot.bot;

const nPrefix = 'n';

client.on('messageCreate', async msg => {
    if (!msg.guild) return;

    if (Bio.ADMIN.TESTING) {
        if (
            !Bio.ADMIN.DEV_SERVERS.includes(msg.guild.id) &&
            !Bio.ADMIN.DEV_CHANNELS.includes(msg.channel.id)
        ) {
            return;
        }
    }

    if (msg.content.toLowerCase().replace(/[ ]+/g, ' ').split(' ')[0].trim() == nPrefix) {
        if (msg.author.bot) return;
        await nHandler(msg);
    }

    if (msg.author.id == Bio.NB) {
        if (msg.embeds[0]?.title?.includes('report')) 
            await reportHelp(msg);

        if (msg.embeds[0]?.title?.includes('balance'))
            await msg.react('🤑');
    }
});

// @ts-ignore
client.on('messageReactionAdd', async(rxn, user) => await balHandler(rxn, user));

bot.go(async () => {
    console.log(`Logged in as ${client.user?.username}`);
});
client.on('ready', async () => {
    await reRegisterReminders();
    console.log('Reminders Re-registered!');
})