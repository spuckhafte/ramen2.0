import { TextChannel } from "discord.js";
import User from "../schema/User.js";
import { Tasks, TimeoutStore } from "../types";
import { register, remIntervals, updateDb } from "./funcs.js";
import { client } from "../index.js";
import Bio from '../data/bio.json' assert { type: "json" };

export const timeouts:TimeoutStore = {} // { "4539454395349-mission": 2342, "userid-task": timeoutId }

export async function manageReminders(task:Tasks, id:string, actualTS:'now'|number, channel:TextChannel|null) {
    if (timeouts[`${id}-${task}`] != undefined) return;
    if (task == 'null') return;
    
    let user = await User.findOne({ id });
    if (!user?.id) user = await register(id);
    if (!user) return;
    if (user.blockPings.includes(task)) return;

    const delay = user.extras?.early ?? 0;
    actualTS = (actualTS == 'now' ? Date.now() : actualTS) as number;

    if (Date.now() >= (actualTS + remIntervals[task] * 1000)) return;
    const tickedTime = Date.now() - actualTS;

    await updateDb({ id }, `reminder.${task}`, actualTS);

    if (user.extras?.defaultChannel) 
        try {
            channel = await client.channels.fetch(user.extras.defaultChannel) as TextChannel;
        } catch(_) { console.log('error fetching channel') }
    if (!channel)
        channel = await client.channels.fetch(Bio.DEFAULT_CHANNEL) as TextChannel;

    if (!channel) return;
    if (!channel.guild.members.me?.permissionsIn(channel).has('SEND_MESSAGES')) return;

    await updateDb({ id }, `lastPlayed.${task}`, channel.id);

    const timeout = setTimeout(async () => {
        delete timeouts[`${id}-${task}`]
        try {
            await channel?.send(`<@${id}> your **${task}** is ready!`);
        } catch (e) {
            console.error(`
                PAYLOAD: <@${id}> your ${task} is ready!
                ERROR: ${e}
            `);
        }
    }, ((remIntervals[task] * 1000) - tickedTime) - (delay * 1000) - 1000);
    
    timeouts[`${id}-${task}`] = timeout;

    return 'added';
}