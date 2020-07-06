
//updated messages

const Discord = require('discord.js')


module.exports = {
	name: 'prestige',
	description: 'Start a new life, with added perks!',
	exclude: true,
	async execute(client,msg,args,userdata) {

		client.sendMessage(msg,"Disabled Command","Sorry, but this Command is currently disabled!","niko_speak")
		return

		const embed = new Discord.MessageEmbed()

		userdata = client.getUserdata(msg.author.id)

		if(!userdata){
			client.sendMessage(msg,"No Profile","Sorry, but you don't have a profile set-up!\nUse``$profile`` to change that!","niko_speak")
			return
			}

			if(!userdata.data.stats){
			client.sendMessage(msg,"No Profile","Sorry, but you don't have a profile set-up!\nUse``$profile`` to change that!","niko_speak")
			return
		}

		if(userdata.data.level != 50){
			client.sendMessage(msg,"Not Max Level",`You have to be Level 50 in order to prestige!`,"niko_speak")
			return
		}

		if(userdata.data.xp < userdata.data.xpNeeded){
			client.sendMessage(msg,"Not enough XP",`Sorry, but you still need \`\`${userdata.data.xpNeeded - userdata.data.xp}\`\` XP!`,"niko_speak")
			return
		}

		const stats = userdata.data.stats

		embed
		.setFooter(`Finalboss Tom's Manager - Important`,client.EmojiMap.get("niko").url)
		.setTitle(`**${msg.author.username}**\nAre you sure you want to prestige?`)
		.setColor(0xf0e85c)
		.setThumbnail(msg.author.avatarURL())
		.setDescription(`**If you prestige you will:**\n- Be reset to Level 1\n- Lose all your stats\n- Gain a 25% boost for all Fightstats\n- Gain 50k :pancakes:\n- Gain a 20% boost on :pancakes:\n- Gain 10 more inventory slots\n- Unlock some new flairs`)

		.addField(`:white_check_mark:`,`"Yes i am absolutely sure and want to start from the beginning!"`,true)
		.addField(` ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `,`**==============**`,true)
		.addField(`:negative_squared_cross_mark:`,`"No wait, i still have to flex on others with my superiority!"`,true)


		const prestigeEmbed = new Discord.MessageEmbed()
		.setFooter(`Finalboss Tom's Manager - Important`,client.EmojiMap.get("niko").url)
		.setTitle(`:trident: **${msg.author.username} has prestiged!**`)
		.setColor(0x42fa45)
		.setThumbnail(msg.author.avatarURL())
		.setDescription("Use ``$me`` to see your new self!")

		const denyEmbed = new Discord.MessageEmbed()
		.setFooter(`Finalboss Tom's Manager - Important`,client.EmojiMap.get("niko").url)
		.setTitle(`:x: Prestige aborted`)
		.setColor(0xfa4242)
		.setThumbnail(msg.author.avatarURL())
		.setDescription("You denied your prestige.")

		var embedMsg;
		await msg.channel.send(embed)
		.then(async m => {
			embedMsg = m
		})

		const filter = (reaction, user) => user.id == msg.author.id;
		const collector = embedMsg.createReactionCollector(filter, {max: 1, time: 60000});


		collector.on('end',r => {
			let check = false
			if(!r.first()){
				embedMsg.edit(denyEmbed)
				embedMsg.reactions.removeAll()
				return
			}
			switch(r.first().emoji.name){
				case "✅":
				const temp = {   strength: Math.floor(Math.random() * 5 + 1)
									, dexterity: Math.floor(Math.random() * 5 + 1)
									, charisma: Math.floor(Math.random() * 5 + 1)
									, wisdom: Math.floor(Math.random() * 5 + 1)
									, luck: Math.floor(Math.random() * 5)
									, honor: 0
									, version: client.profileVersion
				}
				userdata.data.xp = 0;
				userdata.data.xpNeeded = 25;
				userdata.data.level = 1;
				userdata.data.points += 50000
				if(!userdata.data.prestige)userdata.data.prestige = 0;
				userdata.data.prestige += 1;
				userdata.data.xpMax = 1000
				userdata.data.stats = temp
				userdata.data.stats.hpTimer = Date.now()
				userdata.data.stats.currentHp = 1
				userdata.data.inventory.max += 10;
				console.log(userdata)
				client.setUserdata(userdata)

				embedMsg.edit(prestigeEmbed)
				embedMsg.reactions.removeAll()
				break;
				case "❎":
				default:

				embedMsg.edit(denyEmbed)
				embedMsg.reactions.removeAll()
				return
				break;
			}
		})

		try{
		await embedMsg.react("✅")
		await embedMsg.react("❎")
		}
		catch(error){
			return
		}

	},
};
