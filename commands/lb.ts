import { Command, StateManager, buttonSignal } from "breezer.js";
import { getTask } from "../helpers/funcs.js";
import User from "../schema/User.js";
import { StdObject } from "../types";
import { Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { client } from "../index.js";

const meme = 'https://www.youtube.com/watch?v=td1QQphKDK4';

const stateManager = new StateManager({});
export default class extends Command { // r lb m g
    constructor() {
        super({
            structure: ['string', 'string'],
            states: stateManager.clone()
        });
    }

    async execute() {
        const [type, scope] = this.extract();
        if (!this.botHasPerm('SEND_MESSAGES') || !this.botHasPerm('EMBED_LINKS')) {
            if (this.botHasPerm('SEND_MESSAGES'))
                this.msg?.channel.send("`Missing Perm: [EMBED_LINKS]`");
            return;
        }

        if (!type || !scope) {
            await this.msg?.channel.send(`\`r lb <task> <scope>\``);
            return;
        }

        if (type != 'm' && type != 'r' && type != 'ch') {
            await this.msg?.channel.send(`\`r lb <task> <scope>\`\n\`\`\`<task> "m": missions, "r": reports, "ch": challenges\`\`\``);
            return;
        };

        if (scope != 'l' && scope != 'g') {
            await this.msg?.channel.send(`\`r lb <task> <scope>\`\n\`\`\`<scope> "l": local, "g": global\`\`\``);
            return;
        }
        const task = getTask(type) as 'mission'|'report'|'challenge';
        
        const pageDetails = await getPage(1, scope as string, task, this.msg);
        if (!pageDetails) return;

        const total = pageDetails.data.length;
        const lastPage = Math.ceil(total / 10);

        this.states?.set<number>('pageNo', _ => 1)
        this.states?.set<string>('page', _ => pageDetails.string);
        
        const embed = new MessageEmbed({
            title: `${scope == 'l' ? "LOCAL" : 'GLOBAL'} ${task.toUpperCase()} LB`,
            description: '$page$',
            footer: {
                text: `$pageNo$ of ${lastPage}`,
                iconURL: this.msg?.author.displayAvatarURL()
            }, 
            thumbnail: {
                url: client.user?.displayAvatarURL()
            }
        });

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('fb')
                    .setStyle('SECONDARY')
                    .setEmoji('⏪')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('backward')
                    .setStyle('SUCCESS')
                    .setEmoji('◀️')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('forward')
                    .setStyle('SUCCESS')
                    .setEmoji('▶️')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('ff')
                    .setStyle('SECONDARY')
                    .setEmoji('⏩')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('yourPage')
                    .setStyle('PRIMARY')
                    .setLabel('Your Page')
            )

        const sent = await this.send({ embeds: [embed], components: [row] });

        buttonSignal([this.msg?.author.id ?? ""], sent, { time: 15 * 60 * 1000 })?.on('collect', async btn => {
            await btn.deferUpdate();
            let page = this.states?.get('pageNo') as number;
            if (!page) return;

            if (
                btn.customId == 'forward' && page == lastPage ||
                btn.customId == 'backward' && page == 1
            ) return;

            if (btn.customId == 'fb') page = 1;
            if (btn.customId == 'forward') page += 1; 
            if (btn.customId == 'backward') page -= 1;
            if (btn.customId == 'ff') page = lastPage
            if (btn.customId == 'yourPage') {
                const userIndex = pageDetails.data.findIndex(val => val.id == this.msg?.author.id);
                console.log(userIndex)
                page = Math.ceil((userIndex + 1) / 10);
            }

            const newPage = await getPage(page, scope as string, task, this.msg);
            if (!newPage) return;
            
            this.states?.set('page', () => newPage.string);
            this.states?.set('pageNo', () => page);
        });
    }
}

async function getPage(pageNo:number, scope:string, task:'mission'|'challenge'|'report', msg:Message|undefined) {
    const sortQuery:StdObject = { [`weekly.${task}`]: -1 };
    let data = await User.find({}, ['id', 'username', `weekly.${task}`]).sort(sortQuery);

    if (scope == 'l') {
        if (!msg || !msg.guild) return;
        const allGuildMembers = (await msg.guild.members.fetch()).map(i => i.id);
        data = data.filter(i => allGuildMembers.includes(i.id));
    }

    const from = (pageNo - 1) * 10;
    const page = data.slice(from, from + 10);
    let string = '';

    for (let i = 0; i < page.length; i++) {
        const entry = page[i];
        let username;
        if (entry.username == msg?.author.username)
            username = `__${entry.username}__`
        else username = entry.username;

        string += `\`#${((pageNo - 1) * 10) + i + 1}\` **${username}** - **[${(entry.weekly as any)[task]}](${meme})**\\n`;
    }
    return { data, string };
}
