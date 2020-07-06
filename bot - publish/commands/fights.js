const Discord = require('discord.js')

module.exports = {
	name: 'fights',
	aliases: ['brawls', 'show'],
	description: 'Brings up a table of all running fights!',
	category: 'fun',
	execute(client,msg,args,userdata) {
		
		
		if(!client.BrawlMap.first()){
			client.sendMessage(msg,"No Fights running","There are currently no fights running!","niko_speak")
			return
		}
		
		
		const embed = new Discord.MessageEmbed()
		.setFooter("Finalboss Tom's Manager - Important",client.EmojiMap.get("niko").url)
		.setColor(0xffffff)
		.setTitle(`List of all running fights`)
		
		client.BrawlMap.forEach(Brawl => {
			if(!Brawl.msg)return;
			embed.addField(`Round ${Brawl.round}`,` :heart: ${Brawl.users.one.stats.hp} ${Brawl.users.one.member.user.username} :crossed_swords: ${Brawl.users.two.member.user.username} ${Brawl.users.two.stats.hp} :heart:`,false)
		})
		
		client.sendMessage(msg,true,embed)
	
	},
};

/*
aber hier nen kurzformat:
Nichts tun, läd nen Damage Multiplier auf (bis zu x2.5)
Wenn man einen Angriff Blockt, ist der Multiplier instant voll.
Sobald man einen Angriff macht, wird der Multiplier verbraucht
Blocken kostet Ausdauer, wenn man 0 oder weniger hat, funktioniert es nicht mehr, bis man mehr hat.
Man generiert über Zeit und mit Angriffen Mana, wenn man den Magie angriff benutzt, wird das gesamte Mana entladen, für einen starken angriff.
Ranged macht weniger schaden als Melee, hat aber einen Crit Multiplier von x3 statt x2
*/