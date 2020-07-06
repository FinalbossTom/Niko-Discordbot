const Discord = require('discord.js')
const SQLite = require("better-sqlite3");
const database = new SQLite('./databases/database.sqlite');

module.exports = {
	name: 'leaderboard',
	aliases: ['ranks', 'top10', 'themostepicpeople'],
	description: 'Shows a Leaderboard of the Top 10 pointholders.',
	category: 'economy',
	execute(client,msg,args,userdata) {

	const all = database.prepare("SELECT * FROM userdata ORDER BY id DESC;").all();

	const col = new Discord.Collection();

	all.forEach(user => {
		col.set(user.id,user)
	})

	col.sort((userA, userB) => JSON.parse(userB.data).points - JSON.parse(userA.data).points)

	const embed = new Discord.MessageEmbed()

	embed
    .setTitle("Point leaderboard")
    .setFooter("Finalboss Tom's Manager",client.emojis.cache.get("683018113284833301").url)
    .setDescription("The top pancake leaders!")
    .setColor(0x00AE86)

	.addField("=====","Place",true)
	.addField("======================","Status\nUsername",true)
	.addField("============","Level\nPancakes",true)

	var i = 0
	var total = 0;
	col.forEach(user => {
		if(i > 6){
			return
		}
		const dUser = client.users.cache.get(col.findKey(data => user.id == data.id))
		let place = ``
		let status = ``
		if(!dUser)return;

		switch(i){
			case 0: place = `:crown:`; break;
			case 1: place = `:second_place:`; break;
			case 2: place = `:third_place:`; break;
			default: place = `:black_small_square:`; break;
		}

		switch(dUser.presence.status){
			case "online": status = `:green_circle: Online`; break;
			case "idle": status = `:orange_circle: Away`; break;
			case "dnd": status = `:red_circle: Busy`; break;
			case "offline": status = `:black_circle: Offline`; break;
		}

		embed.addField(`${place}`,`${i+1}.`,true)
		embed.addField(`${status}`,`**${dUser.username}**`,true)
		embed.addField(`**Level ${JSON.parse(user.data).level}**`,`${client.formatNumber(JSON.parse(user.data).points)} :pancakes:`,true)
		i++;
		total += JSON.parse(user.data).points;
	})

	embed.addField(`Total :pancakes: on Leaderbard`,`__**${client.formatNumber(total)}**__`,true)
	msg.channel.send(embed);
}, // END OF EXECUTE




	getRank(client,userid){


	let output = {rank: "?", place: "?", status: "?"}
	userdata = client.getUserdata(userid)

	if(!userdata)return(output);
	if(!userdata.data.stats)return(output);

	const all = database.prepare("SELECT * FROM userdata ORDER BY id DESC;").all();
	const col = new Discord.Collection();

	all.forEach(user => {
		col.set(user.id,JSON.parse(user.data))
	})

	col.sort((userA, userB) => userB.points - userA.points)

	let i = 1
	col.forEach(user => {
		user.rank = i
		i++;
	})

	const user = col.get(userid)

	output.rank = user.rank
		switch(output.rank){
			case 1: output.place = `:crown:`; break;
			case 2: output.place = `:second_place:`; break;
			case 3: output.place = `:third_place:`; break;
			default: output.place = `:black_small_square:`; break;
		}

		switch(client.users.cache.get(userid).presence.status){
			case "online": output.status = `:green_circle: Online`; break;
			case "idle": output.status = `:orange_circle: Away`; break;
			case "dnd": output.status = `:red_circle: Busy`; break;
			case "offline": output.status = `:black_circle: Offline`; break;
		}

	return(output)

	}

};
