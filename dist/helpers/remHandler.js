var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../schema/User.js";
import { register, remIntervals, updateDb } from "./funcs.js";
import { client } from "../index.js";
import Bio from '../data/bio.json' assert { type: "json" };
export const timeouts = {};
export function manageReminders(task, id, actualTS, channel) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        if (timeouts[`${id}-${task}`] != undefined)
            return;
        if (task == 'null')
            return;
        let user = yield User.findOne({ id });
        if (!(user === null || user === void 0 ? void 0 : user.id))
            user = yield register(id);
        if (!user)
            return;
        if (user.blockPings.includes(task))
            return;
        const delay = (_b = (_a = user.extras) === null || _a === void 0 ? void 0 : _a.early) !== null && _b !== void 0 ? _b : 0;
        actualTS = (actualTS == 'now' ? Date.now() : actualTS);
        if (Date.now() >= (actualTS + remIntervals[task] * 1000))
            return;
        const tickedTime = Date.now() - actualTS;
        yield updateDb({ id }, `reminder.${task}`, actualTS);
        if ((_c = user.extras) === null || _c === void 0 ? void 0 : _c.defaultChannel)
            try {
                channel = (yield client.channels.fetch(user.extras.defaultChannel));
            }
            catch (_) {
                console.log('error fetching channel');
            }
        if (!channel)
            channel = (yield client.channels.fetch(Bio.DEFAULT_CHANNEL));
        if (!channel)
            return;
        if (!((_d = channel.guild.members.me) === null || _d === void 0 ? void 0 : _d.permissionsIn(channel).has('SEND_MESSAGES')))
            return;
        yield updateDb({ id }, `lastPlayed.${task}`, channel.id);
        const timeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            delete timeouts[`${id}-${task}`];
            try {
                yield (channel === null || channel === void 0 ? void 0 : channel.send(`<@${id}> your **${task}** is ready!`));
            }
            catch (e) {
                console.error(`
                PAYLOAD: <@${id}> your ${task} is ready!
                ERROR: ${e}
            `);
            }
        }), ((remIntervals[task] * 1000) - tickedTime) - (delay * 1000) - 1000);
        timeouts[`${id}-${task}`] = timeout;
        return 'added';
    });
}
