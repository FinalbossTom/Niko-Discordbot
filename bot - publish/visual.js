const { QMainWindow,
				QLabel,
				QPushButton,
				QComboBox,
				QWidget,
				QLineEdit,
				QBoxLayout
			} = require('@nodegui/nodegui');

module.exports = {
	createWindow(client) {
client = client.client // client


const boxWidget = new QWidget();
boxWidget.setObjectName("boxWidget")
boxWidget.setLayout(new QBoxLayout(2));

const guildBox = new QComboBox();
guildBox.setObjectName("guildBox")
guildBox.addEventListener('currentTextChanged', (text) => {
channelBox.clear();
const array = []
client.guilds.cache.find(guild => guild.name == guildBox.currentText()).channels.cache.forEach(channel => {
	if(channel.type != "text")return;
	array.push(channel)
})

array.sort((channel1,channel2) => channel1.rawPosition - channel2.rawPosition)
array.forEach(channel => {
channelBox.addItem(undefined,channel.name)
})

});

const channelBox = new QComboBox();
channelBox.setObjectName("channelBox")


const textInput = new QLineEdit();
textInput.setObjectName("textInput")


boxWidget.setStyleSheet(`
#boxWidget > * {
	margin-top: 2px;
	min-width: 140px;
	max-width: 140px;
	min-height: 17px;
}
`)

boxWidget.layout.addWidget(guildBox)
boxWidget.layout.addWidget(channelBox)
boxWidget.layout.addWidget(textInput)


const test = new QPushButton();
test.setObjectName('buttonSend');
test.setText('Send!');
test.addEventListener('clicked', () => {
	client.sendMessage({channel: client.channels.cache.find(channel => channel.name == channelBox.currentText())},true,textInput.text(),"niko_speak")
})

boxWidget.layout.addWidget(test)

const grid = createGrid();

grid.second.layout.addWidget(boxWidget)



const win = new QMainWindow();
win.setWindowTitle('Booting...');
win.setCentralWidget(grid.widget);
win.show();
global.win = win;

client.on('ready', () => {
	win.setWindowTitle(`${client.user.tag}`)

	client.guilds.cache.forEach(guild => {
		guildBox.addItem(undefined,guild.name)
	})

})

}
}


function createWidget(name,direction){
const widget = new QWidget();
widget.setObjectName(name)
widget.setLayout(new QBoxLayout(direction))
}

function createGrid(){
	const topRow = new QWidget();
	topRow.setObjectName("topRow")
	topRow.setLayout(new QBoxLayout(0))

	const firstRow = new QWidget();
	firstRow.setObjectName("firstRow")
	firstRow.setLayout(new QBoxLayout(2))

	const secondRow = new QWidget();
	secondRow.setObjectName("secondRow")
	secondRow.setLayout(new QBoxLayout(2))

	const thirdRow = new QWidget();
	thirdRow.setObjectName("thirdRow")
	thirdRow.setLayout(new QBoxLayout(2))

	const fourthRow = new QWidget();
	fourthRow.setObjectName("fourthRow")
	fourthRow.setLayout(new QBoxLayout(2))

	topRow.layout.addWidget(firstRow)
	topRow.layout.addWidget(secondRow)
	topRow.layout.addWidget(thirdRow)
	topRow.layout.addWidget(fourthRow)

	return({widget: topRow, first: firstRow, second: secondRow, third: thirdRow, fourth: fourthRow})
}
