const Discord = require('discord.js')

module.exports = {
	name: 'cookie',
	description: 'Gift a cookie to someone!',
	category: 'fun',
	args: true,
	guild: true,
	usage: '[Mention User] OR [Mention Role] OR everyone',
	execute(client,msg,args,userdata,creatures,alertTable) {


		if(!args[1]){
		msg.channel.send(`You have to tell me, who you want to gift a cookie to!`)
		return
		}

		const roll = Math.round(Math.random()*10)

		var string = ""

		switch(roll){
			case 1: string = "You should probably thank them... right?"
			break;
			case 2: string = "I'm sure you'll like it!"
			break;
			case 3: string = "That makes me kind of hungry for one too..."
			break;
			case 4: string = "Sweet."
			break;
			case 5: string = "Wait... how does this even work...?"
			break;
			case 6: string = "Enjoy it!"
			break;
			case 7: string = "I hope you like it!"
			break;
			case 8: string = "I wonder if this is how girl scouts feel..."
			break;
			case 9: string = "Neat."
			break;
			case 10: string = "Perfect timing for a one, right?"
			break;
			default: string = "Mhh... Cookies..."
			break;
		}



		if(msg.mentions.members.first()){
			if(msg.mentions.members.first().id == client.user.id){

				switch(roll){
					case 1: string = "For me...?"
					break;
					case 2: string = "Just what i needed!"
					break;
					case 3: string = "Yessss!"
					break;
					case 4: string = "How nice of you,"
					break;
					case 5: string = "Cookies!"
					break;
					case 6: string = "Are you serious?"
					break;
					case 7: string = "I don't think i should eat that much cookies but still,"
					break;
					case 8: string = "Just like that...?"
					break;
					case 9: string = "Neat!"
					break;
					case 10: string = "Perfect timing for a one!"
					break;
					default: string = "Mhh... Cookies..."
					break;
				}

				msg.channel.send(`${client.EmojiMap.get("niko_excited")}`)
				msg.channel.send(`${string}\nThank you so much ${msg.author}!`)
				return
			}

			if(msg.mentions.members.first().id == msg.author.id){

				msg.channel.send(`${client.EmojiMap.get("niko_huh")}`)
				msg.channel.send(`*Uhm...* i don't think that you can give cookies to yourself...`)
				return
			}

		msg.channel.send(`${msg.mentions.members.first()}, you just got a :cookie: from ${msg.author}!\n${string}`)
		return
		}

		if(msg.mentions.roles.first()){
		msg.channel.send(`${msg.author} just gave everyone in ${msg.mentions.roles.first()} a :cookie:!\n${string}`)
		return
		}

		if(args[1].match("everyone")){
		msg.channel.send(`${client.EmojiMap.get("niko_dance")}`)
		msg.channel.send(`${msg.author} gave a :cookie: to everyone on the Server!`)
		return
		}

		msg.channel.send(`${client.EmojiMap.get("niko_huh")}`)
		msg.channel.send(`Sorry, but that doesn't seem right...\nYou have to **mention** a User or a Role!`)
		return

	},
};
