import { Command } from "breezer.js";
import { updateDb } from "../helpers/funcs.js";

export default class extends Command {
    constructor() {
        super({
            structure: ['string|null'],
        })
    }
    
    async execute() {
        const [action] = this.extract() as string[];
        
        if (!action) {
            await updateDb({ id: this.msg?.author.id }, 'extras.defaultChannel', this.msg?.channel.id);
            await this.msg?.reply('**You will now recieve your pings in this channel.**');
        }

        if (action == 'clear' || action == 'clr') {
            await updateDb({ id: this.msg?.author.id }, 'extras.defaultChannel', '');
            await this.msg?.reply('**Personal channel cleared!**');
        }
    }
}