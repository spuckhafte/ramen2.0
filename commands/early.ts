import { Command } from "breezer.js";
import User from "../schema/User.js";

export default class extends Command {
    constructor() {
        super({
            structure: ['string|null']
        });
    }

    async execute() {
        let [timing] = this.extract() as number[];

        const user = await User.findOne({ id: this.msg?.author.id });
        if (!user) return;

        if (!timing && timing !== 0) {
            this.msg?.reply(`**Early Reminder Factor: \`${user.extras?.early} seconds\`**`);
            return;
        }

        if (Number.isNaN(timing)) {
            this.msg?.reply("**Early Reminder Factor has to be a number (time in seconds)**");
            return;
        }

        timing = +timing;
        
        if (timing > 5 || timing < 0) {
            this.msg?.reply("**Early Reminder Factor timing has to be in between \`0 to 5 seconds\`** *inclusive*.");
            return;
        }

        // @ts-ignore :: .early is by-default a number in schema definition
        user.extras?.early = timing;
        await user.save();

        await this.msg?.reply(`**Early Reminder Factor: \`${timing} seconds\`**`);
    }
}