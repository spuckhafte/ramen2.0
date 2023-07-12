import { Command } from "breezer.js";
import User from "../schema/User.js";
import Bio from '../data/bio.json' assert { type: "json" };

export default class extends Command {
    constructor() {
        super({
            structure: []
        });
    }

    async execute() {
        if (!this.msg) return;
        if (!Bio.GOD_MODS.includes(this.msg.author.id)) return;

        await User.updateMany({}, {
            $set: {
                weekly: {
                    mission: 0,
                    report: 0,
                    challenge: 0
                }
            }
        });
        this.msg?.reply("WEEKLY STATS RESET!")
    }
}