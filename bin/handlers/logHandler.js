
const Format = require("sprintf-js").sprintf

module.exports = {

  debug(data,sender){
    if(!sender)console.log(Format(`[?] [LOG] ${data}`));
    else console.log(Format(`${sender.logStyle} [LOG] ${data}`));
    return(true)
  },

  warn(data,sender){
    if(!sender)console.warn(Format(`== [?] [WARN] ${data}`));
    else console.warn(Format(`== ${sender.logStyle} [WARN] ${data}`));
    return(true)
  },

  error(data,sender){
    console.log("\n=============== ERROR =================\n")

    if(!sender)console.error(new Error(data));
    else console.error(`${sender.logStyle} ${data}`);

    console.log("\n============ END OF ERROR =============\n")
    return(true)
  }

};


function updateUI(){
  console.clear()
  console.log(`Frame: ${temp}`)
  console.log(`CPU: ${process.cpuUsage(process.cpuUsage()).system}`)

  console.log("======== Errors =======")
  errorArray.forEach((error,index) => {
    console.log(`${index+1} ${error}`)
  })

  console.log("========= Logs ========")
  debugArray.forEach((log,index) => {
    console.log(`${index+1} ${log}`)
  })
  console.log("=======================")
  temp++;
}

//process.on('unhandledRejection', error => global.log.error('Uncaught Promise Rejection', error));
