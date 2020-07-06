
//updated messages

const config = require('../../config')
const Discord = require('discord.js')

module.exports = {
	name: 'help',
	aliases: ['?'],
	description: 'Sends a list of Commands, that this bot can use.',
	usage:'[command name]',
	execute(client,msg,args,userdata) {


		const embed = new Discord.MessageEmbed()
		embed
		.setFooter("Finalboss Tom's Manager",client.emojis.cache.get("683018113284833301").url)
		.setThumbnail(client.user.avatarURL())
		.setColor(0xfafc0a)


		if(!args[1]){
		embed
		.setTitle("Command Categories")
		.setDescription(`\nUse \`\`${config.prefix}help [Category Name]\`\` to see all commands inside it!`)
		.addField("**Invitelink to the Test-Discord**","[Click me!](https://discord.gg/5jjDCw3)",false)
		.addField(":crossed_swords:``Admin``","All the commands, that only admins are allowed to use.",false)
		.addField(":tools:**Useful**","Everything that has some actual use.",true)
		.addField(":moneybag:**Economy**","The Commands for your meaningless internet points.",true)
		.addField(":video_game:**Fun**","Stuff that doesn't really make sense, but is neat to have.",true)

		client.sendMessage(msg,true,embed)
		return
		}

		const {commands} = msg.client;
		var list = []

		const categories = ['admin','useful','economy','fun']
		if(categories.includes(args[1])){

			commands.forEach((command) => {
			if(!command.exclude && command.category == args[1]){
			list.push(command)
			}
			})
			list.sort()
			embed
			.setDescription(`\nYou can send \`\`${config.prefix}help [command name]\`\` to get info on a specific command!`)
			.setTitle(`Commands of Category: **${args[1].toUpperCase()}**`)
			while(list.length != 0){
			embed.addField("``"+ list[0].name +"``",list[0].description,true)
			list.shift()
			}
			client.sendMessage(msg,true,embed)
			return
		}

		const name = args[1].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command) {
			client.sendMessage(msg,"Unknown Category or Name","There is no Category or Command named that way!","niko_huh")
			return
			}

		embed
		.setColor(0xfafc0a)
		.setTitle(`Command: \`\`${command.name}\`\``)
		.setFooter("Finalboss Tom's Manager",client.emojis.cache.get("683018113284833301").url)
		if (command.description) embed.addField("Description",command.description,true);
		if (command.aliases) embed.addField("Aliases",command.aliases.join(', '),true);
		if (command.usage) embed.addField("Usage",`\`\`${config.prefix}${command.name} ${command.usage}\`\``);
		if (command.cost) embed.addField("Cost",`***${command.cost}` + ` ***:pancakes:`,true);
		if (command.example) embed.addField("Example",`${command.example}`);

		client.sendMessage(msg,true,embed)
		return


	},
};
