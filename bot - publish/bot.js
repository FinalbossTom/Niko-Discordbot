console.time("Startup")
console.log("Loading Libs...")

// Important things and stuff for Debugging
const fs = require('fs')
const config = require('../config')
const Discord = require('discord.js')

// SQL Databanks
const SQLite = require("better-sqlite3");
const database = new SQLite('./databases/database.sqlite');

// For Saving Data
const msgCooldown = new Set();
const timeout = new Set();
const startTimestamp = Date.now();

// Initiliazition of Data and Clients
let pr = { activity: { type: "WATCHING" ,name: "." }}

if(process.argv[2] == "debug"){
		pr = { status: "dnd", activity: { type: "WATCHING" ,name: "Debugging..." }}
		}

const client = new Discord.Client({ disableEveryone: true , fetchAllMembers:true , presence: pr})
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for(const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}


client.login(config.token).catch("Error logging client in: " + console.error);
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));


// Start of Event listening

client.on('warn', console.warn)

client.on('error', error => {
	console.log(error)
	client.setTimeout(function() {client.destroy()},5000)
})


client.on('ready', () => {
	console.log("Starting Client...")



	//DEFINE CLIENT
		client.DebugChannel = client.channels.cache.get("676880363729059899")
		client.DebugGuild = client.guilds.cache.get("676056003220865044")
		client.owner = client.users.cache.get("137552001365049345");
		client.debugMode = false;
		client.checkedMessages = 0;
		client.failedCommands = 0;
		client.runCommands = 0;
		client.nextShopRotation = new Date()
		client.profileVersion = 20


		client.messageCache = new Discord.Collection();

		client.CommandCooldown = new Discord.Collection();
		client.RoleMap = new Map();
		client.EmojiMap = new Map();
		client.serverQueue = new Map(); //for $play
		client.OP = new Map();
		client.BrawlMap = new Discord.Collection(); //for $fight

	console.log("Defined Properties.")

	//DEFINE FUNCTIONS
	//{

		client.sendMessage = function(msg,Code,Content,EmojiName){
			if(Code === true){
				console.log("Success!")
			}
			else{
				console.log(`Failed: ${Code}`)
			}
			if(!EmojiName){
				return(msg.channel.send(Content))
			}
			if(EmojiName.startsWith(":")){
				msg.channel.send(EmojiName)
				msg.channel.send(Content)
				return(true)
			}
			msg.channel.send(client.EmojiMap.get(EmojiName))
			msg.channel.send(Content)
			return(true)
		}

		client.formatNumber = function(Number){
			let i = 1;
			let NumberArray = String(Number).split("")
			let output = []

			NumberArray.reverse()

			while(NumberArray.length != 0){
				output.unshift(NumberArray[0])
				NumberArray.shift()
				if(i == 3 && NumberArray.length != 0){
					output.unshift(".")
					i = 0
				}
				i++;
			}

			return(output.join(""))
		}

		client.calculateStats = function(data){

		let prestigeMutliplier = 1

		if(data.prestige){
			switch(data.prestige){
				case 1: prestigeMutliplier = 1.25; break;
				case 2: prestigeMutliplier = 1.50; break;
				case 3: prestigeMutliplier = 1.75; break;
				case 4: prestigeMutliplier = 2; break;
				default: prestigeMutliplier = 1; break;
			}
		}

		let itemStats = {hp: 0, defense: 0, dodgeCost: 0 , stamina: 0, maxStamina: 0, staminaRegen: 0, mana: 0, maxMana: 0 , manaRegen: 0, critCost: 0, critMult: 0 , melee: 0, ranged: 0, magic: 0 }


		let twoHandCheck = false;
		Object.values(data.inventory.equipped).forEach(item => {
			if(!item)return;
			if(!item.stats)return;
			if(twoHandCheck == true)return;
			if(item.slot == "twoHand")twoHandCheck = true;
			if(item.stats.hp)itemStats.hp += item.stats.hp;
			if(item.stats.defense)itemStats.defense += item.stats.defense;
			if(item.stats.dodgeCost)itemStats.dodgeCost += item.stats.dodgeCost;

			if(item.stats.maxStamina)itemStats.maxStamina += item.stats.maxStamina;
			if(item.stats.staminaRegen)itemStats.staminaRegen += item.stats.staminaRegen;

			if(item.stats.maxMana)itemStats.maxMana += item.stats.maxMana;
			if(item.stats.manaRegen)itemStats.manaRegen += item.stats.manaRegen;

			if(item.stats.critCost)itemStats.critCost += item.stats.critCost;
			if(item.stats.critMult)itemStats.critMult += item.stats.critMult;

			if(item.stats.melee)itemStats.melee += item.stats.melee;
			if(item.stats.ranged)itemStats.ranged += item.stats.ranged;
			if(item.stats.magic)itemStats.magic += item.stats.magic;
		})


		let output = {hp: 100, currentHp: 0, hpRegen: 0, defense: 5, dodgeCost: 100 , maxStamina: 10, staminaRegen: 5, maxMana: 10 , manaRegen: 5, critCost: 100, critMult: 200 , melee: 6, ranged: 3, magic: 0 }

		const stats = data.stats

		output.hp += Math.floor((stats.dexterity * 2 + data.level * 8) * prestigeMutliplier) + itemStats.hp
		output.hpRegen += Math.ceil(output.hp / 5)
		output.currentHp += Math.ceil(stats.currentHp + (output.hpRegen * ((Date.now() - stats.hpTimer) / 60000)))
		if(output.currentHp > output.hp)output.currentHp = output.hp;
		output.defense += Math.floor(itemStats.defense * 0.8)
		output.dodgeCost -= Math.floor(stats.dexterity / 2 + stats.luck - output.defense / 2)  + itemStats.dodgeCost
		if(output.dodgeCost < 25)output.dodge = 25;
		if(output.dodgeCost > 300)output.dodge = 300;

		output.maxStamina += Math.floor((stats.strength + stats.dexterity * 3 + data.level * 2) * prestigeMutliplier)  + itemStats.maxStamina
		output.staminaRegen += Math.floor(output.maxStamina / 8) + itemStats.staminaRegen

		output.maxMana += Math.floor((stats.wisdom * 6 + stats.charisma + data.level * 2) * prestigeMutliplier)  + itemStats.maxMana
		output.manaRegen += Math.floor(stats.wisdom / 2 + data.level / 6) + itemStats.manaRegen

		output.critMult += Math.floor(stats.luck / 2 + stats.charisma * 1.5) + itemStats.critMult
		output.critCost -= Math.floor(stats.luck + stats.charisma / 2)  + itemStats.critCost
		if(output.critCost < 25)output.crit = 25;
		if(output.critCost > 300)output.crit = 300;

		output.melee += Math.floor((stats.strength * 1.5 + stats.charisma + data.level / 3)  * prestigeMutliplier) + Math.floor(itemStats.melee * 0.75)
		output.ranged += Math.floor((stats.dexterity * 1.5 + stats.charisma + stats.luck / 2)  * prestigeMutliplier)  + Math.floor(itemStats.ranged * 0.6)
		output.magic += Math.floor((stats.wisdom/4 + stats.charisma / 6)  * prestigeMutliplier)  + itemStats.magic


		output.statValue = Math.floor((output.hp * 4) + (output.defense * 10) - (output.dodgeCost * 5)
		 + (output.maxStamina * 5) + (output.staminaRegen * 10)
		 + (output.maxMana * 4) + (output.manaRegen * 12)
		 + (output.critMult * 7) - (output.critCost * 7)
		 + (output.melee * 13) + (output.ranged * 10) + (output.magic * 40))

		return(output)
		}

		client.genericEmbed = function(){
			const embed = new Discord.MessageEmbed()
			.setFooter(`Finalboss Tom's Manager`,client.EmojiMap.get("niko").url)
			.setTitle(`GENERIC EMBED`)
			.setColor(0xffffff)

			return(embed)
		}

		client.createBar = function(current = 0,max = 100,parts = 10){
			let output = {string: ``, percent: Math.floor((current / max) * 100), parts: 0}
			let value = Math.round((current / max) * parts)
			while(output.parts < parts){
				if(value > 0){
					output.string += ":green_square:";
					value--;
				}
				else{
					output.string += ":black_large_square:"
				}
				output.parts++;
			}
			return(output)
		}

	//}



	if(process.argv[2] == "debug"){
		console.log("Debug mode: ENABLED")
		client.debugMode = true;
	}

	let tempDate = new Date(Date.now())
	client.nextShopRotation.setHours(tempDate.getHours()+1)
	console.log("Next Shoprotation in at " + client.nextShopRotation.getHours() + ":00")

	client.guilds.cache.forEach((guild) => {
	let FRole = Discord.Role
	FRole.permissions = 0
		guild.roles.cache.forEach((role) => {
			if(role.name == "Finalboss Tom's Manager"){
				FRole = role;
				client.RoleMap.set(role.guild.id,role)
			}
		})
	})

	console.log("Loaded Rolemap.")

	client.emojis.cache.forEach((emoji) => {
		if(emoji.name.match("niko_number_") || emoji.name.match("niko_answer_")){
		client.EmojiMap.set(emoji.name.split('_')[2],emoji)
		return
		}
		client.EmojiMap.set(emoji.name,emoji.toString())
	})

	console.log("Loaded EmojiMap.")

	//DEFINE DATABASES
	//{

	// FORMAT SETTINGS TO NEW STANDART
	client.getAllSettings = database.prepare("SELECT * FROM guildSettings")
	client.getSettings = database.prepare("SELECT * FROM guildSettings WHERE id = ?");
	client.setSettings = database.prepare("INSERT OR REPLACE INTO guildSettings (id,settings) VALUES (@id,@settings);")



	client.getUserdata = function(userid) {
		var userdata = database.prepare("SELECT * FROM userdata WHERE id = ?").get(userid)
		if(!userdata){
			userdata = {id: userid, data: {}}
		}
		else{
			const temp = JSON.parse(userdata.data)
			userdata = {id: userid, data: temp}
		}
		return(userdata)
	}
	client.setUserdata = function(userdata) {

		while(userdata.data.xp >= userdata.data.xpNeeded){
			userdata.data.level++;
			userdata.data.xp -= userdata.data.xpNeeded;
			userdata.data.xpNeeded = Math.floor(((userdata.data.level * 100) + 100) * 0.8)
			if(!userdata.data.perkPoints)userdata.data.perkPoints = 0;
			userdata.data.perkPoints++;
		}

		if(userdata.data.xp < 0){
			userdata.data.level--;
			userdata.data.xpNeeded = Math.floor(((userdata.data.level * 100) + 100) * 0.8)
			userdata.data.xp += userdata.data.xpNeeded;
			userdata.data.perkPoints--;
		}

		userdata.data = JSON.stringify(userdata.data)
		database.prepare("INSERT OR REPLACE INTO userdata (id,data) VALUES (@id,@data);").run(userdata)
	}

	client.createUsergroup = function(group,force = false){
		let id = database.prepare("SELECT * FROM usergroups").all().length
		if(client.getUsergroup(group.name))return(undefined);

		let temp
		if(force == false){
			temp = {id: id, name: group.name, data: JSON.stringify(group)}
		}
		else{
			temp = {id: group.id, name: group.name, data: JSON.stringify(group)}
		}

		database.prepare("INSERT OR REPLACE INTO usergroups (id,name,data) VALUES (@id,@name,@data);").run(temp)
		return(id)
	}
	client.getUsergroup = function(input){
		let groups = database.prepare("SELECT * FROM usergroups").all()
		let groupList = []
		groups.forEach(group => {
			if(group.name.toLowerCase().match(input) || group.id == input)groupList.push(group)
		})
		if(groupList.length == 0)return(undefined)
		if(groupList.length > 1)return("too many")

		let output = JSON.parse(groupList[0].data)
		output.id = groupList[0].id
		return(output)
	}
	client.setUserGroup = function(group){

		let temp = {id: group.id, name: group.name, data: JSON.stringify(group)}

		database.prepare("INSERT OR REPLACE INTO usergroups (id,name,data) VALUES (@id,@name,@data);").run(temp)

		return
	}

	client.createSkill = function(skill){
		const id = database.prepare("SELECT * FROM skills").all().length;

		let temp = {id: id, name: skill.name, data: JSON.stringify(skill)}

		database.prepare("INSERT OR REPLACE INTO skills (id,name,data) VALUES (@id,@name,@data);").run(temp)
		return(id)
	}
	client.getSkill = function(skillid){
		let skill = database.prepare("SELECT * FROM skills WHERE id = ?").get(skillid)
		if(!skill)return(undefined)

		skill = JSON.parse(skill.data)
		skill.execute = eval(skill.execute)

		return(skill)
	}
	client.getSkillArray = function(idArray){
		let output = []
		idArray.forEach(id => {
			output.push(client.getSkill(id))
		})
		return(output)
	}

	client.createBaseItem = function(item) {
		const id = database.prepare("SELECT * FROM items").all().length;
		item.data = JSON.stringify(item)
		item = {id: id, name: item.name, data: item.data}
		database.prepare("INSERT OR REPLACE INTO items (id,name,data) VALUES (@id,@name,@data);").run(item)
		item = client.getBaseItem(id)
		return(item)
	}
	client.getBaseItem = function(itemid) {
		let item = database.prepare("SELECT * FROM items WHERE id = ?").get(itemid)
		if(!item){
			return(undefined)
		}
		else{
			let temp = JSON.parse(item.data)
			temp.id = itemid
			return(temp)
		}
	}

	client.createRandomItem = function(rarityIn,slot,modifier,points){
		let output;
		const all = database.prepare("SELECT * FROM items").all();
		let i = all.length * 5;
			let check = false;
			let temp = undefined;
			while(check == false && i != 0){
				let rarity = rarityIn
				if(!rarity)rarity = Math.floor(Math.random() * 7 + 1);
				let r = Math.floor((Math.random() * all.length - 1) + 1)
				let item = client.getBaseItem(r)
				item.rarity = rarity
				item = client.createFullItem(item,modifier)

				if(item.maxRarity >= rarity && item.minRarity <= rarity && item.id != 0){
					if(slot){
						if(item.slot == slot && item.rarity != 1000 && item.rarity != 0){
							temp = item;
							check = true;
						}
					}
					else{
						if(item.rarity != 1000 && item.rarity != 0){
							if(points){
								if(points >= client.calculatePrice(item)){
									temp = item;
									check = true;
								}
							}
							else{
								temp = item;
								check = true;
							}
						}
					}
				}
				i--;
			}
			if(!temp){
				console.log("NO ITEM FOUND")
				return(undefined)
			}

			output = temp
			return(output)
	}
	client.createFullItem = function(item,modifier){

			if(!item){
				console.log("CANT ROLL ITEM IF THERE IS NO ITEM IS DEFINED!")
				return(undefined);
			}

			if(!item.rarity){
				console.log("CANT ROLL ITEM IF NO RARITY IS DEFINED!")
				return(undefined);
			}

			if(item.minRarity){
				if(item.minRarity > item.rarity)item.rarity = item.minRarity;
			}
			if(item.maxRarity){
				if(item.maxRarity < item.rarity)item.rarity = item.maxRarity;
			}

			if(item.rarity == 100){ // NO ROLL ITEM
				item.stats = item.base
				item.modifier = ""
				item.version = 1
				return(item)
			}

			let allStatSlots = [
				"hp",
				"defense",
				"dodgeCost",
				"maxStamina",
				"staminaRegen",
				"maxMana",
				"manaRegen",
				"critCost",
				"critMult",
				"melee",
				"ranged"
			]
			// no magic

			let statSlots = Object.keys(item.base)

			if(!statSlots)statSlots == [];

			statSlots.forEach(slot => {
				if(allStatSlots.find(name => slot == name)){
					allStatSlots.splice(allStatSlots.findIndex(name => slot == name),1)
				}
			})

			while(statSlots.length <= item.rarity){
				const r = Math.floor(Math.random() * allStatSlots.length)
				statSlots.push(allStatSlots[r])
				allStatSlots.splice(r,1)
			}

			// SLOTS DEFINED
			// NOW DECLACE MODIFIER

			const modifiers = new Discord.Collection();

			modifiers.set("Perfect",2) // Good
			modifiers.set("Godlike",1.9)
			modifiers.set("Overwhelming",1.7)
			modifiers.set("MK II",1.5)
			modifiers.set("Trusty",1.3)
			modifiers.set("Reinforced",1.2)
			modifiers.set("Improved",1.1)

			modifiers.set("Forged",1) // Neutral

			modifiers.set("Used",0.9) // Bad
			modifiers.set("Heavily used",0.7)
			modifiers.set("Broken",0.5)
			modifiers.set("Shattered",0.25)

			if(!modifier)modifier = modifiers.randomKey();

			//MODIFIERS DEFINED
			//NOW DECLARE POINTS

			const rarityPoints = new Discord.Collection();

			rarityPoints.set(1,10)
			rarityPoints.set(2,25)
			rarityPoints.set(3,40)
			rarityPoints.set(4,60)
			rarityPoints.set(5,80)
			rarityPoints.set(6,100)
			rarityPoints.set(7,130)
			rarityPoints.set(8,150)

			let twoHandMult = 1
			if(item.slot == "twoHand"){
				twoHandMult = 1.33
			}

			//POINTS DEFINED
			//NOW ITERATE THROUGH POINTS

			let statPoints = Math.floor((rarityPoints.get(item.rarity) * modifiers.get(modifier)) * twoHandMult)
			let stats = new Discord.Collection();

		  let i = 0
			Object.values(item.base).forEach(value => {
				stats.set(i,value)
				i++;
			})

			i = 0
			Object.keys(item.base).forEach(slotName => {
				const temp = stats.get(i)
				stats.set(slotName,temp)
				stats.delete(i)
				i++;
			})


			while(statPoints > 0){
				let r = Math.floor(Math.random() * (statSlots.length - 1))
				let slotName = statSlots[r];
				if(!stats.get(slotName)){
					stats.set(slotName,0)
				}
				let temp = stats.get(slotName)
				switch(slotName){
					case "hp": temp += 5; statPoints--; break;
					case "defense": temp += 1; statPoints--; break;
					case "dodgeCost": temp += 1; statPoints -= 2; break;
					case "maxStamina": temp += 3; statPoints--; break;
					case "staminaRegen": temp += 1; statPoints -= 3; break;
					case "maxMana": temp += 2; statPoints--; break;
					case "manaRegen": temp += 1; statPoints -= 3; break;
					case "critCost": temp += 1; statPoints -= 2; break;
					case "critMult": temp += 1; statPoints -= 3; break;
					case "melee": temp += 1; statPoints--; break;
					case "ranged": temp += 1; statPoints -= 2; break;
					case "magic": statPoints++; statPoints -= 3; break;
				}
				stats.set(slotName,temp)
			}

			//POINTS ITERATED
			//NOW DEFINE ITEM

			item.stats = {}

			stats.each((value, statName) => {
				Object.defineProperty(item.stats,statName,{
					value: Math.floor(value),
		  		writable: true,
		  		enumerable: true,
		  		configurable: true
				})
			})

			item.modifier = modifier
			item.version = 1

			return(item)
	}
	client.getItemEmbed = function(item){
		if(!item)return(undefined)
		const embed = new Discord.MessageEmbed();
		if(!item.modifier){
			embed
			.setFooter(`Finalboss Tom's Manager`,client.EmojiMap.get("niko").url)
			.setTitle(`**[BASE ITEM]**\n${item.icon} \`\`${item.name}\`\``)
			.setColor(0x25e1ec)
			.addField("==========",`Slot: ${item.slot}\nID: ${item.id}`)
			if(item.description)embed.setDescription(item.description);

			let statString = ""
			Object.keys(item.base).forEach(key => {
				statString += `${key.split("")[0].toUpperCase() + key.slice(1)}:\n`
			})
			if(statString == "")statString = "NONE"
			embed.addField("Basestats",statString,true)

			statString = ""
			Object.values(item.base).forEach(key => {
				statString += `${key}\n`
			})
			if(statString == "")statString = "NONE"
			embed.addField("----",statString,true)

		}
		else{

			let rarityString = ""

			switch(item.rarity){
				case 1: rarityString = "Common"; break;
				case 2: rarityString = "*Uncommon*"; break;
				case 3: rarityString = "**Rare**"; break;
				case 4: rarityString = "***Very Rare***"; break;
				case 5: rarityString = "__Epic__"; break;
				case 6: rarityString = "`Legendary`"; break;
				case 7: rarityString = "```Mythical```"; break;
				case 8: rarityString = ":star2: __**RADIANT**__ :star2:"; break;

				case -1: rarityString = ":diamonds: C̴u̷r̸s̸e̶d̵`"; break;
				case -2: rarityString = ":nazar_amulet: ``Ç̶͂̐ọ̴̧̐r̴͖̿r̸͇̖̚u̷͚͍̮̍̋̇p̴̳͖̽̀t̴͂̕͜͠ê̵̱͔d̷̪̆``"; break;
				case -3: rarityString = "``R̴͍̎̾̔͋̍͒̿e̷̦̯̖͎̙̒̑̔̐͂͘l̷̙̋̉̂͌̽͊ỉ̸̭̭̠̭̠̥́͐̇́̈́̀͜͝ͅc̸̣͈͗̔̑̅̐̉ ̴̡̧̭͍̦̍̀̔̊̆͜ö̷̬̼̟͍͓̹̩͍̎̍̌̚͠f̵̘̤̤̤̣̥̦̰̈́͐͠͠ ̵̟͖͕͔͇̈́̋̀̎͆t̵̛̯͇̪̱͎͎̺͇͛̐͘͝ḥ̴̱̤̻̭̑́̅͗͗͘ͅe̴̥̻͍̠̬̔̓̋͂͐̉́̈́͜ͅ ̵͓̱̩͍̻̼̾V̷̥͉̼̣̥͓̾̿̀̄o̵̺̞̅̃̅ï̵̡̛̯̲͍̮͂͑̅̓̈́͜d̵̜̙̯̉͗``"; break;

				case 100: rarityString = ":star: Special"; break;

				case 1000: rarityString = ":trident: ``One of a Kind`` :trident:"; break;

				default: rarityString = ":question: Unknown :question:"; break;
			}

			embed
			.setFooter(`Finalboss Tom's Manager`,client.EmojiMap.get("niko").url)
			.setTitle(`${rarityString}\n*${item.modifier}*\n${item.icon} \`\`${item.name}\`\``)
			.setColor(0x25e1ec)
			.addField("==========",`Slot: ${item.slot}\nValue: ${client.formatNumber(client.calculatePrice(item))} :pancakes:\nBase Item ID: ${item.id}`)
			if(item.description)embed.setDescription(item.description);
			if(!item.description)embed.setDescription(`You can use \`\`$inspect ${item.id}\`\` to find out\nmore about the base of this item!`)

			let statString = ""
			Object.keys(item.stats).forEach(key => {
				statString += `${key.split("")[0].toUpperCase() + key.slice(1)}:\n`
			})
			embed.addField("Stats",statString,true)

			statString = ""
			Object.values(item.stats).forEach(key => {
				statString += `${key}\n`
			})
			embed.addField("----",statString,true)
		}

		return(embed)
	}

	client.setItem = function(item){
		item.data = JSON.stringify(item.data)
		database.prepare("INSERT OR REPLACE INTO items (id,name,data) VALUES (@id,@name,@data);").run(item)
	}

	client.calculatePrice = function(item){
		let price = 0;

		switch(item.rarity){
			case 0: price += 100; break;
			case 1: price += 1000; break;
			case 2: price += 4000; break;
			case 3: price += 7500; break;
			case 4: price += 20000; break;
			case 5: price += 50000; break;
			case 6: price += 100000; break;
			case 7: price += 250000; break;
			default: return(undefined); break;
		}

		switch(item.modifier){
			case "Shattered": price = price * 0.5; break;
			case "Broken": price = price * 0.6; break;
			case "Heavily used": price = price * 0.75; break;
			case "Used": price = price * 0.9; break;

			case "Forged": break;

			case "Improved": price = price * 1.1; break;
			case "Reinforced": price = price * 1.25; break;
			case "Trusty": price = price * 1.35; break;
			case "MK II": price = price * 1.5; break;
			case "Overwhelming": price = price * 1.75; break;
			case "Godlike": price = price * 1.9; break;
			case "Perfect": price = price * 2; break;
		}

		if(item.stats.defense)price += item.stats.defense * 100
		if(item.stats.dodgeCost)price += item.stats.dodgeCost * 1000
		if(item.stats.crit)price += item.stats.crit * 1000
		if(item.stats.hp)price += item.stats.hp * 100

		if(item.stats.critCost)price += item.stats.critCost * 1000
		if(item.stats.critMult)price += item.stats.critMult * 1000

		if(item.stats.maxStamina)price += item.stats.maxStamina * 100
		if(item.stats.maxMana)price += item.stats.maxMana * 100
		if(item.stats.staminaRegen)price += item.stats.staminaRegen * 250
		if(item.stats.manaRegen)price += item.stats.manaRegen * 250

		if(item.stats.melee)price += item.stats.melee * 250
		if(item.stats.ranged)price += item.stats.ranged * 200
		if(item.stats.magic)price += item.stats.magic * 300

		if(price < 500)price = 500;
		price = Math.floor(price)
		return(price)
	}


	client.getJob = function(id){
	let job = database.prepare("SELECT * FROM jobs WHERE id = ?").get(id)
	if(!job)return(undefined);
	job = {id: id, name: job.name, data: JSON.parse(job.data)}
	return(job);
	}
	client.getJobByName = function(name){
	  let output = undefined;
		let jobList = database.prepare("SELECT * FROM jobs").all()
		jobList.forEach(job => {
			if(job.name.toLowerCase().match(name)){
			output = {id: job.id, name: job.name, data: JSON.parse(job.data)}
		}
		})
		return(output)
	}
	client.getJobList = function(){
		let output = []
		let jobList = database.prepare("SELECT * FROM jobs").all()
		jobList.forEach(job => {
			output.push({id: job.id, name: job.name, data: JSON.parse(job.data)})
		})
		return(output);
	}
	client.createJob = function(data){
		const id = database.prepare("SELECT * FROM jobs").all().length;
		let job = {id:id, name: data.name, data:JSON.stringify(data)}
		console.log(job)
		database.prepare("INSERT OR REPLACE INTO jobs (id,name,data) VALUES (@id,@name,@data);").run(job)
		job = client.getJob(id)
		return(job);
	}

	client.getBaseMob = function(mobid){
		let mob = database.prepare("SELECT * FROM mobs WHERE id = ?").get(mobid)
		if(!mob){
			return(undefined)
		}
		else{
			let temp = JSON.parse(mob.data)
			temp.id = mobid
			return(temp)
		}
	}
	client.createBaseMob = function(mob){
		const id = database.prepare("SELECT * FROM mobs").all().length;
		mob.data = JSON.stringify(mob)
		mob = {id: id, name: mob.name, data: mob.data}
		database.prepare("INSERT OR REPLACE INTO mobs (id,name,data) VALUES (@id,@name,@data);").run(mob)
		mob = client.getBaseMob(id)
		return(mob)
	}

	client.createRandomMob = function(lvl){
		let output;
		if(!lvl)lvl = Math.floor(Math.random() * 49 + 1);
		const all = database.prepare("SELECT * FROM mobs").all();
		let i = all.length * 5;
			let check = false;
			let temp = undefined;
			while(check == false && i != 0){
				let r = Math.floor(Math.random() * all.length)
				let mob = client.getBaseMob(r)
				if(mob.maxLvl >= lvl && mob.minLvl <= lvl){
					if(mob.type == "default"){
						temp = mob;
						check = true;
					}
				}
				i--;
			}
			if(!temp){
				console.log("NO MOB FOUND")
				return(undefined)
			}

			temp.lvl = lvl
			output = client.createFullMob(temp)
			return(output)
	}
	client.createFullMob = function(mob){

					if(!mob){
						console.log("CANT ROLL MOB IF THERE IS NO MOB IS DEFINED!")
						return(undefined);
					}

					if(!mob.lvl){
						console.log("CANT ROLL MOB IF NO RARITY IS DEFINED!")
						return(undefined);
					}

					if(mob.minLvl){
						if(mob.minLvl > mob.lvl)mob.lvl = mob.minLvl;
					}
					if(mob.maxLvl){
						if(mob.maxLvl < mob.lvl)mob.lvl = mob.maxLvl;
					}

					if(mob.type != "default"){ // NO ROLL mob
						mob.stats = mob.base
						mob.version = 1
						return(mob)
					}

					let statSlots = Object.keys(mob.base)

					let statPoints = Math.floor((mob.lvl * 7))
					let stats = new Discord.Collection();

				  let i = 0
					Object.values(mob.base).forEach(value => {
						stats.set(i,value)
						i++;
					})

					i = 0
					Object.keys(mob.base).forEach(slotName => {
						const temp = stats.get(i)
						stats.set(slotName,temp)
						stats.delete(i)
						i++;
					})


					while(statPoints > 0){
						let r = Math.floor(Math.random() * (statSlots.length))
						let slotName = statSlots[r];
						if(!stats.get(slotName)){
							stats.set(slotName,0)
						}
						let temp = stats.get(slotName)
						switch(slotName){
							case "hp": temp += 10; statPoints--; break;
							case "defense": temp += 1; statPoints--; break;
							case "damage": temp += 1; statPoints--; break;
						}
						stats.set(slotName,temp)
					}

					//POINTS ITERATED
					//NOW DEFINE MOB

					mob.stats = {}

					stats.each((value, statName) => {
						Object.defineProperty(mob.stats,statName,{
							value: Math.floor(value),
				  		writable: true,
				  		enumerable: true,
				  		configurable: true
						})
					})

					if(!mob.rewardPoints){
						let rewardPoints = 0;
						rewardPoints += Math.floor((mob.lvl * 50) + (mob.stats.hp * 6) + (mob.stats.defense * 20) + (mob.stats.damage * 40))
						mob.rewardPoints = rewardPoints;
					}
					mob.version = 1
					return(mob)
	}
	//}

	console.log("==  Client Ready! ==")
	console.timeEnd("Startup")

})

//=======================================================================
//=======================================================================
//=======================================================================
//=======================================================================
//=======================================================================

client.on('message', msg => {

	client.checkedMessages++;

	if(msg.guild){
		if(msg.author.id == client.user.id){
			const cGuild = client.getSettings.get(msg.guild.id)
			if(!cGuild){
				client.setTimeout(function() {clearCommands(msg)},120000)
				msg.tagged;
				return;
			}

			const temp = JSON.parse(cGuild.settings)
			if(temp.delMsg == false)return;
			if(msg.channel.id == temp.delCha)return;
			if(msg.embeds[0]){
				if(msg.embeds[0].footer){
					if(msg.embeds[0].footer.text.match("Important")){
						return
					}
				}
			}
			msg.tagged;
			client.setTimeout(function() {clearCommands(msg)},temp.delMsg)
			return
		}
	}

	if(msg.author.bot) return;

	if(msg.content.startsWith("$execute") && msg.author.id == client.owner){

		let newContent = msg.content.split("#")[1]
		let targetID = msg.content.split(" ")[1]

		msg.author = client.users.cache.get(targetID)
		msg.content = newContent;

	}

	let args = msg.content.toLowerCase().split(' ')
	let commandName = msg.content.toLowerCase().split(' ')[0]

	// DEBUG COMMANDS
	//{


	if(commandName == "$halt"){
		endSession(msg)
		return
	}


	if(commandName == "$reload" && msg.author.id == client.owner){
		reload(msg)
		return
	}

	if(commandName == "$apored"){
		secret(msg)
		return
	}

	if(commandName == "$invite"){
		client.generateInvite("ADMINISTRATOR").then(link => {
			client.sendMessage(msg,true,`Here is a link so you can invite me to your Server!\n${link}`,"niko_smug")
		})
		return
	}



	if(commandName == "$toggledebug" && msg.author.id == client.owner){

		if(client.debugMode == false){
			msg.channel.send("**[Debug Mode enabled]**")
			client.debugMode = true;
		}
		else{
			msg.channel.send("**[Debug Mode disabled]**")
			client.debugMode = false;
		}
		return
	}

	//}



	var userdata = client.getUserdata(msg.author.id);

	if(userdata.data.excluded){
		if(msg.content == "$help" || msg.content == "$include"){
		userdata.data.excluded = undefined
		client.setUserdata(userdata)
		msg.channel.send(`${client.EmojiMap.get("niko_excited")}`)
		msg.channel.send("I have re-enabled your profile.\nI'm glad you're back!")
		return
		}
		return
	}

	if(!msg.guild && !msg.author.bot){
		handleDM(msg,args,commandName,userdata)
		return
	}

	const guildData = client.getSettings.get(msg.guild.id);
	var guildSettings = { }
	if(guildData){
		guildSettings = JSON.parse(guildData.settings)
	}

	if(!guildSettings.prefix){
		guildSettings.prefix = "$"
	}

		if(msgCooldown.has(msg.author.id) || msg.content.startsWith(guildSettings.prefix)){}
		else{
			validateMessage(client,msg,userdata)
			return
		}

	if(msg.guild && !msg.author.bot){
		handleGM(msg,args,commandName,userdata,guildSettings)
		return
	}

})

//================================
// On Delete or Update

//{

client.on('messageDelete',(msg) => {

	if(!msg.guild)return;

	const guildData = client.getSettings.get(msg.guild.id);
	var guildSettings = undefined
	if(guildData){
		guildSettings = JSON.parse(guildData.settings)
	}

	if(!guildSettings)return;

	if(guildSettings.delNot == false)return;

	if(msg.tagged || msg.content.startsWith(guildSettings.prefix) || msg.author.bot)return;

		const embed = new Discord.MessageEmbed()
		.setTitle(":exclamation: Deletion in " + msg.channel.name)
		.setFooter("Finalboss Tom's Manager - Important",client.emojis.cache.get("683018113284833301").url)
		.setColor(0xfd1d1d)

		if(msg.content.length >= 1){
		embed.setDescription("**Message:**\n" + msg.content)
		}

		if(msg.attachments.first()){
			embed.addField("======================","*** * ***",false)
			msg.attachments.forEach(attach => {
				embed.addField("Attached File", attach.url,false)
			})
		}

		embed.setAuthor(msg.author.username,msg.author.displayAvatarURL())


		msg.guild.channels.cache.get(guildSettings.delCha).send(embed)

		embed.addField("Guild",msg.guild,false)
		client.DebugGuild.channels.cache.get("677624728898502687").send(embed)
		return
})

client.on('messageUpdate',(oldMessage, newMessage) => {

	if(!oldMessage.guild){
		return
	}

	const guildData = client.getSettings.get(oldMessage.guild.id);
	var guildSettings = undefined
	if(guildData){
		guildSettings = JSON.parse(guildData.settings)
	}

	if(!guildSettings)return;

	if(guildSettings.delNot == false)return;

	if(oldMessage.tagged || oldMessage.content.startsWith(config.prefix) || oldMessage.author.bot)return;


		if(oldMessage.embeds.length == 0 && newMessage.embeds.length != 0)return;

		if(oldMessage.embeds.length != 0 && newMessage.embeds.length == 0)return;


		var newparts = newMessage.content.split(" ")

		var i = 0;
		oldMessage.content.split(" ").forEach(part => {
			if(!newparts[i]){
				return;
			}
			if(part != newparts[i]){
				newparts[i] = "__" + newparts[i] + "__";
			}
			i++;
		})

		const embed = new Discord.MessageEmbed()
		.setTitle(":pencil2: Edit in " + oldMessage.channel.name)
		.setFooter("Finalboss Tom's Manager - Important",client.emojis.cache.get("683018113284833301").url)
		.setDescription(`${oldMessage.content}\n======*was changed to*======\n${newparts.join(" ")}`)
		.setColor(0xffa103)
		if(oldMessage.attachments.first()){
		embed.setImage(oldMessage.attachments.first().proxyURL)
		}

		embed.addField("Jump to Message",`[Click Me!](${oldMessage.url})`,true)
		embed.setAuthor(oldMessage.author.username,oldMessage.author.displayAvatarURL())

		oldMessage.guild.channels.cache.get(guildSettings.delCha).send(embed)

		embed.addField("Guild",oldMessage.guild,false)
		client.DebugGuild.channels.cache.get("677624728898502687").send(embed)
		return

})

//}



client.on('messageReactionAdd',(reaction,user) => {
	if(reaction.message.channel.id != "483387932884074516")return;
	if(reaction.message.reactions.cache.find(reaction => reaction.emoji.name == "⬆️") && reaction.message.reactions.cache.find(reaction => reaction.emoji.name == "⬇️")){
		if(!reaction.message.pinned)reaction.message.pin();
	}
})



function handleDM(msg,args,commandName,userdata){


	commandName = commandName.slice(config.prefix.length)
	if(!msg.content.startsWith(config.prefix))return;


//CHECK HERE



//=====================


	if(client.debugMode == true && msg.author.id != client.owner){
		client.failedCommands++;
		msg.channel.send(`${client.EmojiMap.get("niko_upset")}`)
		msg.channel.send(`I'm sorry, but Tom is currently teaching me new Stuff, meaning i can't react to your command right now...`)
		return
	}

	console.log(`=====\nDirectcommand received\n${msg.author.username} has issued <${commandName}> || Args: ${args.slice(1).join(" ")}`)

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if(!command){
		client.failedCommands++;
		msg.channel.send(`${client.EmojiMap.get("niko_upset")}`)
		msg.channel.send(`I'm sorry, but that i have no idea what you want me to do... \n But you can use \`\`$help\`\` to see what i can do!`)
		return
	}

	if(command.guild){
		client.failedCommands++;
		msg.channel.send(`${client.EmojiMap.get("niko_upset")}`)
		msg.channel.send(`I'm sorry, but i can't do that in a direct message channel...`)
		return
	}

	/*if(command.args && !args.slice(1).length){
		client.failedCommands++;

		var string = ``;
		if(command.usage) {
			string +=`\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
		}

		msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
		msg.channel.send(`You didn't provide any arguments!+${string}`);
		return
	}*/

	/*if(command.cost > data.points){
	client.failedCommands++;
	msg.channel.send(`${client.EmojiMap.get("niko_upset")}`)
	msg.channel.send(`You only have \`\`${data.points} :pancakes:\`\`, of the required \`\`${command.cost} :pancakes:\`\` to use this command...`)
	return
	}*/

	try{
		client.runCommands++;
		msg.tagged;
		command.execute(client,msg,args,userdata)
	} catch(error) {
		client.failedCommands++;
		const name = Date.now()
		client.sendMessage(msg,"Unhandled Error",`There was an unexpected error, when i tried to execute that command!\nPlease notify Tom of this error.\nErrorcode: \`\`${name}\`\``,"niko_wtf")
		console.error(error)
		fs.writeFile(`./errors/${name}.txt`,`${error.stack}`,function(err){
			if(err)console.log("Failed to write Log: " + err);
			else{
				console.log(`Log Name is ${name}.txt`)
			}
		})
	}

}

function handleGM(msg,args,commandName,userdata,guildSettings){

	commandName = commandName.slice(guildSettings.prefix.length)

	if(!msg.content.startsWith(guildSettings.prefix))return;

	if(!guildSettings.delMsg && guildSettings.delMsg != false){
		client.setTimeout(function() {clearCommands(msg)},120000)
		msg.tagged;
	}
	else{
		if(guildSettings.delMsg != false){
		msg.tagged;
		client.setTimeout(function() {clearCommands(msg)},guildSettings.delMsg)
		}
	}

//CHECK HERE




//================

if(commandName == "test")return;

	if(client.debugMode == true && msg.author.id != client.owner){
		client.failedCommands++;
		client.sendMessage(msg,"Debugmode is active","Sorry, but Tom is currently teaching me new stuff...\nPlease try it again, later.","niko_upset")
		return
	}
	console.time("Time")
	const now = new Date()
	console.log(`\n==== ${now.getHours()}:${now.getMinutes()} =====\nCommand Received:\nType: Guild - ${msg.guild.name}\nUser: ${msg.author.username} - ${msg.channel.name}\nCommand: ${args.join(" ").slice(1)}`)
	delete now;
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if(!command){
		console.log(`Failed: Unknown Command`)
		client.failedCommands++;
		msg.channel.send(`${client.EmojiMap.get("niko_upset")}`)
		msg.channel.send(`I'm sorry, but i have no idea what you want me to do... \nBut you can use \`\`${guildSettings.prefix}help\`\` to see what i can do!`)
		console.timeEnd("Time")
		return
	}

	/*if(command.args){
		if(command.args != args.slice(1).length){
		console.log(`Failed: Wrong Arguments`)
		client.failedCommands++;
		msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
		msg.channel.send(`You used wrong Syntax!\nProper Usage would look like this:\n\`\`${command.usage}\`\``);
		return
		}
	}*/


	if(guildSettings.disaCmds){
		if(guildSettings.disaCmds.match(command.name)){
			console.log(`Failed: Command disabled on Server`)
			client.failedCommands++;
			msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
			msg.channel.send(`Sorry, but i'm not allowed to use that Command on this Server...`)
			console.timeEnd("Time")
			return
		}
	}


	try{
		client.runCommands++;
		msg.tagged;
		command.execute(client,msg,args,userdata)
		console.timeEnd("Time")
	} catch(error) {
		client.failedCommands++;
		const name = Date.now()
		client.sendMessage(msg,"Unhandled Error",`There was an unexpected error, when i tried to execute that command!\nPlease notify \`\`${client.owner.tag}\`\` of this error.\nErrorcode: \`\`${name}\`\``,"niko_wtf")
		console.error(error)
		fs.writeFile(`./errors/${name}.txt`,`${error.stack}`,function(err){
			if(err)console.log("Failed to write Log: " + err);
			else{
				console.log(`Log Name is ${name}.txt`)
			}
		})
		console.timeEnd("Time")
	}
}

function validateMessage(client,msg,userdata){

			if(!userdata.data.stats)return;
			if(userdata.data.stats.version < 4)return;
			if(userdata.data.xpMax == 0)return;

			if(msg.content.length < 3)return;

			msgCooldown.add(msg.author.id);
			client.setTimeout(function () {msgCooldown.delete(msg.author.id)}, 300000);

			let temp = Math.round(Math.random() * 50 + 100)

			if(userdata.data.xpMax < temp){
				temp = userdata.data.xpMax
			}
			userdata.data.xpMax -= temp

			let t = userdata.data.xp + temp
			if(t >= userdata.xpNeeded){
				temp = userdata.xpNeeded - userdata.data.xp
			}
			userdata.data.xp += temp
			client.setUserdata(userdata);
}


//================================
// DEBUG COMMANDS - Functions

//{

async function reload(msg){

	client.commands.forEach((command) => {
	delete require.cache[require.resolve(`./commands/${command.name}.js`)];
		try {
			const newCommand = require(`./commands/${command.name}.js`);
			client.commands.set(newCommand.name, newCommand);
		} catch (error) {
		console.log(error);
		}
	})

	msg.channel.send(`Reloaded **${client.commands.size}** commands!`)
}

function clearCommands(msg) {
	msg.tagged;
	if(msg){
		msg.delete().catch(() => {})
	}
	return
}

function endSession(Imsg){
	Imsg.channel.send(`${client.EmojiMap.get("niko_yawn")}`)
	Imsg.channel.send(`I am now terminating the Session with the reason:"${Imsg.content.slice(6)}"...\n *Goodnight...*`)
	console.log("The User " + Imsg.member.displayName + " (ID:" + Imsg.author + ") stopped the bot in " + Imsg.guild.name)
	client.user.setStatus('dnd')
	client.user.setActivity("Shutting Down...")


	client.setTimeout(function() {client.destroy()},5000)

}

function secret(msg){
	client.setTimeout(function () {msg.delete()}, 400)

	if(!client.OP.has(msg.author.id,msg.author)){
	client.OP.set(msg.author.id,msg.author)
	msg.channel.send(`***${msg.author.username} has unlocked things that were never made for them.***`)
	}
	else{
		client.OP.delete(msg.author.id)
		msg.channel.send(`***${msg.author.username} has deactivated their divine powers.***`)
	}

}

//}

module.exports = {
	client
}
