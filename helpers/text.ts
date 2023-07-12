import Bio from '../data/bio.json' assert { type: "json" };

export const helpText_1 = `**The bot will start reminding you after your fist NB task**
Running any NB command will register a reminder for your cooldown and the bot will ping you on time.
### When to use \`n cd\`?
- If you do a task in a *ramen-less* server, __n cd__ will be required in a *ramen-full* server.
- To register a reminder for **vote**.
- If the bot restarts due to an error, it will attempt to retrieve all the reminders for every user. However, this process may take some time (5-10 mins). If you happen to be online during this period, you can also use __n cd__ to immediately register the *lost rems*.
`;

export const helpText_2 = `## 🤖 Bot Commands
> **Prefix: \` r \`** *(slash commands have been removed)*
### \`r plus\`
Description of Ramen Plus: a way to support the development of your favorite reminder bot and receive **special perks** in return.
> \`r plus subs\`: shows all the donators and their donations.

### \`r lb <task> <scope>\`
Weekly leaderboards for *missions, reports and challenges*, both global and local.
- \`<task>\` **m | r | ch**
- \`<scope>\` **g | l**
> **Global (g):** LB includes all grinders from all the servers Ramen is in.
> **Local (l):** LB includes grinders from the server where this command is being used.

### \`r rem show\`
Shows all the registered reminders.

### \`r rem block <task>\`
Block specific or all tasks, i.e,
- \`<task>\`: set it to any NB task \`m | r | ch | d | etc\` or set it \`all\` (to block all tasks)
> You can also set \`<task>\` to \`show\`, it'll display all the **blocked** tasks.

### \`r rem unblock <task>\`
Unblock specific or all tasks, i.e.,
- \`<task>\`: set it to any NB task \`m | r | ch | d | etc\` or set it \`all\` (to unblock all tasks)

### \`r here\`
The channel where you run this command will be set as your default channel.
- You'll recieve the reminder pings in your **default channel**.
> \`r here clr\` || \`r here clear\` -> clears the default channel.

### \`r early <time>\`
**Early Reminder Factor Timing:** if you want to have your reminders few seconds early than the actual timing, you can set it using this.
- \`<time>\`: has to be a time factor in seconds ranging from \`0 to 5 seconds\`.
> \`r early\`: leave **<time>** empty to see the current value of the factor.  

### \`r profile\`
Shows your profile.
- Includes *online/offline status, weekly leaderboard rankings, lifetime stats (wrt ramen) and your default channel (if any)*.
`
export const helpText_3 = `## ✨ Plus Commands
**These commands can only run in *Plus subscribed servers*, \`r plus\` for details**
### \`r lb+ <task>\`
Server specific leaderboards for the following **tasks:**
- **m | r | ch**
The LBs of a server will be affected only when the members will play in there.
### \`r lbclr <task>\`
Certain members, called ***Mods***, (editable) can clear the **Plus LBs** for the usual **tasks**.
- By default, the user who bought the subscription is included in the **Mods list**.
### \`r mod add @user\`
Members who are already ***Mods*** can **add** any @user to **the list**.
### \`r mod del @user\`
Members who are already ***Mods*** can **remove a** \`@user\` from **the list**.
### \`r mod show\`
Anyone can view the usernames of the ***Mods***.
### \`r plus valid\`
Validity of your plus plan.
`




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

\`r help\`: under the **Plus Commands** section (using btn), refer to the premium commands.
`