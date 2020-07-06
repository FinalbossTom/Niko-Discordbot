const Discord = require('discord.js')

module.exports = {
	name: 'update',
	description: 'Yeah, no way you could use this...',
	exclude: true,
	execute(client,msg,args,userdata,creatures,alertTable,guildSettings) {
		
		if(msg.author.id != client.owner){
		msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
		msg.channel.send(`I'm sorry, but i can't let you do that!`)
		return
		}
		
		if(args[1] == "new"){
		client.version = "?"
		client.UpdateEmbed = new Discord.MessageEmbed
		client.UpdateEmbed
		.setFooter("Finalboss Tom's Manager - Important",client.user.avatarURL())
		.setColor(0x881cff)
		.setTitle(`I was updated to Version ${client.version}!`)
		.setThumbnail("https://cdn.discordapp.com/attachments/677129101055754240/701843162922090516/niko_pancakes.png")
		}
		
			if(args[1] == "add"){
				const temp = msg.content.split(" ")
				temp.shift()
				temp.shift()
				const temp2 = temp.join(" ").split("-,")
				client.UpdateEmbed.addField(`${temp2[0]}`,`${temp2[1]}`,false)
				msg.channel.send(client.UpdateEmbed)
				return
			}
			if(args[1] == "ver"){
				client.UpdateEmbed.setTitle(`I was updated to Version ${args[2]}!`)
				msg.channel.send(client.UpdateEmbed)
				return
			}
		
		if(args[1] == "send"){
			msg.channel.send("I'll send this in 30 seconds.")
			msg.channel.send(client.UpdateEmbed)
			client.updateTimer = client.setTimeout(function() {sendUpdate(client,msg,client.UpdateEmbed)},30000)
			return
		}
		
		if(args[1] == "stop"){
			client.clearTimeout(client.updateTimer)
			msg.reply("stopped")
			return
		}
		
		if(args[1] == "view"){
			msg.channel.send(client.UpdateEmbed)
			return
		}
		
		
		
	},
};



function sendUpdate(client,msg,embed){
	
	const templist = client.getAllSettings.all()
	console.log("Sending Update:")
		templist.forEach((guild) => {
			const t = JSON.parse(guild.settings)
			if(t.updNot == true){
				client.guilds.cache.get(guild.id).channels.cache.get(t.updCha).send(embed)
				console.log(client.guilds.cache.get(guild.id).name)
			}
		})
	
}