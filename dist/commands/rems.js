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
import { timeouts } from "../helpers/remHandler.js";
export default class extends Command {
    constructor() {
        super({
            structure: ["string", "string|null"]
        });
    }
    execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const [action, query] = this.extract();
            if (action == 'show') {
                const storedTasks = Object.keys(timeouts).filter(i => { var _a, _b; return i.includes((_b = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.author.id) !== null && _b !== void 0 ? _b : ""); })
                    .map(i => i.toUpperCase().split('-').splice(0, i.split('-').length - 1)
                    .join(' ').trim().split(' ').join('-'));
                if (storedTasks.length == 0)
                    return;
                (_a = this.msg) === null || _a === void 0 ? void 0 : _a.reply({
                    content: `**LIVE REMINDERS**\n\`\`\`${storedTasks.join(', ')}\`\`\``
                });
            }
        });
    }
}
