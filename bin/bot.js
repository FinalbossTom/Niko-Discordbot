
const Config = require('../config')
const Discord = require('discord.js')
const fs = require ('fs')
global.fUtil = require('./classes/final-utils.js')

this.name = "bot.js"
this.logStyle = "[BOT]"


// MAIN HANDLERS GET INITILIAZED
console.time("Main Handlers")

global.log = require('./handlers/logHandler.js')
global.db = require('./handlers/databaseHandler.js')
global.lang = require ('./handlers/languageHandler.js')
global.cmd = require ('./handlers/commandHandler.js')

console.timeEnd("Main Handlers")

const Client = new Discord.Client({ intents: [
  Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_MEMBERS,
  Discord.Intents.FLAGS.GUILD_MESSAGES,
  Discord.Intents.FLAGS.DIRECT_MESSAGES],
                                    disableEveryone: true , fetchAllMembers:false ,
                                    presence: { activity: { type: "LISTENING" ,name: "your feedback" }}})


global.statistics = {
  cmd: {ran: 0, successful: 0, failed: 0},
  msg: {received: 0, sent: 0},
  startTime: new Date().getTime()
}


Client.EmojiMap = new Map();
global.CooldownMap = new Map();
// Load persistent cooldowns into memory here


//global.client = Client; // this is absolutely horrible and i know i shouldnt do this. Yet i did. - no i didnt lol

console.time("Client connection")
Client.login(Config.dctoken)

Client.on('warn',info => { global.log.debug(this,info)})
Client.on('error', error => { global.log.error(this,error)})

Client.on('ready', async () => {
  console.timeEnd("Client connection")

  // Fill EmojiMap
  Client.emojis.cache.forEach((emoji) => {
		if(emoji.name.match("niko_number_") || emoji.name.match("niko_answer_")){
		Client.EmojiMap.set(emoji.name.split('_')[2],emoji)
		return
		}
		Client.EmojiMap.set(emoji.name,emoji.toString())
	})

  global.log.debug("Client ready!",this)

  const testCommand = await Client.guilds.cache.get(Config.debugguild)?.commands.create({
    name: 'test',
    description: 'Test a person',
  })
  console.log(testCommand);

})


Client.on("guildCreate", guild => {

  global.log.debug("Joined new Guild: " + guild.name + " ID: " + guild.id,this)

  let embed = fUtil.newEmbed();
  embed
  .setThumbnail(Client.user.displayAvatarURL())
  .setTitle("Hi - I'm Niko!")
  .addField("This is just a Test...","But i'm sure that this works!")
  guild.systemChannel.send(embed).then(msg => {
    setupGuilddata(guild);
  })


})

Client.on('interactionCreate', async interaction => {
  if(!interaction.isCommand()) return;
  console.log(interaction)

  if(interaction.commandName === 'test'){
    await interaction.reply('Mhm.')
  }

})


// TODO: Switch to Slash Commands
Client.on('messageCreate', msg => {


  global.statistics.msg.received++;
  //console.log(msg)

  if(msg.author.bot)return;

  //global.db.set({data:"default",id:msg.author.id})

  let reContent;
  if(!msg.guild)reContent = handleDM(msg);
  else reContent = handleGM(msg);

  if(!reContent)return;
  // build answermessage here

  // reContent looks like this
  // {[text: "blabla"], [icon: "niko_speak"], [iconMode: "small"], status: "SUCCESS"}
  //  status: "Either success or a namespace of a error with the name following it like this: error.noTranslation"}
  // Only Status is required, all other things are optional.
  // BUT if the object has an icon, then it has to have a text as well. //fix this

  if(!reContent.text)return;

  // Insert data into the message string.
  if(reContent.text.includes("-$-")){
    let temp = reContent.text.split("-$-")
    console.log(temp)
    let i = 0;
    temp.forEach(part => {
      if(i%2 == 1){


        // IMPLEMENT A CHECK TO SEE IF EVAL IS SAVE SOMEHOW!!!
        // I DONT WANT ANY CODE EXCEPT FOR THE ONE COMING FROM THE (lang).json FILES
        temp[i] = eval(temp[i]);

        /* Old Implmentation. Way safer but very tedious...
        switch(part){ // do this part smarter, i really don't want to have to add 500 things...
          case "tagged.name": temp[i] = msg.mentions.users.first().username; break;
          case "author.name": temp[i] = msg.author.username; break;
          case "guild.name": temp[i] = msg.guild.name; break;
        }
        */
      }
      i++;
    })
    reContent.text = temp.join("");
  }

  // Insert Icon into Text and send the Message
  if(reContent.icon){
    let icon = Client.EmojiMap.get(reContent.icon);
    switch(reContent.iconMode){
      case "big":
      msg.channel.send(icon);
      msg.channel.send(reContent.text);
      break;

      case "small":
      msg.channel.send(icon + "\n" + reContent.text);
      break;

      case "none":
      default:
      msg.channel.send(reContent.text);
      break;
    }
  }

  return;
  // done

})


//===== Functions =====
//TODO: Update to work with Slash Commands

function handleDM(msg){

let prefix = "";
let userdata;

//if(msg.author.id != Client.owner.id)return; // Owner Check for debug purposes

userdata = global.db.get(msg.author.id);
if(!userdata){
  global.log.debug(`User [${msg.author.username}] @${msg.author.id} has no Userdata. Initiliazing Setup...`);
  setupUserdata(msg);
  return;
}

//rework this shit - dumb stupid retard you need to tell me how this shit even works
return({text: global.lang.get(userdata.settings.lang,"generic","error.unknownCommand"), icon: "niko_upset", status: "error.unknownCommand"})

}

function handleGM(msg){

  let prefix = "$";
  let guilddata;

  if(msg.guild.id != "676056003220865044")return; //debugguild check

 // get guilddata
  guilddata = global.db.get(msg.guild.id)
  if(!guilddata && msg.content.startsWith(prefix)){ //Errorcheck, in case the guild somehow does not have data stored (i.e. bot was added while its offline)
    global.log.warn("SERVER (" + msg.guild.id + ") DOES NOT HAVE GUILDDATA - Creating one now...")
    global.db.set({id: msg.guild.id, data: "default"})
    guilddata = global.db.get(msg.guild.id)
    msg.channel.send("*(Your server hasn't been setup yet, so default configurations have been put into place.)*")
    //return({text: "Somehow, your Server does not have any Data stored?\nThis shouldn't be possible, so it might be a good time to ask Tom for help...", icon: "niko_wtf", status: "FAIL5"});
  }


  prefix = guilddata.settings.prefix;

  // check for prefix

  if(!msg.content.startsWith(prefix))return;

  // get userdata
  // Skipping this as it'll only be needed later

  const Userdata = global.db.get(msg.author.id,"version")
  if(!Userdata){
    msg.channel.send("Oh, you seem new to me...\nCould you please first of all send me a ``Private Message`` so we can create a Profile for you?")
    return;
  }
  console.log(Userdata);


  // search if command exists
  const CommandName = msg.content.slice(prefix.length).split(" ")[0]
  const Args = msg.content.split(" ")
  Args.shift()

  const Command = global.commands.get(CommandName)

  // check if everything is in place in order to run the command

  if(!Command){
    return({text: global.lang.get(guilddata.settings.lang,"generic","error.unknownCommand"), icon: "niko_speak", iconMode: guilddata.settings.iconMode, status: "error.unknownCommand"})
  }

  // run command and work through the return

  let reContent = Command.execute({message: msg});


  // Set Cooldown
  if(Command.persistent){
  console.log("Set Persistent Cooldown: " + new Date(global.fUtil.stringToTimestamp(Command.cooldown) + Date.now()));
  }
  else{
    console.log("Set Fleeting Cooldown: " + new Date(global.fUtil.stringToTimestamp(Command.cooldown) + Date.now()));
  }

  //translate text here
  console.log(reContent)

  reContent.text = global.lang.get(guilddata.settings.lang,CommandName,reContent.status)
  reContent.iconMode = guilddata.settings.iconMode

  // return({text: "blabla", icon: "niko_speak", iconMode: "small", status: "error.noTag"})
  //           output text           icon name      big,small,none    error.{name} or success

  return(reContent) //PUT ANSWER HERE

  //console.log(global.db.get("137552001365049345"))

}

function setupUserdata(msg){ // TODO: make this supported by the lang files

  let embed = fUtil.newEmbed();
  embed
  .setThumbnail(Client.user.displayAvatarURL())
  .setTitle("The Rules that apply")
  .setDescription("Hey, i see that you are eager to finally interact with me, however before we start i would like to introduce some rules first.\nPlease read them carefully:")
  .addField("Macros/Scripts or similiar","For some people these sound tempting, however it greatly increases the load on this bot, which makes performance a real pain.\nPlease refrain from using anything like it.")
  .addField("Exploits","This Bot is in a somewhat early state, so Bugs and similiar are to be expected, however taking advantage of them is kinda... dumb.\nSo ${Tom} will instead reward those who help finding bugs!")
  .addField("The \"third Rule\"","This rule is kind of simple, except it isn't: Don't do anything that would force ${Tom} to change or add to these rules.\nIf you are somehow unsure about anything, it's always better to ask.")
  .setFooter("In case of Questions, you can find ${Tom} on [this Discord Server]")

  msg.reply(embed).then(async m => {
    m.react("✅");
    const filter = (reaction, user) => user.id == msg.author.id;
    const collector = m.createReactionCollector(filter, {max: 1, time: 120000});

    collector.on('end',async r => {
      if(r.first()){
        global.log.debug("Success")
        global.db.set({data:"default",id: msg.author.id})
        let e = fUtil.newEmbed();
        e
        .setThumbnail(Client.user.displayAvatarURL())
        .setTitle("Thank you for accepting the Rules!")
        m.edit(e);
        return
      }
      else{
        global.log.debug("Fail")
        let e = fUtil.newEmbed();
        e
        .setThumbnail(Client.user.displayAvatarURL())
        .setTitle("Rules Denied")
        m.edit(e);
        return
      }
  })
})

}

//console.log(global.lang.get("DE","test","success"))
