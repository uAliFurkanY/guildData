# guild-data

Discord.js guild data management with `nkv.db`.

Requesting the guild object is not resource heavy as it just checks if a guild with that id exists or not (creates it if it doesn't exist).  
Requesting properties is also not resource heavy as it is cached.

Technically will work for DMs, but requires tinkering with the code.

##### TODO: This but for user data.

##### TODO: Support DMs.

### Example

```js
#!/usr/bin/env node
require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
client
	.login(process.env.TOKEN)
	.then(() => {
		console.log("Bot login successful.");
	})
	.catch((e) => {
		console.error("An error occured.");
		console.error(e);
		process.exit(1);
	});
// the `database` argument is useless if you don't want to reuse databases
const gd = require("guild-data")(client, { prefix: "&" });

client.on("message", (message) => {
	if (message.author.bot || !message.guild) return;
	const gld = gd(message.guild.id);
	if (!message.content.startsWith(gld.prefix)) return;
	let args = message.content.trim().slice(gld.prefix.length).split(" ");
	const command = args.shift();
	if (command === "get") {
		message.channel.send(gld[args[0]] || "undefined");
	} else if (command === "set") {
		message.channel.send(
			(gld[args[0]] = args[1] || undefined) || "undefined"
		);
	}
});
```

![Demo](https://cdn.discordapp.com/attachments/756056630264856646/758623988435386368/Screenshot_from_2020-09-24_12-35-02.png)
