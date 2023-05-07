import { Message } from "discord.js";

export default async (msg:Message) => {
    const nums = ['1', '2', '3', '4', '5']
    const colors = ['white', 'black'];
    const locations = ['forest', 'dango', 'gate'];

    const report = msg.embeds[0].description?.toLowerCase() as string;

    const num = nums.find(i => report.includes(i));
    const color = colors.find(i => report.includes(i));
    const location = locations.find(i => report.includes(i));

    await msg.channel.send(`**Hint: __\`${num} ${color} ${location}\`__**`);
}