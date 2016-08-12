var buttons 	= require('sdk/ui/button/action');
var tabs 		= require("sdk/tabs");
var pageMod 	= require("sdk/page-mod");

// create the browser button that shows up to the right of the address bar
var button = buttons.ActionButton({
	id: "kludgykrawler",
	label: "Kludgy Krawler",
	icon: {
		"32": "./icons/icon-32.png",
		"48": "./icons/icon-48.png",
		"64": "./icons/icon-64.png",
		"96": "./icons/icon-96.png"
	},
	onClick: function(state){
		// do something 
	}
});


// when a new tab||page is loaded...
tabs.on('ready', function(tab) {
	// ...garble the hell out of it
	tab.attach({
		contentScriptFile: './garble.js'
	});
});


pageMod.PageMod({
	include: "*",
	contentStyleFile: './garble.css'
});