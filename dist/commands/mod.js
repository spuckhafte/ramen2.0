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
import { isPro } from "../helpers/funcs.js";
export default class extends Command {
    constructor() {
        super({
            structure: ['string', 'string']
        });
    }
    execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __awaiter(this, void 0, void 0, function* () {
            const premServer = yield isPro(this.msg);
            if (!premServer)
                return;
            const [action] = this.extract();
            const mention = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.mentions.users.first();
            if ((action != 'add' && action != 'del' && action != 'show') || (action != 'show' && !mention)) {
                yield ((_b = this.msg) === null || _b === void 0 ? void 0 : _b.reply({
                    content: "**Correct structure of this command: `r mod <add||del> @someone\`**",
                    allowedMentions: { repliedUser: false }
                }));
                return;
            }
            if (action == 'show') {
                const mods = [];
                for (let mod of premServer.mods) {
                    const user = yield ((_d = (_c = this.msg) === null || _c === void 0 ? void 0 : _c.guild) === null || _d === void 0 ? void 0 : _d.members.fetch(mod));
                    mods.push((_e = user === null || user === void 0 ? void 0 : user.user.username) !== null && _e !== void 0 ? _e : "");
                }
                ;
                (_f = this.msg) === null || _f === void 0 ? void 0 : _f.reply(`**Username(s) of the Mod(s)**\n\`\`\`${mods.join(", ")}\`\`\``);
                return;
            }
            if (!mention)
                return;
            if (!premServer.mods.includes((_h = (_g = this.msg) === null || _g === void 0 ? void 0 : _g.author.id) !== null && _h !== void 0 ? _h : "")) {
                yield ((_j = this.msg) === null || _j === void 0 ? void 0 : _j.reply({
                    content: "**You are not allowed to access this command.**",
                    allowedMentions: { repliedUser: false }
                }));
                return;
            }
            if (action == 'add') {
                if (premServer.mods.includes(mention.id)) {
                    yield ((_k = this.msg) === null || _k === void 0 ? void 0 : _k.reply({
                        content: "**The mentioned user is already a *mod*.**",
                        allowedMentions: { repliedUser: false }
                    }));
                    return;
                }
                premServer.mods.push(mention.id);
                yield premServer.save();
                yield ((_l = this.msg) === null || _l === void 0 ? void 0 : _l.reply(`**\`${mention.username}\` is now a *mod*!**`));
            }
            if (action == 'del') {
                if (!premServer.mods.includes(mention.id)) {
                    yield ((_m = this.msg) === null || _m === void 0 ? void 0 : _m.reply({
                        content: "**The mentioned user is not a *mod*.**",
                        allowedMentions: { repliedUser: false }
                    }));
                    return;
                }
                premServer.mods.splice(premServer.mods.indexOf(mention.id), 1);
                yield premServer.save();
                yield ((_o = this.msg) === null || _o === void 0 ? void 0 : _o.reply(`**\`${mention.username}\` is __not__ a *mod* now!**`));
            }
        });
    }
}
