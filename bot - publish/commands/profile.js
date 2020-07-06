
//updated messages

const Discord = require('discord.js')
const SQLite = require("better-sqlite3");
const database = new SQLite('./databases/database.sqlite');


module.exports = {
	name: 'profile',
	aliases: ['pro','me'],
	description: 'Shows your, or someone else\'s profile.',
	category: 'useful',
	usage: 'Nothing OR [Mention User]',
	execute(client,msg,args,userdata) {


		const embed = new Discord.MessageEmbed()
		var target = msg.author


		if(msg.mentions.members){
		if(msg.mentions.members.first()){
			if(msg.mentions.members.first().user.bot && msg.mentions.members.first().user.id != client.user.id){
				client.sendMessage(msg,"Bot profile","Sorry, but bot's can't have profiles...","niko_upset")
				return
			}
			target = msg.mentions.members.first().user;
		}

		userdata = client.getUserdata(target.id)

			if(!userdata && target.id != msg.author.id){
			client.sendMessage(msg,"No Profile","Sorry, but that Person doesn't have a profile set-up!","niko_speak")
			return
			}

			if(!userdata.data.stats && target.id != msg.author.id){
			client.sendMessage(msg,"No Profile","Sorry, but that Person doesn't have a profile set-up!","niko_speak")
			return
			}
		}



		if(!userdata.data.stats || userdata.data.stats == null){
			const temp = {   strength: Math.floor(Math.random() * 5 + 1)
									, dexterity: Math.floor(Math.random() * 5 + 1)
									, charisma: Math.floor(Math.random() * 5 + 1)
									, wisdom: Math.floor(Math.random() * 5 + 1)
									, luck: Math.floor(Math.random() * 5)
									, honor: 0
									, version: 6
			}
			if(!userdata.data.points)userdata.data.points = 0;
			userdata.data.daily = Date.now()
			userdata.data.level = 1;
			userdata.data.xp = 0;
			userdata.data.xpNeeded = 25;
			userdata.data.xpMax = 1000
			userdata.data.stats = temp
			client.setUserdata(userdata)
			userdata = client.getUserdata(target.id)
		}

		if(userdata.data.stats.version < client.profileVersion && target.id != msg.author.id){
			client.sendMessage(msg,"Profile Version too low","Sorry, but the Version of that person's Profile is too low!","niko_speak")
			return
		}

		let updateCheck = false;

		if(userdata.data.stats.version < 11){
			userdata.data.stats.version = 11
			const emptyItem = client.getBaseItem(0);
			userdata.data.inventory = {stored: [], max: 30, equipped: {lAccessoire: emptyItem,
																																	hat: emptyItem,
																																	rAccessoire: emptyItem,
																																	lArm: emptyItem,
																																	body: emptyItem,
																																	rArm: emptyItem,
																																	lHand: emptyItem,
																																	legs: emptyItem,
																																	rHand: emptyItem}}
			client.setUserdata(userdata)
			userdata = client.getUserdata(target.id)
			updateCheck = true;
		}

		if(userdata.data.stats.version < 13){
			userdata.data.stats.hpTimer = Date.now()
			userdata.data.stats.currentHp = 100
			userdata.data.stats.version = 13
			client.setUserdata(userdata)
			userdata = client.getUserdata(target.id)
			updateCheck = true;
		}



		if(userdata.data.stats.version < 14){
			userdata.data.stats.version = 14

			userdata.data.skills = {known: [], active: []}

			let tempLevel = userdata.data.level
			let tempPrestige = userdata.data.prestige
			let tempXp = userdata.data.xp

			if(tempPrestige){
				while(tempPrestige > 0){
					tempLevel += 50;
					tempPrestige--;
				}
			}

			while(tempLevel > 1){
				tempXp += 500
				tempLevel--;
			}

			userdata.data.level = 1
			userdata.data.prestige = 0
			userdata.data.xp = tempXp
			userdata.data.xpNeeded = 200
			userdata.data.perkPoints = 5

			userdata.data.inventory.max = 30

			userdata.data.stats.strength = 1
			userdata.data.stats.dexterity = 1
			userdata.data.stats.charisma = 1
			userdata.data.stats.wisdom = 1
			userdata.data.stats.luck = 1

			client.setUserdata(userdata)
			userdata = client.getUserdata(target.id)
			updateCheck = true;
		}

		if(userdata.data.stats.version < 15){
			userdata.data.stats.version = 15
			userdata.data.relations = {marriedTo: undefined, friends: [], enemies: []}
			client.setUserdata(userdata)
			userdata = client.getUserdata(target.id)
			updateCheck = true;
		}

		if(userdata.data.stats.version < 16){
			userdata.data.stats.version = 16
			userdata.data.job = undefined
			client.setUserdata(userdata)
			userdata = client.getUserdata(target.id)
			updateCheck = true;
		}

		if(userdata.data.stats.version < 17){
			userdata.data.stats.version = 17
			userdata.data.userGuild = undefined
			client.setUserdata(userdata)
			userdata = client.getUserdata(target.id)
			updateCheck = true;
		}

		if(userdata.data.stats.version < 18){
			userdata.data.stats.version = 18
			userdata.data.relations.requests = {friend: [], peace: []}
			client.setUserdata(userdata)
			userdata = client.getUserdata(target.id)
			updateCheck = true;
		}

		if(userdata.data.stats.version < 19){
			userdata.data.stats.version = 19
			userdata.data.relations = {marriedTo: undefined, list: [], requests: []}
			client.setUserdata(userdata)
			userdata = client.getUserdata(target.id)
			updateCheck = true;
		}

		if(userdata.data.stats.version < 20){
			userdata.data.stats.version = 20
			userdata.data.relations = {marriedTo: undefined, list: [], requests: []}
			client.setUserdata(userdata)
			userdata = client.getUserdata(target.id)
			updateCheck = true;
		}


		const stats = userdata.data.stats

		let lvlString = ``
		if(userdata.data.prestige)lvlString += `Prestige **${userdata.data.prestige}**\n`
		lvlString += `Level **${userdata.data.level}**`

		let xpString = ``

		let bar = client.createBar(userdata.data.xp,userdata.data.xpNeeded,4)

		xpString += `${bar.string} - **${bar.percent}%**`

		let relationString = ``

		if(userdata.data.relations.marriedTo)relationString += `:ring: ${client.users.cache.get(userdata.data.relations.marriedTo).username}\n`
		relationString += `:v: **${userdata.data.relations.list.filter(relation => relation.type == "friend").length}** Friends\n`
		relationString += `:crossed_swords: **${userdata.data.relations.list.filter(relation => relation.type == "enemy").length}** Enemies\n`
		if(userdata.data.relations.requests.length)relationString += `:grey_question: **${userdata.data.relations.requests.length}** Requests`;


		const rankData = client.commands.get("leaderboard").getRank(client,target.id)
		let title = ``
		if(userdata.data.prestige)title = ":trident: ";

		if(updateCheck){
			embed.setFooter(`Finalboss Tom's Manager - Profile version: ${stats.version} - UPDATED!`,client.EmojiMap.get("niko").url)
		}
		else{
			embed.setFooter(`Finalboss Tom's Manager - Profile version: ${stats.version}`,client.EmojiMap.get("niko").url)
		}

		embed
		.setTitle(`${rankData.status}\n${rankData.place} ${title}${target.username}`)
		.setColor(0xfffffc)
		.setThumbnail(target.avatarURL())

		.addField("**Pancakes**",`${client.formatNumber(userdata.data.points)} :pancakes:`,true)

		.addField("**Relations**",relationString,true)
		.addField(lvlString,xpString,false)

		.addField("**Stats**",`:muscle: ${stats.strength} Strength
								:athletic_shoe: ${stats.dexterity} Dexterity
								:kiss: ${stats.charisma} Charisma
								:brain: ${stats.wisdom} Wisdom
								:four_leaf_clover: ${stats.luck} Luck
								:beginner: ${stats.honor} Honor
								`,true)

		let equipString = ``
		i = 0;
		Object.values(userdata.data.inventory.equipped).forEach(item => {

			if(item.icon.startsWith(":")){
			equipString += `${item.icon}`
			}
			else{
			equipString += `:grey_question:`
			}

			i++;
			if(i == 3){
				equipString += "\n"
				i = 0
			}
		})

		embed
		.addField("**Equipment**",`${equipString}`,true)


		if(msg.author.id == target.id){
		const date = new Date()
		date.setTime(userdata.data.daily - Date.now() - 3600000)

		if(date.getTime() <= 0){
		embed
		.addField("Daily available in",`\`\`Right now!\`\`\n*${userdata.data.xpMax} XP left for today.*`,false)
		}
		else{
		embed
		.addField("Daily available in",`\`\`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\`\`\n*${userdata.data.xpMax} XP left for today.*`,false)
		}

		if(userdata.data.job || userdata.data.job == 0){
			const date = new Date()
			date.setTime(userdata.data.jobCooldown - Date.now())

			if(date.getTime() <= 0){
			embed
			.addField("Job bonus available in",`\`\`Right now!\`\``,true)
			}
			else{
			embed
			.addField("Job bonus available in",`\`\`${date.getHours()-1}:${date.getMinutes()}:${date.getSeconds()}\`\`\nWorking as a **${client.getJob(userdata.data.job).name}**`,true)
			}
		}
		client.sendMessage(msg,true,embed)
		}
		else{
			userdata = client.getUserdata(msg.author.id)
			let targetdata = client.getUserdata(target.id)

						let relation = userdata.data.relations.requests.find(request => request.id == target.id)
														|| targetdata.data.relations.requests.find(request => request.id == msg.author.id)
														|| targetdata.data.relations.list.find(relation => relation.id == msg.author.id)


						console.log(relation)
						if(!relation){
							embed.addField("Options","Use :v: to send them a friendrequest\nOr :crossed_swords: to declare them as your enemy!",false)
						}
						else{
							if(relation.type == "friend"){
								embed
								.addField("Friendship-Level",`**${relation.level}**\nProgress: ${relation.progress}`,false)
								if(!relation.request){embed.addField("Options","Use :x: to cancel your friendship!",true)}
								else{
									if(userdata.data.relations.requests.find(request => request.id == target.id)){
										embed.addField("Options",`Use \`\`$rel accept \`\`${client.users.cache.get(target.id)} to accept it,\nor \`\`$rel deny \`\`${client.users.cache.get(target.id)} to deny the request!`,true)
									}
							}
							}
							else{
								embed.addField("Rivality-Level",`**${relation.level}**\nProgress: ${relation.progress}`,false)

								if(!relation.request){embed.addField("Options","Use :flag_white: to send a peace request!",true)}
								else{
									if(userdata.data.relations.requests.find(request => request.id == target.id)){
										embed.addField("Options",`Use \`\`$rel accept \`\`${client.users.cache.get(target.id)} to accept it,\nor \`\`$rel deny \`\`${client.users.cache.get(target.id)} to deny the request!`,true)
									}
								}
							}
						}

						client.sendMessage(msg,true,embed)
						.then(async m => {
							const filter = (reaction, user) => user.id == msg.author.id;
							const collector = m.createReactionCollector(filter, {max: 1, time: 30000});

							collector.on('end',r => {
								if(!r.first()){
									m.reactions.removeAll()
									return
								}
								let resultEmbed = new Discord.MessageEmbed();
								resultEmbed.setFooter("Niko - Finalboss Tom's Manager")

								switch(r.first().emoji.name){

									case "✌️":
									if(relation)return;
									targetdata = client.getUserdata(target.id)
									targetdata.data.relations.requests.push({id: msg.author.id, request: true, type: "friend", level: "Pending...", progress: 0})
									client.setUserdata(targetdata)

									resultEmbed
									.setTitle(`Sent a friendrequest to ${target.username}!`)
									.setColor(0x14f53c)
									m.edit(resultEmbed)
									m.reactions.removeAll()
									break;

									case "🏳️":
									if(!relation)return;
									targetdata = client.getUserdata(target.id)
									targetdata.data.relations.requests.push({id: msg.author.id, request: true, type: "peace", level: "Pending...", progress: 0})
									client.setUserdata(targetdata)


									resultEmbed
									.setTitle(`Sent a peacerequest to ${target.username}!`)
									.setColor(0xf8efef)
									m.edit(resultEmbed)
									m.reactions.removeAll()
									break;

									case "⚔️":
									if(relation)return;
									targetdata = client.getUserdata(target.id)
									targetdata.data.relations.list.push({id: msg.author.id, type: "enemy", level: 1, progress: 0})
									client.setUserdata(targetdata)

									userdata = client.getUserdata(msg.author.id)
									userdata.data.relations.list.push({id: target.id, type: "enemy", level: 1, progress: 0})
									client.setUserdata(userdata)

									resultEmbed
									.setTitle(`You declared ${target.username} as your enemy!`)
									.setColor(0xfa4242)
									m.edit(resultEmbed)
									m.reactions.removeAll()
									break;

									case "❌":
									if(!relation)return;
									targetdata = client.getUserdata(target.id)
									if(targetdata.data.relations.list.find(relation => relation.id == msg.author.id)){targetdata.data.relations.list.splice(targetdata.data.relations.list.findIndex(relation => relation.id == msg.author.id),1)}
									else{targetdata.data.relations.requests.splice(targetdata.data.relations.requests.findIndex(relation => relation.id == msg.author.id),1)}
									client.setUserdata(targetdata)

									userdata = client.getUserdata(msg.author.id)
									if(userdata.data.relations.list.find(relation => relation.id == target.id))userdata.data.relations.list.splice(userdata.data.relations.list.findIndex(relation => relation.id == target.id),1);
									client.setUserdata(userdata)

									resultEmbed
									.setTitle(`You cancelled your friendship with ${target.username}!`)
									.setColor(0xfa4242)
									m.edit(resultEmbed)
									m.reactions.removeAll()
									break;
									default:
									m.reactions.removeAll()
									return
									break;
								}
							})
							try{
								if(!relation){
									await m.react("✌️");
								  await m.react("⚔️");
								}
								else if(relation.type == "friend" && !relation.request){await m.react("❌");}
								else if(relation.type == "enemy" && !relation.request){await m.react("🏳️");}
							}
							catch(error){}
						}) // Big Boy stuff für auswahl von Reactions
						return
		}


	},
};
