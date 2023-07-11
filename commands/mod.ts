import { Command } from "breezer.js";
import { isPro } from "../helpers/funcs.js";

export default class extends Command {
    constructor() {
        super({
            structure: ['string', 'string']
        });
    }

    async execute() {
        const premServer = await isPro(this.msg);
        if (!premServer) return;

        const [action] = this.extract();
        const mention = this.msg?.mentions.users.first();

        if ((action != 'add' && action != 'del' && action != 'show') || (action != 'show' && !mention)) {
            await this.msg?.reply({
                content: "**Correct structure of this command: `r mod <add||del> @someone\`**",
                allowedMentions: { repliedUser: false }
            });
            return;
        }

        if (action == 'show') {
            const mods: string[] = []
            for (let mod of premServer.mods) {
                const user = await this.msg?.guild?.members.fetch(mod);
                mods.push(user?.user.username ?? "");
            };
            this.msg?.reply(`**Username(s) of the Mod(s)**\n\`\`\`${mods.join(", ")}\`\`\``);
            return;
        }

        if (!mention) return;
        
        if (!premServer.mods.includes(this.msg?.author.id ?? "")) {
            await this.msg?.reply({
                content: "**You are not allowed to access this command.**",
                allowedMentions: { repliedUser: false }
            });
            return;
        }

        if (action == 'add') {
            if (premServer.mods.includes(mention.id)) {
                await this.msg?.reply({
                    content: "**The mentioned user is already a *mod*.**",
                    allowedMentions: { repliedUser: false }
                });
                return;
            }

            premServer.mods.push(mention.id);
            await premServer.save();

            await this.msg?.reply(`**\`${mention.username}\` is now a *mod*!**`);
        }

        if (action == 'del') {
            if (!premServer.mods.includes(mention.id)) {
                await this.msg?.reply({
                    content: "**The mentioned user is not a *mod*.**",
                    allowedMentions: { repliedUser: false }
                });
                return;
            }

            premServer.mods.splice(premServer.mods.indexOf(mention.id), 1);
            await premServer.save();

            await this.msg?.reply(`**\`${mention.username}\` is __not__ a *mod* now!**`);
        }
    }
}