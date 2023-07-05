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
import { MessageEmbed } from "discord.js";
import { client } from "../index.js";
import helpText from "../helpers/helpText.js";
export default class extends Command {
    constructor() {
        super({
            structure: []
        });
    }
    execute() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new MessageEmbed({
                author: {
                    name: "RAMEN GUIDE 📖",
                    iconURL: (_a = client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL()
                },
                description: helpText,
                footer: {
                    text: 'Help msg under development 🔨'
                }
            });
            yield ((_b = this.msg) === null || _b === void 0 ? void 0 : _b.channel.send({ embeds: [embed] }));
        });
    }
}
