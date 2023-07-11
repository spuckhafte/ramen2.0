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
import { getAd, getTask, isPro } from "../helpers/funcs.js";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
const meme = 'https://www.youtube.com/watch?v=td1QQphKDK4';
const stateManager = new StateManager({});
export default class extends Command {
    constructor() {
        super({
            structure: ['string'],
            states: stateManager.clone()
        });
    }
    execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __awaiter(this, void 0, void 0, function* () {
            const [type] = this.extract();
            const premServer = yield isPro(this.msg);
            if (!premServer)
                return;
            const allPremUsers = premServer.users;
            if (!this.botHasPerm('SEND_MESSAGES') || !this.botHasPerm('EMBED_LINKS')) {
                if (this.botHasPerm('SEND_MESSAGES'))
                    (_a = this.msg) === null || _a === void 0 ? void 0 : _a.channel.send("`Missing Perm: [EMBED_LINKS]`");
                return;
            }
            if (!type || (type != 'm' && type != 'r' && type != 'ch')) {
                yield ((_b = this.msg) === null || _b === void 0 ? void 0 : _b.channel.send(`\`r lb <task> \`\n\`\`\`<task> "m": missions, "r": reports, "ch": challenges\`\`\``));
                return;
            }
            ;
            const task = getTask(type);
            const pageDetails = yield getPage(allPremUsers, 1, task, this.msg);
            if (!pageDetails)
                return;
            const total = pageDetails.data.length;
            const lastPage = Math.ceil(total / 10);
            (_c = this.states) === null || _c === void 0 ? void 0 : _c.set('pageNo', _ => 1);
            (_d = this.states) === null || _d === void 0 ? void 0 : _d.set('page', _ => pageDetails.string);
            const embed = new MessageEmbed({
                title: `${(_f = (_e = this.msg) === null || _e === void 0 ? void 0 : _e.guild) === null || _f === void 0 ? void 0 : _f.name}'s ${task.toUpperCase()} LB`,
                description: '$page$',
                footer: {
                    text: `$pageNo$ of ${lastPage} (${yield getAd()})`,
                    iconURL: (_g = this.msg) === null || _g === void 0 ? void 0 : _g.author.displayAvatarURL()
                },
                thumbnail: {
                    url: (_k = (_j = (_h = this.msg) === null || _h === void 0 ? void 0 : _h.guild) === null || _j === void 0 ? void 0 : _j.iconURL()) !== null && _k !== void 0 ? _k : ""
                },
                color: "RANDOM"
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
                .setEmoji('⏩'));
            if (pageDetails.data.find(usr => { var _a; return usr.userId === ((_a = this.msg) === null || _a === void 0 ? void 0 : _a.author.id); })) {
                row.addComponents(new MessageButton()
                    .setCustomId('yourPage')
                    .setStyle('PRIMARY')
                    .setLabel('Your Page'));
            }
            const sent = yield this.send({ embeds: [embed], components: [row] });
            (_o = buttonSignal([(_m = (_l = this.msg) === null || _l === void 0 ? void 0 : _l.author.id) !== null && _m !== void 0 ? _m : ""], sent, { time: 15 * 60 * 1000 })) === null || _o === void 0 ? void 0 : _o.on('collect', (btn) => __awaiter(this, void 0, void 0, function* () {
                var _p, _q, _r;
                yield btn.deferUpdate();
                let page = (_p = this.states) === null || _p === void 0 ? void 0 : _p.get('pageNo');
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
                    const userIndex = pageDetails.data.findIndex(val => { var _a; return val.userId == ((_a = this.msg) === null || _a === void 0 ? void 0 : _a.author.id); });
                    page = Math.ceil((userIndex + 1) / 10);
                }
                const newPage = yield getPage(allPremUsers, page, task, this.msg);
                if (!newPage)
                    return;
                (_q = this.states) === null || _q === void 0 ? void 0 : _q.set('page', () => newPage.string);
                (_r = this.states) === null || _r === void 0 ? void 0 : _r.set('pageNo', () => page);
            }));
        });
    }
}
function getPage(allPremUsers, pageNo, task, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        allPremUsers = arrangeUsers(allPremUsers, task);
        const from = (pageNo - 1) * 10;
        const page = allPremUsers.slice(from, from + 10);
        let string = '';
        for (let i = 0; i < page.length; i++) {
            const entry = page[i];
            let username;
            if (entry.username == (msg === null || msg === void 0 ? void 0 : msg.author.username))
                username = `__${entry.username}__`;
            else
                username = entry.username;
            string += `\`#${((pageNo - 1) * 10) + i + 1}\` **${username}** - **[${entry[task]}](${meme})**\\n`;
        }
        return { data: allPremUsers, string };
    });
}
function arrangeUsers(arr, task) {
    if (arr.length <= 1)
        return arr;
    let pivot = arr[0];
    let leftArr = [];
    let rightArr = [];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i][task] > pivot[task])
            leftArr.push(arr[i]);
        else
            rightArr.push(arr[i]);
    }
    return [
        ...arrangeUsers(leftArr, task),
        pivot,
        ...arrangeUsers(rightArr, task)
    ];
}
;
