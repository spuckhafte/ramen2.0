import { Command } from "breezer.js";
import User from "../schema/User.js";
import { AnyChannel, MessageEmbed } from "discord.js";
import { StdObject } from "../types.js";
import { client } from "../index.js";
import { getAd } from "../helpers/funcs.js";

export default class extends Command {
    constructor() {
        super({
            structure: []
        })
    }

    async execute() {
        if (!this.botHasPerm('SEND_MESSAGES')) return;
        if (!this.botHasPerm('EMBED_LINKS')) {
            await this.msg?.channel.send(`Missing Perm: [EMBED_LINKS]`);
            return;
        }

        const profileOf = this.msg?.mentions.users.first() ?? this.msg?.author;
        if (!profileOf) return;
        
        const user = await User.findOne({ id: profileOf.id });
        if (!user) {
            await this.msg?.channel.send('**Profile not found :(**');
            return;
        }

        let defaultChannel: AnyChannel | null = null;
        try {
            defaultChannel = await client.channels.fetch(user.extras?.defaultChannel ?? "12345");
        } catch (_) { null };

        const embed = new MessageEmbed({
            title: `👤 ${user.username}`,
            thumbnail: { url: profileOf.displayAvatarURL() },
            description: `**Status:** ${user.extras?.online ? '🟢' : '🔴'}\n**Default Channel:** ${defaultChannel ? `<#${defaultChannel.id}>` : '❌'}`,
            fields: [
                {
                    name: '👴 LIFETIME STATS',
                    value: `**➼ Missions:** ${user.stats?.mission}\n**➼ Reports:** ${user.stats?.report}\n**➼ Challenges:** ${user.stats?.challenge}`,
                    inline: true
                },
                {
                    name: '📅 WEEKLY STATS',
                    value: `**➼ Missions:** ${user.weekly?.mission}\n**➼ Reports:** ${user.weekly?.report}\n**➼ Challenges:** ${user.weekly?.challenge}`,
                    inline: true
                },
                {
                    name: '🏆 WEEKLY LB RANKINGS',
                    value: `**➼ Missions:** \`#${await getRanking(user.id, 'mission')}\`\n**➼ Reports:** \`#${await getRanking(user.id, 'report')}\`\n**➼ Challenges:** \`#${await getRanking(user.id, 'challenge')}\``
                },
            ],
            color: 'RANDOM',
            footer: {
                iconURL: client.user?.displayAvatarURL(),
                text: await getAd()
            }
        });
        await this.msg?.channel.send({ embeds: [embed] });
    }
}

async function getRanking(userId:string, task:'mission'|'challenge'|'report') {
    const sortQuery:StdObject = { [`weekly.${task}`]: -1 };
    let data = await User.find({}, ['id', 'username', `weekly.${task}`]).sort(sortQuery);
    return data.findIndex(usr => usr.id === userId) + 1;
}