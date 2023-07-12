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
            structure: ['string|null']
        });
    }
    execute() {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            let [timing] = this.extract();
            const user = yield User.findOne({ id: (_a = this.msg) === null || _a === void 0 ? void 0 : _a.author.id });
            if (!user)
                return;
            if (!timing && timing !== 0) {
                (_b = this.msg) === null || _b === void 0 ? void 0 : _b.reply(`**Early Reminder Factor: \`${(_c = user.extras) === null || _c === void 0 ? void 0 : _c.early} seconds\`**`);
                return;
            }
            if (Number.isNaN(timing)) {
                (_d = this.msg) === null || _d === void 0 ? void 0 : _d.reply("**Early Reminder Factor has to be a number (time in seconds)**");
                return;
            }
            timing = +timing;
            if (timing > 5 || timing < 0) {
                (_e = this.msg) === null || _e === void 0 ? void 0 : _e.reply("**Early Reminder Factor timing has to be in between \`0 to 5 seconds\`** *inclusive*.");
                return;
            }
            (_f = user.extras) === null || _f === void 0 ? void 0 : _f.early = timing;
            yield user.save();
            yield ((_g = this.msg) === null || _g === void 0 ? void 0 : _g.reply(`**Early Reminder Factor: \`${timing} seconds\`**`));
        });
    }
}
