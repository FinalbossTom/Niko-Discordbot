const Discord = require('discord.js')

module.exports = {
	name: 'link',
	description: 'Link a Channel for certain notifications.',
	category: 'admin',
	args: true,
	guild: true,
	execute(client,msg,args,userdata,creatures,alertTable,guildSettings) {
		
		if(!msg.member.permissions.has("ADMINISTRATOR") && msg.author.id != client.owner){
			msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
			msg.channel.send(`I'm sorry, but i can't let you do that!`)
			return
		}
		
		var cGuild = client.getSettings.get(msg.guild.id)
		
		if(!cGuild){
			msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
			msg.channel.send(`Your Server isn't set-up!\nYou first need to use \`\`$setup\`\`!`)
			return
		}
		
		if(!args[1]){
			msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
			msg.channel.send(`You need to tell me, which type of Notifications i should link to this channel!\nThere currently are these:
			- updates
			- deletion
			- status`)
			return
		}
		
		if(!"updates,deletion,status".match(args[1])){
			msg.channel.send(`${client.EmojiMap.get("niko_huh")}`)
			msg.channel.send(`Sorry, but thats an invalid type...`)
			return
		}
		
		var s = JSON.parse(cGuild.settings)
		
		var string = ""
		switch(args[1]){
		case "updates":
			s.updCha = msg.channel.id
			s.updNot = true
			string = "Updates"
			break;
		case "deletion":
			s.delCha = msg.channel.id
			s.delNot = true
			string = "deleted Messages"
			break;
		case "status":
			s.statCha = msg.channel.id
			s.statNot = true
			string = "my Status"
			break;
		default:
			console.log("Default of $link was triggered (~Line 50)")
			msg.channel.send("Uhm... *something* went wrong, would you mind telling Tom about this?")
			return
			break;
		}
		
		cGuild.settings = JSON.stringify(s)
		client.setSettings.run(cGuild)
		
		msg.channel.send(`I will now use this channel for sending ${string}!`)
		return
		
	},
};



