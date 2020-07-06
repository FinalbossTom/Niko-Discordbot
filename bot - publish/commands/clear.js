const Discord = require('discord.js')

module.exports = {
	name: 'clear',
	aliases: ['clean'],
	description: 'Clears chatmessages. You can also use specific parameters.',
	category: 'admin',
	args: true,
	usage: '[Amount of Messages] (Parameter)\n The parameters are "bot" for deleting everything Bot-related\n or "spam" to clear spam',
	execute(client,msg,args,userdata) {
		
		if(!msg.member.permissions.has("ADMINISTRATOR")){
		msg.channel.send(`${client.EmojiMap.get("niko_speak")}`)
		msg.channel.send(`I'm sorry, but i can't let you do that!`)
		return
		}
		
		if(parseInt(args[1]) > 100){
			msg.channel.send(`${client.EmojiMap.get("niko_upset")}`)
			msg.channel.send("Sorry, but you are over the limit...\n I can only handle ``100 messages`` at a time.")
			return
		}
		
		if(parseInt(args[1]) <= 0){
			msg.channel.send(`${client.EmojiMap.get("niko_what")}`)
			msg.channel.send("I can't delete nothing...?")
			return
		}
		
		const filter = (reaction, user) => reaction.emoji.name === 'niko_answer_Stop' && user.id === msg.author.id
		
		if(!args[2]){
			msg.channel.send(`I'm about to delete \`\`${args[1]}\`\` messages!\n I'll wait 10 seconds before the deletion.\n You can cancel this by \`\`Reacting\`\` with the Emoji below.`)
				.then(m => {
				m.react(client.EmojiMap.get('Stop'))
				m.awaitReactions(filter, { time: 10000 , limit: 1})
				.then(collected => {
					if(collected.size == 0){
						msg.channel.bulkDelete(args[1])
						msg.channel.send("Deletion complete!")
					}else{
						msg.channel.send("Aborted deletion.")
					}
					
				})
				.catch(console.error)
				})
			return
		}
		const list = new Discord.Collection()
		
		if(args[2].match("bot")){
			msg.channel.messages.fetch({ limit: parseInt(args[1]) })
			.then(async messages => {
				messages.forEach(m => {
					if(m.author.bot)m.check = true;
					if(m.content.startsWith('!') || m.content.startsWith('%') || m.content.startsWith('+') || m.content.startsWith('$')) m.check = true;
					
					if(m.check){
						m.tagged
						list.set(m.id,m)
					}
				})
				
				msg.channel.send(`I'm about to delete \`\`${list.size}\`\` messages!\n I'll wait 10 seconds before the deletion.\n You can cancel this by \`\`Reacting\`\` with the Emoji below.`)
				.then(m => {
				m.react(client.EmojiMap.get('Stop'))
				m.awaitReactions(filter, { time: 10000 , limit: 1})
				.then(collected => {
					if(collected.size == 0){
						msg.channel.bulkDelete(list)
						msg.channel.send("Deletion complete!")
					}else{
						msg.channel.send("Aborted deletion.")
					}
					
				})
				.catch(console.error)
				})
				
			})
		}
		
		if(args[2].match("spam")){
		msg.channel.messages.fetch({ limit: parseInt(args[1]) })
			.then(async messages => {
				var beforem
				var temp = false
				messages.forEach(m => {
					
					if(temp){
						if(beforem.content == m.content)m.check = true;
					}else{
						temp = true
					}
					
					if(m.content.length <= 3)m.check = true;
					if(m.attachments.size >= 1)m.check = false;
					
					beforem = m;
					if(m.check){
						m.tagged
						list.set(m.id,m)
					}
				})
				
				msg.channel.send(`I'm about to delete \`\`${list.size}\`\` messages!\n I'll wait 10 seconds before the deletion.\n You can cancel this by \`\`Reacting\`\` with the Emoji below.`)
				.then(m => {
				m.react(client.EmojiMap.get('Stop'))
				m.awaitReactions(filter, { time: 10000 , limit: 1})
				.then(collected => {
					if(collected.size == 0){
						msg.channel.bulkDelete(list)
						msg.channel.send("Deletion complete!")
					}else{
						msg.channel.send("Aborted deletion.")
					}
					
				})
				.catch(console.error)
				})
				
				})
			}
		
	},
};
