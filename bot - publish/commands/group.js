const Discord = require('discord.js')

const SQLite = require("better-sqlite3");
const database = new SQLite('./databases/database.sqlite');

module.exports = {
	name: 'group',
	aliases: ['groups'],
java	description: 'Open up the Alert interface.',
	category: 'useful',
	usage: '--Opens up detailed information',
	execute(client,msg,args,userdata) {

		if(args[0] == "$groups" || !args[1]){
			let groups = database.prepare("SELECT * FROM usergroups").all()

			let groupStringArray = ["","",""]
			groups.forEach(group => {
				let tempGroup = JSON.parse(group.data)
				if(!tempGroup.public)return;
				groupStringArray[0] += `\`\`${tempGroup.id}\`\`\n`
				groupStringArray[1] += `${tempGroup.name}\n`
				groupStringArray[2] += ` ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎  ‎‏‏‎‎‏‏ ‎‏‏‎ ‎‏‏‎‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ${tempGroup.users.length + 1}\n`
			})


			let embed = new Discord.MessageEmbed();
			embed.setTitle("All public Groups!")
			.setFooter("Niko - Finalboss Tom's Manager")
			.setDescription("Use ``$group [ID] or [NAME]`` to view more info about it,\nor ``$group create`` if you want to create your own.")
			.addField("== ID ==",groupStringArray[0],true)
			.addField("== Name of the Group ==",groupStringArray[1],true)
			.addField("== Usercount ==",groupStringArray[2],true)

			client.sendMessage(msg,true,embed)
		}


		if(args[1]){

			if(args[1] == "create"){

				let creationEmbed = new Discord.MessageEmbed();
				creationEmbed
				.setTitle("You are about to create a new Group...")
				.setDescription("However creating a group comes at some costs:\n\nYou need to be atleast **Level 20** and have **10** :beginner:\nYou will also have to pay **250k** :pancakes:")
				.setFooter("Niko - Finalboss Tom's Manager")


				client.sendMessage(msg,true,creationEmbed)
				.then(async m => {
					const filter = (reaction, user) => user.id == msg.author.id;
					const collector = m.createReactionCollector(filter, {max: 1, time: 30000});

					collector.on('end',r => {
						if(!r.first()){
							m.reactions.removeAll()
							return
						}
						let resultEmbed = new Discord.MessageEmbed();
						resultEmbed.setFooter("Niko - Finalboss Tom's Manager");
						switch(r.first().emoji.name){
							case "✅":
							userdata = client.getUserdata(msg.author.id)
							if(userdata.data.points < 250000 || userdata.data.level < 20 || userdata.data.stats.honor < 10){

								let missingString = ``

								if(userdata.data.points < 250000)missingString += `- **${250000 - userdata.data.points}** :pancakes:\n`;
								if(userdata.data.level < 20)missingString += `- **${20 - userdata.data.level} Levels**\n`;
								if(userdata.data.stats.honor < 10)missingString += `- **${10 - userdata.data.stats.honor}** :beginner: **Honor**`;

								resultEmbed
								.setTitle("You don't have what it takes to create a group!")
								.setDescription(`You are missing the following:\n${missingString}`)
								.setColor(0xfd0202)

								m.edit(resultEmbed)
								m.reactions.removeAll()
								return
							}

							m.reactions.removeAll()

							resultEmbed
							.setTitle("**Please write the name of the Group.**")
							.setColor(0xfffb00)
							m.edit(resultEmbed)
							.then(m => {
								const filter = message => message.author.id == msg.author.id;
								const collector = m.channel.createMessageCollector(filter, {max: 1, time: 30000});

								collector.on('end',answer => {
									if(!answer.first()){
										client.sendMessage(msg,"No Name","Sorry, but you were too slow with the input...\nI'm cancelling the command.","niko_what")
										return
									}
									if(answer.first().content.length > 25){
										client.sendMessage(msg,"Name is too long","Sorry, but that name is too long!*(Max. 25 characters)*","niko_what")
										return
									}
									if(client.getUsergroup(answer.first().content)){
										client.sendMessage(msg,"Name is taken","Sorry, but a group with a similiar Name already exists!\nPlease try it again with a different name.","niko_what")
										return
									}

									userdata = client.getUserdata(msg.author.id)
									userdata.data.points -= 250000
									//client.setUserdata(userdata)
									userdata = client.getUserdata(msg.author.id)

									let tempid = client.createUsergroup({name: answer.first().content, owner: msg.author.id, description: `This is a newly created group from **${msg.author.tag}**`, moderators: [], users: [], notify: [], public: false})
									let group = client.getUsergroup(tempid)

									let endEmbed = new Discord.MessageEmbed()
									.setFooter("Niko - Finalboss Tom's Manager")
									.setTitle(`Your group was created!`)
									.setDescription(`Name: **${group.name}**\nDescription: ${group.description}\nPublic: **${group.public}**\nID: **${group.id}**\n\nYour new Balance:\n${client.formatNumber(userdata.data.points + 250000)} => **${client.formatNumber(userdata.data.points)}**`)
									.setColor(0x0afa22)

									m.edit(endEmbed)
									return
								})
							})
							break;
							case "❌":
							resultEmbed
							.setTitle("You cancelled the creation.")
							.setColor(0xfd0202)
							m.edit(resultEmbed)
							default:
							m.reactions.removeAll()
							return
							break;
						}
					})
					try{
					await m.react("✅")
					await m.react("❌")
					}
					catch(error){}
				})

				return
			}

			let inputName = args.slice(1).join(" ")
			let target = client.getUsergroup(inputName)
			if(!target){
				client.sendMessage(msg,"Unknown Group","Sorry, but that Group doesn't exist...","niko_what")
				return
			}
			if(target.deleted){
				client.sendMessage(msg,"Deleted Group","Sorry, but that Group doesn't exist...","niko_what")
				return
			}
			if(target == "too many"){
				client.sendMessage(msg,"Too many Groups","Sorry, but i found more than one group...\nPlease try to specify the name bit more, or use the groups ID.","niko_speak")
				return
			}

			let embed = new Discord.MessageEmbed();
			embed
			.setFooter("Finalboss Tom's Manager")
			.setTitle(target.name)
			.setDescription(target.description)
			.addField("Details",`Owner: \`\`${client.users.cache.get(target.owner).tag}\`\`\nPublic: **${target.public}**`)

			console.log(target)

			let type = undefined;
			if(target.public && !target.users.find(id => id == msg.author.id)){
				embed.addField("React with:",":door: to **join** the group\n",false)
				type = "joinable"
			}
			if(target.users.find(id => id == msg.author.id) && !target.moderators.find(id => id == msg.author.id)){
				embed.addField("React with:",":wave: to **leave** the group\n:shushing_face: to **mute or unmute** Group Notifications",false)
				type = "member"
			}
			if(target.moderators.find(id => id == msg.author.id)){
				embed.addField("React with:",":wave: to **leave** the group\n:shushing_face: to **mute or unmute** Group Notifications\n:exclamation: to **ping** this group",false)
				type = "mod"
			}
			if(target.owner == msg.author.id){
				embed.addField("React with:",":no_entry_sign: to **delete** the group\n:shushing_face: to **mute or unmute** Group Notifications\n:exclamation: to **ping** this group",false)
				type = "owner"
			}

			if(!type && !target.public){
				embed.addField("This group is private.",`You are only able to join this group if the owner or a moderator invites you.`,false)
				type = "none"
			}

			switch(type){
				case "joinable":
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
						resultEmbed.setFooter("Niko - Finalboss Tom's Manager");
						switch(r.first().emoji.name){
							case "🚪":

							target = client.getUsergroup(inputName)
							target.users.push(msg.author.id)
							client.setUserGroup(target)

							resultEmbed
							.setTitle(`You successfully joined ${target.name}!`)
							m.reactions.removeAll()
							m.edit(resultEmbed)
							break;

							default:
							m.reactions.removeAll()
							return
							break;
						}
					})
					try{
					await m.react("🚪")
					}
					catch(error){}
				})
				break;

				case "member":
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
						resultEmbed.setFooter("Niko - Finalboss Tom's Manager");
						switch(r.first().emoji.name){
							case "👋":

							target = client.getUsergroup(inputName)
							target.users.splice(target.users.findIndex(id => id == msg.author.id),1)
							client.setUserGroup(target)

							resultEmbed
							.setTitle(`You successfully left ${target.name}!`)
							m.reactions.removeAll()
							m.edit(resultEmbed)
							break;

							case "🤫":

							if(target.notify.find(id => msg.author.id)){
								target = client.getUsergroup(inputName)
								target.notify.splice(target.notify.findIndex(id => id == msg.author.id),1)
								client.setUserGroup(target)
								resultEmbed
								.setTitle(`You unmuted ${target.name}!`)
								.setDescription("You will now **receive notifications**.")
							}
							else{
								target = client.getUsergroup(inputName)
								target.notify.push(msg.author.id)
								client.setUserGroup(target)
								resultEmbed
								.setTitle(`You muted ${target.name}!`)
								.setDescription("You will now **no longer receive notifications**.")
							}

							m.reactions.removeAll()
							m.edit(resultEmbed)
							break;

							default:
							m.reactions.removeAll()
							return
							break;
						}
					})
					try{
					await m.react("👋")
					await m.react("🤫")
					}
					catch(error){}
				})
				break;

				case "owner":
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
						resultEmbed.setFooter("Niko - Finalboss Tom's Manager");
						switch(r.first().emoji.name){
							case "🚫":

							resultEmbed
							.setTitle(`You successfully deleted ${target.name}!`)

							target = client.getUsergroup(inputName)
							target = {id: target.id, name: target.name, deleted: true}
							client.setUserGroup(target)

							m.reactions.removeAll()
							m.edit(resultEmbed)
							break;

							case "🤫":

							if(target.notify.find(id => msg.author.id)){
								target = client.getUsergroup(inputName)
								target.notify.splice(target.notify.findIndex(id => id == msg.author.id),1)
								client.setUserGroup(target)
								resultEmbed
								.setTitle(`You unmuted ${target.name}!`)
								.setDescription("You will now **receive notifications**.")
							}
							else{
								target = client.getUsergroup(inputName)
								target.notify.push(msg.author.id)
								client.setUserGroup(target)
								resultEmbed
								.setTitle(`You muted ${target.name}!`)
								.setDescription("You will now **no longer receive notifications**.")
							}

							m.reactions.removeAll()
							m.edit(resultEmbed)
							break;

							default:
							m.reactions.removeAll()
							return
							break;
						}
					})
					try{
					await m.react("🚫")
					await m.react("🤫")
					}
					catch(error){}
				})
				break;

				case "none":
				client.sendMessage(msg,true,embed)
				break;

				default:
				throw "Error, unknown membertype";
				break;
			}
			return
		}

},
}
