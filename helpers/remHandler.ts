import { TextChannel } from "discord.js";
import User from "../schema/User.js";
import { Tasks, TimeoutStore } from "../types";
import { register, remIntervals, updateDb } from "./funcs.js";
import { client } from "../index.js";
import Bio from '../data/bio.json' assert { type: "json" };

const timeouts:TimeoutStore = {} // { "4539454395349-mission": 2342, "userid-task": timeoutId }
const delay = 1500;

export async function manageReminders(task:Tasks, id:string, actualTS:'now'|number, channel:TextChannel|null) {
    if (timeouts[`${id}-${task}`] != undefined) return;
    if (task == 'null') return;
    
    let user = await User.findOne({ id });
    if (!user?.id) user = await register(id);
    if (!user) return;
    if (!user.getPings.includes(task)) return;

    actualTS = (actualTS == 'now' ? Date.now() : actualTS) as number;

    if (Date.now() >= (actualTS + remIntervals[task] * 1000)) return;
    const tickedTime = Date.now() - actualTS;

    await updateDb({ id }, `reminder.${task}`, actualTS);

    if (user.extras?.defaultChannel) 
        channel = await client.channels.fetch(user.extras.defaultChannel) as TextChannel;
    if (!channel)
        channel = await client.channels.fetch(Bio.DEFAULT_CHANNEL) as TextChannel;

    if (!channel) return;
    if (!channel.guild.members.me?.permissionsIn(channel).has('SEND_MESSAGES')) return;

    await updateDb({ id }, `lastPlayed.${task}`, channel.id);

    const timeout = setTimeout(async () => {
        delete timeouts[`${id}-${task}`]
        await channel?.send(`<@${id}> your **${task}** is ready!`);
    }, ((remIntervals[task] * 1000) - tickedTime) - delay);
    
    timeouts[`${id}-${task}`] = timeout;
    return 'added';
}