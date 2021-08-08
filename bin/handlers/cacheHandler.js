

// DEPRECATED

const Discord = require('discord.js')
const fs = require('fs')

let cacheRaw
let cache = new Discord.Collection();

module.exports = {

name: "cacheHandler",
logStyle: "[CACHE]",

  check(){
    global.handlers.log.debug(this,"Checking Cache")
    fs.readFile('C:/bot-onepointzero/discord/data/cache.json','utf8', (err, jsonString) => {
      if(err) {
        global.handlers.log.debug(this,"No Cache found, creating new.")
        fs.writeFile('C:/bot-onepointzero/discord/data/cache.json','', err => {
          if(err){
            //remove console
            global.handlers.log.error(this,"FAILED TO CREATE NEW CACHE")
            return
          }

        })
        return(false)
      }
      cacheRaw = jsonString
      return(true)
    })
  },

  load(){
    console.time("Loading Cache")

    cache = new Discord.Collection(JSON.parse(cacheRaw))
    console.log(cache)

    console.timeEnd("Loading Cache")
  },

  read(index){

  },

  write(index,data){

  },

  delete(index){

  },

  wipe(){

  },

  size(){

  }

}
