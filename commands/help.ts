import { Command } from "breezer.js";
import { MessageEmbed } from "discord.js";
import { client } from "../index.js";
import helpText from "../helpers/helpText.js";

export default class extends Command {
    constructor() {
        super({
            structure: []
        })
    }

    async execute() {
        const embed = new MessageEmbed({
            author: {
                name: "RAMEN GUIDE 📖",
                iconURL: client.user?.displayAvatarURL()
            },
            description: helpText,
            footer: {
                text: 'Help msg under development 🔨'
            }
        });

        await this.msg?.channel.send({ embeds: [embed] });
    }
}