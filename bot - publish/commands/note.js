const Discord = require('discord.js')

module.exports = {
	name: 'note',
	description: 'Writes a Note for Tom.',
	exclude: true,
	execute(client,msg,args,userdata) {
		
		if(!args[1]){
			msg.channel.send("Writing something for the note could be useful, you know...?")
			return
		}
		
		const notes = client.channels.cache.get("694242420413694102")
		const embed = new Discord.MessageEmbed()
		
		embed.setTitle(args.slice(1).join(" "))
		.setColor(0x881cff)
		.setDescription(`Created by ${msg.author.username} <${msg.author.id}>`)
		.setFooter("Finalboss Tom's Manager - Important",client.user.avatarURL())
		
		notes.send(embed)
		msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
		msg.channel.send("I've successfully created your note for Tom!")
		
	},
};