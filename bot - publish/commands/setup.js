const Discord = require('discord.js')

module.exports = {
	name: 'setup',
	aliases: ['settings'],
	description: 'Use this to setup your Server or to change Settings!',
	category: 'admin',
	guild: true,
	execute(client,msg,args,userdata,creatures,alertTable,guildSettings) {
		
		var cGuild = client.getSettings.get(msg.guild.id)
		
		const embed = new Discord.MessageEmbed
		embed.setFooter("Finalboss Tom's Manager",client.EmojiMap.get("niko").url)
		.setColor(0x13f535)
		.setTitle(`Settings for ${msg.guild.name}`)
		.setThumbnail(msg.guild.iconURL())
		
		if(cGuild && args[0].match("setup")){
			client.sendMessage(msg,"Already setup","This Guild is already set-up!\nUse ``$settings`` to view or edit them.","niko_speak")
			return
		}
		
		if(!cGuild){
		
		const DSettings = { anonymous: false, prefix: "$" , updNot: false, delNot: false, statNot: false, delMsg: 60000, updCha: "[EMPTY]", delCha: "[EMPTY]", statCha: "[EMPTY]", disaCmds: "[EMPTY]", banUser: "[EMPTY]" }
		const data = { id: msg.guild.id, settings: JSON.stringify(DSettings) }
		
		client.setSettings.run(data)
		
		embed
			.addField("Anonymous",DSettings.anonymous,false)
			.addField("Prefix",DSettings.prefix,false)
			
			.addField("Notifications",
			`Update: false
			\nDeletion: false
			\nStatus: false`
			,false)
			
			.addField("Automatic deletion of my Commands in Seconds",DSettings.delMsg / 1000,false)
			.addField("Disabled Commands",DSettings.disaCmds,true)
			.addField("Users that are unable to use my Commands",DSettings.banUser,false)
			
			client.sendMessage(msg,true,embed)
			client.sendMessage(msg,true,"These are the default Settings for any Server!\n**You can now use ``$settings edit`` to change any of them.**")
			return
		}
		
		if(args[1] == "edit"){
			
			if(!msg.member.permissions.has("ADMINISTRATOR")){
				client.sendMessage(msg,"Not enough Permissions","I'm sorry, but i can't let you do that!","niko_speak")
				return
			}
			
			if(!args[2]){
			client.sendMessage(msg,true,`These are the things that you can edit.\nUse them like this: \`\`$settings edit [Option] [New Setting]\`\`
			 - anonymous // **true** OR **false**
			 - timer // **[Time in Seconds]** OR **false**
			 - prefix // **[New Prefix]**
			 - disabled // **add [Command]** OR **remove [Command]**
			 *Notifications:*
			 - updates // Use $link OR **false**
			 - deletion // Use $link OR **false**
			 - status // Use $link OR **false**
			\nTo activate notifications, you need set a Channel for them by using \`\`$link [Type]\`\` in that Channel!
			`,"niko_speak")
			return
			}
			
			var sT = JSON.parse(cGuild.settings)
			
			if(!sT.prefix){
				sT.prefix = "$"
			}
			
			if(!args[3]){
			client.sendMessage(msg,"No Option given","You need to tell me the new Option!","niko_speak")
			return
			}
			
			if(args[2] == "timer"){
				if(args[3] == "false"){
					sT.delMsg = false
					cGuild.settings = JSON.stringify(sT)
					client.setSettings.run(cGuild)
					client.sendMessage(msg,true,"I won't delete my messages anymore!")
					return
				}
				
				if(parseInt(args[3]).toString == "NaN"){
					client.sendMessage(msg,"No Argument","You need to tell me, how many seconds i should wait, before deleting my messages!","niko_speak")
					return
				}
				
				sT.delMsg = parseInt(args[3]) * 1000
				
				if(sT.delMsg >= 300001){
					client.sendMessage(msg,"Too high amount","Sorry, but i can't wait longer than **5 minutes**...","niko_upset")
					return
				}
				
				cGuild.settings = JSON.stringify(sT)
				client.setSettings.run(cGuild)
				
				client.sendMessage(msg,true,`I will now wait **${args[3]} seconds** before deleting my messages!`)
				return
			}
			
			if(args[2] == "disabled"){
				if(!args[3]){
					msg.channel.send(client.EmojiMap.get("niko_speak"))
					msg.channel.send(`You need to tell if you want to **add** or **remove** a command!`)
					return
				}
				
				if(args[3] != "add" && args[3] != "remove"){
					msg.channel.send(client.EmojiMap.get("niko_speak"))
					msg.channel.send(`You need to tell if you want to **add** or **remove** a command!`)
					return
				}
				
				if(!args[4]){
					msg.channel.send(client.EmojiMap.get("niko_speak"))
					msg.channel.send(`You need to tell the Command that you are trying to (de)activate!`)
					return
				}
				
				const command = client.commands.get(args[4])
					|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[4]));
				
				if(!command){
					msg.channel.send(client.EmojiMap.get("niko_huh"))
					msg.channel.send(`I don't know a command named **${args[4]}**...`)
					return
				}
				
				if(sT.disaCmds.match("[EMPTY]"))sT.disaCmds = "";
				
				if(args[3] == "add"){
					sT.disaCmds = sT.disaCmds + `${command.name}, `
					msg.channel.send(client.EmojiMap.get("niko_speak"))
					msg.channel.send(`I have now disabled the **${command.name}** command!`)
				}
				else{
					if(!sT.disaCmds.match(command.name)){
						msg.channel.send(client.EmojiMap.get("niko_huh"))
						msg.channel.send(`That command isn't even disabled...?`)
						return
					}
					
					let commands = sT.disaCmds.split(",")
					let newCommands;
					var i = 0
					commands.forEach(c => {
						if(command.name == c){
							newCommands = commands.slice(i,i)
						}
						i++;
					})
					console.log(newCommands)
					if(newCommands.length <= 0){
						newCommands = ["[EMTPY]"]
					}
					sT.disaCmds = newCommands.join(", ")
					msg.channel.send(client.EmojiMap.get("niko_speak"))
					msg.channel.send(`The command **${command.name}** is now available again!`)
				}
				cGuild.settings = JSON.stringify(sT)
				client.setSettings.run(cGuild)
				return
			}
			
			if(args[2] == "prefix"){
				if(!args[3]){
					msg.channel.send(client.EmojiMap.get("niko_speak"))
					msg.channel.send(`You need to tell me the new Prefix!`)
					return
				}
				
				if(args[3].length > 4){
					msg.channel.send(client.EmojiMap.get("niko_upset"))
					msg.channel.send(`Sorry, but the max length for a prefix is **4**...`)
					return
				}
				
				sT.prefix = args[3]
				
				cGuild.settings = JSON.stringify(sT)
				client.setSettings.run(cGuild)
			
				msg.channel.send(`You successfully changed the prefix to **${args[3]}**!`)
				return
			}
			
			if(args[3] != "true" && args[3] != "false"){
			msg.channel.send(client.EmojiMap.get("niko_upset"))
			msg.channel.send(`Sorry, but that isn't a valid option...`)
			return
			}
			
			switch(args[2]){
				
				case "anonymous": 
					if(args[3] == "true") sT.anonymous = true;
					if(args[3] == "false") sT.anonymous = false;
					break;
					
				case "updates": 
					if(args[3] == "false") sT.updNot = false;
					if(sT.updCha == "[EMPTY]"){
						msg.channel.send("You need to use ``$link updates`` in a Channel!")
						return
					}
					if(args[3] == "true") sT.updNot = true;
					break;
					
				case "deletion": 
					if(args[3] == "false") sT.delNot = false;
					if(sT.delCha == "[EMPTY]"){
						msg.channel.send("You need to use ``$link deletion`` in a Channel!")
						return
					}
					if(args[3] == "true") sT.delNot = true;
					break;
					
				case "status": 
					if(args[3] == "false") sT.statNot = false;
					if(sT.statCha == "[EMPTY]"){
						msg.channel.send("You need to use ``$link status`` in a Channel!")
						return
					}
					if(args[3] == "true") sT.statNot = true;
					break;
					
				default:
					msg.channel.send(client.EmojiMap.get("niko_upset"))
					msg.channel.send(`Sorry, but that isn't a valid option...`)
					return
					break;
			}
			
			cGuild.settings = JSON.stringify(sT)
			client.setSettings.run(cGuild)
			
			msg.channel.send(`You successfully changed **${args[2]}** to *${args[3]}*`)
			
			return
		}
		
			const s = JSON.parse(cGuild.settings)
			var string = ""
			
			if(s.updNot){
				string = `Update: Yes, in "${msg.guild.channels.cache.get(s.updCha).name}"\n` 
			}
			else{
				string = `Update: Disabled\n`
			}
			
			if(s.delNot){
				string = string + `Deletion: Yes, in "${msg.guild.channels.cache.get(s.delCha).name}"\n`
			}
			else{
				string = string + `Deletion: Disabled\n`
			}
			
			if(s.statNot){
				string = string + `Status: Yes, in "${msg.guild.channels.cache.get(s.statCha).name}"`
			}
			else{
				string = string + `Status: Disabled`
			}
			
			embed
			.addField("Anonymous",s.anonymous,false)
			
			.addField("Prefix",s.prefix,false)
			.addField("Notifications",string,false)
			
			.addField("Automatic deletion of my Commands in Seconds",s.delMsg / 1000,false)
			.addField("Disabled Commands",s.disaCmds,true)
			.addField("Users that are unable to use my Commands",s.banUser,false)
			
			msg.channel.send(embed)
			if(msg.member.permissions.has("ADMINISTRATOR")) msg.channel.send("You are able to edit these settings with ``$settings edit``.");
			return
		
	},
};



