import { Command } from "breezer.js";
import { timeouts } from "../helpers/remHandler.js";
import { getTask } from "../helpers/funcs.js";
import User from "../schema/User.js";

export default class extends Command {
    constructor() {
        super({
            structure: ["string", "string|null"]
        });
    }

    /**
     * r rem show
     * r rem block all
     * r rem block m
     * r rem unblock ch
     * r rem unblock all
     */

    async execute() {
        const [action, query] = this.extract() as string[];

        if (action == 'show') {
            const storedTasks = Object.keys(timeouts).filter(i => i.includes(this.msg?.author.id ?? ""))
                .map(i => i.split('-')[1].trim().toUpperCase());

            const tasksString = storedTasks.join(', ').trim();
            await this.msg?.reply({
                content: `**LIVE REMINDERS**\n\`\`\`${tasksString == '' ? "None" : tasksString}\`\`\``,
                allowedMentions: { repliedUser: false }
            })
        }

        const user = await User.findOne({ id: this.msg?.author.id });
        const allTasks = [
            'mission', 'report', 'tower', 'adventure', 
            'daily', 'vote', 'weekly', 'challenge', 'quest', 'train'
        ];
        if (!user) return;

        if (action == 'block') {
            if (!query) return;

            if (query == 'show') {
                const blocked = user.blockPings;
                this.msg?.reply({ 
                    content: `**BLOCKED REMINDERS**\n\`\`\`[${blocked.map(i => i.toUpperCase()).join(', ')}]\`\`\``, 
                    allowedMentions: { repliedUser: false }
                });
                return;
            }

            let delta = true;
            const task = getTask(query);

            if (query == 'all') user.blockPings = [...allTasks];
            else {
                if (task == 'null') {
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
            await this.msg?.reply({
                content: `\`\`\`Reminder(s) blocked: ${query == 'all' ? query.toUpperCase() : getTask(query).toUpperCase()}\`\`\``,
                allowedMentions: { repliedUser: false }
            });

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
            await this.msg?.reply({
                content: `\`\`\`Reminder(s) unblocked: [${query == 'all' ? query.toUpperCase() : getTask(query).toUpperCase()}]\`\`\``,
                allowedMentions: { repliedUser: false }
            });
        }

    }
}