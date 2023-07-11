import { Message, TextChannel } from "discord.js";
import { Tasks } from "../types";
import Bio from '../data/bio.json' assert { type: "json" };
import { client } from "../index.js";
import User from "../schema/User.js";
import premium from '../data/premium.json' assert { type: "json" };
import { StdObject } from '../types';
import { manageReminders } from "./remHandler.js";
import Premium from "../schema/Premium.js";
import Config from "../schema/Config.js";

export const remIntervals = { // seconds
    mission: 1 * 60,
    report: 10 * 60,
    tower: 6 * 60 * 60,
    train: 1 * 60 * 60,
    daily: 24 * 60 * 60,
    challenge: 30 * 60,
    vote: 12 * 60 * 60,
    weekly: 7 * 24 * 60 * 60,
    quest: 10 * 60 * 60,
    adventure: 0
}

export function collectSignal(
    msg:Message, 
    from:'msg.content'|'em.title'|'em.desc', 
    condition:((m:Message<boolean>) => boolean), 
    time=1, max=1, author:('nb'|string)='nb'
) {

    const filter = (m:Message<boolean>) => {
        author = author == 'nb' ? Bio.NB : author;
        if (m.author.id != author ) return false;
        if (from.includes('em')) {
            if (!m.embeds[0]) return false;
            if (from == 'em.desc') if (!m.embeds[0].description) return false;
            if (from == 'em.title') if (!m.embeds[0].title) return false;
        } else 
            if (!m.content) return false;
    
        if (!condition(m)) return false;
        return true;
    }

    return msg.channel.createMessageCollector({ filter, time: time * 1000, max });
} 

export function statsManager(msg:Message, task:'mission'|'report', userId:string) {

    setTimeout(async () => {
        const authAns = task == 'mission' ? 'Correct' : 'Successful';
        if (!msg.embeds[0].footer?.text.includes(authAns)) return;

        const user = await User.findOne({ id: userId });
        if (!user || !user.stats || !user.weekly) return;

        console.log(task, user.id, user.username);

        user.stats[task] += 1;
        user.weekly[task] += 1;

        await user.save();

        /* ------------ PREMIUM ------------ */
        await premiumStat(msg.guild?.id, user.id, user.username, task);

    }, (20 + 1) * 1000);
}

/* ------------ PREMIUM ------------ */
export async function premiumStat(
    serverId:string|undefined, 
    userId:string|undefined, 
    username:string|undefined,
    task:'mission'|'report'|'challenge'
) {
    const premServer = await Premium.findOne({ serverId });
    if (!premServer || !premServer.serverId) return;

    if (typeof premServer.till == 'number' && Date.now() > premServer.till)
        return;

    const premUser = premServer.users.find(usr => usr.userId == userId);
    if (!premUser) {
        premServer.users.push({
            userId, username,
            mission: task == 'mission' ? 1 : 0,
            report: task == 'report' ? 1 : 0,
            challenge: task == 'challenge' ? 1 : 0,
        });
    } else {
        if (typeof premUser[task] !== "number")
            //@ts-ignore
            premUser[task] = 0;
        //@ts-ignore
        premUser[task] += 1;
        if (premUser.username !== username)
            premUser.username = username;
    }

    await premServer.save();
}

export function getTask(t:string):Tasks {
    if (t == 'm' || t == 'mission') return 'mission';
    if (t == 'r' || t == 'report') return 'report';
    if (t == 'tow' || t == 'to' || t == 'tower') return 'tower';
    if (t == 'train' || t == 'tr') return 'train';
    if (t == 'adv' || t == 'adventure') return 'adventure';
    if (t == 'daily' || t == 'd') return 'daily';
    if (t == 'v' || t == 'vote') return 'vote';
    if (t == 'w' || t == 'weekly') return 'weekly';
    if (t == 'ch' || t == 'challenge') return 'challenge';
    if (t == 'q' || t == 'quest') return 'quest';
    else return 'null';
}

export async function register(id:string) {
    const discUser = await client.users.fetch(id);

    let server_specific_stats:any;
    premium.servers.forEach((server:any) => {
        server_specific_stats[server[2]] = {
            id: server[0],
            name: server[1],
            stats: {
                mission: 0,
                report: 0
            }
        }
    });

    const user = await User.create({
        username: discUser.username, 
        id, server_specific_stats
    });
    await user.save();
    return await User.findOne({ id });
}

export async function updateDb(query:StdObject, updateWhat:string, updateValue:any, fetch=false) {
    try {
        let updateObj:StdObject = {};
        let val;
        if (typeof updateValue == 'function') {
            const prevVal = await User.findOne(query, [updateWhat]);
            val = updateValue(prevVal)
        } else val = updateValue;
        updateObj[updateWhat] = val;
        await User.updateOne(query, updateObj);
        if (fetch) return (await User.findOne(query));
    } catch (e) {
        console.log(e)
        return null;
    }
};

export async function reRegisterReminders() {
    let prevChannel =  await client.channels.fetch(Bio.DEFAULT_CHANNEL) as TextChannel;
    const nbPlay1 = prevChannel;

    for (let user of await User.find({})) {
        if (!user.reminder) continue;

        for (let taskNdTS of Object.entries(user.reminder)) {
            const task = taskNdTS[0] as Tasks;
            if (task == 'null') continue;

            const defaultChannel = user.extras?.defaultChannel 
                ?? (user.lastPlayed?.[task] ?? Bio.DEFAULT_CHANNEL);

            let channel = prevChannel;
            if (defaultChannel != prevChannel.id) {
                try {
                    channel = await client.channels.fetch(defaultChannel) as TextChannel;
                } catch (e) {
                    if (user.extras?.defaultChannel) 
                        channel =  await client.channels.fetch(user.extras.defaultChannel) as TextChannel;
                    else channel = nbPlay1;
                }
                prevChannel = channel;
            }
            if (!channel) continue;

            const timestamp = taskNdTS[1];
            await manageReminders(task, user.id, timestamp, channel as TextChannel)
        }
    }
}

export function timeToMs(time:string) {
    if (!time.includes('d')) time = '0d:' + time;
    if (!time.includes('h')) time = time.split('d:')[0] + 'd:' + '0h:' + time.split('d:')[1];
    if (!time.includes('m')) time = time.split('h:')[0] + 'h:' + '0m:' + time.split('h:')[1];

    const days = +(time.split('d:')[0]);
    const hours = +(time.split('h:')[0].split(':')[1]);
    const min = +(time.split('m:')[0].split('h:')[1]);
    const sec = parseInt(time.split('m:')[1]);

    return ((days * 24 * 60 * 60) + (hours * 60 * 60) + (min * 60) + sec) * 1000;
}

export async function isPro(msg:Message|undefined) {
    if (!msg) return false;

    const premServer = await Premium.findOne({ serverId: msg.guild?.id });
    if (
        !premServer || 
        !premServer.serverId || 
        typeof premServer.till !== 'number' ||
        Date.now() > premServer.till
    ) {
        await msg.reply("**Server Specific Leaderboard is a PREMIUM feature.**\n*`r plus` for details.*");
        return false;
    }
    return premServer;
}

export async function getAd() {
    const config = await Config.findOne({ discriminator: 'only-config' });
    return ` try "${config?.try ?? "r plus"}" `;
}