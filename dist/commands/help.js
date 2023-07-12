var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Command, buttonSignal } from "breezer.js";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { client } from "../index.js";
import { helpText_1, helpText_2, helpText_3 } from "../helpers/text.js";
import { getAd } from "../helpers/funcs.js";
const helpText = {
    general: helpText_1,
    botCmds: helpText_2,
    plusCmds: helpText_3
};
export default class extends Command {
    constructor() {
        super({
            structure: []
        });
    }
    execute() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const embed = yield generateEmbed('general');
            const row = generateRow('general');
            const sent = yield ((_a = this.msg) === null || _a === void 0 ? void 0 : _a.channel.send({
                embeds: [embed],
                components: [row]
            }));
            (_b = buttonSignal([], sent)) === null || _b === void 0 ? void 0 : _b.on('collect', (btn) => __awaiter(this, void 0, void 0, function* () {
                if (!Object.keys(helpText).includes(btn.customId))
                    return;
                yield btn.deferUpdate();
                yield (sent === null || sent === void 0 ? void 0 : sent.edit({
                    embeds: [yield generateEmbed(btn.customId)],
                    components: [generateRow(btn.customId)]
                }));
            }));
        });
    }
}
function generateRow(page) {
    return new MessageActionRow()
        .addComponents(new MessageButton()
        .setCustomId('general')
        .setDisabled(page == 'general')
        .setStyle(page == 'general' ? "SUCCESS" : 'PRIMARY')
        .setLabel('General'))
        .addComponents(new MessageButton()
        .setCustomId('botCmds')
        .setDisabled(page == 'botCmds')
        .setStyle(page == 'botCmds' ? 'SUCCESS' : 'PRIMARY')
        .setLabel('Commands'))
        .addComponents(new MessageButton()
        .setCustomId('plusCmds')
        .setDisabled(page == 'plusCmds')
        .setStyle(page == 'plusCmds' ? 'SUCCESS' : 'PRIMARY')
        .setLabel('Plus Commands'));
}
function generateEmbed(page) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let color;
        if (page == 'general')
            color = 'GREEN';
        else if (page == 'plusCmds')
            color = 'GOLD';
        else
            color = 'BLUE';
        return new MessageEmbed({
            author: {
                name: "RAMEN GUIDE 📖",
                iconURL: (_a = client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL()
            },
            description: helpText[page],
            footer: {
                iconURL: (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL(),
                text: `${yield getAd()}`
            },
            color
        });
    });
}
