const Discord = require('discord.js')
const SQLite = require("better-sqlite3");
const database = new SQLite('./databases/database.sqlite');

module.exports = {
	name: 'inspect',
	description: 'Look at the stats of an Item.',
	aliases: ['i','lunz'],
	category: 'economy',
	exclude: true,
	execute(client,msg,args,userdata) {


			if(!args[1]){
				client.sendMessage(msg,"No ID given","You have to tell me the ID of the Item!","niko_speak")
				return
			}

			const item = client.getBaseItem(parseInt(args[1]))
			if(!item){
				client.sendMessage(msg,"Invalid ID","Sorry, but that ID is invalid!","niko_speak")
				return
			}

			client.sendMessage(msg,true,client.getItemEmbed(item))
	},
};
