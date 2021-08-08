
const Discord = require('discord.js')
const fs = require ('fs')

module.exports = {

  newEmbed(){
    const embed = new Discord.MessageEmbed();
    embed
    .setFooter(`Finalboss Tom's Manager`,client.EmojiMap.get("niko").url)
    .setColor(0xffffff)

    return(embed)
  },

  progressBar(current = 0,max = 100,parts = 10){
    let output = {string: ``, percent: Math.floor((current / max) * 100), parts: 0}
    let value = Math.round((current / max) * parts)
    while(output.parts < parts){
      if(value > 0){
        output.string += ":green_square:";
        value--;
      }
      else{
        output.string += ":black_large_square:"
      }
      output.parts++;
    }
    return(output)
  },

  formatNumber(Number = 0){
    let i = 1;
    let NumberArray = String(Number).split("")
    let output = []

    NumberArray.reverse()

    while(NumberArray.length != 0){
      output.unshift(NumberArray[0])
      NumberArray.shift()
      if(i == 3 && NumberArray.length != 0){
        output.unshift(".")
        i = 0
      }
      i++;
    }

    return(output.join(""))
  },

  stringToTimestamp(input){
    var x = parseFloat(input);
    switch(input.charAt(input.length-1)){
      case "d": x *= 24;
      case "h": x *= 60;
      case "m": x *= 60;
      case "s": x *= 1000;
    }
    return(x);
  }


}

/*
client.sendMessage = function(msg,Code,Content,EmojiName){
  if(Code === true){
    console.log("Success!")
  }
  else{
    console.log(`Failed: ${Code}`)
  }
  if(!EmojiName){
    return(msg.channel.send(Content))
  }
  if(EmojiName.startsWith(":")){
    msg.channel.send(EmojiName)
    msg.channel.send(Content)
    return(true)
  }
  msg.channel.send(client.EmojiMap.get(EmojiName))
  msg.channel.send(Content)
  return(true)
}

*/
