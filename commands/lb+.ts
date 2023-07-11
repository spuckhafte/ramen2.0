/* ------------ PREMIUM ------------ */

import { Command, StateManager, buttonSignal } from "breezer.js";
import { getAd, getTask, isPro } from "../helpers/funcs.js";
import { ProUser } from "../types";
import { Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

const meme = 'https://www.youtube.com/watch?v=td1QQphKDK4';

const stateManager = new StateManager({});
export default class extends Command { // r lb m g
    constructor() {
        super({
            structure: ['string'],
            states: stateManager.clone()
        });
    }

    async execute() {

        const [type] = this.extract();

        const premServer = await isPro(this.msg);
        if (!premServer) return;

        const allPremUsers = premServer.users as ProUser[];


        if (!this.botHasPerm('SEND_MESSAGES') || !this.botHasPerm('EMBED_LINKS')) {
            if (this.botHasPerm('SEND_MESSAGES'))
                this.msg?.channel.send("`Missing Perm: [EMBED_LINKS]`");
            return;
        }


        if (!type || (type != 'm' && type != 'r' && type != 'ch')) {
            await this.msg?.channel.send(`\`r lb <task> \`\n\`\`\`<task> "m": missions, "r": reports, "ch": challenges\`\`\``);
            return;
        };


        const task = getTask(type) as 'mission' | 'report' | 'challenge';

        const pageDetails = await getPage(allPremUsers, 1, task, this.msg);
        if (!pageDetails) return;

        const total = pageDetails.data.length;
        const lastPage = Math.ceil(total / 10);

        this.states?.set<number>('pageNo', _ => 1)
        this.states?.set<string>('page', _ => pageDetails.string);

        const embed = new MessageEmbed({
            title: `${this.msg?.guild?.name}'s ${task.toUpperCase()} LB`,
            description: '$page$',
            footer: {
                text: `$pageNo$ of ${lastPage} (${await getAd()})`,
                iconURL: this.msg?.author.displayAvatarURL()
            },
            thumbnail: {
                url: this.msg?.guild?.iconURL() ?? ""
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
            );
        
        if (pageDetails.data.find(usr => usr.userId === this.msg?.author.id)) {
            row.addComponents(
                new MessageButton()
                    .setCustomId('yourPage')
                    .setStyle('PRIMARY')
                    .setLabel('Your Page')
            );
        }
        

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
                const userIndex = pageDetails.data.findIndex(val => val.userId == this.msg?.author.id);
                page = Math.ceil((userIndex + 1) / 10);
            }

            const newPage = await getPage(allPremUsers, page, task, this.msg);
            if (!newPage) return;

            this.states?.set('page', () => newPage.string);
            this.states?.set('pageNo', () => page);
        });
    }
}

async function getPage(
    allPremUsers: ProUser[], 
    pageNo: number, 
    task: 'mission' | 'challenge' | 'report', 
    msg: Message | undefined
) {
    allPremUsers = arrangeUsers(allPremUsers, task);
    const from = (pageNo - 1) * 10;
    const page = allPremUsers.slice(from, from + 10);
    let string = '';

    for (let i = 0; i < page.length; i++) {
        const entry = page[i];
        let username;
        if (entry.username == msg?.author.username)
            username = `__${entry.username}__`;
        else username = entry.username;

        string += `\`#${((pageNo - 1) * 10) + i + 1}\` **${username}** - **[${entry[task]}](${meme})**\\n`;
    }
    return { data: allPremUsers, string };
}



function arrangeUsers(arr: ProUser[], task: 'mission'|'report'|'challenge'): ProUser[] {
    if (arr.length <= 1) return arr;

    let pivot = arr[0];
    let leftArr = [];
    let rightArr = [];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i][task] > pivot[task])
            leftArr.push(arr[i]);
        else rightArr.push(arr[i]);
    }

    return [
        ...arrangeUsers(leftArr, task), 
        pivot, 
        ...arrangeUsers(rightArr, task)
    ];
};