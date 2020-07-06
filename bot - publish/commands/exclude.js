module.exports = {
	name: 'exclude',
	description: 'Deactivates all of my features for you.',
	category: 'useful',
	async execute(client,msg,args,userdata,creatures) {
	

	
		msg.channel.send(client.EmojiMap.get("niko_upset"))
        msg.channel.send(`You are about to deactivate your profile for me.\nThis means that i will no longer react to anything you do.\n**Are you sure about this?**`)
		
		const filter = (reaction,user) => user.id === msg.author.id
		
        try {
		await msg.react(client.EmojiMap.get('yes'))
		await msg.react(client.EmojiMap.get('no'))
		msg.awaitReactions(filter,{time:10000}).then(input => {
		reaction = input.first()
		
		if(!reaction){
			msg.channel.send(client.EmojiMap.get("niko_speak"))
			msg.channel.send(`I cancelled the selection, as you didn't react fast enough.`)
			return
		}
		
		if(reaction.emoji == client.EmojiMap.get('yes')){
			msg.channel.send(client.EmojiMap.get("niko_cry"))
			msg.channel.send(`It's sad to see you go, but you can always come back, by simply using \`\`$include\`\` or \`\`$help\`\`...`)
			const data = client.getuserdata.get(msg.author.id)
			data.excluded = 1
			client.setuserdata.run(data)
			return
		}
		
		if(reaction.emoji == client.EmojiMap.get('no')){
			msg.channel.send(client.EmojiMap.get("niko_excited"))
			msg.channel.send(`I knew you wouldn't leave me just like that!`)
			return
		}
		
		console.log("Error.")
		return
		}
		
		)
		} catch(error){
			msg.channel.send("Something went wrong...?")
			console.log(error)
			return
		}
		
	
	
	},
};