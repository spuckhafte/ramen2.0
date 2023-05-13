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
import { getTask } from "../helpers/funcs.js";
import User from "../schema/User.js";
const meme = 'https://www.youtube.com/watch?v=td1QQphKDK4';
export default class extends Command {
    constructor() {
        super({
            structure: ['string', 'string']
        });
    }
    execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const [type, scope] = this.extract();
            console.log(type, scope);
            if (!type || !scope)
                return;
            if (type != 'm' && type != 'r' && type != 'ch') {
                yield ((_a = this.msg) === null || _a === void 0 ? void 0 : _a.channel.send(`\`r lb <task>\`\n**m**: missions, **r**: reports, **ch**: challenges`));
                return;
            }
            ;
            const task = getTask(type);
            const sortQuery = {};
            sortQuery[`weekly.${task}`] = -1;
            let data = yield User.find({}, ['id', 'username', `weekly.${task}`]).sort(sortQuery);
            if (scope == 'l') {
                if (!this.msg || !this.msg.guild)
                    return;
                const allGuildMembers = (yield this.msg.guild.members.fetch()).map(i => i.id);
                data = data.filter(i => allGuildMembers.includes(i.id));
            }
            const total = data.length;
            const lastPage = Math.ceil(total / 10);
        });
    }
}
function getPage(data, pageNo) {
    return __awaiter(this, void 0, void 0, function* () {
        const from = (pageNo - 1) * 10 + 1;
        const page = data.slice(from, from + 10);
        let string = '';
    });
}
