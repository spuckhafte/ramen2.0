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
import { MessageEmbed } from "discord.js";
import { plusText } from "../helpers/text.js";
import { client } from "../index.js";
import Config from "../schema/Config.js";
import { getAd, isPro } from "../helpers/funcs.js";
export default class extends Command {
    constructor() {
        super({
            structure: ["string|null"],
        });
    }
    execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function* () {
            const [query] = this.extract();
            if (!this.botHasPerm('SEND_MESSAGES') || !this.botHasPerm('EMBED_LINKS')) {
                if (this.botHasPerm('SEND_MESSAGES'))
                    (_a = this.msg) === null || _a === void 0 ? void 0 : _a.channel.send("`Missing Perm: [EMBED_LINKS]`");
                return;
            }
            if (!query) {
                const embed = new MessageEmbed({
                    title: "✨ RAMEN PLUS",
                    description: plusText,
                    footer: {
                        text: "- spuckhafte (student)"
                    },
                    color: "GOLD"
                });
                yield ((_b = this.msg) === null || _b === void 0 ? void 0 : _b.reply({
                    embeds: [embed],
                    allowedMentions: { repliedUser: false }
                }));
                return;
            }
            if (query == 'valid') {
                const premServer = yield isPro(this.msg);
                if (!premServer)
                    return;
                const from = epochToDate((_c = premServer.from) !== null && _c !== void 0 ? _c : 0);
                const till = epochToDate((_d = premServer.till) !== null && _d !== void 0 ? _d : 0);
                const daysLeft = Math.round((((_e = premServer.till) !== null && _e !== void 0 ? _e : 0) - ((_f = premServer.from) !== null && _f !== void 0 ? _f : 0)) / (1000 * 60 * 60 * 24));
                const embed = new MessageEmbed({
                    title: "💯 Plus Subscription Validity",
                    description: `**Form:** ${from}\n**Till:** ${till}\n**Days Left:** ${daysLeft}`,
                    footer: {
                        iconURL: (_g = client.user) === null || _g === void 0 ? void 0 : _g.displayAvatarURL(),
                        text: yield getAd()
                    },
                    color: "AQUA"
                });
                yield ((_h = this.msg) === null || _h === void 0 ? void 0 : _h.channel.send({ embeds: [embed] }));
            }
            if (query == "subs") {
                const config = yield Config.findOne({ discriminator: "only-config" });
                if (!config)
                    return;
                const fields = [];
                for (let usr of config.subs) {
                    fields.push({
                        name: (_j = usr.username) !== null && _j !== void 0 ? _j : "",
                        value: `Amount: \`${usr.amount}\``,
                        inline: true
                    });
                }
                const embed = new MessageEmbed({
                    title: "✨ Plus Supporters",
                    description: !fields.length ? "> **No one yet :(**" : `> **Total supporter(s): \`${fields.length}\`**`,
                    footer: {
                        iconURL: (_k = client.user) === null || _k === void 0 ? void 0 : _k.displayAvatarURL(),
                        text: "use \"r plus\""
                    },
                    color: "FUCHSIA"
                });
                if (fields.length > 0)
                    embed.fields = fields;
                yield ((_l = this.msg) === null || _l === void 0 ? void 0 : _l.channel.send({ embeds: [embed] }));
            }
        });
    }
}
function epochToDate(epoch) {
    let date = new Date(0);
    date.setUTCSeconds(epoch / 1000);
    return date.toString().split('GMT')[0].trim();
}
