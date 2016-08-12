var buttons 	= require('sdk/ui/button/action');
var tabs 		= require("sdk/tabs");
var pageMod 	= require("sdk/page-mod");
var sidebars 	= require("sdk/ui/sidebar");

// ---------------------------------------------------------------------
// the button ----------------------------------------------------------
// ---------------------------------------------------------------------

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


// ---------------------------------------------------------------------
// inject garble files  ------------------------------------------------
// ---------------------------------------------------------------------

var tabWorker;
var stats = {
	meta: {
		init: Date.now(),
		delta: Date.now(),
		total: 0
	},
	page: {}
};

// function hop( page, time ){
// 	setTimeout(function(){
// 		// tab.attach({
// 		// 	contentScript: 'window.location='+newPage;
// 		// });
// 		pageMod.PageMod({
// 			include: "*",
// 			contentScript: 'window.location="http://nickbriz.com"'
// 		});
// 	},time);	
// }

// when a new tab||page is loaded...
tabs.on('ready', function(tab) {
	// ...garble the hell out of it
	// && also get page stats for analtics
	tabWorker = tab.attach({
		contentScriptFile: ['./garble.js','./get-stats.js']
	});

	var newPage, time;

	// when worker receives stats from get-stats.js
	// 1. hide analtics (if open from prev tab||page) 
	// 2. then update the stats
	// 3. set the timer for hopping to new page
	// 4. then show the analtics w/new stats 
	tabWorker.port.on("newStats", function(data) {
		// 1.
		analtics.hide(); 

		// 2.
		stats.page = data; 
		stats.meta.delta = Date.now() - stats.meta.init;
		stats.meta.total++;
		
		// 3.
		newPage = stats.page.links[ Math.floor(Math.random()*stats.page.links.length) ];
		time = (Math.random()<0.75) ? (Math.random()*5000)+2000 : Math.random()*500;
		console.log(newPage,time);
		tab.attach({
			contentScript: 	'setTimeout(function(){'+
							'window.location = "'+ newPage +'";'+
							// 'alert("'+newPage+'");'+
							'},'+time+');'
		});
		
		// 4.
		analtics.show(); 
	});

});

pageMod.PageMod({
	include: "*",
	contentStyleFile: './garble.css'
});


// ---------------------------------------------------------------------
// analytics sidebar  --------------------------------------------------
// ---------------------------------------------------------------------

var analWorkers = [];

var analtics = sidebars.Sidebar({
	id: 'comtentanaltics',
	title: 'Comtent Analtics', 
	url: "./analtics/index.html",
	onReady: function(worker){
		// when the analtics page is ready...
		analWorkers.push(worker);
		// ...pass stats to the analtics.js
		worker.port.emit( "passStats", stats );
	},
  	onDetach: function(worker) {
  		// still not sure when this runs? on [x]close? ...
		// either way, get rid of the old worker ( free up it's memory )
		var index = analWorkers.indexOf(worker);
		if(index != -1) analWorkers.splice(index, 1);
	}	
});