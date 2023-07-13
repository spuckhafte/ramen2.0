import { Command } from "breezer.js";
import { timeouts } from "../helpers/remHandler.js";
import { getAd, getTask } from "../helpers/funcs.js";
import User from "../schema/User.js";
import { MessageEmbed } from "discord.js";

const allTasks = [
    'mission', 'report', 'tower', 'adventure', 
    'daily', 'vote', 'weekly', 'challenge', 'quest', 'train'
];

export default class extends Command {
    constructor() {
        super({
            structure: ["string", "string|null"]
        });
    }

    async execute() {
        const [action, query] = this.extract() as string[];

        if (action == 'show') {
            const storedTasks = Object.keys(timeouts).filter(i => i.includes(this.msg?.author.id ?? ""))
                .map(i => `**${i.split('-')[1].trim().toUpperCase()}**`);

            const totalLive = storedTasks.length;
            const tasksString = storedTasks.join('\n').trim();

            const embed = new MessageEmbed({
                title: "⏰ LIVE REMINDERS",
                description: tasksString !== "" ? tasksString : "**None**",
                color: "GREEN",
                footer: {
                    text: `${totalLive} of ${allTasks.length} tasks are live (${await getAd()})`,
                    iconURL: this.msg?.author.displayAvatarURL()
                }
            });

            if (!this.botHasPerm('SEND_MESSAGES') || !this.botHasPerm('EMBED_LINKS')) {
                if (this.botHasPerm('SEND_MESSAGES'))
                    this.msg?.channel.send("`Missing Perm: [EMBED_LINKS]`");
                return;
            }

            await this.msg?.reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false }
            })
        }

        const user = await User.findOne({ id: this.msg?.author.id });
        if (!user) return;

        if (action == 'block') {
            if (!query) return;

            if (query == 'show') {
                const blocked = user.blockPings;
                const totalBlocked = blocked.length;
                const blockTasksString = blocked.map(i => `**${i.toUpperCase()}**`).join('\n').trim();

                const embed = new MessageEmbed({
                    title: "🚫 BLOCKED REMINDERS",
                    description: blockTasksString !== "" ? blockTasksString : "**None**",
                    color: "DARK_RED",
                    footer: {
                        text: `${totalBlocked} of ${allTasks.length} tasks are blocked (${await getAd()})`,
                        iconURL: this.msg?.author.displayAvatarURL()
                    }
                });

                if (!this.botHasPerm('SEND_MESSAGES') || !this.botHasPerm('EMBED_LINKS')) {
                    if (this.botHasPerm('SEND_MESSAGES'))
                        this.msg?.channel.send("`Missing Perm: [EMBED_LINKS]`");
                    return;
                }

                this.msg?.reply({ 
                    embeds: [embed],
                    allowedMentions: { repliedUser: false }
                });
                return;
            }

            let delta = true;
            const task = getTask(query);

            if (query == 'all') user.blockPings = [...allTasks];
            else {
                if (task == 'null') {
                    if (!this.botHasPerm('SEND_MESSAGES')) return;
                    this.msg?.reply({ 
                        content: `**\`${query}\` is not a valid task!**`, 
                        allowedMentions: { repliedUser: false }
                    });
                    return;
                }
                
                if (!user.blockPings.includes(task)) 
                    user.blockPings.push(task);
                else delta = false;
            }

            if (delta) await user.save();


            if (this.botHasPerm('SEND_MESSAGES')) {
                await this.msg?.reply({
                    content: `\`\`\`Reminder(s) blocked: ${query == 'all' ? query.toUpperCase() : getTask(query).toUpperCase()}\`\`\``,
                    allowedMentions: { repliedUser: false }
                });
            }

            const timeoutKeys = Object.keys(timeouts);
            const timeoutValues = Object.values(timeouts);
            
            if (query == 'all') {
                for (let i in timeoutKeys) {
                    if (!timeoutKeys[i].includes(this.msg?.author.id ?? "")) 
                        continue;
                    clearTimeout(timeoutValues[i]);
                    delete timeouts[timeoutKeys[i] as keyof typeof timeouts];
                }
            } else {
                for (let i in timeoutKeys) {
                    if (timeoutKeys[i].trim() != `${this.msg?.author.id}-${task}`)
                        continue;
                    clearTimeout(timeoutValues[i]);
                    delete timeouts[timeoutKeys[i] as keyof typeof timeouts];
                    break;
                }
            }
        }

        if (action == 'unblock') {
            if (!query) return;
            
            let delta = true;
            if (query == 'all') user.blockPings = [];
            else {
                const task = getTask(query);
                if (!task) {
                    if (!this.botHasPerm('SEND_MESSAGES')) return;
                    this.msg?.reply({ 
                        content: `**\`${query}\` is not a valid task!**`, 
                        allowedMentions: { repliedUser: false }
                    });
                    return;
                }

                if (user.blockPings.includes(task)) 
                    user.blockPings.splice(user.blockPings.indexOf(task), 1);
                else delta = false;
            }

            if (delta) await user.save();
            if (!this.botHasPerm('SEND_MESSAGES')) return;
            await this.msg?.reply({
                content: `\`\`\`Reminder(s) unblocked: ${query == 'all' ? query.toUpperCase() : getTask(query).toUpperCase()}\`\`\``,
                allowedMentions: { repliedUser: false }
            });
        }

    }
}