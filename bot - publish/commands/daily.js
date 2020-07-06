module.exports = {
	name: 'daily',
	aliases: ['day', 'd'],
	description: 'Shows you the point in time, when you\'ll get your daily bonus.',
	category: 'economy',
	usage: '[Mention User]',
	execute(client,msg,args,userdata) {

		userdata = client.getUserdata(msg.author.id)
		const date = new Date()
		if(!userdata.data.daily){
			userdata.data.daily = Date.now()
		}

		if(!userdata.data.stats){
			client.sendMessage(msg,"No Profile","Sorry, but you don't have a profile set-up!\nUse ``$me`` to change that.","niko_speak")
			return
		}

		if(userdata.data.stats.version < 4){
			client.sendMessage(msg,"Profile version too low","Sorry, but your Profile version is too low!\nUse ``$me`` to change that.","niko_speak")
			return
		}


		date.setTime(userdata.data.daily - Date.now() - 3600000)
		if(date.getTime() <= 0){

			if(userdata.data.points == null){
				userdata.data.points = 0;
			}

			userdata.data.points += 10069
			userdata.data.xp += 500
			userdata.data.xpMax = 1000

			const date = new Date()
			date.setDate(date.getDate()+1)
			userdata.data.daily = date.getTime()

			client.setUserdata(userdata);

			if(msg.member.roles.cache.find(role => role.hexColor == "#cf853c") || msg.member.displayName.match("pancake") || client.OP.has(msg.author.id)){

				msg.channel.send(client.EmojiMap.get("niko_wtf"))
				msg.channel.send(`You have claimed your daily Bonu-... wait... are you a Pancake?!?\n**How am i supposed to give pancakes to a pancake...??**\n\n*(You still received your pancakes.)*`)
				return
			}


		msg.channel.send(client.EmojiMap.get("niko_excited"))
		msg.channel.send(`You have claimed your daily Bonus of **10069** :pancakes: and **500** XP.\nI have also reset your Daily Max XP.\nBe sure to check back tomorrow!`)
		return
		}

		if(isNaN(date.getHours())){
			execute(client,msg,args,userdata)
			return
		}

		msg.channel.send(client.EmojiMap.get("niko_speak"))
		msg.channel.send(`You can get your daily bonus in \`\`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\`\`!`)
		return

	},
};
