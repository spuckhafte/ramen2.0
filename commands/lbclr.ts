import { Command } from "breezer.js";
import { getTask, isPro } from "../helpers/funcs.js";

export default class extends Command {
    constructor() {
        super({
            structure: ["string"]
        });
    }

    async execute() {
        const premServer = await isPro(this.msg);
        if (!premServer) return;

        if (!premServer.mods.includes(this.msg?.author.id ?? "")) {
            if (!this.botHasPerm('SEND_MESSAGES')) return;
            await this.msg?.reply({
                content: "**You are not allowed to access this command.**",
                allowedMentions: { repliedUser: false }
            });
            return;
        }

        let [task] = this.extract() as string[];

        task = getTask(task);

        if (task == 'null' || (task !== 'mission' && task !== 'report' && task !== 'challenge')) {
            if (!this.botHasPerm('SEND_MESSAGES')) return;
            this.msg?.reply({
                content: '`r lbclr <task>`\n`<task> "m" | "r" | "ch"`',
                allowedMentions: { repliedUser: false }
            });
            return;
        }

        for (let usr of premServer.users)
            usr[task] = 0;

        await premServer.save();

        if (!this.botHasPerm('SEND_MESSAGES')) return;
        await this.msg?.reply("**Mission LB cleared!**");
    }
}