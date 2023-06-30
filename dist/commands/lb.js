var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Command, StateManager, buttonSignal } from "breezer.js";
import { getTask } from "../helpers/funcs.js";
import User from "../schema/User.js";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { client } from "../index.js";
const meme = 'https://www.youtube.com/watch?v=td1QQphKDK4';
const stateManager = new StateManager({});
export default class extends Command {
    constructor() {
        super({
            structure: ['string', 'string'],
            states: stateManager.clone()
        });
    }
    execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function* () {
            const [type, scope] = this.extract();
            if (!this.botHasPerm('SEND_MESSAGES') || !this.botHasPerm('EMBED_LINKS')) {
                if (this.botHasPerm('SEND_MESSAGES'))
                    (_a = this.msg) === null || _a === void 0 ? void 0 : _a.channel.send("`Missing Perm: [EMBED_LINKS]`");
                return;
            }
            if (!type || !scope) {
                yield ((_b = this.msg) === null || _b === void 0 ? void 0 : _b.channel.send(`\`r lb <task> <scope>\``));
                return;
            }
            if (type != 'm' && type != 'r' && type != 'ch') {
                yield ((_c = this.msg) === null || _c === void 0 ? void 0 : _c.channel.send(`\`r lb <task> <scope>\`\n\`\`\`<task> "m": missions, "r": reports, "ch": challenges\`\`\``));
                return;
            }
            ;
            if (scope != 'l' && scope != 'g') {
                yield ((_d = this.msg) === null || _d === void 0 ? void 0 : _d.channel.send(`\`r lb <task> <scope>\`\n\`\`\`<scope> "l": local, "g": global\`\`\``));
                return;
            }
            const task = getTask(type);
            const pageDetails = yield getPage(1, scope, task, this.msg);
            if (!pageDetails)
                return;
            const total = pageDetails.data.length;
            const lastPage = Math.ceil(total / 10);
            (_e = this.states) === null || _e === void 0 ? void 0 : _e.set('pageNo', _ => 1);
            (_f = this.states) === null || _f === void 0 ? void 0 : _f.set('page', _ => pageDetails.string);
            const embed = new MessageEmbed({
                title: `${scope == 'l' ? "LOCAL" : 'GLOBAL'} ${task.toUpperCase()} LB`,
                description: '$page$',
                footer: {
                    text: `$pageNo$ of ${lastPage}`,
                    iconURL: (_g = this.msg) === null || _g === void 0 ? void 0 : _g.author.displayAvatarURL()
                },
                thumbnail: {
                    url: (_h = client.user) === null || _h === void 0 ? void 0 : _h.displayAvatarURL()
                }
            });
            const row = new MessageActionRow()
                .addComponents(new MessageButton()
                .setCustomId('fb')
                .setStyle('SECONDARY')
                .setEmoji('⏪'))
                .addComponents(new MessageButton()
                .setCustomId('backward')
                .setStyle('SUCCESS')
                .setEmoji('◀️'))
                .addComponents(new MessageButton()
                .setCustomId('forward')
                .setStyle('SUCCESS')
                .setEmoji('▶️'))
                .addComponents(new MessageButton()
                .setCustomId('ff')
                .setStyle('SECONDARY')
                .setEmoji('⏩'))
                .addComponents(new MessageButton()
                .setCustomId('yourPage')
                .setStyle('PRIMARY')
                .setLabel('Your Page'));
            const sent = yield this.send({ embeds: [embed], components: [row] });
            (_l = buttonSignal([(_k = (_j = this.msg) === null || _j === void 0 ? void 0 : _j.author.id) !== null && _k !== void 0 ? _k : ""], sent, { time: 15 * 60 * 1000 })) === null || _l === void 0 ? void 0 : _l.on('collect', (btn) => __awaiter(this, void 0, void 0, function* () {
                var _m, _o, _p;
                yield btn.deferUpdate();
                let page = (_m = this.states) === null || _m === void 0 ? void 0 : _m.get('pageNo');
                if (!page)
                    return;
                if (btn.customId == 'forward' && page == lastPage ||
                    btn.customId == 'backward' && page == 1)
                    return;
                if (btn.customId == 'fb')
                    page = 1;
                if (btn.customId == 'forward')
                    page += 1;
                if (btn.customId == 'backward')
                    page -= 1;
                if (btn.customId == 'ff')
                    page = lastPage;
                if (btn.customId == 'yourPage') {
                    const userIndex = pageDetails.data.findIndex(val => { var _a; return val.id == ((_a = this.msg) === null || _a === void 0 ? void 0 : _a.author.id); });
                    console.log(userIndex);
                    page = Math.ceil((userIndex + 1) / 10);
                }
                const newPage = yield getPage(page, scope, task, this.msg);
                if (!newPage)
                    return;
                (_o = this.states) === null || _o === void 0 ? void 0 : _o.set('page', () => newPage.string);
                (_p = this.states) === null || _p === void 0 ? void 0 : _p.set('pageNo', () => page);
            }));
        });
    }
}
function getPage(pageNo, scope, task, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        const sortQuery = { [`weekly.${task}`]: -1 };
        let data = yield User.find({}, ['id', 'username', `weekly.${task}`]).sort(sortQuery);
        if (scope == 'l') {
            if (!msg || !msg.guild)
                return;
            const allGuildMembers = (yield msg.guild.members.fetch()).map(i => i.id);
            data = data.filter(i => allGuildMembers.includes(i.id));
        }
        const from = (pageNo - 1) * 10;
        const page = data.slice(from, from + 10);
        let string = '';
        for (let i = 0; i < page.length; i++) {
            const entry = page[i];
            let username;
            if (entry.username == (msg === null || msg === void 0 ? void 0 : msg.author.username))
                username = `__${entry.username}__`;
            else
                username = entry.username;
            string += `\`#${((pageNo - 1) * 10) + i + 1}\` **${username}** - **[${entry.weekly[task]}](${meme})**\\n`;
        }
        return { data, string };
    });
}
