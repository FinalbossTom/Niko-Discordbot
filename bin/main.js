console.time("Boot Sequence")

const EventEmitter = require('events');
class mainClientClass extends EventEmitter {};

const MainClient = new mainClientClass();
global.MainClient = MainClient;

let bot = require('./bot.js')

MainClient.on('restart', () => {
  global.client.destroy();
  setTimeout(function(){
    bot = require('./bot.js')
  }, 5000);
})


console.timeEnd("Boot Sequence")
