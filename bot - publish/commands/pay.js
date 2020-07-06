module.exports = {
	name: 'pay',
	aliases: ['gift','transfer'],
	description: 'Gift money to someone else!',
	category: 'economy',
	args: true,
	usage: '$pay [Mention User] [Amount]',
	execute(client,msg,args,userdata) {
		

			if(!msg.mentions.users.first()){
				msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
				msg.channel.send(`You need to tell me, who you want to give your :pancakes: to!`);
				return
			}
			
			if(msg.mentions.users.first().id == msg.author.id){
				msg.channel.send(`${client.EmojiMap.get("niko_wtf")}`)
				msg.channel.send(`You can't gift something to yourself...`);
				return
			}
			
			if(!args[2]){
				msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
				msg.channel.send(`You need to tell me, how many :pancakes: you want to send!`);
				return
			}
			
			if(isNaN(parseInt(args[2]))){
				msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
				msg.channel.send(`You used the wrong Syntax!\nUse it like this: \`\`$pay @User 1000\`\``);
				return
			}
			
			if(!args[1].match("<@!")){
				msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
				msg.channel.send(`You used the wrong Syntax!\nUse it like this: \`\`$pay @User 1000\`\``);
				return
			}
			
			if(parseInt(args[2]) <= 0){
				msg.channel.send(`${client.EmojiMap.get("niko_wtf")}`)
				msg.channel.send(`uhm... no...?`);
				return
			}
			
			dataSender = client.getUserdata(msg.author.id)
			dataReceiver = client.getUserdata(msg.mentions.users.first().id)
			
			if(dataSender.data.points < parseInt(args[2])){
			msg.channel.send(`${client.EmojiMap.get("niko_huh")}`)
			msg.channel.send(`You don't have enough Pancakes to do that!`);
			return
			}
			
			dataSender.data.points -= parseInt(args[2])
			dataReceiver.data.points += parseInt(args[2])
			
			client.setUserdata(dataSender)
			client.setUserdata(dataReceiver)
			
			msg.channel.send(`${client.EmojiMap.get("niko_excited")}`)
			msg.channel.send(`**${msg.author.username}** just gave **${args[2]}** :pancakes: to **${msg.mentions.users.first().username}**!`);
			return

		
	},
};