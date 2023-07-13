/* ------------ PREMIUM ------------ */

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

    async execute() {
        const [query] = this.extract();

        if (!this.botHasPerm('SEND_MESSAGES') || !this.botHasPerm('EMBED_LINKS')) {
            if (this.botHasPerm('SEND_MESSAGES'))
                this.msg?.channel.send("`Missing Perm: [EMBED_LINKS]`");
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
            await this.msg?.reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false }
            });
            return;
        }

        if (query == 'valid') {
            const premServer = await isPro(this.msg);
            if (!premServer) return;

            const from = epochToDate(premServer.from ?? 0);
            const till = epochToDate(premServer.till ?? 0);
           
            const daysLeft = Math.round(((premServer.till ?? 0) - (premServer.from ?? 0)) / (1000 * 60 * 60 * 24));
            
            const embed = new MessageEmbed({
                title: "💯 Plus Subscription Validity",
                description: `**Form:** ${from}\n**Till:** ${till}\n**Days Left:** ${daysLeft}`,
                footer: {
                    iconURL: client.user?.displayAvatarURL(),
                    text: await getAd()
                },
                color: "AQUA"
            });
            await this.msg?.channel.send({ embeds: [embed] });
        }

        if (query == "subs") {
            const config = await Config.findOne({ discriminator: "only-config" });
            if (!config) return;

            const fields: { name: string, value: string, inline: boolean }[] = [];

            for (let usr of config.subs) {
                fields.push({
                    name: usr.username ?? "",
                    value: `Amount: \`${usr.amount}\``,
                    inline: true
                })
            }
            

            const embed = new MessageEmbed({
                title: "✨ Plus Supporters",
                description: !fields.length ? "> **No one yet :(**" : `> **Total supporter(s): \`${fields.length}\`**`,
                footer: {
                    iconURL: client.user?.displayAvatarURL(),
                    text: "use \"r plus\""
                },
                color: "FUCHSIA"
            });

            if (fields.length > 0) embed.fields = fields;

            await this.msg?.channel.send({ embeds: [embed] });
        }
    }
}

function epochToDate(epoch:number) {
    let date = new Date(0);
    date.setUTCSeconds(epoch / 1000)
    return date.toString().split('GMT')[0].trim();
}