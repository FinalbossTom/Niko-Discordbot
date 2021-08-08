
const cmdHandler = require('../handlers/commandHandler.js');

class Instance {

  guildID  = 0

  cmdQueue = []
  cdQueue  = []

  running = false

  setup(idInput){
    this.guildID = idInput
  }

  run(obj){
    this.cmdQueue.push({cmdName: obj.cmd, gUser: obj.gUser, guild: obj.guild})
    if(this.running == false){this.runQueue()}
  }

  runQueue(){
    this.running = true;
    let currentCmd = this.cmdQueue[0];

    //cmdHandler.run(currentCmd)

    this.cmdQueue.shift()
    if(this.cmdQueue.length >= 1){
      this.runQueue()
    }
    else{
      this.running = false
    }

  }


}

module.exports = {

  new(){
    return(new Instance)
  },



}
