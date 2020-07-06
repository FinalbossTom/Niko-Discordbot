const Discord = require('discord.js')

module.exports = {
	name: 'job',
	aliases: ['j','jobs','work'],
	description: 'View and Select from a bunch of Jobs!',
	category: 'economy',
	exclude: true,
	execute(client,msg,args,userdata) {

		if(userdata.data.stats.version < 16){
			client.sendMessage(msg,"Outdated Profile","Sorry, but you need to update your profile, before being able to use this!\nSimply use ``$me``!","niko_speak")
			return
		}


		if(!args[1] && args[0] != "$jobs"){
			triggerJob(client,msg,userdata)
			return
		}

		if(args[0] == "$jobs" || args[1] == "list"){

			let rows = [`‏‏‎ \n`,`‏‏‎ \n`,`‏‏‎ \n`]
			let counter = 0;
			let currentRow = 0;
			client.getJobList().forEach(job => {
				counter++;
				rows[currentRow] += `**${counter}** - ${job.data.name}\n`
				if(counter == 10){
					counter = 0
					currentRow++;
				}
			})


			let embed = new Discord.MessageEmbed();
			embed.setTitle("All currently available Jobs!")
			.setFooter("Niko - Finalboss Tom's Manager")
			.setDescription("Use ``$job [NUMBER]`` to view more info about it,\nor to join it!")
			.addField("===========",rows[0],true)
			.addField("===========",rows[1],true)
			.addField("===========",rows[2],true)

			client.sendMessage(msg,true,embed)
			return
		}


		if(!isNaN(parseInt(args[1])) || client.getJobByName(args[1])){
			let job;
			if(client.getJobByName(args[1])){job = client.getJobByName(args[1])}
			else{job = client.getJob(parseInt(args[1]) - 1)}

			if(!job){
				return
			}

			let paymentArray = []

			Object.keys(job.data.payment).forEach((key, index) => {
				paymentArray.push([`**${key}**`, index])
			})

			Object.values(job.data.payment).forEach((value, index) => {
				paymentArray[index][1] = value
			})

			paymentArray.forEach((part, index, array) => {
				array[index] = part.join(": ")
			})

			paymentArray = paymentArray.join("\n")

			let embed = new Discord.MessageEmbed();
			embed.setTitle(job.data.name)
			.setDescription(job.data.description)
			.addField("Perks",paymentArray,true)
			.addField("Cooldown",`\`\`${Math.floor(job.data.cooldown / 3.6e+6)} hours\`\``,true)

			if(!userdata.data.job && userdata.data.job != 0){
				embed.addField("Options","Use :white_check_mark: to join this job!")
			}
			else{
				if(userdata.data.job == job.id){
					embed.addField("Options","Use :x: to leave this job!")
				}
				else{
					embed.addField("Options","Use :white_check_mark: to **leave your old job** and instead join this one!")
				}
			}


			client.sendMessage(msg,true,embed)
			.then(async m => {
				const filter = (reaction, user) => user.id == msg.author.id;
				const collector = m.createReactionCollector(filter, {max: 1, time: 30000});

				collector.on('end',r => {
					if(!r.first()){
						m.reactions.removeAll()
						return
					}
					switch(r.first().emoji.name){
						case "✅":
						let resultEmbed = new Discord.MessageEmbed();
						resultEmbed.setFooter("Niko - Finalboss Tom's Manager")
						.setTitle(`You now work as a **${job.name}**!`)
						.setColor(0x14f53c)
						userdata = client.getUserdata(msg.author.id)
						userdata.data.job = job.id
						client.setUserdata(userdata)
						m.edit(resultEmbed)
						m.reactions.removeAll()
						break;
						case "❌":
						userdata = client.getUserdata(msg.author.id)
						userdata.data.job = undefined
						client.setUserdata(userdata)
						default:
						m.reactions.removeAll()
						return
						break;
					}
				})
				try{
				if(!userdata.data.job && userdata.data.job != 0){await m.react("✅")}
				else{
					if(userdata.data.job == job.id){await m.react("❌")}
						else{
						await m.react("✅")
						}
					}
				}
				catch(error){}
			})
			return
		}

	},
};

function triggerJob(client,msg,userdata){

if(!userdata){
	client.sendMessage(msg,"No Profile","Sorry, but you need to setup a profile, using ``$me`` in order to use this!","niko_speak")
	return
}

if(!userdata.data.job && userdata.data.job != 0){
	client.sendMessage(msg,"No Job","Sorry, but you currently don't have a job!\nUse ``$jobs`` or ``$job list`` to search for one.","niko_speak")
	return
}

const date = new Date()

date.setTime(userdata.data.jobCooldown - Date.now())

if(date.getTime() > 0){
	client.sendMessage(msg,"Job on Cooldown",`Sorry, but you still have to wait for \`\`${date.getHours()-1}:${date.getMinutes()}:${date.getSeconds()}\`\`, until you can attend your job again!`,"niko_speak")
	return
}

const job = client.getJob(userdata.data.job)

let events = [];
job.data.events.forEach(eve => {
	events.push(eve.type)
})

// RNG
let roll = 0;
let gob = (Math.round(Math.random() * (100 + userdata.data.stats.luck / 4)) >= 20)

if(gob){
	roll = Math.round((Math.random() * 1000) + userdata.data.stats.luck)
}
else{
	roll = Math.round((Math.random() * -1000) + userdata.data.stats.luck)
}

while(!events.find(type => type == roll)){
	if(roll < 0)roll++;
	if(roll > 0)roll--;
	if(roll == 0)break;
}



let Event = job.data.events.find(eve => eve.type == roll)

// BUILD OUTPUT STRING
let eventString = Event.string
let eventArray = []
let users = msg.guild.members.cache.random(Event.users)
eventString.split("$").forEach(part => {
	if(part == "user1" && Event.users >= 1)part = users[0].user.username;
	if(part == "user2" && Event.users >= 2)part = users[1].user.username;
	if(part == "user3" && Event.users >= 3)part = users[2].user.username;
	if(part == "user4" && Event.users >= 4)part = users[3].user.username;
	if(part == "user5" && Event.users >= 5)part = users[4].user.username;
	eventArray.push(part)
})
eventString = eventArray.join("**")



let rewardString = ``

if(Event.perks.pancakes){
	userdata.data.points += Event.perks.pancakes;
	rewardString += `\n **${Event.perks.pancakes}** :pancakes:`
}
if(Event.perks.xp){
	userdata.data.xp += Event.perks.xp;
	rewardString += `\n **${Event.perks.xp}** XP`
}
if(Event.perks.honor){
	userdata.data.stats.honor += Event.perks.honor;
	rewardString += `\n **${Event.perks.honor}** :beginner:`
}

if(Event.perks.items){
	let amount = Event.perks.items.amount;
	let value = Event.perks.items.value;

	let counter = 0;

	while(counter < amount){
		if(userdata.data.inventory.stored.length < userdata.data.inventory.max){
			let item = client.createRandomItem(undefined,undefined,undefined,Math.floor(value / amount))
			userdata.data.inventory.stored.push(item)
			rewardString += `\n ${item.icon}**${item.modifier} ${item.name}**`
		}
		else{
			rewardString += `\n *(Item lost, due to not enough inventory space)*`
		}
		counter++;
	}
}

userdata.data.jobCooldown = Date.now() + job.data.cooldown

client.setUserdata(userdata);
client.sendMessage(msg,true,`${eventString}\n=================\nGained:${rewardString}\nCome back in ${job.data.cooldown / 3.6e+6} hours!`,"niko_speak")
return
}
