const Discord = require('discord.js')
const SQLite = require("better-sqlite3");
const database = new SQLite('./databases/database.sqlite');

module.exports = {
	name: 'inventory',
	description: 'Open up your inventory and equip things.',
	aliases: ['inv','items'],
	category: 'economy',
	exclude: true,
	execute(client,msg,args,userdata) {

		if(userdata.data.stats.version < client.profileVersion){
		client.sendMessage(msg,"User profile version too low","Sorry, but your Profile version is too low!\n(Update it with $me)","niko_speak")
		return
		}

		let temp = userdata.data.inventory.stored
		temp.forEach((item,index) => {
			if(item.id == 0){
				userdata.data.inventory.stored.splice(index,1)
				client.setUserdata(userdata)
				userdata = client.getUserdata(msg.author.id)
			}
		})
		
		if(args[1]){

			if(args[1] == "sell" || args[1] == "equip" || args[1] == "e" || args[1] == "i" || args[1] == "inspect"){
				client.sendMessage(msg,"Old Syntax","Tom has updated the inventory Command!\nYou now only have to tell me which item you want to select!\nExample: ``$inventory 3`` or ``$inventory hand r``","niko_speak")
				return
			}

			let item = undefined;
			let selected = undefined;
			let equipped = false;
			switch(args[1]){
				case "hat":
				 item = userdata.data.inventory.equipped.hat;
				 equipped = true;
				 break;
				case "accessoire": case "acc":
				if(args[2]){
					if(args[2] == "right" || args[2] == "r"){
						item = userdata.data.inventory.equipped.rAccessoire;
						selected = "rAccessoire"
					}
					if(args[2] == "left" || args[2] == "l"){
						item = userdata.data.inventory.equipped.lAccessoire;
						selected = "lAccessoire"
					}
				}
				if(!item){
					item = userdata.data.inventory.equipped.lAccessoire;
					selected = "lAccessoire"
				}
				equipped = true;
				break;

				case "body":
				item = userdata.data.inventory.equipped.body;
				selected = "body"
				equipped = true;
				break;
				case "arm":
				if(args[2]){
					if(args[2] == "right" || args[2] == "r"){
						item = userdata.data.inventory.equipped.rArm;
						selected = "rArm"
					}
					if(args[2] == "left" || args[2] == "l"){
						item = userdata.data.inventory.equipped.lArm;
						selected = "lArm"
					}
				}
				if(!item){
					item = userdata.data.inventory.equipped.lArm;
					selected = "lArm"
				}
				equipped = true;
				break;

				case "hand":
				if(args[2]){
					if(args[2] == "right" || args[2] == "r"){
						item = userdata.data.inventory.equipped.rHand;
						selected = "rHand"
					}
					if(args[2] == "left" || args[2] == "l"){
						item = userdata.data.inventory.equipped.lHand;
						selected = "lHand"
					}
				}
				if(!item){
					item = userdata.data.inventory.equipped.lHand
					selected = "lHand"
				}
				equipped = true;
				break;

				case "legs": case "leg":
				item = userdata.data.inventory.equipped.legs;
				selected = "legs"
				equipped = true;
				break;
			}

			if(!item)item = userdata.data.inventory.stored[parseInt(args[1]) - 1];

			if(!item){
				client.sendMessage(msg,"Invalid Slot","Sorry, but that Slot is invalid!\nUse either ``$inv (SLOT NAME) ['l' or 'r']`` or ``$inv (SLOT NUMBER)``","niko_speak")
				return
			}
			if(item.id == 0){
				client.sendMessage(msg,"Empty Slot","Sorry, but that Slot is Empty!","niko_speak")
				return
			}

			let itemEmbed = client.getItemEmbed(item)
			console.log(itemEmbed)
			if(equipped == true){
				itemEmbed.addField("Options","Click on :regional_indicator_u: to unequip the item!",false)
			}
			else{
				itemEmbed.addField("Options","Click on :regional_indicator_e:  to equip the item,\nor on :moneybag: to sell it!",false)
			}
			client.sendMessage(msg,true,itemEmbed).then(async m => {
				const filter = (reaction, user) => user.id == msg.author.id;
				const collector = m.createReactionCollector(filter, {max: 1, time: 30000});

				collector.on('end',async r => {
					if(!r.first()){
						m.reactions.removeAll()
						return
					}
					switch(r.first().emoji.name){
						case "🇪":
						if(equipped == true)return;
						await m.reactions.removeAll();

						let resultEmbed = new Discord.MessageEmbed();
						resultEmbed
						.setTitle(`Equipped ${item.icon}\`\`${item.modifier} ${item.name}\`\`!`)
						.setColor(0x19e649)
						let right = false;
						if(item.slot == "accessoire" || item.slot == "hand" || item.slot == "arm"){
							let chooseSlotEmbed = new Discord.MessageEmbed();
							chooseSlotEmbed
							.setTitle("*Left or Right Slot?*")

							const equipped = userdata.data.inventory.equipped;
							switch(item.slot){
								case "accessoire":
								chooseSlotEmbed
								.addField(`${equipped.lAccessoire.icon} Accessoire (L)`,`${equipped.lAccessoire.modifier}\n\`\`${equipped.lAccessoire.name}\`\``,true)
								.addField("========","\n- ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏-\n========",true)
								.addField(`${equipped.rAccessoire.icon} Accessoire (R)`,`${equipped.rAccessoire.modifier}\n\`\`${equipped.rAccessoire.name}\`\``,true)
								break;

								case "arm":
								chooseSlotEmbed
								.addField(`${equipped.lArm.icon} Arm (L)`,`${equipped.lArm.modifier}\n\`\`${equipped.lArm.name}\`\``,true)
								.addField("========","\n- ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏-\n========",true)
								.addField(`${equipped.rArm.icon} Arm (R)`,`${equipped.rArm.modifier}\n\`\`${equipped.rArm.name}\`\``,true)
								break;

								case "hand":
								chooseSlotEmbed
								.addField(`${equipped.lHand.icon} Hand (L)`,`${equipped.lHand.modifier}\n\`\`${equipped.lHand.name}\`\``,true)
								.addField("========","\n- ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎-\n========",true)
								.addField(`${equipped.rHand.icon} Hand (R)`,`${equipped.rHand.modifier}\n\`\`${equipped.rHand.name}\`\``,true)
								break;
							}

							m.edit(chooseSlotEmbed).then(async m => {
								const filter = (reaction, user) => user.id == msg.author.id;
								const collector = m.createReactionCollector(filter, {max: 1, time: 30000});

								collector.on('end',r => {
									if(!r.first()){
										m.reactions.removeAll()
										return
									}

									switch(r.first().emoji.name){
										case "🇱":
										break;

										case "🇷":
										right = true;
										break;
									}
									let answer = equip(client,args,item,userdata,right)
									if(!answer)client.sendMessage(msg,"Item with no Slot","Sorry, but that Item doesn't have a slot!\nYou can't equip it...","niko_what");
									client.setUserdata(answer)
									m.edit(resultEmbed)
									m.reactions.removeAll();
								})
								try{
									await m.react("🇱")
									await m.react("🇷")
								}
								catch(error){}
							})
						}
						else{
							let answer = equip(client,args,item,userdata,right)
							if(!answer)client.sendMessage(msg,"Item with no Slot","Sorry, but that Item doesn't have a slot!\nYou can't equip it...","niko_what");
							client.setUserdata(answer)
							m.edit(resultEmbed)
							m.reactions.removeAll();
						}
						break;

						case "💰":
						if(equipped == true)return;
						await m.reactions.removeAll();
						if(!client.calculatePrice(item)){
							client.sendMessage(msg,"Can't Sell item","Sorry, but you can't sell that Item!","niko_speak")
							return
						}
						itemEmbed.addField("=========",`Are you sure you want to sell this item\n for **${client.formatNumber(Math.floor(client.calculatePrice(item) / 2))}** :pancakes: ?`)
						m.edit(itemEmbed).then(async m => {
							const filter = (reaction, user) => user.id == msg.author.id;
							const collector = m.createReactionCollector(filter, {max: 1, time: 30000});

							collector.on('end',r => {
								if(!r.first()){
									m.reactions.removeAll()
									return
								}
								let transactionEmbed = new Discord.MessageEmbed();
								switch(r.first().emoji.name){
									case "✅":
									userdata = client.getUserdata(msg.author.id)
									if(!userdata.data.inventory.stored[parseInt(args[1])-1])return;
									transactionEmbed
									.setFooter(`Finalboss Tom's Manager`,client.EmojiMap.get("niko").url)
									.setTitle(`Transaction Complete!`)
									.setColor(0x19e649)
									.setDescription(`You sold\n${item.modifier}\n${item.icon}\`\`${item.name}\`\`\nfor ${client.formatNumber(Math.floor(client.calculatePrice(item) / 2))} :pancakes:`)
									.addField("New Balance",`${client.formatNumber(userdata.data.points)} => **${client.formatNumber(userdata.data.points +  Math.floor(client.calculatePrice(item) / 2))}**`,false)
									m.edit(transactionEmbed)
									m.reactions.removeAll()
									userdata.data.points += Math.floor(client.calculatePrice(item) / 2)
									userdata.data.inventory.stored.splice(parseInt(args[1])-1,1)
									client.setUserdata(userdata)
									break;

									case "❌":
									default:
									transactionEmbed
									.setFooter(`Finalboss Tom's Manager`,client.EmojiMap.get("niko").url)
									.setTitle(`Transaction Cancelled.`)
									.setColor(0xfa4242)
									m.edit(transactionEmbed)
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
						break;

						case "🇺":
						if(equipped == false)return;
						await m.reactions.removeAll();
						let unequipEmbed = new Discord.MessageEmbed();
						unequipEmbed.setTitle(`Unequipped ${item.icon}\`\`${item.modifier} ${item.name}\`\`!`)
						.setColor(0xe9dc33)
						if(!selected)return

						const emptySlot = client.getBaseItem(0)
						switch(selected){
							case "lAccessoire":
							userdata.data.inventory.stored.push(userdata.data.inventory.equipped.lAccessoire)
							userdata.data.inventory.equipped.lAccessoire = emptySlot
							break;

							case "hat":
							userdata.data.inventory.stored.push(userdata.data.inventory.equipped.hat)
							userdata.data.inventory.equipped.hat = emptySlot
							break;

							case "rAccessoire":
							userdata.data.inventory.stored.push(userdata.data.inventory.equipped.rAccessoire)
							userdata.data.inventory.equipped.rAccessoire = emptySlot
							break;

							case "lArm":
							userdata.data.inventory.stored.push(userdata.data.inventory.equipped.lArm)
							userdata.data.inventory.equipped.lArm = emptySlot
							break;

							case "body":
							userdata.data.inventory.stored.push(userdata.data.inventory.equipped.body)
							userdata.data.inventory.equipped.body = emptySlot
							break;

							case "rArm":
							userdata.data.inventory.stored.push(userdata.data.inventory.equipped.rArm)
							userdata.data.inventory.equipped.rArm = emptySlot
							break;

							case "lHand":
							const lTemp = userdata.data.inventory.equipped.lHand
							let check = false;
							if(lTemp.id != 0){
								if(lTemp.slot == "twoHand"){
									check = true;
								}
							}
							userdata.data.inventory.stored.push(userdata.data.inventory.equipped.lHand)
							userdata.data.inventory.equipped.lHand = emptySlot
							if(check == true)userdata.data.inventory.equipped.rHand = emptySlot
							break;

							case "legs":
							userdata.data.inventory.stored.push(userdata.data.inventory.equipped.legs)
							userdata.data.inventory.equipped.legs = emptySlot
							break;

							case "rHand":
							const rTemp = userdata.data.inventory.equipped.rHand
							let check2 = false;
							if(rTemp.id != 0){
								if(rTemp.slot == "twoHand"){
									check2 = true;
								}
							}
							userdata.data.inventory.stored.push(userdata.data.inventory.equipped.rHand)
							userdata.data.inventory.equipped.rHand = emptySlot
							if(check2 == true)userdata.data.inventory.equipped.lHand = emptySlot
							break;
						}
						client.setUserdata(userdata)
						m.edit(unequipEmbed)
						break;
					}
				})

				try{
					if(equipped == false && item.slot != "none"){
						await m.react("🇪")
						await m.react("💰")
					}
					if(equipped == true){
						await m.react("🇺")
					}
				}
				catch(error){}
			})
			return
		}

		const embed = new Discord.MessageEmbed();
		embed
		.setFooter(`Finalboss Tom's Manager`,client.EmojiMap.get("niko").url)
		.setTitle(`Your inventory!`)
		.setDescription("Use ``$inventory (NUMBER)``\nor ``$inventory (SLOT NAME) [l or r]`` to view an item!")
		.setColor(0xffffff)
		.setThumbnail(msg.author.avatarURL())

		const equipped = userdata.data.inventory.equipped;
		embed
		.addField(`${equipped.lAccessoire.icon} Accessoire (L)`,`${equipped.lAccessoire.modifier}\n\`\`${equipped.lAccessoire.name}\`\``,true)
		.addField(`${equipped.hat.icon} Hat`,`${equipped.hat.modifier}\n\`\`${equipped.hat.name}\`\``,true)
		.addField(`${equipped.rAccessoire.icon} Accessoire (R)`,`${equipped.rAccessoire.modifier}\n\`\`${equipped.rAccessoire.name}\`\``,true)
		.addField(`${equipped.lArm.icon} Arm (L)`,`${equipped.lArm.modifier}\n\`\`${equipped.lArm.name}\`\``,true)
		.addField(`${equipped.body.icon} Body`,`${equipped.body.modifier}\n\`\`${equipped.body.name}\`\``,true)
		.addField(`${equipped.rArm.icon} Arm (R)`,`${equipped.rArm.modifier}\n\`\`${equipped.rArm.name}\`\``,true)
		.addField(`${equipped.lHand.icon} Hand (L)`,`${equipped.lHand.modifier}\n\`\`${equipped.lHand.name}\`\``,true)
		.addField(`${equipped.legs.icon} Legs`,`${equipped.legs.modifier}\n\`\`${equipped.legs.name}\`\``,true)
		.addField(`${equipped.rHand.icon} Hand (R)`,`${equipped.rHand.modifier}\n\`\`${equipped.rHand.name}\`\``,true)

		let storedItemString = ""
		let i = 1;
		userdata.data.inventory.stored.forEach((item,index,array) => {
			storedItemString += `|${index + 1}: ${array[index].icon}`
			if(i == 5){
				i = 0;
				storedItemString += "\n"
			}
			i++;
		})
		if(storedItemString == "")storedItemString = "No Items stored."

		embed
		.addField(`Stored Items - ${userdata.data.inventory.stored.length} / ${userdata.data.inventory.max}`,`${storedItemString}`,false)
		msg.channel.send(embed)
	},
};


function equip(client,args,item,userdata,right){

const emptySlot = client.getBaseItem(0)
const itemPos = parseInt(args[1]) - 1
switch(item.slot){
	case "hat":
	userdata.data.inventory.stored[itemPos] = userdata.data.inventory.equipped.hat
	userdata.data.inventory.equipped.hat = item
	break;

	case "accessoire":
		if(right == false){
			userdata.data.inventory.stored[itemPos] = userdata.data.inventory.equipped.lAccessoire
			userdata.data.inventory.equipped.lAccessoire = item
		}
		else{
			userdata.data.inventory.stored[itemPos] = userdata.data.inventory.equipped.rAccessoire
			userdata.data.inventory.equipped.rAccessoire = item
		}
	break;

	case "body":
	userdata.data.inventory.stored[itemPos] = userdata.data.inventory.equipped.body
	userdata.data.inventory.equipped.body = item
	break;

	case "arm":
		if(right == false){
			userdata.data.inventory.stored[itemPos] = userdata.data.inventory.equipped.lArm
			userdata.data.inventory.equipped.lArm = item
		}
		else{
			userdata.data.inventory.stored[itemPos] = userdata.data.inventory.equipped.rArm
			userdata.data.inventory.equipped.rArm = item
		}
	break;




	case "hand":
	const lTemp = userdata.data.inventory.equipped.lHand
	let check = false;
	if(lTemp.id != 0){
		if(lTemp.slot == "twoHand"){
			check = true;
		}
	}
		if(right == false){
			userdata.data.inventory.stored[itemPos] = userdata.data.inventory.equipped.lHand
			userdata.data.inventory.equipped.lHand = item
			if(check == true)userdata.data.inventory.equipped.rHand = emptySlot;
		}
		else{
			userdata.data.inventory.stored[itemPos] = userdata.data.inventory.equipped.rHand
			userdata.data.inventory.equipped.rHand = item
			if(check == true)userdata.data.inventory.equipped.lHand = emptySlot;
		}
	break;

	case "twoHand":
	const rTemp = userdata.data.inventory.equipped.rHand
	let rcheck = false
	if(rTemp.id != 0){
		if(rTemp.slot == "hand"){
			rcheck = true;
		}
	}

	userdata.data.inventory.stored[itemPos] = userdata.data.inventory.equipped.lHand
	if(rcheck == true){
	userdata.data.inventory.stored.push(userdata.data.inventory.equipped.rHand)
	}
	userdata.data.inventory.equipped.lHand = item
	userdata.data.inventory.equipped.rHand = item
	break;

	case "legs":
	userdata.data.inventory.stored[itemPos] = userdata.data.inventory.equipped.legs
	userdata.data.inventory.equipped.legs = item
	break;

	default:
	return(undefined)
	break;
}
if(userdata.data.inventory.stored.findIndex(item => item.id == 0)){
	userdata.data.inventory.stored.splice(userdata.data.inventory.stored.findIndex(item => item.id == 0),1)
}

return(userdata)
}
