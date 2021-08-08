
// Read and Write DB entries

const fs = require("fs")
const Discord = require('discord.js')

const SQLite = require("better-sqlite3");
const Database = new SQLite('./bin/data/database.sqlite');

const Size = Math.floor(fs.statSync('./bin/data/database.sqlite')["size"] / 1000.0)

const Cache = new Discord.Collection();

const DefaultGuilddata = {
  id: undefined,
  data: {},
  settings: {iconMode: "big", lang: "EN", prefix: "$"},
  version: 1000,
  lastChange: undefined
}

const DefaultUserdata = {
  id: undefined,
  points: 0,
  profile: {
    title: "",
    backgroundID: 0,
    private: false,
    quotes: []
  },
  stats: {level: 1, prestige: 0,
          strength: 10, constitution: 10,
          finesse: 10, charisma: 10,
          intelligence: 10, wits: 10,
          honor: 0},
  timers: [],
  rpgData: {
    inventory: {
      equipped: {
                  head: undefined, body: undefined,
                  arms: undefined, belt: undefined,
                  legs: undefined, boots: undefined,
                  trinket: undefined, accessoires: []
      }
    },
    skills: {
      active: [], known: []
    }
  },
  settings: {iconMode: "Big", lang: "EN"},
  version: 1000,
  lastChange: undefined
}

this.name = "databaseHandler.js"
this.logStyle = "[DB]"

global.log.debug(`Database of ${Size}KB loaded.`,this)

module.exports = {

  get(id,slots){

    let temp = undefined;
    let output = {};
    if(!slots)slots = "*";
    temp = global.client.guilds.cache.get(id);
    if(temp){ // GET GUILD

            let guilddata = Database.prepare("SELECT "+ slots +" FROM guilddata WHERE id = ?").get(id)

            console.log(guilddata);
            if(!guilddata){
              return(undefined)
            }
            else{

              Object.keys(guilddata).forEach(key => {
                switch(key){
                  case "id":
                  output.id = guilddata.id;
                  break;

                  case "data":
                  output.data = JSON.parse(guilddata.data)
                  break;

                  case "settings":
                  output.settings = JSON.parse(guilddata.settings);
                  break;

                  case "version":
                  output.version = guilddata.version;
                  break;

                  case "lastChange":
                  output.lastChange = guilddata.lastChange;
                  break;
                }
              })
              global.log.debug(`Loaded guilddata of "${id}"`)
            }
            return(output)
    }
    else{
      temp = global.client.users.cache.get(id);

      if(temp){ // GET USER

        let userdata = Database.prepare("SELECT "+ slots +" FROM userdata WHERE id = ?").get(id)

        console.log(userdata);
        if(!userdata){
          return(undefined)
        }
        else{

          Object.keys(userdata).forEach(key => {
            switch(key){
              case "id":
              output.id = userdata.id;
              break;

              case "points":
              output.points = userdata.points;
              break;

              case "profile":
              output.profile = JSON.parse(userdata.profile);
              break;

              case "stats":
              output.stats = JSON.parse(userdata.stats);
              break;

              case "timers":
              output.timers = JSON.parse(userdata.timers);
              break;

              case "inventory":
              output.inventory = JSON.parse(userdata.inventory);
              break;

              case "skills":
              output.skills = JSON.parse(userdata.skills);
              break;

              case "settings":
              output.settings = JSON.parse(userdata.settings);
              break;

              case "version":
              output.version = userdata.version;
              break;

              case "lastChange":
              output.lastChange = userdata.lastChange;
              break;
            }
          })
          global.log.debug(`Loaded userdata of "${id}"`)
        }
        return(output)

      }
      else{
        return(undefined)
      }
    }

  },

  set(input){

    let temp = global.client.guilds.cache.get(input.id);

    if(input.data = "default" && temp){
      let id = input.id;
      input = DefaultGuilddata;
      input.id = id;
    }

    let obj = {};
    obj.id = input.id;

    if(temp){ // Set Guilddata
      input.lastChange = new Date().getTime();
      let keys = Object.keys(input);

      let slots1 = "";
      let slots2 = "";
      keys.forEach(key => {
        switch(key){
          case "id":
          break;

          case "data":
          obj.data = JSON.stringify(input.data);
          slots1 += ",data";
          slots2 += ",@data";
          break;

          case "settings":
          obj.settings = JSON.stringify(input.settings);
          slots1 += ",settings";
          slots2 += ",@settings";
          break;

          case "version":
          obj.version = JSON.stringify(input.version);
          slots1 += ",version";
          slots2 += ",@version";
          break;

          case "lastChange":
          obj.lastChange = JSON.stringify(input.lastChange);
          slots1 += ",lastChange";
          slots2 += ",@lastChange";
          break;

          default:
          global.log.warn(`Unknown Key found when setting data: ${key}`)
          break;
        }
      })

      console.log(Database.prepare("INSERT OR REPLACE INTO guilddata (id"+ slots1 + ") VALUES (@id"+ slots2 +");").run(obj));

      return(true)
    }
    else { // Set Userdata
      temp = global.client.users.cache.get(input.id);

      if(input.data = "default" && temp){
        let id = input.id;
        input = DefaultUserdata;
        input.id = id;
      }

      if(temp){
        input.lastChange = new Date().getTime();
        let keys = Object.keys(input);

        let slots1 = "";
        let slots2 = "";
        keys.forEach(key => {
          switch(key){
            case "id":
            break;

            case "points":
            obj.points = input.points;
            slots1 += ",points";
            slots2 += ",@points";
            break;

            case "profile":
            obj.profile = JSON.stringify(input.profile);
            slots1 += ",profile";
            slots2 += ",@profile";
            break;

            case "stats":
            obj.stats = JSON.stringify(input.stats);
            slots1 += ",stats";
            slots2 += ",@stats";
            break;

            case "timers":
            obj.timers = JSON.stringify(input.timers);
            slots1 += ",timers";
            slots2 += ",@timers";
            break;

            case "rpgData":
            obj.rpgData = JSON.stringify(input.rpgData);
            slots1 += ",rpgData";
            slots2 += ",@rpgData";
            break;

            case "settings":
            obj.settings = JSON.stringify(input.settings);
            slots1 += ",settings";
            slots2 += ",@settings";
            break;

            case "version":
            obj.version = input.version;
            slots1 += ",version";
            slots2 += ",@version";
            break;

            case "lastChange":
            obj.lastChange = input.lastChange;
            slots1 += ",lastChange";
            slots2 += ",@lastChange";
            break;

            default:
            global.log.warn(`Unknown Key found when setting data: ${key}`)
            break;
          }
        })

        console.log(Database.prepare("INSERT OR REPLACE INTO userdata (id"+ slots1 + ") VALUES (@id"+ slots2 +");").run(obj));

        return(true)
      }
      else{ // Fail if none worked
        global.log.error(`Couldn't save Data of "${input.id}" - Nowhere to save`)
        return(false)
      }

    }


  }


}
