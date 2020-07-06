module.exports = {
	name: 'kill',
	aliases: ['ded', 'delete'],
	description: 'Kills the mentioned User.',
	category: 'fun',
	args: true,
	usage: '<Mention User>',
	guild: true,
	async execute(client,msg,args,userdata) {
		
		msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
		msg.channel.send(`Sorry but this is currently disabled...`)
		return
		
	



	},
};

