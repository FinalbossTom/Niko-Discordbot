module.exports = {
	name: 'skip',
	aliases: ['next', 'nextsong', 'killsong'],
	description: 'Skips the Song that is currently playing.',
	category: 'useful',
	execute(client,msg,args,userdata) {
		
		if(!msg.guild.voice){
			msg.channel.send(`${client.EmojiMap.get("niko_huh")}`)
			msg.channel.send(`I am not playing anything...?`)
			return
		}
		
		let UserVC = msg.member.voice.channel
		if(!UserVC){
			msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
			msg.channel.send(`You have to be in my Voicechannel to stop me!`)
			return
		}
		
		let ClientVC = msg.guild.me.voice.channel;
		
		if(UserVC.id === ClientVC.id){
			client.serverQueue.get(msg.guild.id).connection.dispatcher.end(`${msg.author.username} used "$skip"`)
			msg.channel.send(`Alright! I am skipping to the next Song now.`)
		} else {
			msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
			msg.channel.send(`You have to be in my Voicechannel to skip a song!`)
		}
	},
};
