const Discord = require('discord.js')

module.exports = {
	name: 'session',
	description: 'Shows the status of the current session.',
	category: 'useful',
	execute(client,msg,args,userdata) {


	const embed = new Discord.MessageEmbed()

	embed
    .setTitle("Status of this Session")
    .setFooter("Finalboss Tom's Manager",client.emojis.cache.get("683018113284833301").url)
    .setColor(0xffe400);


	embed.addField(`==========`,`Usage`,false)
	.addField(`CPU`,`**${process.cpuUsage().system / 1000000}%**`,true)
	.addField(`Memory`,`**${Math.floor(process.memoryUsage().heapUsed / 1000000)} MB\nof ${Math.floor(process.memoryUsage().heapTotal / 1000000)} MB**`,true)
	.addField(`Uptime`,`**${Math.floor(process.uptime() / 60)} Minutes**`,true)

	embed.addField(`==========`,`Commands:`,false)
	.addField(`:envelope_with_arrow:\nMessages`,`**${client.checkedMessages}**`,true)
	.addField(`:white_check_mark:\nRun`,`**${client.runCommands}**`,true)
	.addField(`:no_entry_sign:\nFailed`,`**${client.failedCommands}**`,true)

	msg.channel.send(embed)
	},
};
