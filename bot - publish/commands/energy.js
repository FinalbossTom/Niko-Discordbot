const Discord = require('discord.js')

module.exports = {
	name: 'energy',
	description: 'Gift an energy drink to someone!',
	category: 'fun',
	args: true,
	guild: true,
	usage: '[Mention User] OR [Mention Role] OR everyone',
	execute(client,msg,args,userdata,creatures,alertTable) {
		
		const roll = Math.round(Math.random()*10)
		
		var string = ""
		
		switch(roll){
			case 1: string = "Feel the Power!" 
			break;
			case 2: string = "Wait... do you even drink that?" 
			break;
			case 3: string = "I wonder what they make this stuff of..." 
			break;
			case 4: string = "But you've got to show me your wings after drinking it!" 
			break;
			case 5: string = "Wait... how does this even work...?" 
			break;
			case 6: string = "Enjoy it!" 
			break;
			case 7: string = "I hope you like it!" 
			break;
			case 8: string = "Manager Niko, to the rescue!" 
			break;
			case 9: string = "Neat." 
			break;
			case 10: string = "Perfect timing for a one, right?" 
			break;
			default: string = "Is it really the best idea, to drink that...?"
			break;
		}
		
		
		
		if(msg.mentions.members.first()){
			if(msg.mentions.members.first().id == client.user.id){
				msg.channel.send(`${client.EmojiMap.get("niko_upset")}`)
				msg.channel.send(`I'm sorry, but Tom told me not to drink any of those...`)
				return
			}
			
			if(msg.mentions.members.first().id == msg.author.id){
				
				msg.channel.send(`${client.EmojiMap.get("niko_huh")}`)
				msg.channel.send(`*Uhm...* i don't think that you can give that to yourself...`)
				return
			}
			
		msg.channel.send(`:cloud_lightning: ${msg.mentions.members.first()}, you just got a ${client.EmojiMap.get("niko_energydrink")} from ${msg.author}! :cloud_lightning: \n${string}`)
		return
		}
		
		if(msg.mentions.roles.first()){
		msg.channel.send(`${msg.author} just gave everyone in ${msg.mentions.roles.first()} a ${client.EmojiMap.get("niko_energydrink")}!\n${string}`)
		return
		}
		
		if(args[1].match("everyone")){
		msg.channel.send(`${client.EmojiMap.get("niko_dance")}`)
		msg.channel.send(`${msg.author} gave a ${client.EmojiMap.get("niko_energydrink")} to everyone on the Server!`)
		return
		}
		
		msg.channel.send(`${client.EmojiMap.get("niko_huh")}`)
		msg.channel.send(`Sorry, but that doesn't seem right...\nYou have to **mention** a User or a Role!`)
		return
		
	},
};



