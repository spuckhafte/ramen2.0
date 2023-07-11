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
import { manageReminders } from "./remHandler.js";
import Premium from "../schema/Premium.js";
import Config from "../schema/Config.js";
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
export function statsManager(msg, task, userId) {
    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const authAns = task == 'mission' ? 'Correct' : 'Successful';
        if (!((_a = msg.embeds[0].footer) === null || _a === void 0 ? void 0 : _a.text.includes(authAns)))
            return;
        const user = yield User.findOne({ id: userId });
        if (!user || !user.stats || !user.weekly)
            return;
        console.log(task, user.id, user.username);
        user.stats[task] += 1;
        user.weekly[task] += 1;
        yield user.save();
        yield premiumStat((_b = msg.guild) === null || _b === void 0 ? void 0 : _b.id, user.id, user.username, task);
    }), (20 + 1) * 1000);
}
export function premiumStat(serverId, userId, username, task) {
    return __awaiter(this, void 0, void 0, function* () {
        const premServer = yield Premium.findOne({ serverId });
        if (!premServer || !premServer.serverId)
            return;
        if (typeof premServer.till == 'number' && Date.now() > premServer.till)
            return;
        const premUser = premServer.users.find(usr => usr.userId == userId);
        if (!premUser) {
            premServer.users.push({
                userId, username,
                mission: task == 'mission' ? 1 : 0,
                report: task == 'report' ? 1 : 0,
                challenge: task == 'challenge' ? 1 : 0,
            });
        }
        else {
            if (typeof premUser[task] !== "number")
                premUser[task] = 0;
            premUser[task] += 1;
            if (premUser.username !== username)
                premUser.username = username;
        }
        yield premServer.save();
    });
}
export function getTask(t) {
    if (t == 'm' || t == 'mission')
        return 'mission';
    if (t == 'r' || t == 'report')
        return 'report';
    if (t == 'tow' || t == 'to' || t == 'tower')
        return 'tower';
    if (t == 'train' || t == 'tr')
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
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        let prevChannel = yield client.channels.fetch(Bio.DEFAULT_CHANNEL);
        const nbPlay1 = prevChannel;
        for (let user of yield User.find({})) {
            if (!user.reminder)
                continue;
            for (let taskNdTS of Object.entries(user.reminder)) {
                const task = taskNdTS[0];
                if (task == 'null')
                    continue;
                const defaultChannel = (_b = (_a = user.extras) === null || _a === void 0 ? void 0 : _a.defaultChannel) !== null && _b !== void 0 ? _b : ((_d = (_c = user.lastPlayed) === null || _c === void 0 ? void 0 : _c[task]) !== null && _d !== void 0 ? _d : Bio.DEFAULT_CHANNEL);
                let channel = prevChannel;
                if (defaultChannel != prevChannel.id) {
                    try {
                        channel = (yield client.channels.fetch(defaultChannel));
                    }
                    catch (e) {
                        if ((_e = user.extras) === null || _e === void 0 ? void 0 : _e.defaultChannel)
                            channel = (yield client.channels.fetch(user.extras.defaultChannel));
                        else
                            channel = nbPlay1;
                    }
                    prevChannel = channel;
                }
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
export function isPro(msg) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!msg)
            return false;
        const premServer = yield Premium.findOne({ serverId: (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id });
        if (!premServer ||
            !premServer.serverId ||
            typeof premServer.till !== 'number' ||
            Date.now() > premServer.till) {
            yield msg.reply("**Server Specific Leaderboard is a PREMIUM feature.**\n*`r plus` for details.*");
            return false;
        }
        return premServer;
    });
}
export function getAd() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield Config.findOne({ discriminator: 'only-config' });
        return ` try "${(_a = config === null || config === void 0 ? void 0 : config.try) !== null && _a !== void 0 ? _a : "r plus"}" `;
    });
}
