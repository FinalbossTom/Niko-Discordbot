const config = require('../../config')
const Discord = require('discord.js')

const ytdl = require('ytdl-core')
const ytdldiscord = require('ytdl-core-discord')
const prism = require('prism-media');
const queue = new Map();

const Youtube = require('simple-youtube-api')
const youtube = new Youtube(config.googletoken)

var sleepTime
var expirationTime
var now


module.exports = {
	name: 'play',
	aliases: ['yt','video','music'],
	description: 'Plays a Song, specified by the User.',
	category: 'useful',
	args: true,
	usage: '<Name of Video> |OR| <direct Youtube link>',
	cost: 500,
	guild: true,
	execute(client,msg,args,userdata) {

return

		const searchString = args.slice(1).join(" ");
		const url = args[1]

		if(url.match("youtube.com/watch")){
			return
		}


		sendEmbed(client,msg,searchString)
		return

	},
};

async function sendEmbed(client,msg,searchString){

	const embed = new Discord.MessageEmbed();
	embed.setTitle("Select a Video!")
	.setFooter("Finalboss Tom's Manager",client.emojis.cache.get("683018113284833301").url)
	.setColor(0xfa4242)

	const videos = await youtube.searchVideos(searchString, 5)
	var index = 0

	while(index < 5){
		embed.addField(`${++index}`,videos[index - 1].title)
	}


	var embedMSG;
	await msg.channel.send(embed)
		.then((m) => {
			embedMSG = m;
	})


	const filter = (reaction, user) => user.id == msg.author.id;
	const collector = embedMSG.createReactionCollector(filter, {max: 1, time: 20000});
	collector.on('collect',async r => {

	const I = parseInt(r.emoji.name.split("_").slice(2).join())
	var video = await youtube.getVideoByID(videos[I - 1].id)

	handleVideo(client,msg,video)
	return
	});

	await embedMSG.react(client.EmojiMap.get('1'))
	await embedMSG.react(client.EmojiMap.get('2'))
	await embedMSG.react(client.EmojiMap.get('3'))
	await embedMSG.react(client.EmojiMap.get('4'))
	await embedMSG.react(client.EmojiMap.get('5'))

	return true;
}

async function handleVideo(client,msg,video){

	const song = {
		id: video.id,
		title: video.title,
		url: `https://www.youtube.com/watch?v=${video.id}`
	};

	var Queue = client.serverQueue.get(msg.guild.id)

	if(!Queue){
		Queue = {
			textChannel: msg.channel,
			voiceChannel: msg.member.voice.channel,
			connection: null,
			songs: []
		};

		Queue.songs.push(song)

		const connection = await Queue.voiceChannel.join()
		Queue.connection = connection;
		client.serverQueue.set(msg.guild.id, Queue);
		play(client,msg,Queue.songs[0]);
		return
	}

	Queue.songs.push(song)
	client.serverQueue.set(msg.guild.id, Queue);
	msg.channel.send(`${client.EmojiMap.get("niko_speak")} **${song.title}** has been added to the queue!`);
	return
}

function play(client,msg,song) {
	const ytdl = require('ytdl-core')
	const queue = client.serverQueue.get(msg.guild.id);

	if (!song) {
		queue.voiceChannel.leave();
		client.serverQueue.delete(msg.guild.id);
		return;
	}
	console.log(`Now playing "${song.title}" in <${msg.guild.name}>`)
	const dispatcher = queue.connection.play(ytdl(song.url).on('progress', (L,done,total) => {
		console.log(`Download for ${msg.guild.name}: ${done} of ${total} bytes`)
	}),{volume: 0.04})
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log("Song ended because: " + reason);
			queue.songs.shift();
			play(client,msg,queue.songs[0]);
		})
		.on('error', error => console.error(error));
	queue.textChannel.send(`${client.EmojiMap.get("party_YT")} Now playing: \`\`${song.title}\`\``);
}
