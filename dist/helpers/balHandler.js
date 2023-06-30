var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MessageEmbed } from "discord.js";
import { client } from "../index.js";
import { userHasPerm } from "breezer.js";
export default (rxn, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    if (user.bot)
        return;
    const botMsg = rxn.message.embeds[0];
    if (!botMsg)
        return;
    if (!((_a = botMsg.title) === null || _a === void 0 ? void 0 : _a.includes('balance')))
        return;
    if (!((_b = botMsg.footer) === null || _b === void 0 ? void 0 : _b.text.includes('earned lifetime')))
        return;
    if (!((_d = (_c = rxn.message.embeds[0].footer) === null || _c === void 0 ? void 0 : _c.iconURL) === null || _d === void 0 ? void 0 : _d.includes(user.id)))
        return;
    if (rxn.emoji.name !== '🤑')
        return;
    const rxnUsers = (_e = rxn.message.reactions.cache.find(rx => rx.emoji.name == '🤑')) === null || _e === void 0 ? void 0 : _e.users.cache.toJSON();
    if (!rxnUsers || (rxnUsers === null || rxnUsers === void 0 ? void 0 : rxnUsers.length) == 0)
        return;
    let botInList = false;
    for (let usr of rxnUsers) {
        if (usr.id === ((_f = client.user) === null || _f === void 0 ? void 0 : _f.id)) {
            botInList = true;
            break;
        }
    }
    if (!botInList)
        return;
    const ryo = (_g = botMsg.description) === null || _g === void 0 ? void 0 : _g.split('\n')[0].split('** ')[1];
    const specialTickets = (_h = botMsg.description) === null || _h === void 0 ? void 0 : _h.split('\n')[1].split('** ')[1];
    if (!ryo || !specialTickets)
        return;
    const pulls = Math.floor(+ryo / 300);
    const spulls = Math.floor(+specialTickets / 500);
    if (yield userHasPerm('SEND_MESSAGES', (_k = (_j = client.user) === null || _j === void 0 ? void 0 : _j.id) !== null && _k !== void 0 ? _k : "", rxn.message)) {
        if (yield userHasPerm('EMBED_LINKS', (_m = (_l = client.user) === null || _l === void 0 ? void 0 : _l.id) !== null && _m !== void 0 ? _m : "", rxn.message)) {
            const embed = new MessageEmbed({
                title: `${user.username}'s Balance Planning`,
                fields: [
                    { name: 'Pulls', value: `${pulls}`, inline: true },
                    { name: 'Special Pulls', value: `${spulls}`, inline: true }
                ],
                footer: {
                    iconURL: botMsg.footer.iconURL,
                    text: (_o = user.username) !== null && _o !== void 0 ? _o : ""
                },
                color: "RANDOM"
            });
            yield rxn.message.channel.send({ embeds: [embed] });
        }
        else {
            const content = `__**${user.username}'s BALANCE PLANNING**__\n**Pulls:** \`${pulls}\`\n**Special Pulls:** \`${spulls}\`\n\n\`Missing Perm: [EMBED_LINKS]\``;
            yield rxn.message.reply({ content });
        }
    }
    yield ((_p = rxn.message.reactions.cache.find(rx => rx.emoji.name === '🤑')) === null || _p === void 0 ? void 0 : _p.users.remove((_q = client.user) === null || _q === void 0 ? void 0 : _q.id));
});
