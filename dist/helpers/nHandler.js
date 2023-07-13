var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { collectSignal, getTask, premiumStat, statsManager, timeToMs, updateDb } from "./funcs.js";
import { manageReminders } from "./remHandler.js";
import { remIntervals } from "./funcs.js";
import User from "../schema/User.js";
const RESET_ONLINE = 60;
const clearUserOnlineStack = {};
export default (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const content = msg.content.toLowerCase().replace(/[ ]+/g, ' ').trim();
    const cmd = content.split(' ')[1];
    if (!cmd)
        return;
    const task = getTask(cmd);
    let isCd = ['cd', 'cooldown'].includes(cmd.trim());
    if (task == 'null' && !isCd)
        return;
    setImmediate(() => __awaiter(void 0, void 0, void 0, function* () {
        yield updateDb({ id: msg.author.id }, 'extras.online', true);
        yield updateDb({ id: msg.author.id }, 'username', msg.author.username);
        if (clearUserOnlineStack[msg.author.id])
            clearInterval(clearUserOnlineStack[msg.author.id]);
        clearUserOnlineStack[msg.author.id] = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            yield updateDb({ id: msg.author.id }, 'extras.online', false);
            delete clearUserOnlineStack[msg.author.id];
        }), RESET_ONLINE * 1000);
    }));
    if (task == 'mission' || task == 'report') {
        collectSignal(msg, 'em.title', m => { var _a, _b; return !!((_b = (_a = m.embeds[0]) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.includes(msg.author.username)); }).on('collect', (botMsg) => __awaiter(void 0, void 0, void 0, function* () {
            yield manageReminders(task, msg.author.id, "now", msg.channel);
            statsManager(botMsg, task, msg.author.id);
        }));
    }
    if (task == 'tower') {
        collectSignal(msg, 'msg.content', m => m.content.includes(msg.author.username)).on('collect', () => __awaiter(void 0, void 0, void 0, function* () {
            yield manageReminders("tower", msg.author.id, "now", msg.channel);
        }));
    }
    if (task == 'train') {
        collectSignal(msg, 'em.title', m => { var _a, _b; return stdCheck((_b = (_a = m.embeds[0]) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : '', msg.author.username, 'training'); }).on('collect', () => __awaiter(void 0, void 0, void 0, function* () {
            yield manageReminders("train", msg.author.id, "now", msg.channel);
        }));
    }
    if (task == 'daily') {
        collectSignal(msg, 'em.title', m => { var _a, _b; return stdCheck((_b = (_a = m.embeds[0]) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : '', msg.author.username, 'daily'); }).on('collect', () => __awaiter(void 0, void 0, void 0, function* () {
            yield manageReminders("daily", msg.author.id, "now", msg.channel);
        }));
    }
    if (task == 'weekly') {
        collectSignal(msg, 'msg.content', m => !!stdCheck(m.content, msg.author.username, 'weekly')).on('collect', () => __awaiter(void 0, void 0, void 0, function* () {
            yield manageReminders("weekly", msg.author.id, "now", msg.channel);
        }));
    }
    if (task == 'quest') {
        collectSignal(msg, 'em.title', m => { var _a, _b; return !!((_b = (_a = m.embeds[0]) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.includes(`${msg.author.username}'s quests`)); }).on('collect', (nbMsg) => __awaiter(void 0, void 0, void 0, function* () {
            const desc = nbMsg.embeds[0].description;
            let timeString = desc.split('- `')[1].trim().split('` rema')[0].trim();
            const ticked = timeTicked('quest', timeToMs(timeString));
            if (Number.isNaN(ticked)) {
                console.log(ticked, timeString, '<- quest');
                return;
            }
            const confirm = yield manageReminders('quest', msg.author.id, Date.now() - ticked, msg.channel);
            if (confirm == 'added') {
                yield msg.channel.send({
                    content: `${msg.author} reminder added for **quest**`,
                    allowedMentions: { repliedUser: false }
                });
            }
        }));
    }
    if (task == 'challenge') {
        let collector = collectSignal(msg, 'msg.content', m => !!m.content.includes(`**${msg.author.username}** challenged you to a fight`)).on('collect', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const mention = (_a = msg.mentions.users.first()) !== null && _a !== void 0 ? _a : { id: "", username: "" };
            let target = mention.id;
            collectSignal(msg, 'msg.content', m => !!(m.content.trim().toLowerCase() == 'y' || m.content.trim().toLowerCase() == 'yes'), 31, 1, target)
                .on('collect', () => __awaiter(void 0, void 0, void 0, function* () {
                var _b;
                yield manageReminders('challenge', msg.author.id, 'now', msg.channel);
                collector.dispose(msg);
                const user = yield User.findOne({ id: msg.author.id });
                if (!user || !user.stats || !user.weekly)
                    return;
                user.stats[task] += 1;
                user.weekly[task] += 1;
                yield user.save();
                yield premiumStat((_b = msg.guild) === null || _b === void 0 ? void 0 : _b.id, user.id, msg.author.username, task);
            }));
        }));
    }
    if (task == 'adventure') {
    }
    if (isCd) {
        const verifyEmbed = new RegExp(`(${msg.author.username})|(cooldowns)`, 'g');
        collectSignal(msg, 'em.title', m => { var _a, _b; return !!((_b = (_a = m.embeds[0]) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.match(verifyEmbed)); }).on('collect', (nbMsg) => __awaiter(void 0, void 0, void 0, function* () {
            let tasksCollected = [];
            for (let field of nbMsg.embeds[0].fields) {
                const cdTasks = field.value.split('\n');
                for (let task_i in cdTasks) {
                    const task = cdTasks[+task_i];
                    if (field.name == 'Other' && +task_i > 0)
                        break;
                    if (task.includes('Booster'))
                        continue;
                    if (task.includes('white_check_mark'))
                        continue;
                    const taskName = task.split('--- ')[1].split('(')[0].toLowerCase().trim();
                    const taskTime = task.split(' (')[1].split(')')[0].trim().replace(/[ ]/g, ':');
                    const ticked = timeTicked(taskName, timeToMs(taskTime));
                    const confirmation = yield manageReminders(taskName, msg.author.id, Date.now() - ticked, msg.channel);
                    if (!confirmation)
                        continue;
                    tasksCollected.push(`**${taskName}**`);
                }
            }
            if (tasksCollected.length == 0)
                return;
            const l = tasksCollected.length;
            let string = `<@${msg.author.id}> reminder${l > 1 ? 's' : ''} added for ${tasksCollected.join(', ')}.`;
            yield msg.channel.send({
                content: string,
                allowedMentions: {
                    repliedUser: false
                }
            });
        }));
    }
});
function timeTicked(task, remaining) {
    if (task == 'null')
        return;
    return (remIntervals[task] * 1000 - remaining);
}
function stdCheck(content, username, task) {
    return content.includes(username) && content.includes(task);
}
