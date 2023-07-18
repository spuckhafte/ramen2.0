import { Command } from "breezer.js";
import User from "../schema/User.js";

export default class extends Command {
    constructor() {
        super({
            structure: []
        });
    }

    async execute() {
        if (!this.msg) return;
        if (!this.msg.member?.roles.cache.has('1130759159151874139')) return;
        if (this.msg.channel.id != '1130765930771779625') return;

        await User.updateMany({}, {
            $set: {
                weekly: {
                    mission: 0,
                    report: 0,
                    challenge: 0
                }
            }
        });
        if (!this.botHasPerm('SEND_MESSAGES')) return;
        this.msg?.reply("WEEKLY STATS RESET!")
    }
}