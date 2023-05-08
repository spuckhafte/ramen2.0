var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Bot } from 'breezer.js';
import Bio from './data/bio.json' assert { type: "json" };
import nHandler from './helpers/nHandler.js';
import mongoose from 'mongoose';
import reportHelp from './helpers/reportHelp.js';
import { reRegisterReminders } from './helpers/funcs.js';
mongoose.set('strictQuery', false);
mongoose.connect(Bio.DB, (e) => console.log(e ? "Error: " + e : "[connected to DB]"));
const bot = new Bot({
    commandsFolder: './dist/commands',
    token: Bio.BOT_TOKEN,
    prefix: "r ",
    lang: '.js'
});
const nPrefix = 'n';
bot.bot.on('messageCreate', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!msg.guild)
        return;
    if (Bio.ADMIN.TESTING) {
        if (!Bio.ADMIN.DEV_SERVERS.includes(msg.guild.id) &&
            !Bio.ADMIN.DEV_CHANNELS.includes(msg.channel.id))
            return;
    }
    if (msg.content.toLowerCase().replace(/[ ]+/g, ' ').split(' ')[0].trim() == nPrefix) {
        if (msg.author.bot)
            return;
        yield nHandler(msg);
    }
    if (msg.author.id == Bio.NB) {
        if ((_b = (_a = msg.embeds[0]) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.includes('report'))
            yield reportHelp(msg);
    }
}));
bot.go(() => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    console.log(`Logged in as ${(_c = bot.bot.user) === null || _c === void 0 ? void 0 : _c.username}`);
    yield reRegisterReminders();
    console.log('Reminders Re-registered!');
}));
export const client = bot.bot;
