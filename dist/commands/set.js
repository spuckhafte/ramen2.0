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
import Config from "../schema/Config.js";
import Bio from '../data/bio.json';
export default class extends Command {
    constructor() {
        super({
            structure: ['string', 'string']
        });
    }
    execute() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!Bio.GOD_MODS.includes((_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.author.id) !== null && _b !== void 0 ? _b : ""))
                return;
            const [property, value] = this.extract();
            const config = yield Config.findOne({ discriminator: "only-config" });
            if (!config)
                return;
            if (!config[property]) {
                yield ((_c = this.msg) === null || _c === void 0 ? void 0 : _c.reply(`No such property: ${property}`));
                return;
            }
            config[property] = value;
            yield config.save();
            yield ((_d = this.msg) === null || _d === void 0 ? void 0 : _d.reply('done'));
        });
    }
}
