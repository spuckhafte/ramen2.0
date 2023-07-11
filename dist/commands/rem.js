var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __awaiter(this, void 0, void 0, function* () {
            const [action, query] = this.extract();
            if (action == 'show') {
                const storedTasks = Object.keys(timeouts).filter(i => { var _a, _b; return i.includes((_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.author.id) !== null && _b !== void 0 ? _b : ""); })
                    .map(i => `**${i.split('-')[1].trim().toUpperCase()}**`);
                const totalLive = storedTasks.length;
                const tasksString = storedTasks.join('\n').trim();
                const embed = new MessageEmbed({
                    title: "⏰ LIVE REMINDERS",
                    description: tasksString !== "" ? tasksString : "**None**",
                    color: "GREEN",
                    footer: {
                        text: `${totalLive} of ${allTasks.length} tasks are live (${yield getAd()})`,
                        iconURL: (_a = this.msg) === null || _a === void 0 ? void 0 : _a.author.displayAvatarURL()
                    }
                });
                yield ((_b = this.msg) === null || _b === void 0 ? void 0 : _b.reply({
                    embeds: [embed],
                    allowedMentions: { repliedUser: false }
                }));
            }
            const user = yield User.findOne({ id: (_c = this.msg) === null || _c === void 0 ? void 0 : _c.author.id });
            if (!user)
                return;
            if (action == 'block') {
                if (!query)
                    return;
                if (query == 'show') {
                    const blocked = user.blockPings;
                    const totalBlocked = blocked.length;
                    const blockTasksString = blocked.map(i => `**${i.toUpperCase()}**`).join('\n').trim();
                    const embed = new MessageEmbed({
                        title: "🚫 BLOCKED REMINDERS",
                        description: blockTasksString !== "" ? blockTasksString : "**None**",
                        color: "DARK_RED",
                        footer: {
                            text: `${totalBlocked} of ${allTasks.length} tasks are blocked (${yield getAd()})`,
                            iconURL: (_d = this.msg) === null || _d === void 0 ? void 0 : _d.author.displayAvatarURL()
                        }
                    });
                    (_e = this.msg) === null || _e === void 0 ? void 0 : _e.reply({
                        embeds: [embed],
                        allowedMentions: { repliedUser: false }
                    });
                    return;
                }
                let delta = true;
                const task = getTask(query);
                if (query == 'all')
                    user.blockPings = [...allTasks];
                else {
                    if (task == 'null') {
                        (_f = this.msg) === null || _f === void 0 ? void 0 : _f.reply({
                            content: `**\`${query}\` is not a valid task!**`,
                            allowedMentions: { repliedUser: false }
                        });
                        return;
                    }
                    if (!user.blockPings.includes(task))
                        user.blockPings.push(task);
                    else
                        delta = false;
                }
                if (delta)
                    yield user.save();
                yield ((_g = this.msg) === null || _g === void 0 ? void 0 : _g.reply({
                    content: `\`\`\`Reminder(s) blocked: ${query == 'all' ? query.toUpperCase() : getTask(query).toUpperCase()}\`\`\``,
                    allowedMentions: { repliedUser: false }
                }));
                const timeoutKeys = Object.keys(timeouts);
                const timeoutValues = Object.values(timeouts);
                if (query == 'all') {
                    for (let i in timeoutKeys) {
                        if (!timeoutKeys[i].includes((_j = (_h = this.msg) === null || _h === void 0 ? void 0 : _h.author.id) !== null && _j !== void 0 ? _j : ""))
                            continue;
                        clearTimeout(timeoutValues[i]);
                        delete timeouts[timeoutKeys[i]];
                    }
                }
                else {
                    for (let i in timeoutKeys) {
                        if (timeoutKeys[i].trim() != `${(_k = this.msg) === null || _k === void 0 ? void 0 : _k.author.id}-${task}`)
                            continue;
                        clearTimeout(timeoutValues[i]);
                        delete timeouts[timeoutKeys[i]];
                        break;
                    }
                }
            }
            if (action == 'unblock') {
                if (!query)
                    return;
                let delta = true;
                if (query == 'all')
                    user.blockPings = [];
                else {
                    const task = getTask(query);
                    if (!task) {
                        (_l = this.msg) === null || _l === void 0 ? void 0 : _l.reply({
                            content: `**\`${query}\` is not a valid task!**`,
                            allowedMentions: { repliedUser: false }
                        });
                        return;
                    }
                    if (user.blockPings.includes(task))
                        user.blockPings.splice(user.blockPings.indexOf(task), 1);
                    else
                        delta = false;
                }
                if (delta)
                    yield user.save();
                yield ((_m = this.msg) === null || _m === void 0 ? void 0 : _m.reply({
                    content: `\`\`\`Reminder(s) unblocked: ${query == 'all' ? query.toUpperCase() : getTask(query).toUpperCase()}\`\`\``,
                    allowedMentions: { repliedUser: false }
                }));
            }
        });
    }
}
