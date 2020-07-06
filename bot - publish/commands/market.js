const Discord = require('discord.js')
const SQLite = require("better-sqlite3");
const database = new SQLite('./databases/database.sqlite');

module.exports = {
	name: 'market',
	description: 'Shows the current Item-rotation.',
	aliases: ['shop','s'],
	category: 'economy',
	execute(client,msg,args,userdata) {

		if(userdata.data.stats.version < client.profileVersion){
		client.sendMessage(msg,"User profile version too low","Sorry, but your Profile version is too low!\n(Update it with $me)","niko_speak")
		return
		}

		if(args[1] == "inspect" || args[1] == "i"){

			if(!args[2]){
				client.sendMessage(msg,"No Slot given","You have to tell me the Slot of the Item in the Shop!","niko_speak")
				return
			}

			const item = client.currentShop[parseInt(args[2]) - 1]
			if(!item){
				client.sendMessage(msg,"Invalid Slot","Sorry, but that Slot is invalid!","niko_speak")
				return
			}

			client.sendMessage(msg,true,client.getItemEmbed(item))
			return
		}

		if(args[1] == "buy" || args[1] == "b"){

			if(!args[2]){
				client.sendMessage(msg,"No Slot given","You have to tell me the Slot of the Item in the Shop!","niko_speak")
				return
			}

			const item = client.currentShop[parseInt(args[2]) - 1]
			if(!item){
				client.sendMessage(msg,"Invalid Slot","Sorry, but that Slot is invalid!","niko_speak")
				return
			}
			if(client.calculatePrice(item) > userdata.data.points){
				client.sendMessage(msg,"Not enough points",`Sorry, but you need ${client.calculatePrice(item) - userdata.data.points} more :pancakes: to buy that item!`,"niko_speak")
				return
			}

			const embed = new Discord.MessageEmbed();
			embed
			.setFooter(`Finalboss Tom's Manager`,client.EmojiMap.get("niko").url)
			.setTitle(`Transaction Complete!`)
			.setColor(0x25e1ec)
			.setDescription(`You bought\n${item.modifier}\n${item.icon}\`\`${item.name}\`\`\nfor ${client.formatNumber(client.calculatePrice(item))} :pancakes:`)
			.addField("New Balance",`${client.formatNumber(userdata.data.points)} => **${client.formatNumber(userdata.data.points - client.calculatePrice(item))}**`,false)
			client.sendMessage(msg,true,embed)

			userdata.data.inventory.stored.push(item)
			userdata.data.points -= client.calculatePrice(item)
			client.setUserdata(userdata)
			return
		}


		const tempDate = new Date()
		 if(!client.currentShop || tempDate.getHours()  >= client.nextShopRotation.getHours() && tempDate.getHours() != 23 ){

			 client.currentShop = []
			 while(client.currentShop.length != 6){
				 let temp = client.createRandomItem()
				 if(temp){
				  if(temp.market == true)client.currentShop.push(temp);
			 	}
			 }
			 client.nextShopRotation.setHours(tempDate.getHours() + 1)
		 }




		const embed = new Discord.MessageEmbed();
 		embed
 		.setFooter(`Finalboss Tom's Manager`,client.EmojiMap.get("niko").url)
 		.setTitle(`Welcome to the Shop!\n*Next Rotation at ${client.nextShopRotation.getHours()}:00*`)
		.setDescription("You can use `$market inspect (Number)` to find out more, about an item\nor buy it using `$market buy (Number)`!")
 		.setColor(0x25e1ec)

		let i = 1
		client.currentShop.forEach(item => {
			embed.addField(`Number: **${i}**\n       \`\`${item.modifier}\`\`\n${item.icon} \`\`${item.name}\`\``,`Cost: ${client.formatNumber(client.calculatePrice(item))} :pancakes:
			Slot: ${item.slot}
			Rarity: ${item.rarity}`,true)
			i++;
		})

		client.sendMessage(msg,true,embed)
	},
};
