const Discord = require('discord.js')

module.exports = {
	name: 'stats',
	description: 'Shows your stats for Fights.',
	category: 'fun',
	execute(client,msg,args,userdata) {



	const embed = new Discord.MessageEmbed()

	embed
  .setTitle("Your Stats!")
  .setFooter("Finalboss Tom's Manager",client.emojis.cache.get("683018113284833301").url)
	.setColor(0xfffffc)
	.setThumbnail(msg.author.avatarURL())


	userdata = client.getUserdata(msg.author.id)

	const stats = userdata.data.stats
	const fightStats = client.calculateStats(userdata.data)
	let timer = ""
	if(fightStats.currentHp < fightStats.hp)timer = `\`\`${Math.ceil((fightStats.hp - fightStats.currentHp) / (fightStats.hpRegen / 60))} sec left\`\``

	embed.addField("**Fightstats**",`:globe_with_meridians:** ${client.formatNumber(fightStats.statValue)} Stat Points**

								:heart: ${fightStats.currentHp}/${fightStats.hp} Health ${timer}
								:shield: ${fightStats.defense} Defense
								:dash: ${fightStats.dodgeCost}% Dodgecost

								:zap: ${fightStats.maxStamina} Max Stamina
								${fightStats.staminaRegen} Stamina per Round

								:diamond_shape_with_a_dot_inside: ${fightStats.maxMana} Max Mana
								${fightStats.manaRegen} Mana per Round

								:dagger: ${fightStats.melee} Melee Damage
								:bow_and_arrow: ${fightStats.ranged} Ranged Damage
								:book: ${fightStats.magic} Base Magic Damage

								:anger: ${fightStats.critCost}% Critcost
								:exclamation: ${fightStats.critMult}% Critdamage
								`,true)

	msg.channel.send(embed)
	},
};
