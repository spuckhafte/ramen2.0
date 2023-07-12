import { Command, buttonSignal } from "breezer.js";
import { ColorResolvable, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { client } from "../index.js";
import { helpText_1, helpText_2, helpText_3 } from "../helpers/text.js";
import { getAd } from "../helpers/funcs.js";

const helpText = {
    general: helpText_1,
    botCmds: helpText_2,
    plusCmds: helpText_3
}

export default class extends Command {
    constructor() {
        super({
            structure: []
        });
    }

    async execute() {
        const embed = await generateEmbed('general');
        const row = generateRow('general');

        const sent = await this.msg?.channel.send({ 
            embeds: [embed], 
            components: [row] 
        });

        buttonSignal([], sent)?.on('collect', async btn => {
            if (!Object.keys(helpText).includes(btn.customId)) return;
            await btn.deferUpdate();

            await sent?.edit({
                embeds: [await generateEmbed(btn.customId as keyof typeof helpText)],
                components: [generateRow(btn.customId as keyof typeof helpText)]
            });
        });
    }
}

function generateRow(page: 'general' | 'botCmds' | 'plusCmds') {
    return new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('general')
                .setDisabled(page == 'general')
                .setStyle(page == 'general' ? "SUCCESS" : 'PRIMARY')
                .setLabel('General')
        )
        .addComponents(
            new MessageButton()
                .setCustomId('botCmds')
                .setDisabled(page == 'botCmds')
                .setStyle(page == 'botCmds' ? 'SUCCESS' : 'PRIMARY')
                .setLabel('Commands')
        )
        .addComponents(
            new MessageButton()
                .setCustomId('plusCmds')
                .setDisabled(page == 'plusCmds')
                .setStyle(page == 'plusCmds' ? 'SUCCESS' : 'PRIMARY')
                .setLabel('Plus Commands')
        )
}

async function generateEmbed(page: 'general' | 'botCmds' | 'plusCmds') {
    let color: ColorResolvable;
    if (page == 'general') color = 'GREEN';
    else if (page == 'plusCmds') color = 'GOLD';
    else color = 'BLUE';

    return new MessageEmbed({
        author: {
            name: "RAMEN GUIDE 📖",
            iconURL: client.user?.displayAvatarURL()
        },
        description: helpText[page],
        footer: {
            iconURL: client.user?.displayAvatarURL(),
            text: `${await getAd()}`
        },
        color
    });
}