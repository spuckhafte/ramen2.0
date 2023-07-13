var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Command } from "breezer.js";
import User from "../schema/User.js";
import { MessageEmbed } from "discord.js";
import { client } from "../index.js";
import { getAd } from "../helpers/funcs.js";
export default class extends Command {
    constructor() {
        super({
            structure: []
        });
    }
    execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.botHasPerm('SEND_MESSAGES'), this.botHasPerm('EMBED_LINKS'));
            if (!this.botHasPerm('SEND_MESSAGES'))
                return;
            if (!this.botHasPerm('EMBED_LINKS')) {
                yield ((_a = this.msg) === null || _a === void 0 ? void 0 : _a.channel.send(`Missing Perm: [EMBED_LINKS]`));
                return;
            }
            const profileOf = (_c = (_b = this.msg) === null || _b === void 0 ? void 0 : _b.mentions.users.first()) !== null && _c !== void 0 ? _c : (_d = this.msg) === null || _d === void 0 ? void 0 : _d.author;
            if (!profileOf)
                return;
            const user = yield User.findOne({ id: profileOf.id });
            if (!user) {
                yield ((_e = this.msg) === null || _e === void 0 ? void 0 : _e.channel.send('**Profile not found :(**'));
                return;
            }
            const embed = new MessageEmbed({
                title: `👤 ${user.username}`,
                thumbnail: { url: profileOf.displayAvatarURL() },
                description: `**Status:** ${((_f = user.extras) === null || _f === void 0 ? void 0 : _f.online) ? '🟢' : '🔴'}\n**Default Channel:** ${((_g = user.extras) === null || _g === void 0 ? void 0 : _g.defaultChannel) ? `<#${user.extras.defaultChannel}>` : '❌'}`,
                fields: [
                    {
                        name: '👴 LIFETIME STATS',
                        value: `**➼ Missions:** ${(_h = user.stats) === null || _h === void 0 ? void 0 : _h.mission}\n**➼ Reports:** ${(_j = user.stats) === null || _j === void 0 ? void 0 : _j.report}\n**➼ Challenges:** ${(_k = user.stats) === null || _k === void 0 ? void 0 : _k.challenge}`,
                        inline: true
                    },
                    {
                        name: '📅 WEEKLY STATS',
                        value: `**➼ Missions:** ${(_l = user.weekly) === null || _l === void 0 ? void 0 : _l.mission}\n**➼ Reports:** ${(_m = user.weekly) === null || _m === void 0 ? void 0 : _m.report}\n**➼ Challenges:** ${(_o = user.weekly) === null || _o === void 0 ? void 0 : _o.challenge}`,
                        inline: true
                    },
                    {
                        name: '🏆 WEEKLY LB RANKINGS',
                        value: `**➼ Missions:** \`#${yield getRanking(user.id, 'mission')}\`\n**➼ Reports:** \`#${yield getRanking(user.id, 'report')}\`\n**➼ Challenges:** \`#${yield getRanking(user.id, 'challenge')}\``
                    },
                ],
                color: 'RANDOM',
                footer: {
                    iconURL: (_p = client.user) === null || _p === void 0 ? void 0 : _p.displayAvatarURL(),
                    text: yield getAd()
                }
            });
            yield ((_q = this.msg) === null || _q === void 0 ? void 0 : _q.channel.send({ embeds: [embed] }));
        });
    }
}
function getRanking(userId, task) {
    return __awaiter(this, void 0, void 0, function* () {
        const sortQuery = { [`weekly.${task}`]: -1 };
        let data = yield User.find({}, ['id', 'username', `weekly.${task}`]).sort(sortQuery);
        return data.findIndex(usr => usr.id === userId) + 1;
    });
}
