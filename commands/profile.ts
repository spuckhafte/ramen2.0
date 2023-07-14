import { Command } from "breezer.js";
import User from "../schema/User.js";
import { MessageEmbed } from "discord.js";
import { StdObject } from "../types.js";
import { client } from "../index.js";
import { getAd } from "../helpers/funcs.js";
import { redi } from "../helpers/redisHandler.js";
import Bio from '../data/bio.json' assert { type: "json" };

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


        const embed = new MessageEmbed({
            title: `👤 ${user.username}`,
            thumbnail: { url: profileOf.displayAvatarURL() },
            description: `**Status:** ${user.extras?.online ? '🟢' : '🔴'}\n**Default Channel:** ${user.extras?.defaultChannel ? `<#${user.extras.defaultChannel}>` : '❌'}`,
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
    const key = `${userId}-lbrank-${task}`;
    let ranking = await redi.get(key);

    if (!ranking) {
        const sortQuery:StdObject = { [`weekly.${task}`]: -1 };
        let data = await User.find({}, ['id', 'username', `weekly.${task}`]).sort(sortQuery);

        const rank = data.findIndex(usr => usr.id === userId) + 1;
        await redi.setEx(key, Bio.REDIS.USER_LB_RANK_EXP_MIN * 60, `${rank}`);
        return rank;        
    } else
        return +ranking;
}