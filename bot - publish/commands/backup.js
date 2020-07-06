const Discord = require('discord.js')

const fs = require('fs')

const SQLite = require("better-sqlite3");

module.exports = {
	name: 'backup',
	description: 'Backup the database',
	category: 'useful',
	exclude: true,
	execute(client,msg,args,userdata) {

		if(msg.author.id != client.owner)return;

		const name = Date.now()
		fs.copyFile('./databases/database.sqlite', `./databases/${name}.sqlite`, (err) => {
  		if (err) throw err;
  		client.sendMessage(msg,true,`Created Backup.\nName: \`\`${name}.sqlite\`\``)
		});



	},
};
