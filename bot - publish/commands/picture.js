const Discord = require('discord.js')

var Imgur = require('imgur');
Imgur.setClientId('712741d783b59a0');

module.exports = {
	name: 'picture',
	aliases: ['pic'],
	description: 'Searches on Imgur for a random Picture. **(VERY BUGGY)**',
	category: 'useful',
	usage: '[Search String]',
	args: true,
	async execute(client,msg,args,userdata) {
	
	const optionalParams = {sort: 'top', dateRange: 'month', page: Math.floor(Math.random() * 6)}

		var msg2
		var content = ""

		
		await msg.channel.send("*Processing... please wait.*").then(message => {
			msg2 = message
		})
		
		try{
		
		await Imgur.search(args[1], optionalParams).then(function(json){
		const pic = json.data[Math.floor(Math.random() * json.data.length)]
		if(!pic){
			msg2.edit("I'm very sorry but something went horribly wrong...\n How about you try again?")
			return
		}
		
		if(!pic.images){
			if(pic.title != null)content = "**" + pic.title + "**\n";
			if(pic.description != null) content = content + pic.description + "\n";
			
			if(content.match("https://"))content = "";
			
			content = content + pic.link
		}else{
			if(pic.images[0].title != null)content = "**" + pic.images[0].title + "**\n";
			if(pic.images[0].description != null) content = content + pic.images[0].description + "\n";
			
			if(content.match("https://"))content = "";
			
			content = content + pic.images[0].link
		}
		})
		}catch(err){
			console.log(err)
		}
		
		msg2.edit(content);
		
	
	
	},
	
};

