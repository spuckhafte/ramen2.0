import { Message, TextChannel } from "discord.js";
import { collectSignal, getTask, timeToMs } from "./funcs.js";
import { manageReminders } from "./remHandler.js";
import { Tasks } from "../types.js";
import { remIntervals } from "./funcs.js";
import User from "../schema/User.js";
import { client } from "../index.js";
import Bio from "../data/bio.json" assert { type: "json" };

export default async (msg: Message) => {
    const content = msg.content.toLowerCase().replace(/[ ]+/g, ' ').trim();

    const cmd = content.split(' ')[1];
    if (!cmd) return;
    const task = getTask(cmd);
    let isCd = ['cd', 'cooldown'].includes(cmd.trim());
    if (task == 'null' && !isCd) return;

    if (task == 'mission' || task == 'report') {
        collectSignal(
            msg, 'em.title', 
            m => !!m.embeds[0]?.title?.includes(msg.author.username)
        ).on('collect', async () => {
            await manageReminders(task, msg.author.id, "now", msg.channel as TextChannel);
        });
    }

    if (task == 'tower') {
        collectSignal(
            msg, 'msg.content',
            m => m.content.includes(msg.author.username)
        ).on('collect', async () => {
            const a = await manageReminders("tower", msg.author.id, "now", msg.channel as TextChannel);
            console.log(a)
        });
    }

    if (task == 'train') {
        const verifyEmbed = new RegExp(`(${msg.author.username})|(training)`, 'g');
        collectSignal(
            msg, 'em.title',
            m =>  !!m.embeds[0]?.title?.match(verifyEmbed)
        ).on('collect', async () => {
            await manageReminders("train", msg.author.id, "now", msg.channel as TextChannel);
        });
    }

    if (task == 'daily') {
        collectSignal(
            msg, 'em.title',
            m => !!m.embeds[0]?.title?.includes(`${msg.author.id}#${msg.author.discriminator}'s daily`)
        ).on('collect', async () => {
            await manageReminders("daily", msg.author.id, "now", msg.channel as TextChannel);
        });
    }

    if (task == 'weekly') {
        const verifyMsg = new RegExp(`(${msg.author.username})|(weekly)`);
        collectSignal(
            msg, 'em.title',
            m => !!m.embeds[0]?.title?.match(verifyMsg)
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
            let target = msg.mentions.users.first()?.id;
            collectSignal(
                msg, 'msg.content',
                m => !!(m.content.trim().toLowerCase() == 'y' || m.content.trim().toLowerCase() == 'yes'),
                31, 1, target
            ).on('collect', async () => {
                await manageReminders('challenge', msg.author.id, 'now', msg.channel as TextChannel);
                collector.dispose(msg);
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
