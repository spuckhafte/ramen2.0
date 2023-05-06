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
        let collector = collectSignal(msg, 'msg.content', m => !!m.content.includes(`**${msg.author.username}** challenged you to a fight`)).on('collect', (msg) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            let target = (_a = msg.mentions.users.first()) === null || _a === void 0 ? void 0 : _a.id;
            collectSignal(msg, 'msg.content', m => !!(m.content.trim().toLowerCase() == 'y'), 31, 1, target).on('collect', () => __awaiter(void 0, void 0, void 0, function* () {
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
function timeTicked(task, remaining) {
    if (task == 'null')
        return;
    return (remIntervals[task] * 1000 - remaining);
}
