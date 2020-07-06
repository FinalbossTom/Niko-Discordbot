module.exports = {
	name: 'timeout',
	aliases: ['mute'],
	description: 'Mutes a User for a specified amount of time.',
	usage: '[Mention User] (Time in Minutes)',
	category: 'admin',
	guild: true,
	async execute(client,msg,args,userdata) {
	
	if(!msg.member.permissions.has("ADMINISTRATOR")){
		msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
		msg.channel.send(`I'm sorry, but i can't let you do that!`)
		return
	}
	
	const target = msg.mentions.members.first()
	var time = args[2]
	var mutedRole
	
	if(!target){
		msg.channel.send(`${client.EmojiMap.get("niko_huh")}`)
		msg.channel.send(`Well... i do have to know who to mute, you know?\nPlease tag someone using "@"`)
		return
	}
	
	
	if(!msg.guild.roles.cache.find(role => role.name == "Muted by Niko")){
		await msg.guild.roles.create({data:{ name: "Muted by Niko", color: 0xfa4242, permissions: 0, position: client.RoleMap.get(msg.guild.id).position}, reason:'Used to mute people with $mute',})
		.then(role => {
		mutedRole = role
		})
	}else{
		mutedRole = msg.guild.roles.cache.find(role => role.name == "Muted by Niko")
	}
	
	msg.guild.channels.cache.forEach((channel) => {
		if(channel.type == "text"){
		channel.updateOverwrite(mutedRole,{ 'SEND_MESSAGES': false }, 'Makes the User unable to Write.')
		}
		})
	
	if(!target.roles.cache.has(mutedRole.id)){
		if(!time){
		msg.channel.send(`You haven't specified for how long i should mute them...\n I'm setting it to \`\`5 Minutes\`\`.`)
		time = 5
		}
	target.roles.add(mutedRole)
	timeOut(client,msg,target,time,mutedRole)
	msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
	msg.channel.send(`I have muted \`\`${target.user.username}\`\` for \`\`${time}\`\` minutes!`)
	}else{
		target.roles.remove(mutedRole.id)
		msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
		msg.channel.send(`I have unmuted \`\`${target.user.username}\`\`!`)
	}
	
	
	},
};

function timeOut(client,msg,target,time,mutedRole){
	setTimeout(() => {
		if(target.roles.cache.has(mutedRole.id)){
		msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
		msg.channel.send(`The time for \`\`${target.user.username}\`\` is up!\n Unmuting them now...`)
		}
		}, time * 60000);
	setTimeout(() => {target.roles.remove(mutedRole.id)}, time * 60000 + 2000);
}