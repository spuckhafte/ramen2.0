import { Command } from "breezer.js";
import Config from "../schema/Config.js";
import Bio from '../data/bio.json';

export default class extends Command {
    constructor() {
        super({
            structure: ['string', 'string']
        });
    }

    async execute() {
        if (!Bio.GOD_MODS.includes(this.msg?.author.id ?? "")) return;

        const [property, value] = this.extract() as string[];

        const config = await Config.findOne({ discriminator: "only-config" });
        if (!config) return;

        if (!config[property as keyof typeof config]) {
            await this.msg?.reply(`No such property: ${property}`);
            return;
        }

        config[property as keyof typeof config] = value as never;
        await config.save();
        await this.msg?.reply('done');
    }
}