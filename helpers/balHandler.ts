import { Message, MessageEmbed, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { client } from "../index.js";
import { userHasPerm } from "breezer.js";

export default async (rxn:MessageReaction|PartialMessageReaction, user:User|PartialUser) => {
    if (user.bot) return;
    const botMsg = rxn.message.embeds[0];
    if (!botMsg) return;
    if (!botMsg.title?.includes('balance')) return
    if (!botMsg.footer?.text.includes('earned lifetime')) return;
    if (!rxn.message.embeds[0].footer?.iconURL?.includes(user.id)) return;
    if (rxn.emoji.name !== '🤑') return;

    const rxnUsers = rxn.message.reactions.cache.find(rx => rx.emoji.name == '🤑')?.users.cache.toJSON();
    if (!rxnUsers || rxnUsers?.length == 0) return;

    let botInList = false;
    for (let usr of rxnUsers) {
        if (usr.id === client.user?.id) {
            botInList = true;
            break;
        }
    }
    if (!botInList) return;

    const ryo = botMsg.description?.split('\n')[0].split('** ')[1];
    const specialTickets = botMsg.description?.split('\n')[1].split('** ')[1];

    if (!ryo || !specialTickets) return;

    const pulls = Math.floor(+ryo / 300);
    const spulls = Math.floor(+specialTickets / 500);
    
    if (await userHasPerm('SEND_MESSAGES', client.user?.id ?? "", rxn.message as Message)) {
        if (await userHasPerm('EMBED_LINKS', client.user?.id ?? "", rxn.message as Message)) {
            const embed = new MessageEmbed({
                title: `${user.username}'s Balance Planning`,
                fields: [
                    { name: 'Pulls', value: `${pulls}`, inline: true },
                    { name: 'Special Pulls', value: `${spulls}`, inline: true }
                ],
                footer: {
                    iconURL: botMsg.footer.iconURL,
                    text: user.username ?? ""
                },
                color: "RANDOM"
            });
            await rxn.message.channel.send({ embeds: [embed] });
        } else {
            const content = `__**${user.username}'s BALANCE PLANNING**__\n**Pulls:** \`${pulls}\`\n**Special Pulls:** \`${spulls}\`\n\n\`Missing Perm: [EMBED_LINKS]\``;
            await rxn.message.reply({ content });
        }
    }

    await rxn.message.reactions.cache.find(rx => rx.emoji.name === '🤑')?.users.remove(client.user?.id);
}