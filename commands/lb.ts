import { Command } from "breezer.js";
import { getTask } from "../helpers/funcs.js";
import User from "../schema/User.js";
import { StdObject } from "../types";

const meme = 'https://www.youtube.com/watch?v=td1QQphKDK4';

export default class extends Command { // r lb g
    constructor() {
        super({
            structure: ['string', 'string']
        });
    }

    async execute() {
        const [type, scope] = this.extract();
        console.log(type, scope)
        if (!type || !scope) return;

        if (type != 'm' && type != 'r' && type != 'ch') {
            await this.msg?.channel.send(`\`r lb <task>\`\n**m**: missions, **r**: reports, **ch**: challenges`);
            return;
        };
        const task = getTask(type) as 'mission'|'report'|'challenge';
        
        const sortQuery:StdObject = {};
        sortQuery[`weekly.${task}`] = -1;

        let data = await User.find({}, ['id', 'username', `weekly.${task}`]).sort(sortQuery)

        if (scope == 'l') {
            if (!this.msg || !this.msg.guild) return;
            const allGuildMembers = (await this.msg.guild.members.fetch()).map(i => i.id);
            data = data.filter(i => allGuildMembers.includes(i.id));
        }

        const total = data.length;
        const lastPage = Math.ceil(total / 10);

        
    }
}

async function getPage(data:any, pageNo:number) {
    const from = (pageNo - 1) * 10 + 1;
    const page = data.slice(from, from + 10);
    let string = '';
    // for (let i in page1) {
    //     if (+i == 10) break;
    //     i += 1;

    //     const entry = page1[+i];
    //     string += `\`#${((1 - 1) * 10) + i}\` ${entry.username} - [${entry.weekly?.[task]}](${meme})`;
    // }
}