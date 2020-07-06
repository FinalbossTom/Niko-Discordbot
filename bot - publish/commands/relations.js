const Discord = require('discord.js')

module.exports = {
	name: 'relations',
	description: 'In the works',
	aliases: ['rel','friends','enemies','requests'],
	category: 'fun',
	exclude: true,
	execute(client,msg,args,userdata) {

		if(userdata.data.stats.version < 20){
			client.sendMessage(msg,"Profile Outdated","Sorry, but your Profile is outdated!\nUse ``$me`` to update it!","niko_upset")
			return
		}


		if(!args[1]){
			let friendString = `‏‏‎ \n`;
			let enemyString = `‏‏‎ \n`;

			userdata.data.relations.list.forEach(relation => {
				let user = client.users.cache.get(relation.id)
				if(relation.type == "friend"){friendString += `${relation.level} - **${user.username}**\n`}
				else{enemyString += `${relation.level} - **${user.username}**\n`}
			})


			let embed = new Discord.MessageEmbed();
			embed
			.setTitle("‏‏‎Your Relations")
			.setFooter("Niko - Finalboss Tom's Manager")
			.setThumbnail(msg.author.avatarURL())
			.addField("**=====** __Friendlist__ **=====**",friendString,true)
			.addField("**=====** __Enemylist__ **=====**",enemyString,true)


			let temp = userdata.data.relations.requests.filter(request => request.type == "friend")
			if(temp.length){
				let requestString = ``
				temp.forEach(request => {
					requestString += `**${client.users.cache.get(request.id).username}**`
				})
				embed.addField(":v: Open Friendrequests",requestString,false)
			}


			temp = userdata.data.relations.requests.filter(request => request.type == "peace")
			if(temp.length){
				let requestString = ``
				temp.forEach(request => {
					requestString += `**${client.users.cache.get(request.id).username}**`
				})
				embed.addField(":flag_white: Open Peacerequests",requestString,false)
			}

			if(userdata.data.relations.married){
				embed.setDescription(`:ring: Married to **${client.users.cache.get(userdata.data.relations.marriedTo.id).username}**`)
			}
			client.sendMessage(msg,true,embed)
			return
		}

		if(args[1] == "accept"){
			if(!args[2]){
				client.sendMessage(msg,"No User Tagged","You have tell me, which user you want to accept!\n(Either a @Mention or ``all``)","niko_speak")
				return
			}

			if(args[2] == "all"){
				client.sendMessage(msg,"lol","Sorry, but Tom isn't done with this yet...","niko_upset")
				return


			}

			if(msg.mentions.users.first()){
				userdata = client.getUserdata(msg.author.id)
				let target = msg.mentions.users.first()
				let targetdata = client.getUserdata(target.id)

				let relation = userdata.data.relations.requests.find(request => request.id == target.id)
												|| targetdata.data.relations.requests.find(request => request.id == msg.author.id)
												|| targetdata.data.relations.list.find(relation => relation.id == msg.author.id)

				if(!relation)return;
				if(!relation.request)return;

				if(relation.type == "friend"){
					userdata.data.relations.list.push({id: target.id, type: "friend", level: 1, progress: 0})
					targetdata.data.relations.list.push({id: msg.author.id, type: "friend", level: 1, progress: 0})

					userdata.data.relations.requests.splice(userdata.data.relations.requests.findIndex(request => request.id == target.id),1)

					client.setUserdata(userdata)
					client.setUserdata(targetdata)

					client.sendMessage(msg,true,`You are now befriended with **${target.username}**!`,"niko_excited")
					return
				}
				else{
					//Remove from Enemy

					userdata.data.relations.list.splice(userdata.data.relations.list.findIndex(relation => relation.id == target.id),1)
					targetdata.data.relations.list.splice(targetdata.data.relations.list.findIndex(relation => relation.id == msg.author.id),1)

					userdata.data.relations.requests.splice(userdata.data.relations.requests.findIndex(request => request.id == target.id),1)

					client.setUserdata(userdata)
					client.setUserdata(targetdata)

					client.sendMessage(msg,true,`You are no longer Enemies with **${target.username}**!`,"niko_excited")
					return
				}

				return
			}



			client.sendMessage(msg,"No User Tagged","You have tell me, which user you want to accept!\n(Either a @Mention or ``all``)","niko_speak")
			return
		}

	},
};
