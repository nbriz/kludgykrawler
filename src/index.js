var buttons = require('sdk/ui/button/action');

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
