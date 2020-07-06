module.exports = {
	name: 'stop',
	aliases: ['stopmusic'],
	description: 'Stops the Song that is currently playing.',
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
			client.serverQueue.get(msg.guild.id).connection.dispatcher.end(`${msg.author.username} used "$stop"`)
			msg.guild.me.voice.setChannel(null)
			msg.channel.send(`${client.EmojiMap.get("niko_upset")}`)
			msg.channel.send(`The party is over...`)
			client.serverQueue.songs = [];
		} else {
			msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
			msg.channel.send(`You have to be in my Voicechannel to stop me!`)
		}
	},
};
