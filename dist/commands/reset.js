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
import Bio from '../data/bio.json' assert { type: "json" };
export default class extends Command {
    constructor() {
        super({
            structure: []
        });
    }
    execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.msg)
                return;
            if (!Bio.GOD_MODS.includes(this.msg.author.id))
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
            (_a = this.msg) === null || _a === void 0 ? void 0 : _a.reply("WEEKLY STATS RESET!");
        });
    }
}
