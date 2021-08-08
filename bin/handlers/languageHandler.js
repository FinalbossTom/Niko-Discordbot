

const EN = require('C:/bot-onepointzero/discord/lang/EN.json')
const DE = require('C:/bot-onepointzero/discord/lang/DE.json')

this.name = "languageHandler.js"
this.logStyle = "[LANG]"

module.exports = { // fix this piece of garbage

  get(langID,namespace,id,isReturning){


    console.log(`langID: ${langID} , namespace: ${namespace} , id: ${id}`)
    if(!id){
      global.log.error(`No ID given for namespace: ${namespace}`)
      return(this.get(langID,"generic","error.genericFail"));
    }

    if(langID == "EN" && id == "error.noTranslation"){
      global.log.error("Call for unimplemented Text - langID: " + langID + " namespace: " + namespace + " ID: " + id)
    }

    let lang;
    let output = "";

    switch(langID){
      case "EN": lang = EN; break;
      case "DE": lang = DE; break;

      default: lang = EN; break;
    }


    let langObj = Object.entries(lang).filter(array => array[0] == namespace)[0]

    if(langObj){
      langObj = langObj[1]
    }
    else if(!isReturning){
      output = this.get(langID,"generic","error.noTranslation") + this.get("EN",namespace,id,true)
      return(output)
    }
    else {
      return("")
    }

    if(id == "description"){
      output = langObj.description
      return(output)
    }

    if(id.startsWith("error")){
      if(!Object.entries(langObj.error).filter(array => array[0] == id.slice(6))[0])return(this.get(langID,"generic","error.noTranslation") + this.get("EN",namespace,id));
      let answerArray = Object.entries(langObj.error).filter(array => array[0] == id.slice(6))[0][1]
      output = answerArray[Math.floor(Math.random() * answerArray.length)]
    }

    else if (id == "success"){
      if(!langObj.success)return(this.get(langID,"generic","error.noTranslation") + this.get("EN",namespace,id));
      let answerArray = langObj.success
      output = answerArray[Math.floor(Math.random() * answerArray.length)]
    }

    if(!output)output = this.get(langID,"generic","error.noTranslation") + this.get("EN",namespace,id)

    return(output)
  }
};
