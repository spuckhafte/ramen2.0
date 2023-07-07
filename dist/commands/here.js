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
import { updateDb } from "../helpers/funcs.js";
export default class extends Command {
    constructor() {
        super({
            structure: ['string|null'],
        });
    }
    execute() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const [action] = this.extract();
            if (!action) {
                yield updateDb({ id: (_a = this.msg) === null || _a === void 0 ? void 0 : _a.author.id }, 'extras.defaultChannel', (_b = this.msg) === null || _b === void 0 ? void 0 : _b.channel.id);
                yield ((_c = this.msg) === null || _c === void 0 ? void 0 : _c.reply('**You will now recieve your pings in this channel.**'));
                return;
            }
            if (action == 'clear' || action == 'clr') {
                yield updateDb({ id: (_d = this.msg) === null || _d === void 0 ? void 0 : _d.author.id }, 'extras.defaultChannel', '');
                yield ((_e = this.msg) === null || _e === void 0 ? void 0 : _e.reply('**Personal channel cleared!**'));
            }
            else {
                yield ((_f = this.msg) === null || _f === void 0 ? void 0 : _f.reply("`r here clear/clr` to clear your default channel"));
            }
        });
    }
}
