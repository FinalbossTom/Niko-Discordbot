

// DEPRECATED


const Discord = require('discord.js')
const fs = require('fs')

const Instance = require('../classes/instance.js')
const InstanceMap = new Discord.Collection()

module.exports = {

name: "instanceHandler",
logStyle: "[INSTANCE]",


check(id){
return(InstanceMap.has(id))
},

get(id){

if(InstanceMap.has(id)){
  return(InstanceMap.get(id))
}
else{
  return(new(id))
}

},

destroy(id){
  delete InstanceMap.get(id)
  InstanceMap.delete(id)
  console.log(InstanceMap)
},

new(id){

if(this.check(id)){
  destroy(id)
}

let tempInstance = Instance.new()
tempInstance.setup(2)

InstanceMap.set(id,{instance: tempInstance, delTimer: setTimeout(function(){console.log(this)},5000)})
},



clear(){

},


}
