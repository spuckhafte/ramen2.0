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
import { getTask } from "../helpers/funcs.js";
import User from "../schema/User.js";
export default class extends Command {
    constructor() {
        super({
            structure: ["string", "string|null"]
        });
    }
    execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            const [action, query] = this.extract();
            if (action == 'show') {
                const storedTasks = Object.keys(timeouts).filter(i => { var _a, _b; return i.includes((_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.author.id) !== null && _b !== void 0 ? _b : ""); })
                    .map(i => i.split('-')[1].trim().toUpperCase());
                const tasksString = storedTasks.join(', ').trim();
                yield ((_a = this.msg) === null || _a === void 0 ? void 0 : _a.reply({
                    content: `**LIVE REMINDERS**\n\`\`\`${tasksString == '' ? "None" : tasksString}\`\`\``,
                    allowedMentions: { repliedUser: false }
                }));
            }
            const user = yield User.findOne({ id: (_b = this.msg) === null || _b === void 0 ? void 0 : _b.author.id });
            const allTasks = [
                'mission', 'report', 'tower', 'adventure',
                'daily', 'vote', 'weekly', 'challenge', 'quest', 'train'
            ];
            if (!user)
                return;
            if (action == 'block') {
                if (!query)
                    return;
                if (query == 'show') {
                    const blocked = user.blockPings;
                    (_c = this.msg) === null || _c === void 0 ? void 0 : _c.reply({
                        content: `**BLOCKED REMINDERS**\n\`\`\`[${blocked.map(i => i.toUpperCase()).join(', ')}]\`\`\``,
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
                        (_d = this.msg) === null || _d === void 0 ? void 0 : _d.reply({
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
                yield ((_e = this.msg) === null || _e === void 0 ? void 0 : _e.reply({
                    content: `\`\`\`Reminder(s) blocked: ${query == 'all' ? query.toUpperCase() : getTask(query).toUpperCase()}\`\`\``,
                    allowedMentions: { repliedUser: false }
                }));
                const timeoutKeys = Object.keys(timeouts);
                const timeoutValues = Object.values(timeouts);
                if (query == 'all') {
                    for (let i in timeoutKeys) {
                        if (!timeoutKeys[i].includes((_g = (_f = this.msg) === null || _f === void 0 ? void 0 : _f.author.id) !== null && _g !== void 0 ? _g : ""))
                            continue;
                        clearTimeout(timeoutValues[i]);
                        delete timeouts[timeoutKeys[i]];
                    }
                }
                else {
                    for (let i in timeoutKeys) {
                        if (timeoutKeys[i].trim() != `${(_h = this.msg) === null || _h === void 0 ? void 0 : _h.author.id}-${task}`)
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
                        (_j = this.msg) === null || _j === void 0 ? void 0 : _j.reply({
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
                yield ((_k = this.msg) === null || _k === void 0 ? void 0 : _k.reply({
                    content: `\`\`\`Reminder(s) unblocked: [${query == 'all' ? query.toUpperCase() : getTask(query).toUpperCase()}]\`\`\``,
                    allowedMentions: { repliedUser: false }
                }));
            }
        });
    }
}
