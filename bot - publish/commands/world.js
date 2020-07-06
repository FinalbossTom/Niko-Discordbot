const Discord = require('discord.js')

module.exports = {
	name: 'world',
	description: 'Open up the Worldmap!',
	aliases: ['w','map'],
	category: 'useful',
	guild: true,
	exclude: true,
	execute(client,msg,args,userdata) {

		return





	},
};



function isPointInPoly(poly, pt){
		for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
				((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
				&& (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
				&& (c = !c);
		return c;
}

/*

points = [
    {x: 0, y: 0},
    {x: 0, y: length},
    {x: length, y: 10},
    {x: -length, y: -10},
    {x: 0, y: -length},
    {x: 0, y: 0}
];

*/
