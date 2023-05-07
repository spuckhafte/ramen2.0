var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { collectSignal, getTask, timeToMs } from "./funcs.js";
import { manageReminders } from "./remHandler.js";
import { remIntervals } from "./funcs.js";
import User from "../schema/User.js";
import { client } from "../index.js";
import Bio from "../data/bio.json" assert { type: "json" };
export default (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const content = msg.content.toLowerCase().replace(/[ ]+/g, ' ').trim();
    const task = getTask(content.split(' ')[1]);
    let isCd = ['cd', 'cooldown'].includes(content.split(' ')[1].trim());
    if (task == 'null' && !isCd)
        return;
    if (task == 'mission' || task == 'report') {
        collectSignal(msg, 'em.title', m => { var _a, _b; return !!((_b = (_a = m.embeds[0]) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.includes(msg.author.username)); }).on('collect', () => __awaiter(void 0, void 0, void 0, function* () {
            yield manageReminders(task, msg.author.id, "now", msg.channel);
        }));
    }
    if (task == 'tower') {
        collectSignal(msg, 'msg.content', m => m.content.includes(msg.author.username)).on('collect', () => __awaiter(void 0, void 0, void 0, function* () {
            const a = yield manageReminders("tower", msg.author.id, "now", msg.channel);
            console.log(a);
        }));
    }
    if (task == 'train') {
        const verifyEmbed = new RegExp(`(${msg.author.username})|(training)`, 'g');
        collectSignal(msg, 'em.title', m => { var _a, _b; return !!((_b = (_a = m.embeds[0]) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.match(verifyEmbed)); }).on('collect', () => __awaiter(void 0, void 0, void 0, function* () {
            yield manageReminders("train", msg.author.id, "now", msg.channel);
        }));
    }
    if (task == 'daily') {
        collectSignal(msg, 'em.title', m => { var _a, _b; return !!((_b = (_a = m.embeds[0]) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.includes(`${msg.author.id}#${msg.author.discriminator}'s daily`)); }).on('collect', () => __awaiter(void 0, void 0, void 0, function* () {
            yield manageReminders("daily", msg.author.id, "now", msg.channel);
        }));
    }
    if (task == 'weekly') {
        const verifyMsg = new RegExp(`(${msg.author.username})|(weekly)`);
        collectSignal(msg, 'em.title', m => { var _a, _b; return !!((_b = (_a = m.embeds[0]) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.match(verifyMsg)); }).on('collect', () => __awaiter(void 0, void 0, void 0, function* () {
            yield manageReminders("weekly", msg.author.id, "now", msg.channel);
        }));
    }
    if (task == 'quest') {
        collectSignal(msg, 'em.title', m => { var _a, _b; return !!((_b = (_a = m.embeds[0]) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.includes(`${msg.author.username}'s quests`)); }).on('collect', (nbMsg) => __awaiter(void 0, void 0, void 0, function* () {
            const desc = nbMsg.embeds[0].description;
            let timeString = desc.split('- `')[1].trim().split('` rema')[0].trim();
            const ticked = timeTicked('quest', timeToMs(timeString));
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
            let target = (_a = msg.mentions.users.first()) === null || _a === void 0 ? void 0 : _a.id;
            collectSignal(msg, 'msg.content', m => !!(m.content.trim().toLowerCase() == 'y' || m.content.trim().toLowerCase() == 'yes'), 31, 1, target).on('collect', () => __awaiter(void 0, void 0, void 0, function* () {
                yield manageReminders('challenge', msg.author.id, 'now', msg.channel);
                collector.dispose(msg);
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
export function reRegisterReminders() {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        for (let user of yield User.find({})) {
            if (!user.reminder)
                continue;
            for (let taskNdTS of Object.entries(user.reminder)) {
                const task = taskNdTS[0];
                if (task == 'null')
                    continue;
                const defaultChannel = (_b = (_a = user.extras) === null || _a === void 0 ? void 0 : _a.defaultChannel) !== null && _b !== void 0 ? _b : ((_d = (_c = user.lastPlayed) === null || _c === void 0 ? void 0 : _c[task]) !== null && _d !== void 0 ? _d : Bio.DEFAULT_CHANNEL);
                const channel = yield client.channels.fetch(defaultChannel);
                if (!channel)
                    continue;
                const timestamp = taskNdTS[1];
                yield manageReminders(task, user.id, timestamp, channel);
            }
        }
    });
}
function timeTicked(task, remaining) {
    if (task == 'null')
        return;
    return (remIntervals[task] * 1000 - remaining);
}
