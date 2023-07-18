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
import User from "../schema/User.js";
export default class extends Command {
    constructor() {
        super({
            structure: []
        });
    }
    execute() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.msg)
                return;
            if (!((_a = this.msg.member) === null || _a === void 0 ? void 0 : _a.roles.cache.has('1130759159151874139')))
                return;
            if (this.msg.channel.id != '1130765930771779625')
                return;
            yield User.updateMany({}, {
                $set: {
                    weekly: {
                        mission: 0,
                        report: 0,
                        challenge: 0
                    }
                }
            });
            if (!this.botHasPerm('SEND_MESSAGES'))
                return;
            (_b = this.msg) === null || _b === void 0 ? void 0 : _b.reply("WEEKLY STATS RESET!");
        });
    }
}
