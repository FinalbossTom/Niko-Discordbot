const Discord = require('discord.js')
const { Permissions } = require('discord.js')

const SQLite = require("better-sqlite3");
const oldDB = new SQLite('./databases/userdata.sqlite');
const database = new SQLite('./databases/database.sqlite');

module.exports = {
	name: 'debug',
	description: 'Don\'t touch this.',
	aliases: ['tester'],
	exclude: true,
	async execute(client,msg,args,userdata) {

		if(args[0] == "$tester"){
			if(msg.guild.id == "676056003220865044"){
				msg.member.roles.add(msg.guild.roles.cache.find(role => role.name == "Tester"))
				client.sendMessage(msg,true,"You are now a **Tester**!","niko_smug")
			}
			else{
				client.sendMessage(msg,"Wrong Guild","You are only able to use this in the Test guild!\nhttps://discord.gg/YGpbfgn","niko_speak")
			}
			return
		}

		if(msg.author != client.owner){
			msg.channel.send("No.")
			return
		}

		if(args[1]){
			if(args[1] == "guild"){
				if(!args[2])return
				switch(args[2]){
					case "members":
					if(!args[3]){
						let output = []
						msg.guild.members.cache.forEach(member => {
							output.push(`${member.user.presence.status} - ${member.user.username}`)
						})
						output.sort()
						console.log(output)
					}
					else{
						let target = msg.guild.members.cache.get(args[3])
						let roles = new Discord.Collection();
						target.roles.cache.forEach(role => {
							roles.set(role.id,role.name)
						})
						console.log({ID: target.id, Name: target.user.username, DisplayedName: target.displayName, RoleIDs: roles, avatarURL: target.user.avatarURL(), permissions: target.permissions.toArray()})
					}
					break;

					case "channels": // UNFINISHED!!!!!!
					if(!args[3]){
						let output = new Discord.Collection()
					  msg.guild.channels.cache.forEach(channel => {
							if(channel.type == "category" && !output.get(channel.id)){
								output.set(channel.id,[])
							}
							else{
								let temp = output.get(channel.parentID)
								if(!temp){
									output.set(channel.parentID,[])
									temp = []
								}
								temp.push({pos: channel.position, name: channel.name})
								output.set(channel.parentID,temp)
							}
						})
						output.forEach(category => {
							category.sort((channel1,channel2) => channel1.pos - channel2.pos)
						})
						console.log(output)
					}
					break;

					case "settings":
					break;

					case "roles":
					if(!args[3]){
						let roles = new Discord.Collection();
						msg.guild.roles.cache.forEach(role => {
							roles.set(role.id,{pos: role.rawPosition, name: role.name})
						})
						roles.sort((role1, role2) => role2.pos - role1.pos)
						console.log(roles)
					}
					else{
						let role = msg.guild.roles.cache.get(args[3])
						let members = []
						role.members.forEach(member => {
							members.push(member.displayName)
						})
						console.log({id: role.id, name: role.name, editable: role.editable, categorised: role.hoist, position: role.rawPosition, members: members, permissions: role.permissions.toArray()})
					}
					break;

					default:
					throw "Not a valid option";
					break;
				}

				return
			}
	}


	let groups = [
		{id: "dbd",name: "Dead by Daylight", owner: client.user.id, description: `This is a public group for **Dead by Daylight**.`, moderators: [], users: [], notify: [], public: true},
		{id: "r6" ,name: "Rainbow Six Siege", owner: client.user.id, description: `This is a public group for **Rainbow Six Siege**.`, moderators: [], users: [], notify: [], public: true},
		{id: "gta",name: "Grand Theft Auto", owner: client.user.id, description: `This is a public group for **Grand Theft Auto**.`, moderators: [], users: [], notify: [], public: true},
		{id: "gmod",name: "Garry's Mod", owner: client.user.id, description: `This is a public group for **Garry's Mod**.`, moderators: [], users: [], notify: [], public: true},
		{id: "mhw",name: "Monster Hunter World", owner: client.user.id, description: `This is a public group for **Monster Hunter World**.`, moderators: [], users: [], notify: [], public: true}
	]



groups.forEach(group => {
	client.createUsergroup(group,true)
})



return;


// JOBS

let jobArray = [
	{
		name: "Adventurer",
		description: "Wander through the lands,\nnever knowing what you could expect!",
		cooldown: 1.44e+7,
		payment: {Risk: "Medium", XP: "High",Pancakes: "Medium-Low", Items: "Rarely"},
		events: [
			{
				type: 950,
				string: "After a long treasure hunt, you finally found the secret hideout of $user1$.\nPiles of Pancakes and other loot were hidden here!",
				users: 1,
				perks: {pancakes: 75000, items: {amount: 2, value:100000}, honor: -2}
			},

			{
				type: 700,
				string: "During your travels, you found $user1$, who was threatened by a monster!\nYou made quick work of it, and were rewarded!",
				users: 1,
				perks: {xp: 800, pancakes: 15000, honor: 1}
			},

			{
				type: 500,
				string: "During your travels, you found a small village.\nThe mayor of the village, named $user1$, told you about a severe rat problem they had.\n*Nothing you wouldn't be able to handle for sure.*",
				users: 1,
				perks: {xp: 600, pancakes: 12000, honor: 2}
			},

			{
				type: 200,
				string: "You found a dungeon in the middle of a Forest and decided to banish all evil from it.\nThe rough battles you fought, brought alot of expirience, but there wasn't really much to loot...",
				users: 0,
				perks: {xp: 700, honor: 1}
			},

			{
				type: 0,
				string: "During sunset, you decided to sit down and enjoy the sunset...",
				users: 0,
				perks: {xp: 300},
				image: "https://p1.pxfuel.com/preview/580/415/799/sunrise-herdecke-morgenrot-skies.jpg"
			},

			{
				type: -300,
				string: "While you were climbing a cliff, you slipped of a rock and fell from a considerable height!\nAfter waking up again you noticed that you lost some of your pancakes...",
				users: 0,
				perks: {pancakes: -3000}
			},

			{
				type: -900,
				string: "During your travels you met $user1$, who you challenged to a duel!\nAfter a rough loss, you lost the bet money...",
				users: 1,
				perks: {pancakes: -7000}
			}
		]
	},


	{
		name: "E-Girl",
		description: "Stream yourself online on different platforms,\nand live from the money of horny virgins.",
		cooldown: 2.88e+7,
		payment: {Risk: "Low",Pancakes: "Medium", Honor: "*Expect it to drop.*"},
		events: [
			{
				type: 950,
				string: "During your stream today, a user named $user1$ donated a HUGE amount of pancakes!\nHe said something about 'wanting to learn more about you in private', but who cares? You're rich!",
				users: 1,
				perks: {pancakes: 150000, honor: -2}
			},

			{
				type: 750,
				string: "You picked a good time today to stream!\nA lot of new people joined as your followers and tons of people donated!",
				users: 0,
				perks: {pancakes: 40000, honor: 1}
			},

			{
				type: 500,
				string: "'A good stream a day, keeps the horny your way!' - Nobody, ever.\n*But you still made alot of pancakes*",
				users: 0,
				perks: {pancakes: 15000}
			},

			{
				type: 300,
				string: "Appearently people really like what they see, so hosting a successfull stream, isn't that hard.\nSome however take your actions really personal...",
				users: 0,
				perks: {pancakes: 10000, honor: -1}
			},

			{
				type: 0,
				string: "Your Stream today went rather alright.\nThere weren't alot of donations, but it could have been worse.",
				users: 0,
				perks: {pancakes: 3000, honor: -1}
			},

			{
				type: -300,
				string: "Due to a bug from the Streaming service, your stream wasn't announced to most of your followers!\n...and you can't really have a good stream without viewers.",
				users: 0,
				perks: {pancakes: 1000}
			},

			{
				type: -900,
				string: "A User named $user1$ exposed a lot of pictures, that you had sold online for 'special purposes'...\nThe Backlash you received from the media was huge!",
				users: 1,
				perks: {honor: -10}
			}
		]
	},

	{
		name: "Broom",
		description: "You are literally just a broom.\nDon't ask me how this works...",
		cooldown: 2.88e+7,
		payment: {Risk: "None",Pancakes: "Low"},
		events: [
			{
				type: 0,
				string: "You are a Broom.\nYou are used to clean the floor.\nNobody really knows, why or how you get paid, but it surely happens.",
				users: 0,
				perks: {pancakes: 3000}
			}
		]
	},



	{
		name: "Cultist",
		description: "Start your own cult and worship whatever you want.\nIf you believe strong enough, they will surely reward you!",
		cooldown: 3.996e+7,
		payment: {Risk: "High", Pancakes: "Very High"},
		events: [
			{
				type: 700,
				string: "After fully commiting in your daily ritual, your Lord recognized your strength and showered you in wealth!",
				users: 0,
				perks: {pancakes: 200000}
			},

			{
				type: 400,
				string: "You were heard!\nYour worshipped Lord seemed to be very happy with your doings and rewarded you handsomely!",
				users: 0,
				perks: {pancakes: 50000}
			},

			{
				type: 0,
				string: "Today seemed to be an odd day...\nYou tried your best to call upon your Lord, but haven't received the smalles answer...\n*Maybe the are asleep or something?*",
				users: 0,
				perks: {}
			},

			{
				type: -200,
				string: "You decided to bring $user1$ to your daily ritual in order to get more members,\n$user1$ however screwed alot of things up and made your Lord very angry!\nThey weren't that angry, but a punishment had to be done.",
				users: 1,
				perks: {pancakes: -10000}
			},

			{
				type: -500,
				string: "*Oh oh...*\n$user1$ heard how you were talking trash about a well respected Lord, who is actually a friend of your Lord!\nEven though you didn't know this, you didn't get away that easily...",
				users: 1,
				perks: {pancakes: -30000}
			}
		]
	},

	{
		name: "Scavenger",
		description: "Like digging through random stuff in the hope of finding something and living at the edge of poverty?",
		cooldown: 1.44e+7,
		payment: {Risk: "Low", Items: "Almost guranteed"},
		events: [

			{
				type: 600,
				string: "With some help of your friend $user1$, you managed to find tons of items today!",
				users: 1,
				perks: {items: {amount: 3, value: 100000}}
			},

			{
				type: 300,
				string: "How lucky!\nYou found something pretty good in some sort of chest that was hidden in a pile of junk.",
				users: 0,
				perks: {items: {amount: 1, value: 40000}}
			},

			{
				type: 0,
				string: "While digging through a pile of junk, you found something that seems to resemble something useful.\n*Or atleast hope so...*",
				users: 0,
				perks: {items: {amount: 1, value: 10000}}
			},

			{
				type: -300,
				string: "You found a pretty cool item today, but when you showed it to $user1$ they stole it from you!",
				users: 1,
				perks: {}
			}

		]
	}


]


jobArray.forEach(job => {
	console.log(client.createJob(job))
});




return

/*
Types:
-1000 to -1 = BAD
0 Neutral
1 to 1000 = GOOD

The higher the number, the rarer the event.
RNG always tries to get to 0.
*/




let Event = job.events[Math.floor(Math.random() * job.events.length)]

let eventString = Event.string
let eventArray = []
let users = msg.guild.members.cache.random(Event.users)


eventString.split("$").forEach(part => {
	if(part == "user1" && Event.users >= 1)part = users[0].user.username;
	if(part == "user2" && Event.users >= 2)part = users[1].user.username;
	if(part == "user3" && Event.users >= 3)part = users[2].user.username;
	if(part == "user4" && Event.users >= 4)part = users[3].user.username;
	if(part == "user5" && Event.users >= 5)part = users[4].user.username;
	eventArray.push(part)
})

eventString = eventArray.join("**")

console.log(Event)
console.log(eventString)







return

		// SKILL
		/*
		{
			NAME: [NAME],
			ICON: [DISCORD EMOJI / CUSTOM EMOJI],
			TYPE: [OFFENSIVE, DEFENSIVE, BUFF, DEBUFF, SPECIAL],
			DIRECT: [TRUE / FALSE] -- Bestimmt ob es Point&Click ist.
			SELF: [TRUE / FALSE] -- Bestimmt ob es nur den Caster betrifft.

			STATS: {
				DAMAGE: [UNDEFINED / INT] -- Direkter Schaden
				INFLICTS: [ARRAY AN BUFFS / DEBUFFS] -- Die Buffs die den getroffenen Zielen zugefügt werden
				ROUNDS: [UNDEFINED / INT] -- Anzahl an Runden, für die die Buffs zählen (Nur benötigt wenn INFLICTS existiert)
				RANGE: [UNDEFINED / INT] -- Anzahl an Tiles, die es weitreicht. Bei undefined ist es global
				PATH: [UNDEFINED / STRAIGHT, AREA, BEAM, X, SPECIAL] -- Pathing System, muss ich noch genauer definieren
				IMPACT: [UNDEFINED / INT(Radius) / ARRAY[HIGH,WIDE,(DIRECTIONAL: [TRUE / FALSE])]] -- Bestimmt AOE effekt bei ausführung. Entweder keinen, einen Runden Radius oder eine gewisse Linie(optional mit Direktionaler Prüfung)
			},

			EXECUTE: [FUNCTION STRING] -- Hier drin die ganzen Sachen von dem Skill ausführen. Man kriegt ein attackOBj was alles vom Kampf beinhaltet. Aufbau weiter unten deklariert.
		}


		// ATTACKOBJ
		{
		FIGHT: [FIGHT OBJECT], -- Steht in fight.js
		CASTER: [FIGHTER OBJECT], --
		TARGET: [ [FIGHTER OBJECT] / ARRAY[FIGHTER OBJECT] / FIELDCOORDINATE ]
		}

		// FIGHT OBJECT
		{

		}

		*/




		let skillArray = [
			{name: "Debug Skill", icon: ":question:" , type: "special" , execute: '(function(client,msg){client.sendMessage(msg,true,"Yes.")})'},

			{name: "Ignite"  , icon: ":fire:" , type: "offensive" , direct: true ,
			 stats: {inflicts: ["Burning"], rounds: 5, range: 3},
			 required: {wisdom: 5},
			 execute: '(function(attackObj){})'},

			{name: "Fireball", icon: ":fire:" , type: "offensive" ,
			stats: {inflicts: ["Burning"], rounds: 3, range: 6, path: "straight", impact: 1},
			required: {wisdom: 15},
			execute: '(function(attackObj){})'},

			{name: "Fireblast",icon: ":fire:" , type: "offensive" ,
			stats: {inflicts: ["Burning II"], rounds: 3, path: "straight", impact: 3},
			required: {wisdom: 30},
			execute: '(function(attackObj){})'},


			{name: "Snare" , icon: ":spider_web:" , type: "debuff", direct: true,
			stats: {inflicts: ["Slowness"], rounds: 3, range: 3},
			execute: '(function(attackObj){})'},

			{name: "Poisoned Dart", icon: ":dart:" , type: "debuff",
			stats: {inflicts: ["Poisoned"], rounds: 5, range: 4, path: "straight", impact: 1},
			required: {dexterity:10},
			execute: '(function(attackObj){})'},

			{name: "Enrage", icon: ":anger:" , type: "buff", direct: true , self: true ,
		 	 stats: {inflicts: ["Rage"], rounds: 3},
		 	 required: {strength: 10},
			 execute: '(function(attackObj){})'},

		]


		skillArray.forEach(skill => {
			console.log(client.getSkill(client.createSkill(skill)))
		})


		return


	  await client.createReactionEmbed(msg,client.genericEmbed())



















return

/*const mobs = [
	{name: "Placeholder Mob", type: "default", ai: "aggressive", minLvl: 0, maxLvl: 0, base: {hp: 0, defense: 0, damage: 0}},

	{name: "Chicken", type: "default", ai: "random", minLvl: 1, maxLvl: 10, base: {hp: 50, defense: 5, damage: 10}},
	{name: "Wolf", type: "default", ai: "aggressive", minLvl: 1, maxLvl: 10, base: {hp: 70, defense: 10, damage: 30}},
	{name: "Tortoise", type: "default", ai: "defensive", minLvl: 1, maxLvl: 10, base: {hp: 120, defense: 25, damage: 20}},

	{name: "Skeleton", type: "default", ai: "random", minLvl: 10, maxLvl: 30, base: {hp: 200, defense: 20, damage: 30}},
	{name: "Zombie", type: "default", ai: "aggressive", minLvl: 10, maxLvl: 30, base: {hp: 100, defense: 10, damage: 60}},
	{name: "Scavenger", type: "default", ai: "random", minLvl: 10, maxLvl: 30, base: {hp: 170, defense: 15, damage: 35}},

	{name: "Small Wyvern", type: "default", ai: "random", minLvl: 30, maxLvl: 50, base: {hp: 200, defense: 50, damage: 40}},
	{name: "Desert Lynx", type: "default", ai: "aggressive", minLvl: 30, maxLvl: 50, base: {hp: 100, defense: 40, damage: 60}},
	{name: "Giant Worm", type: "default", ai: "defensive", minLvl: 30, maxLvl: 50, base: {hp: 250, defense: 50, damage: 20}},

	{name: "Possessed Armor", type: "default", ai: "defensive", minLvl: 50, maxLvl: 75, base: {hp: 400, defense: 70, damage: 100}},
	{name: "Mind Controlled Soldier", type: "default", ai: "aggressive", minLvl: 50, maxLvl: 75, base: {hp: 300, defense: 40, damage: 150}},
	{name: "Giant Spider", type: "default", ai: "random", minLvl: 50, maxLvl: 75, base: {hp: 200, defense: 80, damage: 50}},
]*/

const mobs = [
	{name: "Golden Swordsman", type: "default", ai: "random", minLvl: 75, maxLvl: 100, base: {hp: 600, defense: 90, damage: 160}},
	{name: "Golden Lancer", type: "default", ai: "defensive", minLvl: 75, maxLvl: 100, base: {hp: 700, defense: 100, damage: 140}},
	{name: "Golden Berserker", type: "default", ai: "aggressive", minLvl: 75, maxLvl: 100, base: {hp: 500, defense: 60, damage: 230}},

	{name: "The King", type: "default", ai: "random", minLvl: 101, maxLvl: 101, base: {hp: 1500, defense: 180, damage: 220}, rewardPoints: 200000},
]


mobs.forEach(mob => {
	 client.createBaseMob(mob)
})
return




/*
		let userString = "Item Reset:"
		const all = database.prepare("SELECT * FROM userdata ORDER BY id DESC;").all();

		const col = new Discord.Collection();

		all.forEach(user => {
			col.set(user.id,JSON.parse(user.data))
		})

		col.forEach((data,id) => {

			if(!data.stats)return;
			if(data.stats.version < 7)return;
			if(data.inventory == {stored: [], max: 30, equipped: {lAccessoire: 0 ,hat: 0,rAccessoire: 0,lArm: 0,body: 0,rArm: 0,lHand: 0,legs: 0,rHand: 0}})return;

			data.inventory.stored.forEach(itemID => {
				const item = client.getItem(itemID)
				if(!item)return;
				const price = client.calculatePrice(item)
				if(!price)return;
				console.log(`+${price}`)
				data.points += price;
			})

			Object.values(data.inventory.equipped).forEach(itemID => {
				const item = client.getItem(itemID)
				if(!item)return;
				const price = client.calculatePrice(item)
				if(!price)return;
				console.log(`+${price}`)
				data.points += price;
			})

			data.inventory = {stored: [], max: 30, equipped: {lAccessoire: 0 ,hat: 0,rAccessoire: 0,lArm: 0,body: 0,rArm: 0,lHand: 0,legs: 0,rHand: 0}}


			client.setUserdata({id: id, data: data})
			userString += `\nResetted all items of ${client.users.cache.get(id).username}`
		})

		msg.channel.send(userString)
*/







		//console.log(client.users.cache.get("712921631294488587"))


		/*
		Rarity list:

	 -3 = Void					175 points, but also -45 points
	 -2 = Corrupted			80 points, but also -30 points
	 -1 = Cursed				50 points, but also -15 points

		1 = Common				10 points
		2 = Uncommon			25 points
		3 = Rare					40 points
		4 = Very Rare			60 points
		5 = Epic					80 points
		6 = Legendary			100 points
		7 = Mythical			130 points
		8 = Radiant				150 points

  	100 = Special     No Rolls

	 1000 = One of a Kind

	 Modifier List:

	   [Name]   [Point Modifier]
	 Shattered 			-75%
	 Broken 				-50%
	 Heavily used   -30%
	 Minorly used   -10%
	 Forged   			+ 0%
	 Improved				+10%
	 Reinforced     +20%
	 Trusty         +30%
	 MK II          +50%
	 Overwhelming   +70%
	 Godlike        +90%
	 Perfect        +100%
		*/

		// Item Layout:
		const testItem = {name: "Legendary Sword",
										  slot: "hand",
											type:"melee",
											style: "sword",
											icon:":dagger:",
											market: true,
											minRarity: 5,
											maxRarity: 5,
											base: { melee: 22,
														  critMult: 10,
														  defense: 10,
															maxStamina: 5}
										}

/*
		const items = [

			{name: "Leather Plate", slot: "body", icon: ":shirt:", market: true, minRarity: 1, maxRarity: 4, base: {hp: 20, defense: 5, ranged: 2}},
			{name: "Leather Greaves", slot: "legs", icon: ":shorts:", market: true, minRarity: 1, maxRarity: 4, base: {hp: 20, defense: 5, ranged: 2}},

			{name: "Iron Helmet", slot: "hat", icon: ":helmet_with_cross:", market: true, minRarity: 1, maxRarity: 4, base: {hp: 30, defense: 10}},
			{name: "Iron Plating", slot: "body", icon: ":coat:", market: true, minRarity: 1, maxRarity: 4, base: {hp: 50, defense: 20, melee: 2}},
			{name: "Iron Gauntlet", slot: "arm", icon: ":gloves:", market: true, minRarity: 1, maxRarity: 4, base: {hp: 20, defense: 5, melee: 1}},
			{name: "Iron Greaves", slot: "legs", icon: ":jeans:", market: true, minRarity: 1, maxRarity: 4, base: {hp: 50, defense: 14}},

			{name: "Steel Helmet", slot: "hat", icon: ":helmet_with_cross:", market: true, minRarity: 2, maxRarity: 5, base: {hp: 50, defense: 15}},
			{name: "Steel Plating", slot: "body", icon: ":coat:", market: true, minRarity: 2, maxRarity: 5, base: {hp: 60, defense: 25, melee: 4}},
			{name: "Steel Gauntlet", slot: "arm", icon: ":gloves:", market: true, minRarity: 2, maxRarity: 5, base: {hp: 30, defense: 7, melee: 2}},
			{name: "Steel Greaves", slot: "legs", icon: ":jeans:", market: true, minRarity: 2, maxRarity: 5, base: {hp: 60, defense: 17}},

			{name: "Golden Crown", slot: "hat", icon: ":crown:", market: true, minRarity: 4, maxRarity: 7, base: {hp: 70, defense: 20}},
			{name: "Golden Plating", slot: "body", icon: ":coat:", market: true, minRarity: 4, maxRarity: 7, base: {hp: 90, defense: 35, melee: 6, manaRegen: 5}},
			{name: "Golden Gauntlet", slot: "arm", icon: ":gloves:", market: true, minRarity: 4, maxRarity: 7, base: {hp: 30, defense: 7, melee: 2, manaRegen: 2}},
			{name: "Golden Greaves", slot: "legs", icon: ":jeans:", market: true, minRarity: 4, maxRarity: 7, base: {hp: 80, defense: 20}},

			{name: "Diamond Crown", slot: "hat", icon: ":helmet_with_cross:", market: true, minRarity: 5, maxRarity: 6, base: {hp: 100, defense: 25}},
			{name: "Diamond Plating", slot: "body", icon: ":coat:", market: true, minRarity: 5, maxRarity: 6, base: {hp: 120, defense: 45, melee: 10}},
			{name: "Diamond Gauntlet", slot: "arm", icon: ":gloves:", market: true, minRarity: 5, maxRarity: 6, base: {hp: 50, defense: 12, melee: 4}},
			{name: "Diamond Greaves", slot: "legs", icon: ":jeans:", market: true, minRarity: 5, maxRarity: 6, base: {hp: 100, defense: 25}},

			// Melee

			{name: "Iron Sword", slot: "hand", icon: ":dagger:", market: true, minRarity: 1, maxRarity: 4, base: {melee: 12, defense: 5}},
			{name: "Iron Axe", slot: "twoHand", icon: ":axe:", market: true, minRarity: 1, maxRarity: 4, base: {melee: 20, defense: 5}},
			{name: "Iron Lance", slot: "twoHand", icon: ":probing_cane:", market: true, minRarity: 1, maxRarity: 4, base: {melee: 12, defense: 12}},

			{name: "Golden Sword", slot: "hand", icon: ":dagger:", market: true, minRarity: 4, maxRarity: 7, base: {melee: 25, defense: 10}},
			{name: "Golden Waraxe", slot: "twoHand", icon: ":axe:", market: true, minRarity: 4, maxRarity: 7, base: {melee: 40, defense: 13}},
			{name: "Golden Lance", slot: "twoHand", icon: ":probing_cane:", market: true, minRarity: 4, maxRarity: 7, base: {melee: 30, defense: 30}},

			{name: "Diamond Sword", slot: "hand", icon: ":dagger:", market: true, minRarity: 5, maxRarity: 6, base: {melee: 35, defense: 15}},
			{name: "Diamond Waraxe", slot: "twoHand", icon: ":axe:", market: true, minRarity: 5, maxRarity: 6, base: {melee: 60, defense: 20}},

			// Ranged

			{name: "Wooden Bow", slot: "twoHand", icon: ":bow_and_arrow:", market: true, minRarity: 1, maxRarity: 4, base: {ranged: 3, dodgeCost: 5}},
			{name: "Wooden Boomerang", slot: "hand", icon: ":croissant:", market: true, minRarity: 1, maxRarity: 4, base: {ranged: 5, melee: 3}},
			{name: "Pebbles", slot: "hand", icon: ":bricks:", market: true, minRarity: 1, maxRarity: 4, base: {ranged: 1, critCost: 5}},

			{name: "Longbow", slot: "twoHand", icon: ":bow_and_arrow:", market: true, minRarity: 1, maxRarity: 5, base: {ranged: 6, critMult: 5}},
			{name: "Ironcast Crossbow", slot: "twoHand", icon: ":pick:", market: true, minRarity: 2, maxRarity: 5, base: {ranged: 10, melee: 6}},
			{name: "Shuriken", slot: "hand", icon: ":star:", market: true, minRarity: 2, maxRarity: 5, base: {ranged: 3, critCost: 5, defense: -7}},

			{name: "Combat Yoyo", slot: "hand", icon: ":yo_yo:", market: true, minRarity: 2, maxRarity: 5, base: {ranged: 3, dodgeCost: 10}},
			{name: "Kunai", slot: "hand", icon: ":oden:", market: true, minRarity: 3, maxRarity: 6, base: {ranged: 6, staminaRegen: 10, defense: -10}},

			// Magic

			{name: "Novice Spellbook", slot: "hand", icon: ":book:", market: true, minRarity: 1, maxRarity: 4, base: {maxMana: 5, manaRegen: 5}},
			{name: "Wooden Staff", slot: "twoHand", icon: ":paintbrush:", market: true, minRarity: 1, maxRarity: 4, base: {maxMana: 15, defense: 5}},
			{name: "Novice Spellgun", slot: "hand", icon: ":gun:", market: true, minRarity: 1, maxRarity: 4, base: {ranged: 3, manaRegen: 3}},

			{name: "Advanced Spellbook", slot: "hand", icon: ":book:", market: true, minRarity: 3, maxRarity: 6, base: {maxMana: 30, manaRegen: 15}},
			{name: "Ironcast Staff", slot: "twoHand", icon: ":paintbrush:", market: true, minRarity: 3, maxRarity: 6, base: {maxMana: 50, defense: 10}},
			{name: "Advanced Spellgun", slot: "hand", icon: ":gun:", market: true, minRarity: 3, maxRarity: 6, base: {ranged: 5, manaRegen: 10}},

			{name: "Spell in a Bottle", slot: "hand", icon: ":book:", market: true, minRarity: 4, maxRarity: 7, base: {manaRegen: 50, maxMana: -100}},
			{name: "Witches Broom", slot: "twoHand", icon: ":broom:", market: true, minRarity: 4, maxRarity: 7, base: {maxMana: 65, defense: 20}},

			// Accessoires

			{name: "Ring of Stamina", slot: "accessoire", icon: ":ring:", market: true, minRarity: 1, maxRarity: 5, base: {maxStamina: 30, staminaRegen: 5}},
			{name: "Ring of Life", slot: "accessoire", icon: ":ring:", market: true, minRarity: 1, maxRarity: 5, base: {hp: 100}},
			{name: "Ring of Mana", slot: "accessoire", icon: ":ring:", market: true, minRarity: 1, maxRarity: 5, base: {maxMana: 40, manaRegen: 3}},

			{name: "Red Scarf", slot: "accessoire", icon: ":scarf:", market: true, minRarity: 1, maxRarity: 5, base: {defense: 5}},
			{name: "Glasses", slot: "accessoire", icon: ":glasses:", market: true, minRarity: 2, maxRarity: 4, base: {critCost: -50, critMult: 25}},
			{name: "Fairy", slot: "accessoire", icon: ":sparkles:", market: true, minRarity: 4, maxRarity: 6, base: {dodgeCost: 20, maxMana: 30}},

			{name: "Prayer Beads", slot: "accessoire", icon: ":prayer_beads:", market: true, minRarity: 6, maxRarity: 6, base: {}},
			{name: "Backpack", slot: "accessoire", icon: ":school_satchel:", market: true, minRarity: 1, maxRarity: 5, base: {staminaRegen: -10, defense: 20}},
			{name: "Street Drug", slot: "accessoire", icon: ":pill:", market: true, minRarity: 1, maxRarity: 1, base: {dodgeCost: 20, staminaRegen: -20}},

			{name: "Sunglasses", slot: "accessoire", icon: ":dark_sunglasses:", market: true, minRarity: 100, maxRarity: 100, base: {dodgeCost: 50, defense: -75}}

		]
*/

		const items = [

			{name: "Short Dress", slot: "body", icon: ":dress:", market: true, minRarity: 1, maxRarity: 4, base: {maxStamina: 20, staminaRegen: 5}},
			{name: "White Coat", slot: "body", icon: ":lab_coat:", market: true, minRarity: 1, maxRarity: 4, base: {maxMana: 30, manaRegen: 5}},
			{name: "Blue Kimono", slot: "body", icon: ":kimono:", market: true, minRarity: 1, maxRarity: 4, base: {ranged: 5, dodgeCost: 10}},


			{name: "Mana Crystal", slot: "hand", icon: ":diamond_shape_with_a_dot_inside:", market: true, minRarity: 100, maxRarity: 100, base: {maxMana: 200}},
			{name: "Mid-Game Snack", slot: "hand", icon: ":poultry_leg:", market: true, minRarity: 100, maxRarity: 100, base: {hp: 350, staminaRegen: 10}},
			{name: "Skateboard", slot: "accessoire", icon: ":skateboard:", market: true, minRarity: 100, maxRarity: 100, base: {dodgeCost: 35, melee: -30, ranged: -10, manaRegen: -10}},



			{name: "Umbrella", slot: "hand", icon: ":closed_umbrella:", market: true, minRarity: 1, maxRarity: 4, base: {dodgeCost: -10, defense: 20}},
			{name: "Third Eye", slot: "hat", icon: ":eye:", market: true, minRarity: 2, maxRarity: 5, base: {maxMana: 50, maxStamina: 50}},
			{name: "Headphones", slot: "hat", icon: ":headphones:", market: true, minRarity: 1, maxRarity: 3, base: {dodgeCost: 20}},

			{name: "Iron Warhammer", slot: "hand", icon: ":hammer:", market: true, minRarity: 1, maxRarity: 3, base: {melee: 20}},
			{name: "Steel Warhammer", slot: "hand", icon: ":hammer:", market: true, minRarity: 2, maxRarity: 4, base: {melee: 35, defense: 20}},
			{name: "Golden Warhammer", slot: "hand", icon: ":hammer:", market: true, minRarity: 4, maxRarity: 5, base: {melee: 30, maxMana: 50, maxStamina: 30}},

			{name: "Leather Shield", slot: "hand", icon: ":brown_circle:",  market: true, minRarity: 1, maxRarity: 4, base: {defense: 30}},
			{name: "Iron Shield",    slot: "hand", icon: ":white_circle:",  market: true, minRarity: 2, maxRarity: 4, base: {defense: 50}},
			{name: "Steel Shield",   slot: "hand", icon: ":purple_circle:", market: true, minRarity: 3, maxRarity: 5, base: {defense: 70}},
			{name: "Golden Shield",  slot: "hand", icon: ":yellow_circle:", market: true, minRarity: 4, maxRarity: 5, base: {defense: 50, maxMana: 40}},

			{name: `"Nice."`, slot: "none", icon: ":trophy:",description: "A trophy for those, who exploited the $prestige command.", market: false, minRarity: 100, maxRarity: 100, base: {}}

		]


		console.log(items)
		items.forEach(item => {
			let temp = client.createBaseItem(item)
			let temp2 = client.getBaseItem(temp.id)
			console.log(temp2)
		})

		return;

			/*
			Slots:
		0	Hat
		1	Accessoire
		2	Body
		3	Arm
		4	Hand
		5	Legs
			*/




let r = Math.floor(Math.random() * 7 + 1)
let temp = client.createRandomItem(7)
console.log(temp)
console.log(client.calculatePrice(temp))
return
/*
		let check = false;
		const filter = m => m.author.id == client.owner
		while(check == false){

		const item = generate(client)

		const embed = new Discord.MessageEmbed();
		embed
		.setFooter(`Finalboss Tom's Manager`,client.EmojiMap.get("niko").url)
		.setTitle(`Generated Item`)
		.setColor(0xffffff)
		.addField("TypeStuff",`${item.data.icon}\nRarity: ${item.data.rarity}\nSlot: ${item.data.slot}\nType: ${item.data.type}\nStyle: ${item.data.style}`,true)

		let statString = ""
		Object.keys(item.data.stats).forEach(key => {
			statString += `${key}:\n`
		})
		embed.addField("Stats",statString,true)

		statString = ""
		Object.values(item.data.stats).forEach(key => {
			statString += `${key}\n`
		})
		embed.addField("----",statString,true)

		console.log(item)
		await msg.channel.send(embed)
		await msg.channel.awaitMessages(filter, {max: 1})
		.then(collected => {
			let m = collected.first()
			if(m.content == "c"){
				check = true;
				return;
			}
			if(m.content == "d")return;
			item.name = m.content
			client.createItem(item)
		})
		}
*/

	},
};


function generate(client){

	const slotRoll = Math.floor(Math.random() * 6)
	const rarityRoll = Math.floor(Math.random() * 1000)
	let rarity;
	let points;

	if(rarityRoll <= 400){
		rarity = 0;
		points = 5;
	}
	if(rarityRoll > 400)	{
		rarity = 1;
		points = 10;
	}
	if(rarityRoll > 500)	{
		rarity = 2;
		points = 20;
	}
	if(rarityRoll > 600)	{
		rarity = 3;
		points = 30;
	}
	if(rarityRoll > 700)	{
		rarity = 4;
		points = 45;
	}
	if(rarityRoll > 800)	{
		rarity = 5;
		points = 60;
	}
	if(rarityRoll > 900)	{
		rarity = 6;
		points = 80;
	}
	if(rarityRoll >= 950)	{
		rarity = 7;
		points = 100;
	}

	let item;
	if(slotRoll == 4){
		item = generateWeapon(client,points,rarity);
	}
	else{
		item = generateArmor(client,points,rarity);
	}
item.data.rarity = rarity;
return(item)
}


function rollStats(client,item){

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
		"ranged",
		"magic"
	]

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

	const modifier = modifiers.randomKey()

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

	//POINTS DEFINED
	//NOW ITERATE THROUGH POINTS

	let statPoints = Math.floor(rarityPoints.get(item.rarity) * modifiers.get(modifier))
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
		let temp = stats.get(slotName) + 1
		stats.set(slotName,temp)
		statPoints--;
	}

	//POINTS ITERATED
	//NOW DEFINE ITEM

	item.stats = {}

	stats.each((value, statName) => {
		Object.defineProperty(item.stats,statName,{
			value: value,
  		writable: true,
  		enumerable: true,
  		configurable: true
		})
	})

	item.modifier = modifier
	item.version = 1

	return(item)
}






function generateWeapon(client,points,rarity){
	let item = {name: "Unnamed Weapon", data: {stats:{},required:{}}}
	let data = item.data

	const handRoll = Math.round(Math.random())
	if(handRoll == 0)data.slot = "hand";
	else{data.slot = "twoHand"};

	const typeRoll = Math.floor(Math.random() * 3)
	const styleRoll = Math.floor(Math.random() * 3)
	switch(typeRoll){

		//MELEE
		case 0:data.type = "melee";
		switch(styleRoll){
			case 0:
			data.style = "sword";
			data.icon = ":dagger:"
			break;

			case 1:
			data.style = "axe";
			data.icon = ":axe:";
			break;

			case 2:
			data.style = "lance";
			data.icon = ":probing_cane:"
			break;
		}
		break;

		// RANGED
		case 1:data.type = "ranged";
		switch(styleRoll){
			case 0:
			data.style = "bow";
			data.icon = ":bow_and_arrow:"
			break;

			case 1:
			data.style = "throwing";
			data.icon = ":star:";
			break;

			case 2:
			data.style = "yoyo";
			data.icon = ":yo_yo:"
			break;
		}
		break;

		//MAGIC
		case 2:data.type = "magic";
		switch(styleRoll){
			case 0:
			data.style = "book";
			data.icon = ":book:"
			break;

			case 1:
			data.style = "broom";
			data.icon = ":broom:";
			break;

			case 2:
			data.style = "spellgun";
			data.icon = ":gun:"
			break;
		}
		break;
	}

	let tempStats = { hp: 0,
										defense: 0,
										dodge: 0,
										stamina: 0,
										maxStamina: 0,
										mana: 0,
										maxMana: 0,
										crit: 0,
										melee: 0,
										ranged: 0,
										magic: 0
									}

	if(data.slot == "twoHand")points = Math.floor(points * 1.40);

	while(points != 0){
		const statRoll = Math.floor(Math.random() * rarity)
		switch(statRoll){
			case 0: case 1: case 2:
			if(data.type == "melee")tempStats.melee += 2;
			if(data.type == "ranged")tempStats.ranged++;
			if(data.type == "magic")tempStats.magic++;
			break;
			case 3: tempStats.crit += 0.5;
			break;
			case 4: tempStats.defense++;
			break;
			case 5: tempStats.maxStamina++;
			break;
			case 6: tempStats.maxMana++;
			break;
			case 7: tempStats.crit += 0.5;
			break;
			case 8: tempStats.dodge += 0.5;
			break;
			default:
			if(data.type == "melee")tempStats.melee++;
			if(data.type == "ranged")tempStats.ranged++;
			if(data.type == "magic")tempStats.magic++;
			break;
		}
		points--;
	}

if(tempStats.defense)data.stats.defense = tempStats.defense;
if(tempStats.dodge)data.stats.dodge = Math.floor(tempStats.dodge);
if(tempStats.maxStamina)data.stats.maxStamina = tempStats.maxStamina;
if(tempStats.maxMana)data.stats.maxMana = tempStats.maxMana;
if(tempStats.crit)data.stats.crit = Math.floor(tempStats.crit);

if(tempStats.melee)data.stats.melee = tempStats.melee;
if(tempStats.ranged)data.stats.ranged = tempStats.ranged;
if(tempStats.magic)data.stats.magic = tempStats.magic;

item.data = data;
return(item)
}

function generateArmor(client,points,rarity){
	let item = {name: "Unnamed Armorpiece", data: {stats:{},required:{}}}
	let data = item.data

	/*
	Slots:
0	Hat
1	Accessoire
2	Body
3	Arm
4	Hand
5	Legs
	*/

	const slotRoll = Math.floor(Math.random() * 4)
	const styleRoll = Math.floor(Math.random() * 5)
	switch(slotRoll){

		//HAT
		case 0:
		data.type = "hat";
		data.slot = "hat";
		switch(styleRoll){
			case 0:
			data.style = "cap";
			data.icon = ":billed_cap:"
			break;

			case 1:
			data.style = "tophat";
			data.icon = ":tophat:";
			break;

			case 2:
			data.style = "university";
			data.icon = ":mortar_board:"
			break;

			case 3:
			data.style = "ribbon";
			data.icon = ":ribbon:"
			break;

			case 4:
			data.style = "glasses";
			data.icon = ":eyeglasses:"
			break;
		}
		break;

		//Accessoire
		case 1:
		data.type = "accessoire";
		data.slot = "accessoire";
		switch(styleRoll){
			case 0:
			data.style = "scarf";
			data.icon = ":scarf:"
			break;

			case 1:
			data.style = "backpack";
			data.icon = ":school_satchel:";
			break;

			case 2:
			data.style = "pendant";
			data.icon = ":medal:"
			break;

			case 3:
			data.style = "ring";
			data.icon = ":ring:"
			break;

			case 4:
			data.style = "companion";
			data.icon = ":sparkles:"
			break;
		}
		break;

		//BODY
		case 2:
		data.type = "body";
		data.slot = "body";
		switch(styleRoll){
			case 0:
			data.style = "shirt";
			data.icon = ":shirt:"
			break;

			case 1:
			data.style = "kimono";
			data.icon = ":kimono:";
			break;

			case 2:
			data.style = "robe";
			data.icon = ":martial_arts_uniform:"
			break;

			case 3:
			data.style = "coat";
			data.icon = ":lab_coat:"
			break;

			case 4:
			data.style = "tunic";
			data.icon = ":running_shirt_with_sash:"
			break;
		}
		break;

		//ARM
		case 3:
		data.type = "arm";
		data.slot = "arm";
		switch(styleRoll){
			case 0:case 1: case 2:
			data.style = "glove";
			data.icon = ":gloves:"
			break;

			case 3: case 4:
			data.style = "shield";
			data.icon = ":brown_circle:";
			break;
		}
		break;

		//LEGS
		case 4:
		data.type = "legs";
		data.slot = "legs";
		switch(styleRoll){
			case 0:
			data.style = "pants";
			data.icon = ":jeans:"
			break;

			case 1:
			data.style = "shorts";
			data.icon = ":shorts:";
			break;

			case 2:
			data.style = "boots";
			data.icon = ":boot:"
			break;

			case 3:
			data.style = "socks";
			data.icon = ":socks:"
			break;

			case 4:
			data.style = "ballet";
			data.icon = ":ballet_shoes:"
			break;
		}
		break;
	}



	let tempStats = { hp: 0,
										defense: 0,
										dodge: 0,
										stamina: 0,
										maxStamina: 0,
										mana: 0,
										maxMana: 0,
										crit: 0,
										melee: 0,
										ranged: 0,
										magic: 0
									}

	while(points != 0){
		const statRoll = Math.floor(Math.random() * rarity)
		switch(statRoll){
			case 0: tempStats.defense++;
			break;
			case 1: tempStats.hp += 5;
			break;
			case 2: tempStats.maxStamina++;
			break;
			case 3: tempStats.maxMana++;
			break;
			case 5: tempStats.dodge += 0.5;
			break;
			case 6: tempStats.stamina++;
			break;
			case 7: tempStats.mana++;
			break;
			default:
			tempStats.defense++;
			break;
		}
		points--;
	}

if(tempStats.hp)data.stats.hp = tempStats.hp;
if(tempStats.defense)data.stats.defense = tempStats.defense;
if(tempStats.dodge)data.stats.dodge = Math.floor(tempStats.dodge);
if(tempStats.stamina)data.stats.stamina = tempStats.stamina;
if(tempStats.maxStamina)data.stats.maxStamina = tempStats.maxStamina;
if(tempStats.mana)data.stats.mana = tempStats.mana;
if(tempStats.maxMana)data.stats.maxMana = tempStats.maxMana;


item.data = data;
return(item)

}

function getPermName(bitfield = 0) {
  for (let key in Discord.Permissions.FLAGS)
    if (Discord.Permissions.FLAGS[key] == bitfield) return key;
  return null;
}


function levelUp(userdata){

// Userdata ist hier {lvl: 1, xp: 73840}

let lvlMap = new Discord.Collection()

lvlMap.set(1,100)
lvlMap.set(10,500)
lvlMap.set(20,3000)
lvlMap.set(30,5500)

let result = undefined
let tempLvl = userdata.lvl
while(!result){
	console.log(tempLvl)
	result = lvlMap.get(tempLvl)
	if(!result)tempLvl--;
}

console.log(result)

if(userdata.xp >= result){
	userdata.lvl++;
	userdata.xp -= result;
	console.log(userdata)
	if(userdata.xp >= result)userdata = levelUp(userdata);
	console.log(userdata)
}

return(userdata)
}


function getXpNeeded(lvlMap,lvl){

	let output = 0;
	let templvl1 = lvl;
	let templvl2 = lvl;

	while(templvl1 != 0){
		result = undefined;
		while(!result){
			result = lvlMap.get(templvl2)
			if(!result)templvl2--;
		}
		output += result;
		templvl1--;
		templvl2 = templvl1;
	}

	return(output)
}
