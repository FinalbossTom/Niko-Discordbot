const Discord = require('discord.js')

const types = [`FIRE`, `WATER`, `EARTH`, `AIR`, `ELECTRIC`, `ICE`, `PLANT`, `NEUTRAL`]

module.exports = {
	name: 'game',
	aliases: ['g'],
	description: 'Dont touch this.',
	usage: 'Just dont.',
	exclude: true,
	async execute(client,msg,args,userdata,creatures) {
	
	//id,author,name,type,attack,defense,health,speed,size,weight,rarity,test
	// [Math.floor(Math.random()*100*lastcreature.id), Math.floor(Math.random()*100*lastcreature.id), Math.floor(Math.random()*100*lastcreature.id), Math.floor(Math.random()*100*lastcreature.id), Math.random()*10, Math.random()*100]
	
	if(msg.author.id != client.owner.id){
		msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
		msg.channel.send(`I'm sorry, but i'm sadly not yet able to provide you any real entertainment...\nTom is still working on this and he doesn't seem to be fast enough.`)
		return
		}
		
		msg.channel.send(`[DEBUG MODE -- $game]`)
	
	if(args[1] == "find"){
		
	
	const list = creatures.prepare("SELECT * FROM creatures ORDER BY id DESC;").all();
	
	var lastcreature = list[0]
	const temp = lastcreature.id + 1
	const roll = Math.ceil(Math.random()*temp)
	
	
	if(roll > lastcreature.id || args[2] == "f"){
		
	const typeRoll = Math.floor(Math.random()*types.length)
	var statMax = 500 + (lastcreature.id * 3)
	var statRoll = []
	
	statRoll.push(50 + Math.floor(Math.random()*100))
	statRoll.push(20 + Math.floor(Math.random()*50))
	statRoll.push(20 + Math.floor(Math.random()*75))
	statRoll.push(10 + Math.floor(Math.random()*40))
	
	statRoll.push((statRoll[0] + statRoll[1] - statRoll[3]) / 100 * Math.random()*10)
	statRoll.push(((statRoll[0] + statRoll[1] + statRoll[4]) / (Math.random()*100)) * Math.random()*10)
	
	const tRarity = Math.floor(Math.sqrt(statRoll[0] + statRoll[1] + statRoll[2] + statRoll[3] + statRoll[4] + statRoll[5]) / 5)
	
	
	const data = { id: lastcreature.id + 1,author: `${msg.author}`, name: `[Not Set]`, type: `${types[typeRoll]}`, attack: statRoll[2],defense: statRoll[1],health: statRoll[0],speed: statRoll[3],size: statRoll[4].toFixed(2),weight: statRoll[5].toFixed(2),rarity: tRarity}
	
	const embed = new Discord.RichEmbed()
	embed
	.setTitle(`You found a new Creature!`)
	.setFooter("Finalboss Tom's Manager",client.emojis.get("683018113284833301").url)
    .setDescription(`***Send a Name right now, to Name it!***`)
    .setColor(0x18fabc)
	.addField("Rarity",data.rarity,true)
	.addField("Type",data.type,true)
	.addField("Health",data.health,true)
	.addField("Attack Power",data.attack,true)
	.addField("Defensive Power",data.defense,true)
	.addField("Speed",data.speed,true)
	.addField("Size",data.size + " Meters",true)
	.addField("Weight",data.weight + " Kg",true)
	.addField("ID",data.id,true)
	
	msg.channel.send({embed})
	
		try {
			var response = await msg.channel.awaitMessages(msg2 => msg.author.id == msg2.author.id,  {
			maxMatches: 1
			})
		}finally{
			msg.channel.send(`It's name is now \`\`${response.first().content}\`\``)
		}
		
		data.name = `${response.first().content}`
		client.setCreature.run(data)
		return
	}else{
		
	data = client.getCreature.get(roll)
	const embed = new Discord.RichEmbed()
	embed
	.setTitle(`You found a ${data.name}!`)
	.setFooter("Finalboss Tom's Manager",client.emojis.get("683018113284833301").url)
    .setDescription(`***The author is ${data.author}***`)
    .setColor(0x18fabc)
	.addField("Rarity",data.rarity,true)
	.addField("Type",data.type,true)
	.addField("Health",data.health,true)
	.addField("Attack Power",data.attack,true)
	.addField("Defensive Power",data.defense,true)
	.addField("Speed",data.speed,true)
	.addField("Size",data.size + " Meters",true)
	.addField("Weight",data.weight + " Kg",true)
	.addField("ID",data.id,true)
	
	msg.channel.send({embed})
	}
	
	
	}
	
	
	},
};