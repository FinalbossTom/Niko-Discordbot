const Discord = require('discord.js')
const { createCanvas } = require('canvas')

module.exports = {
	name: 'fight',
	aliases: ['brawl','duel'],
	description: 'Start a brawl with someone!',
	category: 'fun',
	guild: true,
	usage: '[Mention User]',
	execute(client,msg,args,userdata) {

		if(msg.author.id != client.owner){
			client.sendMessage(msg,"Can't run Brawl","Remember when Tom said, he was going to rework this command?\nI think he lied...","niko_upset")
			return
		}



msg.channel.send(generateMap(5))





},
}


function generateMap(size = 5){

	let fieldMatrix =  []
	let i = 0;
	while(i < size){
		fieldMatrix[i] = new Array(size)
		i++;
	}

	fieldMatrix.forEach((row,index,array) => {
		i = 0;
		while(i < row.length){
			row[i] = {type: "empty", name: "Empty Field", icon: ":brown_square:", walkable: true, swimmable: false, flyable: true, effects: [], modifiers: []}
			i++;
		}
	})

	console.log(fieldMatrix)


	let fieldString = ""

	fieldMatrix.forEach(row => {
		row.forEach(field => {
			fieldString += field.icon;
		})
		fieldString += "\n"
	})


	let embed = new Discord.MessageEmbed();
	embed.setDescription(fieldString)
	embed.setFooter("Yeah")

	return(embed)

	return

	let canvas = createCanvas(500,500)
	let ctx = canvas.getContext('2d')

}






/*



		if(!msg.mentions.members.first()){
			client.sendMessage(msg,"No target","You need to tell me, who you want to fight!","niko_speak")
			return
		}
			if(msg.mentions.members.first().id == client.user.id){
				//RANDOM ENCOUNTER

				userdata = client.getUserdata(msg.author.id)
				if(!userdata){
					client.sendMessage(msg,"User has no Data","Sorry, but you don't have a profile set-up!","niko_speak")
					return
				}
				if(!userdata.data.stats){
				client.sendMessage(msg,"User has no Data","Sorry, but you don't have a profile set-up!","niko_speak")
				return
				}
				if(userdata.data.stats.version < client.profileVersion){
				client.sendMessage(msg,"User profile version too low","Sorry, but your Profile version is too low!\n(Update it with $me)","niko_speak")
				return
				}

				if(client.BrawlMap.get(msg.author.id)){
					client.sendMessage(msg,"Author is already Brawling","Sorry, but you are already in a fight!","niko_speak")
					return
				}

				setupRandomEncounter(client,msg,userdata,args[2])
				return
			}

			if(msg.mentions.members.first().bot){
				client.sendMessage(msg,"Cant fight bot","You can't fight a bot!","niko_speak")
				return
			}

			if(msg.mentions.members.first().id == msg.author.id){
				client.sendMessage(msg,"Cant fight yourself","You can't fight yourself...","niko_what")
				return
			}

			//validate data
			//{

			userdata = client.getUserdata(msg.author.id)

			if(!userdata){
				client.sendMessage(msg,"User has no Data","Sorry, but you don't have a profile set-up!","niko_speak")
				return
			}

			if(!userdata.data.stats){
			client.sendMessage(msg,"User has no Data","Sorry, but you don't have a profile set-up!","niko_speak")
			return
			}

			if(userdata.data.stats.version < client.profileVersion){
			client.sendMessage(msg,"User profile version too low","Sorry, but your Profile version is too low!\n(Update it with $me)","niko_speak")
			return
			}

			const targetData = client.getUserdata(msg.mentions.members.first().user.id)
			if(!targetData){
			client.sendMessage(msg,"Target has no Data","Sorry, but you that person doesn't have a profile set-up!","niko_speak")
			return
			}

			if(!targetData.data.stats){
			client.sendMessage(msg,"Target has no Data","Sorry, but you that person doesn't have a profile set-up!","niko_speak")
			return
			}

			if(targetData.data.stats.version < 3){
			client.sendMessage(msg,"Target profile version too low","Sorry, but that person's Profile version is too low!","niko_speak")
			return
			}

			//}

			let price = 0
			if(!isNaN(parseInt(args[3]))){
				price = parseInt(args[3])
			}

			if(client.BrawlMap.get(msg.mentions.users.first().id)){
				client.sendMessage(msg,"Target is already Brawling","Sorry, but that person is already in a fight!","niko_speak")
				return
			}

			if(client.BrawlMap.get(msg.author.id)){
				client.sendMessage(msg,"Author is already Brawling","Sorry, but you are already in a fight!","niko_speak")
				return
			}

			challenge(client,msg,userdata,targetData)

	},
};

function setupBrawl(client,msg,userdata,targetData,embedMSG){

	if(client.BrawlMap.get(msg.author.id) || client.BrawlMap.get(msg.mentions.users.first().id)){
		client.sendMessage(msg,"User is already Brawling","Sorry, but that person is already in a fight!","niko_speak")
		return
	}


			client.BrawlMap.set(msg.author.id,"[EMPTY]")
			client.BrawlMap.set(msg.mentions.users.first().id,"[EMPTY]")

			try{
			let BrawlEmbed = new Discord.MessageEmbed()
			let oneEmbed = new Discord.MessageEmbed()
			let twoEmbed = new Discord.MessageEmbed()

			BrawlEmbed
			.setFooter("Finalboss Tom's Manager - Important",client.EmojiMap.get("niko").url)
			.setColor(0xffffff)
			.setTitle(`A Fight between\n:dagger: ${msg.member.user.username} and\n:shield: ${msg.mentions.members.first().user.username} has started!`)

			oneEmbed
			.setFooter("Finalboss Tom's Manager - Important",client.EmojiMap.get("niko").url)
			.setTitle(`Fight against ${msg.mentions.users.first().username}!`)
			.setDescription(`*Loading...*`)

			twoEmbed
			.setFooter("Finalboss Tom's Manager - Important",client.EmojiMap.get("niko").url)
			.setTitle(`Fight against ${msg.author.username}!`)
			.setDescription(`*Loading...*`)


			let Brawl = {
			msg: msg,
			guild: msg.guild,
			users: { one: {member: msg.member, data: userdata, stats: undefined, boosts: { charged: 1} },
					 two: {member: msg.mentions.members.first(), data:targetData, stats: undefined, boosts: { charged: 1} } },
			channel: msg.channel,
			embeds: { guild: BrawlEmbed , one: oneEmbed, two: twoEmbed },
			messages: {guild: embedMSG, one: new Discord.Message(), two: new Discord.Message()},
			reward: {one: 0, two: 0, price: 0},
			round: 1,
			collector: {one: undefined, two: undefined}
			}

			client.BrawlMap.set(msg.author.id,Brawl)
			client.BrawlMap.set(msg.mentions.users.first().id,msg.author.id)

			startBrawl(client,Brawl)
			}
			catch(error){
				client.sendMessage(msg,"Brawl failed to start","Sorry, but something went wrong, while trying to start the fight!\n*Resetting Brawlmap...*","niko_wtf")
				client.BrawlMap.delete(msg.author.id)
				client.BrawlMap.delete(msg.mentions.users.first().id)
				console.log(error)
				return
			}

}

async function startBrawl(client,Brawl){

	//Sending / Setting Messages
	//{
	try{
	await Brawl.messages.guild.edit(Brawl.embeds.guild)

	await Brawl.users.one.member.user.createDM()
	.then(async channel => {
		await channel.send(Brawl.embeds.one).then(async m => {
			Brawl.messages.one = m
		})
	})

	await Brawl.users.two.member.user.createDM()
	.then(async channel => {
		await channel.send(Brawl.embeds.two).then(async m => {
			Brawl.messages.two = m
		})
	})

	Brawl.collector.one = Brawl.users.one.member.user.dmChannel.createMessageCollector(m => !m.author.bot)
	Brawl.collector.two = Brawl.users.two.member.user.dmChannel.createMessageCollector(m => !m.author.bot)

	Brawl.collector.one.on('collect', message => {
		Brawl.users.two.member.user.dmChannel.send(`**${Brawl.users.one.member.user.username} wrote:**\n${message.content}`)
		message.react("✉")
	})

	Brawl.collector.two.on('collect', message => {
		Brawl.users.one.member.user.dmChannel.send(`**${Brawl.users.two.member.user.username} wrote:**\n${message.content}`)
		message.react("✉")
	})

	Brawl.users.one.stats = client.calculateStats(Brawl.users.one.data.data)
	Brawl.users.two.stats = client.calculateStats(Brawl.users.two.data.data)

	Brawl.users.one.stats.stamina = Math.floor(Brawl.users.one.stats.maxStamina / 4)
	Brawl.users.two.stats.stamina = Math.floor(Brawl.users.two.stats.maxStamina / 4)

	Brawl.users.one.stats.mana = Math.floor(Brawl.users.one.stats.maxMana / 4)
	Brawl.users.two.stats.mana = Math.floor(Brawl.users.two.stats.maxMana / 4)

	Brawl.users.one.stats.maxHp = Brawl.users.one.stats.hp
	Brawl.users.two.stats.maxHp = Brawl.users.two.stats.hp

	Brawl.embeds.one
	.setThumbnail(Brawl.users.two.member.user.avatarURL())
	.addField("Your Status",`*Loading...*`,true)
	.addField("‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎",`‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `,true)
	.addField("Enemy Status",`*Loading...*`,true)
	.addField("‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ",`‏‏‎Your Damage`,true)
	.addField("‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ",`Attacks`,true)
	.addField("‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ",`Received Damage`,true)
	.addField("=Attacks=",`‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `,true)
	.addField("=== Costs ===",`‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `,true)
	.addField("=:boom: + **Attack**=",`‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `,true)

	Brawl.messages.one.edit(Brawl.embeds.one)

	Brawl.embeds.two
	.setThumbnail(Brawl.users.one.member.user.avatarURL())
	.addField("Your Status",`*Loading...*`,true)
	.addField("‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ",`‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `,true)
	.addField("Enemy Status",`*Loading...*`,true)
	.addField("‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ",`‏‏‎Your Damage`,true)
	.addField("‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ",`Attacks`,true)
	.addField("‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ",`Received Damage`,true)
	.addField("= Attacks =",`‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `,true)
	.addField("=== Costs ===",`‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `,true)
	.addField("= :boom: + **Attack** =",`‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `,true)
	Brawl.messages.two.edit(Brawl.embeds.two)

	let fight = { round: 1, type: "pvp",
	one: { icon: "◼", choice: "**============**", stats: Brawl.users.one.stats, data: Brawl.users.one.data.data, damage: 0, totalDamage: 0 , crit: false, blocked: false , modifiers: {charged: 1, blocked: 1} },
	two: { icon: "◼", choice: "**============**", stats: Brawl.users.two.stats, data: Brawl.users.two.data.data, damage: 0, totalDamage: 0 , crit: false, blocked: false , modifiers: {charged: 1, blocked: 1} }
	}



	if(!Brawl.users.one.member.user.BrawlCache){
		Brawl.users.one.member.user.BrawlCache = []
	}

	if(!Brawl.users.two.member.user.BrawlCache){
		Brawl.users.two.member.user.BrawlCache = []
	}

	if(Brawl.users.one.member.user.BrawlCache.find(id => id == Brawl.users.two.member.user.id) || Brawl.users.two.member.user.BrawlCache.find(id => id == Brawl.users.one.member.user.id)){
		fight.penalty = 0.33
	}

	Brawl.users.one.member.user.BrawlCache.push(Brawl.users.two.member.user.id)
	Brawl.users.two.member.user.BrawlCache.push(Brawl.users.one.member.user.id)

	if(Brawl.users.one.member.user.BrawlCache.length > 4)Brawl.users.one.member.user.BrawlCache.shift();
	if(Brawl.users.two.member.user.BrawlCache.length > 4)Brawl.users.two.member.user.BrawlCache.shift();

	client.setTimeout(function() {Brawl.users.one.member.user.BrawlCache.shift()}, 300000)
	client.setTimeout(function() {Brawl.users.two.member.user.BrawlCache.shift()}, 300000)

	console.log(`Started Brawl between ${Brawl.users.one.member.user.username} and ${Brawl.users.two.member.user.username}`)
	nextRound(client,Brawl,fight)

	}
	catch(error){
		client.sendMessage(Brawl,"Brawl failed to start","Sorry, but something went wrong, while trying to start the fight!\n*Resetting Brawlmap...*","niko_wtf")
		client.BrawlMap.delete(Brawl.msg.author.id)
		client.BrawlMap.delete(Brawl.msg.mentions.users.first().id)
		console.log(error)
		return
	}
	//}



}

async function nextRound(client,Brawl,fight){

	if(fight.round == 1){
	try{
		await Brawl.messages.one.react("🗡️")
		await Brawl.messages.one.react("🏹")
		await Brawl.messages.one.react("📖")
		await Brawl.messages.one.react("🛡️")
		await Brawl.messages.one.react("💥")
	}
	catch(error){}

	try{
		await Brawl.messages.two.react("🗡️")
		await Brawl.messages.two.react("🏹")
		await Brawl.messages.two.react("📖")
		await Brawl.messages.two.react("🛡️")
		await Brawl.messages.two.react("💥")
	}
	catch(error){}
	}


	let oneString = `${fight.one.damage}`
	if(fight.one.crit == true && fight.one.blocked == false){
		oneString = `**${fight.one.damage}!!**`
	}

	let twoString = `${fight.two.damage}`
	if(fight.two.crit == true && fight.two.blocked == false){
		twoString = `**${fight.two.damage}!!**`
	}

	let oneCharge = ` ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `
	if(fight.one.modifiers.charged > 1){
		oneCharge = `**x${fight.one.modifiers.charged}**:exclamation:`
		if(fight.one.modifiers.charged > 1.5){
			oneCharge += `:exclamation:`
			if(fight.one.modifiers.charged > 2){
				oneCharge += `:exclamation:`
			}
		}
	}

	let twoCharge = ` ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `
	if(fight.two.modifiers.charged > 1){
		twoCharge = `**x${fight.two.modifiers.charged}**:exclamation:`
		if(fight.two.modifiers.charged > 1.5){
			twoCharge += `:exclamation:`
			if(fight.two.modifiers.charged > 2){
				twoCharge += `:exclamation:`
			}
		}
	}


	let melee = CDE(fight.one,fight.two,"melee")
	let ranged = CDE(fight.one,fight.two,"ranged")
	let magic = CDE(fight.one,fight.two,"magic")
	let block = CDE(fight.one,fight.two,"block")

	Brawl.embeds.one.fields[3].name = `${oneCharge}`
	Brawl.embeds.one.fields[5].name = `${twoCharge}`

	Brawl.embeds.one.setDescription(`==== Round **${fight.round}** ====`)
	Brawl.embeds.one.fields[0].value = `:heart: ${fight.one.stats.hp}\n:zap: ${Math.floor(fight.one.stats.stamina)} / ${Math.floor(fight.one.stats.maxStamina)}\n:diamond_shape_with_a_dot_inside: ${Math.floor(fight.one.stats.mana)} / ${Math.floor(fight.one.stats.maxMana)}`
	Brawl.embeds.one.fields[2].value = `${fight.two.stats.hp} :heart:\n${Math.floor(fight.two.stats.stamina)} / ${Math.floor(fight.two.stats.maxStamina)} :zap:\n${Math.floor(fight.two.stats.mana)} / ${Math.floor(fight.two.stats.maxMana)} :diamond_shape_with_a_dot_inside:`
	Brawl.embeds.one.fields[3].value = `${Brawl.embeds.one.fields[3].value}\n${oneString}`
	Brawl.embeds.one.fields[4].value = `${Brawl.embeds.one.fields[4].value}\n${fight.one.icon} - ${fight.two.icon}`
	Brawl.embeds.one.fields[5].value = `${Brawl.embeds.one.fields[5].value}\n${twoString}`


	Brawl.embeds.one.fields[6].value = `:dagger: ${melee.damageMin} - ${melee.damageMax}\n:bow_and_arrow: ${ranged.damageMin} - ${ranged.damageMax}\n:book: ${magic.damageMin}\n:shield: - Block`
	Brawl.embeds.one.fields[7].value = `/ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ${melee.cost}\n/ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ${ranged.cost}\n/ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ${magic.cost}\n${block.cost} ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ${block.critCost}`
	Brawl.embeds.one.fields[8].value = `:dagger: ${melee.critMin} - ${melee.critMax}\n:bow_and_arrow: ${ranged.critMin} - ${ranged.critMax}\n:book: ${magic.critMin}\n::dash: - Dodge`

	Brawl.messages.one.edit(Brawl.embeds.one)


	Brawl.embeds.two.fields[3].name = twoCharge
	Brawl.embeds.two.fields[5].name = oneCharge


	Brawl.embeds.two.setDescription(`Round **${fight.round}**`)
	Brawl.embeds.two.fields[0].value = `:heart: ${fight.two.stats.hp}\n:zap: ${Math.floor(fight.two.stats.stamina)} / ${Math.floor(fight.two.stats.maxStamina)}\n:diamond_shape_with_a_dot_inside: ${Math.floor(fight.two.stats.mana)} / ${Math.floor(fight.two.stats.maxMana)}`
	Brawl.embeds.two.fields[2].value = `${fight.one.stats.hp} :heart:\n${Math.floor(fight.one.stats.stamina)} / ${Math.floor(fight.one.stats.maxStamina)} :zap:\n${Math.floor(fight.one.stats.mana)} / ${Math.floor(fight.one.stats.maxMana)} :diamond_shape_with_a_dot_inside:`
	Brawl.embeds.two.fields[3].value = `${Brawl.embeds.two.fields[3].value}\n${twoString}`
	Brawl.embeds.two.fields[4].value = `${Brawl.embeds.two.fields[4].value}\n${fight.two.icon} - ${fight.one.icon}`
	Brawl.embeds.two.fields[5].value = `${Brawl.embeds.two.fields[5].value}\n${oneString}`

	melee = CDE(fight.two,fight.one,"melee")
	ranged = CDE(fight.two,fight.one,"ranged")
	magic = CDE(fight.two,fight.one,"magic")
	block = CDE(fight.two,fight.one,"block")

	Brawl.embeds.two.fields[6].value = `:dagger: ${melee.damageMin} - ${melee.damageMax}\n:bow_and_arrow: ${ranged.damageMin} - ${ranged.damageMax}\n:book: ${magic.damageMin}\n:shield: - Block`
	Brawl.embeds.two.fields[7].value = `/ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ${melee.cost}\n/ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ${ranged.cost}\n/ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ${magic.cost}\n${block.cost} ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎${block.critCost}`
	Brawl.embeds.two.fields[8].value = `:dagger: ${melee.critMin} - ${melee.critMax}\n:bow_and_arrow: ${ranged.critMin} - ${ranged.critMax}\n:book: ${magic.critMin}\n::dash: - Dodge`

	Brawl.messages.two.edit(Brawl.embeds.two)

	let oneReaction
	let twoReaction
	client.setTimeout(function() {
		oneReaction = Brawl.messages.one.reactions.cache.filter(r => r.count >= 2 || r.emoji.name == "🏳️")
		twoReaction = Brawl.messages.two.reactions.cache.filter(r => r.count >= 2 || r.emoji.name == "🏳️")

		if(!oneReaction.first()){
			fight.one.choice = "nothing"
			fight.one.crit = false;
		}
		else{
		switch(oneReaction.first().emoji.name){
			case "🗡️":
			fight.one.choice = "melee"
			break;
			case "🏹":
			fight.one.choice = "ranged"
			break;
			case "📖":
			fight.one.choice = "magic"
			break;
			case "🛡️":
			fight.one.choice = "block"
			break;
			case "🏳️":
			console.log("surrender")
			surrender(client,Brawl,"one")
			return
			break;
			default:
			fight.one.choice = "nothing"
			break;
		}
		if(oneReaction.find(r => r.emoji.name == "💥")){
			fight.one.crit = true;
		}
		else{
			fight.one.crit = false;
		}
		}

		if(!twoReaction.first()){
			fight.two.choice = "nothing"
			fight.two.crit = false;
		}
		else{
		switch(twoReaction.first().emoji.name){
			case "🗡️":
			fight.two.choice = "melee"
			break;
			case "🏹":
			fight.two.choice = "ranged"
			break;
			case "📖":
			fight.two.choice = "magic"
			break;
			case "🛡️":
			fight.two.choice = "block"
			break;
			case "🏳️":
			console.log("surrender")
			surrender(client,Brawl,"two")
			return
			break;
			default:
			fight.two.choice = "nothing"
			break;
		}
		if(twoReaction.find(r => r.emoji.name == "💥")){
			fight.two.crit = true;
		}
		else{
			fight.two.crit = false;
		}
		}
	calculateRound(client,Brawl,fight)
	}, 10000)

}

function calculateRound(client,Brawl,fight){

	fight.one = calculateDamage(fight.one)
	fight.two = calculateDamage(fight.two)

	fight.one.damage -= Math.floor(fight.two.stats.defense / 1.5);
	fight.two.damage -= Math.floor(fight.one.stats.defense / 1.5);

	if(fight.one.damage < 0 || isNaN(fight.one.damage))fight.one.damage = 0;
	if(fight.two.damage < 0 || isNaN(fight.two.damage))fight.two.damage = 0;

	if(fight.one.blocked == true){
		if(fight.one.stats.stamina > 0){
			if(fight.one.crit == true){
				fight.one.icon = "💨"
				fight.two.damage = "*(Dodged)*"
				fight.one.stats.stamina -= Math.floor(50 * (fight.one.stats.dodgeCost / 100)) + Math.floor(fight.one.stats.staminaRegen)
			}
			else{
				if(fight.two.damage <= 0){
					fight.one.stats.stamina -= Math.floor(fight.two.stats.defense)
				}
				else{
					fight.one.modifiers.charged = 2.5
					fight.two.damage = Math.floor(fight.two.damage - (fight.one.stats.defense * 3))
					if(fight.two.damage < 0 || isNaN(fight.two.damage))fight.two.damage = 0;
					fight.one.stats.stamina -= Math.floor(10 + (fight.two.damage / (fight.one.stats.defense * 5)))
				}
			}
		}
		else{
			fight.one.icon = "🚫"
		}
	}

	if(fight.two.blocked == true){
		if(fight.two.stats.stamina > 0){
			if(fight.two.crit == true){
				fight.two.icon = "💨"
				fight.one.damage = "*(Dodged)*"
				fight.two.stats.stamina -= Math.floor(50 * (fight.two.stats.dodgeCost / 100)) + Math.floor(fight.two.stats.staminaRegen)
			}
			else{
				if(fight.one.damage <= 0){
					fight.two.stats.stamina -= Math.floor(fight.two.stats.defense)
				}
				else{
					fight.two.modifiers.charged = 2.5
					fight.one.damage = Math.floor(fight.one.damage - (fight.two.stats.defense * 3))
					if(fight.one.damage < 0 || isNaN(fight.one.damage))fight.one.damage = 0;
					fight.two.stats.stamina -= Math.floor(10 + (fight.one.damage / (fight.two.stats.defense * 5)))
				}
			}
		}
		else{
			fight.two.icon = "🚫"
		}
	}


	if(fight.one.crit != true || fight.one.choice != "block" || fight.one.icon == "🚫"){
	  if(fight.two.damage > fight.one.stats.maxHp / 2 && fight.one.stats.hp > fight.one.stats.maxHp * 0.75)fight.two.damage = fight.one.stats.maxHp / 2;
		fight.two.damage = Math.floor(fight.two.damage)
		fight.one.stats.hp -= fight.two.damage
		fight.two.totalDamage += fight.two.damage
	}

	if(fight.two.crit != true || fight.two.choice != "block" || fight.two.icon == "🚫"){
		if(fight.one.damage > fight.two.stats.maxHp / 2 && fight.two.stats.hp > fight.two.stats.maxHp * 0.75)fight.one.damage = fight.two.stats.maxHp / 2;
		fight.one.damage = Math.floor(fight.one.damage)
		fight.two.stats.hp -= fight.one.damage
		fight.one.totalDamage += fight.one.damage
	}

	if(fight.one.stats.hp <= 0 || fight.two.stats.hp <= 0){
		end(client,Brawl,fight)
		return
	}


	Brawl.round++;
	fight.round++;
	if(fight.round > 20){
		end(client,Brawl,fight)
		return
	}
	nextRound(client,Brawl,fight)
}

function calculateDamage(player,force){

	player.damage = 0
	player.modifiers.hit = 0
	player.blocked = false

	let roll = Math.floor(Math.random() * 15)

	switch(player.choice){
		case "melee":
		player.icon = "🗡️"
		player.damage += (player.stats.melee + roll) * player.modifiers.charged
		player.stats.stamina += player.stats.staminaRegen
		player.stats.mana += player.stats.manaRegen
		player.modifiers.charged = 1
		break;
		case "ranged":
		player.icon = "🏹"
		player.damage += (player.stats.ranged + roll) * player.modifiers.charged
		player.stats.stamina += Math.floor(player.stats.staminaRegen / 2)
		player.stats.mana += player.stats.manaRegen
		player.modifiers.charged = 1
		break;
		case "magic":
		player.icon = "📖"
		player.damage += (player.stats.magic * (player.modifiers.charged * 4)) + (player.stats.mana)
		player.stats.mana = 0
		player.modifiers.charged = 1
		break;

		case "block":
		player.icon = "🛡️"
		player.damage = 0
		player.blocked = true
		player.stats.mana += player.stats.manaRegen
		break;
		case "nothing":
		player.icon = "◼"
		player.damage = 0
		player.stats.stamina += Math.floor(player.stats.staminaRegen * 1.5)
		if(player.modifiers.charged < 2.5){
		player.modifiers.charged += 0.5
		}
		player.stats.mana += player.stats.manaRegen
		break;
	}

	if(player.crit == true && player.choice != "block" && !force && player.stats.stamina > 0){
		if(player.choice == "melee"){
		player.damage = Math.round(player.damage * (player.stats.critMult / 100))
		player.stats.stamina -= Math.floor(50 * (player.stats.critCost / 100)) + Math.floor(player.stats.staminaRegen)
		}
		if(player.choice == "ranged"){
		player.damage = Math.round(player.damage * (player.stats.critMult / 100 + 0.5))
		player.stats.stamina -= Math.floor(40 * (player.stats.critCost / 100)) + Math.floor(player.stats.staminaRegen)
		}
		if(player.choice == "magic"){
			player.damage = Math.round(player.damage * (player.stats.critMult / 100 - 1))
			player.stats.stamina -= Math.floor(50 * (player.stats.critCost / 100)) + Math.floor(player.stats.staminaRegen)
		}
	}

	if(player.damage < 0 || isNaN(player.damage))player.damage = 0;


	if(player.stats.stamina > player.stats.maxStamina)player.stats.stamina = player.stats.maxStamina;
	if(player.stats.mana > player.stats.maxMana)player.stats.mana = player.stats.maxMana;

	return(player)
}

function CDE(player,enemy,type){

		let damageMin = undefined;
		let damageMax = undefined;
		let critMin = undefined;
		let critMax = undefined;
		let cost = undefined;
		let critCost = undefined;

			switch(type){
				case "melee":
				damageMin = (player.stats.melee) * player.modifiers.charged
				damageMax = (player.stats.melee + 15) * player.modifiers.charged

				critMin = ((player.stats.melee) * player.modifiers.charged) * (player.stats.critMult / 100)
				critMax = ((player.stats.melee + 15) * player.modifiers.charged) * (player.stats.critMult / 100)

				cost = Math.floor(50 * (player.stats.critCost / 100)) + Math.floor(player.stats.staminaRegen)

				break;

				case "ranged":
				damageMin = (player.stats.ranged) * player.modifiers.charged
				damageMax = (player.stats.ranged + 15) * player.modifiers.charged

				critMin = ((player.stats.ranged) * player.modifiers.charged) * (player.stats.critMult / 100 + 0.5)
				critMax = ((player.stats.ranged + 15) * player.modifiers.charged) * (player.stats.critMult / 100 + 0.5)

				cost = Math.floor(40 * (player.stats.critCost / 100)) + Math.floor(player.stats.staminaRegen)
				break;

				case "magic":
				damageMin = (player.stats.magic * (player.modifiers.charged * 4)) + (player.stats.mana)

				critMin = ((player.stats.magic * (player.modifiers.charged * 4)) + (player.stats.mana)) * (player.stats.critMult / 100 - 1)
				cost = Math.floor(50 * (player.stats.critCost / 100)) + Math.floor(player.stats.staminaRegen)

				break;

				case "block":
				cost = player.stats.defense
				critCost = Math.floor(50 * (player.stats.dodgeCost / 100)) + Math.floor(player.stats.staminaRegen)
				break;
			}


		if(damageMin){
			damageMin -= enemy.stats.defense;
			if(damageMin < 0 || isNaN(damageMin))damageMin = 0;
			damageMin = Math.floor(damageMin)
		}
		if(damageMax){
			damageMax -= enemy.stats.defense;
			if(damageMax < 0 || isNaN(damageMax))damageMax = 0;
			damageMax = Math.floor(damageMax)
		}

				if(critMin){
					critMin -= enemy.stats.defense;
					if(critMin < 0 || isNaN(critMin))critMin = 0;
					critMin = Math.floor(critMin)
				}
				if(critMax){
					critMax -= enemy.stats.defense;
					if(critMax < 0 || isNaN(critMax))critMax = 0;
					critMax = Math.floor(critMax)
				}


			let output = {}

			output.damageMin = damageMin
			output.damageMax = damageMax
			output.critMin = Math.floor(critMin)
			output.critMax = Math.floor(critMax)
			output.cost = Math.floor(cost)
			output.critCost = Math.floor(critCost)

		return(output)
}

function end(client,Brawl,fight){

	client.setTimeout(function() {Brawl.collector.one.stop()},10000)
	client.setTimeout(function() {Brawl.collector.two.stop()},10000)


	let winner = undefined
	let loser = undefined

	let penalty = 1

	let roll = Math.floor(Math.random() * 10 + 10)

	if(fight.penalty){
		penalty = fight.penalty
	}

	Brawl.users.one.data = client.getUserdata(Brawl.users.one.member.user.id)
	Brawl.users.two.data = client.getUserdata(Brawl.users.two.member.user.id)

	Brawl.reward.one = Math.floor((Brawl.users.two.data.data.level + roll) * penalty)
	Brawl.reward.two = Math.floor((Brawl.users.one.data.data.level + roll) * penalty)

	Brawl.users.one.data.data.xp += Brawl.reward.one
	Brawl.users.two.data.data.xp += Brawl.reward.two


	client.setUserdata(Brawl.users.one.data)
	client.setUserdata(Brawl.users.two.data)


	let oneString = `${fight.one.damage}`
	if(fight.one.crit == true){
		oneString = `**${fight.one.damage}!!**`
	}

	let twoString = `${fight.two.damage}`
	if(fight.two.crit == true){
		twoString = `**${fight.two.damage}!!**`
	}

	Brawl.embeds.one.setDescription(`==== Round **${fight.round}** ====`)
	Brawl.embeds.one.fields[0].value = `:heart: ${fight.one.stats.hp}\n:zap: ${Math.floor(fight.one.stats.stamina)}\n:diamond_shape_with_a_dot_inside: ${Math.floor(fight.one.stats.mana)}`
	Brawl.embeds.one.fields[2].value = `${fight.two.stats.hp} :heart:\n${Math.floor(fight.two.stats.stamina)} :zap:\n${Math.floor(fight.two.stats.mana)} :diamond_shape_with_a_dot_inside:`
	Brawl.embeds.one.fields[3].value = `${Brawl.embeds.one.fields[3].value}\n${oneString}`
	Brawl.embeds.one.fields[4].value = `${Brawl.embeds.one.fields[4].value}\n${fight.one.icon} - ${fight.two.icon}`
	Brawl.embeds.one.fields[5].value = `${Brawl.embeds.one.fields[5].value}\n${twoString}`


	Brawl.embeds.one.fields[6].value = `========`
	Brawl.embeds.one.fields[8].value = `========`

	Brawl.messages.one.edit(Brawl.embeds.one)

	Brawl.embeds.two.setDescription(`Round **${fight.round}**`)
	Brawl.embeds.two.fields[0].value = `:heart: ${fight.two.stats.hp}\n:zap: ${Math.floor(fight.two.stats.stamina)}\n:diamond_shape_with_a_dot_inside: ${Math.floor(fight.two.stats.mana)}`
	Brawl.embeds.two.fields[2].value = `${fight.one.stats.hp} :heart:\n${Math.floor(fight.one.stats.stamina)} :zap:\n${Math.floor(fight.one.stats.mana)} :diamond_shape_with_a_dot_inside:`
	Brawl.embeds.two.fields[3].value = `${Brawl.embeds.two.fields[3].value}\n${twoString}`
	Brawl.embeds.two.fields[4].value = `${Brawl.embeds.two.fields[4].value}\n${fight.two.icon} - ${fight.one.icon}`
	Brawl.embeds.two.fields[5].value = `${Brawl.embeds.two.fields[5].value}\n${oneString}`

	Brawl.embeds.two.fields[6].value = `========`
	Brawl.embeds.two.fields[8].value = `========`




	if(Brawl.users.one.stats.hp <= 0 && Brawl.users.two.stats.hp <= 0){
	client.BrawlMap.delete(Brawl.msg.author.id)
	client.BrawlMap.delete(Brawl.msg.mentions.users.first().id)
	Brawl.embeds.one
	.addField("-------",`-------`,true)
	.addField("============",`Fight is over!\n**DRAW**\nGained **${Brawl.reward.one}** XP!`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.one.edit(Brawl.embeds.one)

	Brawl.embeds.two
	.addField("-------",`-------`,true)
	.addField("============",`Fight is over!\n**DRAW**\nGained **${Brawl.reward.two}** XP!`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.two.edit(Brawl.embeds.two)

	Brawl.embeds.guild
	.addField("-------",`-------`,true)
	.addField("============",`Fight is over!\n**DRAW**`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.guild.edit(Brawl.embeds.guild)

	return
	}

	if(fight.round > 20){

	if(fight.one.stats.hp < fight.two.stats.hp){
		winner = Brawl.users.two.member
		loser = Brawl.users.one.member
	}
	else{
		winner = Brawl.users.one.member
		loser = Brawl.users.two.member
	}

	client.BrawlMap.delete(Brawl.msg.author.id)
	client.BrawlMap.delete(Brawl.msg.mentions.users.first().id)
	Brawl.embeds.one
	.addField("-------",`-------`,true)
	.addField("============",`Fight is over!\n**${winner.user.username}** won!\nGained **${Brawl.reward.one}** XP!`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.one.edit(Brawl.embeds.one)

	Brawl.embeds.two
	.addField("-------",`-------`,true)
	.addField("============",`Fight is over!\n**${winner.user.username}** won!\nGained **${Brawl.reward.two}** XP!`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.two.edit(Brawl.embeds.two)

	Brawl.embeds.guild
	.addField("-------",`-------`,true)
	.addField("============",`Fight is over!\n**${winner.user.username}** won!`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.guild.edit(Brawl.embeds.guild)

	return
	}



	if(Brawl.users.one.stats.hp <= 0){
		winner = Brawl.users.two.member
		loser = Brawl.users.one.member
	}
	else{
		winner = Brawl.users.one.member
		loser = Brawl.users.two.member
	}

	Brawl.embeds.one
	.addField("-------",`-------`,true)
	.addField("============",`Fight is over!\n**${winner.user.username}** won!\nGained **${Brawl.reward.one}** XP!`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.one.edit(Brawl.embeds.one)

	Brawl.embeds.two
	.addField("-------",`-------`,true)
	.addField("============",`Fight is over!\n**${winner.user.username}** won!\nGained **${Brawl.reward.two}** XP!`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.two.edit(Brawl.embeds.two)

	Brawl.embeds.guild
	.addField("-------",`-------`,true)
	.addField("============",`Fight is over!\n**${winner.user.username}** won!`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.guild.edit(Brawl.embeds.guild)

	client.BrawlMap.delete(Brawl.msg.author.id)
	client.BrawlMap.delete(Brawl.msg.mentions.users.first().id)

}

function surrender(client,Brawl,player){

	if(player == "one"){
	client.BrawlMap.delete(Brawl.msg.author.id)
	client.BrawlMap.delete(Brawl.msg.mentions.users.first().id)
	Brawl.embeds.one
	.addField("-------",`-------`,true)
	.addField("============",`You surrendered!\nFight is over!\n**${Brawl.msg.mentions.users.first().username}** won!\n*Gained no XP*`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.one.edit(Brawl.embeds.one)

	Brawl.embeds.two
	.addField("-------",`-------`,true)
	.addField("============",`${Brawl.msg.author.username} surrendered!\nFight is over!\n**${Brawl.msg.mentions.users.first().username}** won!\n*Gained no XP*`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.two.edit(Brawl.embeds.two)

	Brawl.embeds.guild
	.addField("-------",`-------`,true)
	.addField("============",`${Brawl.msg.author.username} surrendered!\nFight is over!\n**${Brawl.msg.mentions.users.first().username}** won!`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.guild.edit(Brawl.embeds.guild)
	return
	}
	else{
	client.BrawlMap.delete(Brawl.msg.author.id)
	client.BrawlMap.delete(Brawl.msg.mentions.users.first().id)
	Brawl.embeds.one
	.addField("-------",`-------`,true)
	.addField("============",`${Brawl.msg.mentions.users.first().username} surrendered!\nFight is over!\n**You** won!\n*Gained no XP*`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.one.edit(Brawl.embeds.one)

	Brawl.embeds.two
	.addField("-------",`-------`,true)
	.addField("============",`You surrendered!\nFight is over!\n**You** lost!\n*Gained no XP*`,true)
	.addField("-------",`-------`,true)
	Brawl.messages.two.edit(Brawl.embeds.two)

	Brawl.embeds.guild
	.addField("-------",`-------`,true)
	.addField("============",`${Brawl.msg.mentions.users.first().username} surrendered!\nFight is over!\n**${Brawl.msg.author.username}** won!`,true)
	.addField("-------",`-------`,true)
	}

}

async function challenge(client,msg,userdata,targetData){

	const embed = new Discord.MessageEmbed()
	.setFooter("Finalboss Tom's Manager - Important",client.EmojiMap.get("niko").url)
	.setColor(0xffffff)
	.setTitle(`${msg.author.username} challenged ${msg.mentions.users.first().username}!`)

	let embedMSG;
	await msg.channel.send(embed).then(async m => {
		embedMSG = m;
	})

	const filter = (reaction, user) => user.id == msg.mentions.users.first().id;
	const collector = embedMSG.createReactionCollector(filter, {max: 1, time: 20000});


	await collector.on('end',r => {

		if(!r.first()){
			embed
			.setTitle(`The challenge timed out.`)
			embedMSG.edit(embed)
			embedMSG.reactions.removeAll()
			return(false)
		}
		switch(r.first().emoji.name){
			case "✅":
			embedMSG.reactions.removeAll()
			setupBrawl(client,msg,userdata,targetData,embedMSG)
			break;
			case "❌":
			embed
			.setTitle(`${msg.mentions.users.first().username} denied the challenge!`)
			embedMSG.edit(embed)
			embedMSG.reactions.removeAll()
			return(false)
			break;
			default:
			embed
			.setTitle(`The challenge timed out.`)
			embedMSG.edit(embed)
			embedMSG.reactions.removeAll()
			return(false)
			break;
		}
	})

	try{
	await embedMSG.react("✅")
	await embedMSG.react("❌")
	}
	catch(error){
		return(false)
	}

}





function setupRandomEncounter(client,msg,userdata,lvl){
	client.BrawlMap.set(msg.author.id,"[EMPTY]")

	try{
	let BrawlEmbed = new Discord.MessageEmbed()
	let oneEmbed = new Discord.MessageEmbed()

	BrawlEmbed
	.setFooter("Finalboss Tom's Manager",client.EmojiMap.get("niko").url)
	.setColor(0xffffff)
	.setTitle(`${msg.member.user.username} started a random Encounter!`)

	oneEmbed
	.setFooter("Finalboss Tom's Manager - Important",client.EmojiMap.get("niko").url)
	.setTitle(`Fight against ...`)
	.setDescription(`*Loading...*`)
	if(!lvl)lvl = userdata.data.level;

	let Brawl = {
	msg: msg,
	guild: msg.guild,
	player: { member: msg.member, data: userdata, stats: undefined, boosts: { charged: 1} },
	mob: client.createRandomMob(parseInt(lvl)),
	channel: msg.channel,
	embeds: { guild: BrawlEmbed , player: oneEmbed, },
	messages: {guild: undefined, player: new Discord.Message()},
	round: 1,
	}

	client.BrawlMap.set(msg.author.id,Brawl)

	startRandomEncounter(client,Brawl)
	}
	catch(error){
		client.sendMessage(msg,"Brawl failed to start","Sorry, but something went wrong, while trying to start the fight!\n*Resetting Brawlmap...*","niko_wtf")
		client.BrawlMap.delete(msg.author.id)
		console.log(error)
		return
	}
}

async function startRandomEncounter(client,Brawl){

	//Sending / Setting Messages
	//{
	try{
		await Brawl.channel.send(Brawl.embeds.guild).then(async m => {
			Brawl.messages.guild = m
		})

	await Brawl.player.member.user.createDM()
	.then(async channel => {
		await channel.send(Brawl.embeds.player).then(async m => {
			Brawl.messages.player = m
			})
		})


	Brawl.player.stats = client.calculateStats(Brawl.player.data.data)
	Brawl.player.stats.stamina = Math.floor(Brawl.player.stats.maxStamina / 4)
	Brawl.player.stats.mana = Math.floor(Brawl.player.stats.maxMana / 4)
	Brawl.player.stats.maxHp = Brawl.player.stats.hp
	Brawl.player.stats.hp = Brawl.player.stats.currentHp

	Brawl.mob.stats.melee = Brawl.mob.stats.damage
	Brawl.mob.decisionCache = []

	Brawl.embeds.player
	.setTitle(`Fight against [${Brawl.mob.lvl}] ${Brawl.mob.name}`)
	.addField("Your Status",`*Loading...*`,true)
	.addField("‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎",`‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `,true)
	.addField("Enemy Status",`*Loading...*`,true)
	.addField("‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ",`‏‏‎Your Damage`,true)
	.addField("‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ",`Attacks`,true)
	.addField("‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ",`Received Damage`,true)
	.addField("=Attacks=",`‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `,true)
	.addField("=== Costs ===",`‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `,true)
	.addField("=:boom: + **Attack**=",`‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `,true)

	Brawl.messages.player.edit(Brawl.embeds.player)


	let fight = { round: 1, type: "pve",
	player: { icon: "◼", choice: "**============**", stats: Brawl.player.stats, data: Brawl.player.data.data, damage: 0, totalDamage: 0 , crit: false, blocked: false , modifiers: {charged: 1, blocked: 1} },
	mob:    { icon: "◼", choice: "**============**", stats: Brawl.mob.stats   , data: Brawl.mob             , damage: 0, totalDamage: 0 , crit: false, blocked: false , modifiers: {charged: 1, blocked: 1} }
	}


	console.log(`Started random Encounter between for ${Brawl.player.member.user.username}`)
	nextRoundEncounter(client,Brawl,fight)
	}
	catch(error){
		client.sendMessage(Brawl,"Brawl failed to start","Sorry, but something went wrong, while trying to start the fight!\n*Resetting Brawlmap...*","niko_wtf")
		client.BrawlMap.delete(Brawl.msg.author.id)
		console.log(error)
		return
	}
}

async function nextRoundEncounter(client,Brawl,fight){

	if(fight.round == 1){
	try{
		await Brawl.messages.player.react("🗡️")
		await Brawl.messages.player.react("🏹")
		await Brawl.messages.player.react("📖")
		await Brawl.messages.player.react("🛡️")
		await Brawl.messages.player.react("💥")
	}
	catch(error){}
}

	let playerString = `${fight.player.damage}`
	if(fight.player.crit == true && fight.player.blocked == false){
		playerString = `**${fight.player.damage}!!**`
	}

	let mobString = `${fight.mob.damage}`
	if(fight.mob.crit == true && fight.mob.blocked == false){
		mobString = `**${fight.mob.damage}!!**`
	}

	let playerCharge = ` ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `
	if(fight.player.modifiers.charged > 1){
		playerCharge = `**x${fight.player.modifiers.charged}**:exclamation:`
		if(fight.player.modifiers.charged > 1.5){
			playerCharge += `:exclamation:`
			if(fight.player.modifiers.charged > 2){
				playerCharge += `:exclamation:`
			}
		}
	}

	let mobCharge = ` ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ `
	if(fight.mob.modifiers.charged > 1){
		mobCharge = `**x${fight.mob.modifiers.charged}**:exclamation:`
		if(fight.mob.modifiers.charged > 1.5){
			mobCharge += `:exclamation:`
			if(fight.mob.modifiers.charged > 2){
				mobCharge += `:exclamation:`
			}
		}
	}


	let melee = CDE(fight.player,fight.mob,"melee")
	let ranged = CDE(fight.player,fight.mob,"ranged")
	let magic = CDE(fight.player,fight.mob,"magic")
	let block = CDE(fight.player,fight.mob,"block")

	Brawl.embeds.player.fields[3].name = `${playerCharge}`
	Brawl.embeds.player.fields[5].name = `${mobCharge}`

	Brawl.embeds.player.setDescription(`==== Round **${fight.round}** ====`)
	Brawl.embeds.player.fields[0].value = `:heart: ${fight.player.stats.hp} / ${fight.player.stats.maxHp}\n:zap: ${Math.floor(fight.player.stats.stamina)} / ${Math.floor(fight.player.stats.maxStamina)}\n:diamond_shape_with_a_dot_inside: ${Math.floor(fight.player.stats.mana)} / ${Math.floor(fight.player.stats.maxMana)}`
	Brawl.embeds.player.fields[2].value = `${fight.mob.stats.hp} :heart:\n${fight.mob.stats.defense} :shield:\n${fight.mob.stats.damage} :dagger:`
	Brawl.embeds.player.fields[3].value = `${Brawl.embeds.player.fields[3].value}\n${playerString}`
	Brawl.embeds.player.fields[4].value = `${Brawl.embeds.player.fields[4].value}\n${fight.player.icon} - ${fight.mob.icon}`
	Brawl.embeds.player.fields[5].value = `${Brawl.embeds.player.fields[5].value}\n${mobString}`


	Brawl.embeds.player.fields[6].value = `:dagger: ${melee.damageMin} - ${melee.damageMax}\n:bow_and_arrow: ${ranged.damageMin} - ${ranged.damageMax}\n:book: ${magic.damageMin}\n:shield: - Block`
	Brawl.embeds.player.fields[7].value = `/ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ${melee.cost}\n/ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ${ranged.cost}\n/ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ${magic.cost}\n${block.cost} ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ${block.critCost}`
	Brawl.embeds.player.fields[8].value = `:dagger: ${melee.critMin} - ${melee.critMax}\n:bow_and_arrow: ${ranged.critMin} - ${ranged.critMax}\n:book: ${magic.critMin}\n::dash: - Dodge`

	Brawl.messages.player.edit(Brawl.embeds.player)

	let playerReaction
	client.setTimeout(function() {
		playerReaction = Brawl.messages.player.reactions.cache.filter(r => r.count >= 2 || r.emoji.name == "🏳️")

		if(!playerReaction.first()){
			fight.player.choice = "nothing"
			fight.player.crit = false;
		}
		else{
		switch(playerReaction.first().emoji.name){
			case "🗡️":
			fight.player.choice = "melee"
			break;
			case "🏹":
			fight.player.choice = "ranged"
			break;
			case "📖":
			fight.player.choice = "magic"
			break;
			case "🛡️":
			fight.player.choice = "block"
			break;
			case "🏳️":
			console.log("surrender")
			endEncounter(client,Brawl,fight,true)
			return
			break;
			default:
			fight.player.choice = "nothing"
			break;
		}
		if(playerReaction.find(r => r.emoji.name == "💥")){
			fight.player.crit = true;
		}
		else{
			fight.player.crit = false;
		}	}
	calculateRoundEncounter(client,Brawl,fight)
	}, 10000)

}

function calculateRoundEncounter(client,Brawl,fight){

	fight.player = calculateDamage(fight.player)

	fight.mob = makeDecision(fight.mob,Brawl,fight)
	fight.mob = calculateDamage(fight.mob)

	fight.player.damage -= Math.floor(fight.mob.stats.defense / 1.5);
	fight.mob.damage -= Math.floor(fight.player.stats.defense / 1.5);

	if(fight.player.damage < 0 || isNaN(fight.player.damage))fight.player.damage = 0;
	if(fight.mob.damage < 0 || isNaN(fight.mob.damage))fight.mob.damage = 0;

	if(fight.player.blocked == true){
		if(fight.player.stats.stamina > 0){
			if(fight.player.crit == true){
				fight.player.icon = "💨"
				fight.mob.damage = "*(Dodged)*"
				fight.player.stats.stamina -= Math.floor(50 * (fight.player.stats.dodgeCost / 100)) + Math.floor(fight.player.stats.staminaRegen)
			}
			else{
				if(fight.mob.damage <= 0){
					fight.player.stats.stamina -= Math.floor(fight.mob.stats.defense)
				}
				else{
					fight.player.modifiers.charged = 2.5
					fight.mob.damage = Math.floor(fight.mob.damage - (fight.player.stats.defense * 3))
					if(fight.mob.damage < 0 || isNaN(fight.mob.damage))fight.mob.damage = 0;
					fight.player.stats.stamina -= Math.floor(10 + (fight.mob.damage / (fight.player.stats.defense * 5)))
				}
			}
		}
		else{
			fight.player.icon = "🚫"
		}
	}

	if(fight.mob.blocked == true){
			if(fight.mob.crit == true){
				fight.mob.icon = "💨"
				fight.player.damage = "*(Dodged)*"
			}
			else{
				if(fight.player.damage <= 0){
				}
				else{
					fight.mob.modifiers.charged = 2.5
					fight.player.damage = Math.floor(fight.player.damage - (fight.mob.stats.defense * 3))
					if(fight.player.damage < 0 || isNaN(fight.player.damage))fight.player.damage = 0;
				}
			}
		}


	if(fight.player.crit != true || fight.player.choice != "block" || fight.player.icon == "🚫"){
	  if(fight.mob.damage > fight.player.stats.maxHp / 2 && fight.player.stats.hp > fight.player.stats.maxHp * 0.75)fight.mob.damage = fight.player.stats.maxHp / 2;
		fight.mob.damage = Math.floor(fight.mob.damage)
		fight.player.stats.hp -= fight.mob.damage
		fight.mob.totalDamage += fight.mob.damage
	}

	if(fight.mob.crit != true || fight.mob.choice != "block" || fight.mob.icon == "🚫"){
		if(fight.player.damage > fight.mob.stats.maxHp / 2 && fight.mob.stats.hp > fight.mob.stats.maxHp * 0.75)fight.player.damage = fight.mob.stats.maxHp / 2;
		fight.player.damage = Math.floor(fight.player.damage)
		fight.mob.stats.hp -= fight.player.damage
		fight.player.totalDamage += fight.player.damage
	}

	if(fight.player.stats.hp <= 0 || fight.mob.stats.hp <= 0){
		endEncounter(client,Brawl,fight)
		return
	}


	Brawl.round++;
	fight.round++;
	if(fight.round > 20){
		endEncounter(client,Brawl,fight)
		return
	}
	nextRoundEncounter(client,Brawl,fight)
}

function makeDecision(mob,Brawl,fight){
	let decision = [60,25,15];

	switch(mob.ai){
		case "random": break;
		default: break;
		case "aggressive": decision = [80,10,10]; break;
		case "defensive": decision = [25,50,25]; break;
	}

	if(mob.modifiers.charged > 1){
		decision = [30,5,65]
	}
	if(mob.modifiers.charged > 2){
		decision = [70,10,20]
	}

	if(fight.player.modifiers.charged >= 2){
		decision = [10,80,10]
	}

	let roll = Math.floor(Math.random() * 99 + 1)
	if(decision[0] >= roll)mob.choice = "melee";
	let temp = decision[0] + decision[1];
	if(temp <= roll)mob.choice = "block";
	temp += decision[2]
	if(temp <= roll)mob.choice = "nothing";

	if(!mob.choice)mob.choice = "melee";

	Brawl.mob.decisionCache.push(mob.choice)
	if(Brawl.mob.decisionCache.length > 3)Brawl.mob.decisionCache.shift();
	if(Brawl.mob.decisionCache.filter(decision => mob.choice == decision)){
		let roll = Math.round(Math.random() * 100)
		if(Brawl.mob.decisionCache.filter(decision => mob.choice == decision).length >= 3 && roll >= 10){
			mob = makeDecision(mob,Brawl,fight)
		}
	}

	return(mob)
}

function endEncounter(client,Brawl,fight,surrender){

	let playerString = `${fight.player.damage}`
	if(fight.player.crit == true){
		playerString = `**${fight.player.damage}!!**`
	}

	let mobString = `${fight.mob.damage}`
	if(fight.mob.crit == true){
		mobString = `**${fight.mob.damage}!!**`
	}

	Brawl.embeds.player.setDescription(`==== Round **${fight.round}** ====`)
	Brawl.embeds.player.fields[0].value = `:heart: ${fight.player.stats.hp}\n:zap: ${Math.floor(fight.player.stats.stamina)}\n:diamond_shape_with_a_dot_inside: ${Math.floor(fight.player.stats.mana)}`
	Brawl.embeds.player.fields[2].value = `${fight.mob.stats.hp} :heart:\n${fight.mob.stats.defense} :shield:\n${fight.mob.stats.damage} :dagger:`
	Brawl.embeds.player.fields[3].value = `${Brawl.embeds.player.fields[3].value}\n${playerString}`
	Brawl.embeds.player.fields[4].value = `${Brawl.embeds.player.fields[4].value}\n${fight.player.icon} - ${fight.mob.icon}`
	Brawl.embeds.player.fields[5].value = `${Brawl.embeds.player.fields[5].value}\n${mobString}`


	Brawl.embeds.player.fields[6].value = `========`
	Brawl.embeds.player.fields[8].value = `========`


	let playerData = client.getUserdata(Brawl.player.member.user.id)
	playerData.data.stats.currentHp = fight.player.stats.hp
	if(playerData.data.stats.currentHp < 0)playerData.data.stats.currentHp = 0;
	playerData.data.stats.hpTimer = Date.now()
	let rewardString = "";
	if(fight.player.stats.hp > 0 && fight.round <= 20 && !surrender){
		let rewardXp = 0;
		let rewardPancakes = 0;
		let rewardItems = [];
		let rewardPoints = fight.mob.data.rewardPoints;

		let itemRoll = Math.floor(Math.random() * 100 + ((fight.mob.data.lvl / 2) + fight.player.data.stats.luck))

		let penalty = false
		if(fight.player.data.level > fight.mob.data.lvl){
			rewardPoints = Math.floor(rewardPoints * (fight.mob.data.lvl / fight.player.data.level))
			itemRoll = 0;
			penalty = true;
		}

		if(fight.mob.data.lvl >= 30 && itemRoll >= 90){
			let tempItem = undefined;
			while(!tempItem){
			let rarityRoll = Math.floor(Math.random() * (rewardPoints / 3000) + 1)
			if(rarityRoll > 5)rarityRoll = 5;
			tempItem = client.createRandomItem(rarityRoll,undefined,undefined,(rewardPoints * 1.5))
				if(tempItem){
					if(client.calculatePrice(tempItem) < rewardPoints){
						tempItem = undefined;
					}
					else{
						rewardItems.push(tempItem)
					}
				}
			}
		}

		rewardXp = Math.floor((rewardPoints / 100) + (Math.random() * (rewardPoints / 5000)))
		rewardPancakes = Math.floor((rewardPoints / 6) + (Math.random() * (rewardPoints / 2000)))

		if(rewardXp){
			rewardString += `**${rewardXp}** XP\n`
			playerData.data.xp += rewardXp;
		}
		if(rewardPancakes){
			rewardString += `**${rewardPancakes}** :pancakes:\n`
			playerData.data.points += rewardPancakes;
		}
		if(rewardItems.length >= 1){
			rewardString += `Items:\n`
			rewardItems.forEach(item => {
				if(playerData.data.inventory.stored.length < playerData.data.inventory.max){
				rewardString += `[${item.rarity}] ${item.icon}\`\`${item.modifier} ${item.name}\`\`\n`
				playerData.data.inventory.stored.push(item)
				}
				else{
					rewardString += `~~[${item.rarity}] ${item.icon} ${item.modifier} ${item.name}~~\n*(Lost due to no Invetory Space)*\n`
				}
			})
		}

		if(penalty == true){
			rewardString += "*Receveived less rewards,\ndue to the monster being a lower level.*"
		}

		Brawl.embeds.player
		.addField("-------",`-------`,true)
		.addField("============",`Fight is over!\nGained ${rewardString}`,true)
		.addField("-------",`-------`,true)
	}
	else{
		let lostPancakes = 0;
		lostPancakes += Math.floor(playerData.data.points * 0.25)
		if(lostPancakes > 25000)lostPancakes = 25000;
		playerData.data.points -= lostPancakes;

		Brawl.embeds.player
		.addField("-------",`-------`,true)
		.addField("============",`Fight is over!\nYou died!\nLost **${client.formatNumber(lostPancakes)}** :pancakes:`,true)
		.addField("-------",`-------`,true)
	}

	console.log(`${Brawl.player.member.user.username} gained ${rewardString}`)
	client.setUserdata(playerData)

	Brawl.messages.player.edit(Brawl.embeds.player)
	client.BrawlMap.delete(Brawl.player.member.user.id)
}
*/


//**
