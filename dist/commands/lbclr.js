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
import { getTask, isPro } from "../helpers/funcs.js";
export default class extends Command {
    constructor() {
        super({
            structure: ["string"]
        });
    }
    execute() {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const premServer = yield isPro(this.msg);
            if (!premServer)
                return;
            if (!premServer.mods.includes((_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.author.id) !== null && _b !== void 0 ? _b : "")) {
                if (!this.botHasPerm('SEND_MESSAGES'))
                    return;
                yield ((_c = this.msg) === null || _c === void 0 ? void 0 : _c.reply({
                    content: "**You are not allowed to access this command.**",
                    allowedMentions: { repliedUser: false }
                }));
                return;
            }
            let [task] = this.extract();
            task = getTask(task);
            if (task == 'null' || (task !== 'mission' && task !== 'report' && task !== 'challenge')) {
                if (!this.botHasPerm('SEND_MESSAGES'))
                    return;
                (_d = this.msg) === null || _d === void 0 ? void 0 : _d.reply({
                    content: '`r lbclr <task>`\n`<task> "m" | "r" | "ch"`',
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
            for (let usr of premServer.users)
                usr[task] = 0;
            yield premServer.save();
            if (!this.botHasPerm('SEND_MESSAGES'))
                return;
            yield ((_e = this.msg) === null || _e === void 0 ? void 0 : _e.reply("**Mission LB cleared!**"));
        });
    }
}
