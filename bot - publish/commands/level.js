
//updated messages

const Discord = require('discord.js')


module.exports = {
	name: 'level',
	aliases: ['levelup','up','lvl'],
	description: 'Level yourself up!',
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

		if(userdata.data.xp < userdata.data.xpNeeded){
			client.sendMessage(msg,"Not enough XP",`Sorry, but you still need \`\`${userdata.data.xpNeeded - userdata.data.xp}\`\` XP!`,"niko_speak")
			return
		}

		if(userdata.data.level == 50){
			client.sendMessage(msg,"Max Level",`You are already at the maximum Level!\nIf you want to upgrade further, you have to use \`\`$prestige\`\`!`,"niko_speak")
			return
		}


		const stats = userdata.data.stats

		embed
		.setFooter(`Finalboss Tom's Manager - Important`,client.EmojiMap.get("niko").url)
		.setTitle(`Choose your stat to upgrade!`)
		.setColor(0xfffffc)
		.setThumbnail(msg.author.avatarURL())


		.addField(`:muscle: **${stats.strength}** Strength`,"Pure physical Strength allows you to carry even the heaviest things!",true)
		.addField(`:athletic_shoe: **${stats.dexterity}** Dexterity`,"Some more Stamina could never be a bad choice, right?",true)
		.addField(`:kiss: **${stats.charisma}** Charisma`,"With some Charme and Swag, nobody will be able to resist you!",true)
		.addField(`:brain: **${stats.wisdom}** Wisdom`,"Knowing everything could have some positive effects.\nBut they are mostly magical.",true)
		.addField(`:four_leaf_clover: **${stats.luck}** Luck`,"Ever wanted to win the lottery 3 times in a row?",true)



		var embedMsg;
		await msg.channel.send(embed)
		.then(async m => {
			embedMsg = m
		})

		const filter = (reaction, user) => user.id == msg.author.id;
		const collector = embedMsg.createReactionCollector(filter, {max: 1, time: 30000});


		collector.on('end',r => {
			let check = false
			if(!r.first()){
				check = true;
				embedMsg.reactions.removeAll()
				return
			}
			switch(r.first().emoji.name){
				case "💪":
				stats.strength += 1;
				msg.react("💪")
				break;
				case "👟":
				stats.dexterity += 1;
				msg.react("👟")
				break;
				case "💋":
				stats.charisma += 1;
				msg.react("💋")
				break;
				case "🧠":
				stats.wisdom += 1;
				msg.react("🧠")
				break;
				case "🍀":
				stats.luck += 1;
				msg.react("🍀")
				break;

				default:
				check = true;
				client.sendMessage(msg,"Unknown Reaction",`Uhm...?`,"niko_what")
				return
				break;
			}

			if(check == true){
			return
			}

			userdata.data.xp = userdata.data.xp - userdata.data.xpNeeded;
			userdata.data.xpNeeded = Math.round(userdata.data.xpNeeded * 1.25);
			if(userdata.data.xpNeeded > 500)userdata.data.xpNeeded = 500;
			userdata.data.level += 1;
			if(userdata.data.level == 50)userdata.data.xpNeeded = 2000;

			userdata.data.stats = stats
			client.setUserdata(userdata)
			embedMsg.delete()
		})

		try{
		await embedMsg.react("💪")
		await embedMsg.react("👟")
		await embedMsg.react("💋")
		await embedMsg.react("🧠")
		await embedMsg.react("🍀")
		}
		catch(error){
			return
		}

	},
};
