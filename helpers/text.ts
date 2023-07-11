import Bio from '../data/bio.json' assert { type: "json" };

export const helpText = `**The bot will start reminding you after your fist NB task**`;

export const plusText = `**Ramen Plus is a way to support your favorite reminder bot.**
Building and maintaining the bot takes a lot of effort and surely is hectic. 
With Ramen Plus, you have the opportunity to directly contribute to its growth and ensure that it remains a reliable and efficient tool for all your NB needs.
Btw its a two way deal: You also get **special perks** for your server with Ramen Plus.

All the donators will be mentioned in the \`r plus subs\` list.

__**SPECIAL PERKS 💪**__

**Server Specific LBs**
With this feature, you can have personalized leaderboards that track users' progress only within your server. These leaderboards can be reset at any time using a specific command. You also have the ability to control who has the permission to reset the leaderboards.
These server-specific leaderboards are particularly useful if you plan to host any NB events within your server.

**Pricing:** 
\`USD-2 / INR-150 per month\` 
\`USD-20 / INR-1500 per year\`

**====================================**

__**PAYMENT OPTIONS**__

\`1.\` **[Paypal](${Bio.PAYPAL})**
\`2.\` **UPI: _${Bio.UPI}_**
*If you prefer to pay by any other means, please DM me (spuckhafte)*

If you wish to **donate without any perks**, please DM me, as I'll need to include your name in the **"r plus subs"** list.

**====================================**

__**AFTERMATH**__

Once the payment is done, open a ticket in [Official Ramen Server](${Bio.OFFICIAL_SERVER}) (or DM me) and send the screen-shot or any type of proof of payment. 
Moderators will register you then.

**====================================**

\`r plus cmd\`: refer to premium commands.
`

export const plusHelp = `**These commands can only run in *Plus subscribed servers*, \`r plus\` for details**

\`r lb+ <task>\`
Server specific leaderboards for the following **tasks:**
> **"m" | "r" | "ch"**
The LBs of a server will be affected only when the members will play in there.

\`r lbclr <task>\`
Certain members, called ***Mods***, (editable) can clear the **Plus LBs** for the usual **tasks**.
> By default, the user who bought the subscription is included in the **Mods list**.

\`r mod add @user\`
Members who are already ***Mods*** can **add new**  \`@user\` in **the list**..

\`r mod del @user\`
Members who are already ***Mods*** can **remove a** \`@user\` from **the list**.

\`r mod show\`
Anyone can view the usernames of the ***Mods***.

\`r plus valid\`
Validity of your plus plan.
`