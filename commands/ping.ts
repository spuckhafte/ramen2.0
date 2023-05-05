import { Command } from "breezer.js";

export default class extends Command {
    constructor() {
        super({
            structure: []
        })
    }

    async execute() {
        await this.msg?.channel.send('Pong!');
    }
}