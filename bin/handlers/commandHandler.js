const Discord = require('discord.js')
const fs = require ('fs')

this.name = "commandHandler.js"
this.logStyle = "[CMD]"

// Load Commands
console.time("Commands")
global.commands = new Discord.Collection();

const commandDirectories = fs.readdirSync('./bin/commands').filter(file => !file.endsWith('.js') && file != "deactivated")
global.log.debug('Loading from ' + commandDirectories.length + ' Directories',this)

commandDirectories.forEach(dir => {
  const files = fs.readdirSync(`./bin/commands/${dir}`).filter(file => file.endsWith('.js'))

  global.log.debug(`Loading ${files.length} Commands from ${dir}`,this)

  files.forEach(file => {
    const command = require(`../commands/${dir}/${file}`)
    global.commands.set(command.namespace, command)
    global.log.debug(`Loaded ${file}`,this)
  })
})
global.log.debug(`Loaded a total of ${global.commands.size} Commands`,this)
console.timeEnd("Commands")


module.exports = {

  get(name){

  },

  run(name){

  },

  reload(){
    // Load Commands
    console.time("Reload Commands")
    global.commands.clear();

    global.log.debug('Loading from ' + commandDirectories.length + ' Directories',this)

    commandDirectories.forEach(dir => {
      const files = fs.readdirSync(`./bin/commands/${dir}`).filter(file => file.endsWith('.js'))

      global.log.debug(`Loading ${files.length} Commands from ${dir}`,this)

      files.forEach(file => {
        const command = require(`../bin/${dir}/${file}`)
        global.commands.set(command.name, command)
        global.log.debug(`Loaded ${file}`,this)
      })
    })
    global.log.debug(`Loaded a total of ${global.commands.size} Commands`,this)
    console.timeEnd("Reload Commands")
  }

}
