import { Message, TextChannel } from "discord.js";

export default async (msg:Message) => {
    const nums = ['1', '2', '3', '4', '5']
    const colors = ['white', 'black', 'grey'];
    const locations = ['forest', 'dango', 'gate'];

    const report = msg.embeds[0].description?.toLowerCase() as string;

    const num = nums.find(i => report.includes(i));
    const color = colors.find(i => report.includes(i));
    const location = locations.find(i => report.includes(i));

    if (!msg.guild?.members.me?.permissionsIn(msg.channel as TextChannel).has('SEND_MESSAGES')) 
        return;

    await msg.reply(`**Hint: __\`${num} ${color} ${location}\`__**`);
}