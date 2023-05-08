var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Bio from '../data/bio.json' assert { type: "json" };
import { client } from "../index.js";
import User from "../schema/User.js";
import premium from '../data/premium.json' assert { type: "json" };
import { manageReminders } from "./remHandler";
export const remIntervals = {
    mission: 1 * 60,
    report: 10 * 60,
    tower: 6 * 60 * 60,
    train: 1 * 60 * 60,
    daily: 24 * 60 * 60,
    challenge: 30 * 60,
    vote: 12 * 60 * 60,
    weekly: 7 * 24 * 60 * 60,
    quest: 10 * 60 * 60,
    adventure: 0
};
export function collectSignal(msg, from, condition, time = 1, max = 1, author = 'nb') {
    const filter = (m) => {
        author = author == 'nb' ? Bio.NB : author;
        if (m.author.id != author)
            return false;
        if (from.includes('em')) {
            if (!m.embeds[0])
                return false;
            if (from == 'em.desc')
                if (!m.embeds[0].description)
                    return false;
            if (from == 'em.title')
                if (!m.embeds[0].title)
                    return false;
        }
        else if (!m.content)
            return false;
        if (!condition(m))
            return false;
        return true;
    };
    return msg.channel.createMessageCollector({ filter, time: time * 1000, max });
}
export function getTask(t) {
    if (t == 'm' || t == 'mission')
        return 'mission';
    if (t == 'r' || t == 'report')
        return 'report';
    if (t == 'tow' || t == 'to' || t == 'tower')
        return 'tower';
    if (t == 'train')
        return 'train';
    if (t == 'adv' || t == 'adventure')
        return 'adventure';
    if (t == 'daily' || t == 'd')
        return 'daily';
    if (t == 'v' || t == 'vote')
        return 'vote';
    if (t == 'w' || t == 'weekly')
        return 'weekly';
    if (t == 'ch' || t == 'challenge')
        return 'challenge';
    if (t == 'q' || t == 'quest')
        return 'quest';
    else
        return 'null';
}
export function register(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const discUser = yield client.users.fetch(id);
        let server_specific_stats;
        premium.servers.forEach((server) => {
            server_specific_stats[server[2]] = {
                id: server[0],
                name: server[1],
                stats: {
                    mission: 0,
                    report: 0
                }
            };
        });
        const user = yield User.create({
            username: discUser.username,
            id, server_specific_stats
        });
        yield user.save();
        return yield User.findOne({ id });
    });
}
export function updateDb(query, updateWhat, updateValue, fetch = false) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let updateObj = {};
            let val;
            if (typeof updateValue == 'function') {
                const prevVal = yield User.findOne(query, [updateWhat]);
                val = updateValue(prevVal);
            }
            else
                val = updateValue;
            updateObj[updateWhat] = val;
            yield User.updateOne(query, updateObj);
            if (fetch)
                return (yield User.findOne(query));
        }
        catch (e) {
            console.log(e);
            return null;
        }
    });
}
;
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
export function timeToMs(time) {
    if (!time.includes('d'))
        time = '0d:' + time;
    if (!time.includes('h'))
        time = time.split('d:')[0] + 'd:' + '0h:' + time.split('d:')[1];
    if (!time.includes('m'))
        time = time.split('h:')[0] + 'h:' + '0m:' + time.split('h:')[1];
    const days = +(time.split('d:')[0]);
    const hours = +(time.split('h:')[0].split(':')[1]);
    const min = +(time.split('m:')[0].split('h:')[1]);
    const sec = parseInt(time.split('m:')[1]);
    return ((days * 24 * 60 * 60) + (hours * 60 * 60) + (min * 60) + sec) * 1000;
}
