
module.exports = {

	namespace: 'test', // universal and unique name used as a namespace in language files
	description: '', //description, shown in /preview
	global: false, //wether this is a guild specific command or not

	level: 'debug', // Levels: everyone, role, admin, operator, owner, debug -- defines who is able to use the command
	hidden: false, // wether this command is hidden in the "help" command

	cooldown: '10s', // Cooldown in Seconds, Minutes, Hours or Days
	persistent: false, // Wether the Cooldown should not be reset after a restart (if persistent then it will stay)

	execute(Obj) {

		var msg = Obj.message;

		if(msg.mentions.users.first()){
			if(msg.mentions.users.first() == msg.author)return({icon: "niko_wtf", status: "error.selfTag"});
			return({icon: "niko_speak", status: "success"})
		}

		return({icon: "niko_upset", status: "error.noTag"});


	},
};
