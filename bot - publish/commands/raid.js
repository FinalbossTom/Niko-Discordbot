const Discord = require('discord.js')

module.exports = {
	name: 'raid',
	description: 'Crash the bot. (Or don\'t.)',
	category: 'fun',
	guild: true,
	exclude: true,
	execute(client,msg,args,userdata) {

		msg.channel.send("**DOWNLOAD RAID SHADOW LEGENDS!**\n**__FREE__ ON THE APP STORE AND GOOGLE PLAY STORE FOR IOS AND ANDROID!!**\n**AND IF YOU USE CODE ``APORED`` IN THE REFERENCE TAB YOU CAN GET 50K GOLD AND A __FREE__ EPIC CHAMPION!!!!!!**")
		return;
	},
};
