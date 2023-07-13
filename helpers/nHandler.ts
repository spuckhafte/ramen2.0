import { Message, TextChannel } from "discord.js";
import { collectSignal, getTask, premiumStat, statsManager, timeToMs, updateDb } from "./funcs.js";
import { manageReminders } from "./remHandler.js";
import { Tasks } from "../types.js";
import { remIntervals } from "./funcs.js";
import User from "../schema/User.js";

const RESET_ONLINE = 60; // seconds
const clearUserOnlineStack: { [index: string]: NodeJS.Timer } = {};

export default async (msg: Message) => {
    const content = msg.content.toLowerCase().replace(/[ ]+/g, ' ').trim();

    const cmd = content.split(' ')[1];
    if (!cmd) return;
    const task = getTask(cmd);
    let isCd = ['cd', 'cooldown'].includes(cmd.trim());
    if (task == 'null' && !isCd) return;

    setImmediate(async () => {
        await updateDb({ id: msg.author.id }, 'extras.online', true);
        await updateDb({ id: msg.author.id }, 'username', msg.author.username)
        if (clearUserOnlineStack[msg.author.id]) 
            clearInterval(clearUserOnlineStack[msg.author.id]);
        clearUserOnlineStack[msg.author.id] = setInterval(async () => {
            await updateDb({ id: msg.author.id }, 'extras.online', false);
            delete clearUserOnlineStack[msg.author.id];
        }, RESET_ONLINE * 1000);
    });

    if (task == 'mission' || task == 'report') {
        collectSignal(
            msg, 'em.title', 
            m => !!m.embeds[0]?.title?.includes(msg.author.username)
        ).on('collect', async botMsg => {
            await manageReminders(task, msg.author.id, "now", msg.channel as TextChannel);
            statsManager(botMsg, task, msg.author.id);
        });
    }

    if (task == 'tower') {
        collectSignal(
            msg, 'msg.content',
            m => m.content.includes(msg.author.username)
        ).on('collect', async () => {
            await manageReminders("tower", msg.author.id, "now", msg.channel as TextChannel);
        });
    }

    if (task == 'train') {
        collectSignal(
            msg, 'em.title',
            m =>  stdCheck(m.embeds[0]?.title ?? '', msg.author.username, 'training')
        ).on('collect', async () => {
            await manageReminders("train", msg.author.id, "now", msg.channel as TextChannel);
        }); 
    }

    if (task == 'daily') {
        collectSignal(
            msg, 'em.title',
            m => stdCheck(m.embeds[0]?.title ?? '', msg.author.username, 'daily')
        ).on('collect', async () => {
            await manageReminders("daily", msg.author.id, "now", msg.channel as TextChannel);
        });
    }

    if (task == 'weekly') {
        collectSignal(
            msg, 'msg.content',
            m => !!stdCheck(m.content, msg.author.username, 'weekly')
        ).on('collect', async () => {
            await manageReminders("weekly", msg.author.id, "now", msg.channel as TextChannel);
        });
    }

    if (task == 'quest') {
        collectSignal(
            msg, 'em.title',
            m => !!m.embeds[0]?.title?.includes(`${msg.author.username}'s quests`)
        ).on('collect', async nbMsg => {
            const desc = nbMsg.embeds[0].description as string;
            let timeString = desc.split('- `')[1].trim().split('` rema')[0].trim();
            const ticked = timeTicked('quest', timeToMs(timeString));

            if (Number.isNaN(ticked)) {
                console.log(ticked, timeString ,'<- quest');
                return;
            }
            
            const confirm = await manageReminders(
                'quest', msg.author.id, Date.now() - (ticked as number), 
                msg.channel as TextChannel
            );

            if (confirm == 'added') {
                await msg.channel.send({
                    content: `${msg.author} reminder added for **quest**`,
                    allowedMentions: { repliedUser: false }
                });
            }
        });
    }

    if (task == 'challenge') {
        let collector = collectSignal(
            msg, 'msg.content',
            m => !!m.content.includes(`**${msg.author.username}** challenged you to a fight`)
        ).on('collect', async () => {
            const mention = msg.mentions.users.first() ?? { id: "", username: "" };
            let target = mention.id;

            collectSignal(  
                msg, 'msg.content',
                m => !!(m.content.trim().toLowerCase() == 'y' || m.content.trim().toLowerCase() == 'yes'),
                31, 1, target
            )
            .on('collect', async () => {
                await manageReminders('challenge', msg.author.id, 'now', msg.channel as TextChannel);
                collector.dispose(msg);

                const user = await User.findOne({ id: msg.author.id });
                if (!user || !user.stats || !user.weekly) return;

                user.stats[task] += 1;
                user.weekly[task] += 1;

                await user.save();

                /* ------------ PREMIUM ------------ */
                await premiumStat(msg.guild?.id, user.id, msg.author.username, task);
            })
        })
    }

    if (task == 'adventure') {
        // no adv for now
    }

    if (isCd) {
        const verifyEmbed = new RegExp(`(${msg.author.username})|(cooldowns)`, 'g');
        collectSignal(
            msg, 'em.title',
            m => !!m.embeds[0]?.title?.match(verifyEmbed)
        ).on('collect', async nbMsg => {
            let tasksCollected:string[] = [];
            
            for (let field of nbMsg.embeds[0].fields) {
                const cdTasks = field.value.split('\n');

                for (let task_i in cdTasks) {
                    const task = cdTasks[+task_i];

                    if (field.name == 'Other' && +task_i > 0) break;
                    if (task.includes('Booster')) continue;
                    if (task.includes('white_check_mark')) continue;

                    const taskName = task.split('--- ')[1].split('(')[0].toLowerCase().trim();
                    const taskTime = task.split(' (')[1].split(')')[0].trim().replace(/[ ]/g, ':');
                    const ticked = timeTicked(taskName as Tasks, timeToMs(taskTime)) as number;

                    const confirmation = await manageReminders(
                        taskName as Tasks, msg.author.id,
                        Date.now() - ticked, msg.channel as TextChannel
                    )
                    if (!confirmation) continue;
                    tasksCollected.push(`**${taskName}**`);
                }
            }
            
            if (tasksCollected.length == 0) return;

            const l = tasksCollected.length;
            let string = `<@${msg.author.id}> reminder${l>1?'s':''} added for ${tasksCollected.join(', ')}.`;
            await msg.channel.send({
                content: string,
                allowedMentions: {
                    repliedUser: false
                }
            })
        });
    }
}

function timeTicked(task:Tasks, remaining:number) {
    if (task == 'null') return;
    return (remIntervals[task] * 1000 - remaining);
}

function stdCheck(content: string, username:string, task:'training'|'cooldown'|'weekly'|'daily') {
    return content.includes(username) && content.includes(task);
}