var buttons 	= require('sdk/ui/button/action');
var tabs 		= require("sdk/tabs");
var pageMod 	= require("sdk/page-mod");
var sidebars 	= require("sdk/ui/sidebar");
var pageWorkers = require("sdk/page-worker");
var timers		= require("sdk/timers");

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

var globalTime = 10000;
var tabWorker;
var urlWorker;
var newPage, time;
var stats = {
	meta: {
		init: Date.now(),
		delta: Date.now(),
		total: 190
	},
	page: {}
};


// automatically inject the garbling css 
// ...on every page all the time.
pageMod.PageMod({
	include: "*",
	contentStyleFile: './garble.css'
});

// when a new tab||page is loaded...
tabs.on('ready', function(tab) {


	// check url && hop...
	function urlCheckHop( newPage, time ){
		// console.log('checking:', newPage);
		var urlWrkRan = false;
		// create a worker that loads + checks the page that's up next
		urlWorker = pageWorkers.Page({
			contentURL: newPage,
			contentScriptFile: './checkURL.js',
			contentScriptWhen: "ready"
		});

		urlWorker.port.on("ran", function() {	
			urlWrkRan = true;
		});

		urlWorker.port.on("location", function( url ) {		
			if( url ){
				tab.attach({
					contentScript: 	'setTimeout(function(){'+
									'window.location = "'+ url +'";'+
									'},'+globalTime+');'
				});	
			} else {
				// console.log( "FAILED ON", newPage );
				var newPic = stats.page.links[ Math.floor(Math.random()*stats.page.links.length) ];
				urlCheckHop( newPic, time );
			}
		});		

		timers.setTimeout(function(){
			if( !urlWrkRan ){
				// console.log( "FAILED TO INJECT urlWorker >> checkURL.js" );
				var newPic = stats.page.links[ Math.floor(Math.random()*stats.page.links.length) ];
				urlCheckHop( newPic, time );
			}
		},globalTime);

	}

	// ...garble the hell out of it via garble.js
	// && also get page stats for analtics
	tabWorker = tab.attach({

		contentScriptFile: ['./garble.js','./get-stats.js']
	});

	
	// when worker receives stats from get-stats.js
	// 1. hide analtics (if open from prev tab||page) 
	// 2. then update the stats
	// 3. set the timer for hopping to new page
	// 4. then show the analtics w/new stats 
	tabWorker.port.on("newStats", function(data) {

		// 1.
		analtics.hide(); 

		// 2.
		if( data.links.length > 1 ) // DANGER DANGER DANGER
			stats.page = data; 
		stats.meta.delta = Date.now() - stats.meta.init;
		stats.meta.total++;
		
		// 3. -------------------------------------------------------------------------------
		newPage = stats.page.links[ Math.floor(Math.random()*stats.page.links.length) ];
		time = (Math.random()<0.75) ? (Math.random()*5000)+2000 : Math.random()*500;
		urlCheckHop( newPage, time );

		//------------------------------------------------------------------------------------
		
		// 4.
		analtics.show(); 		
	});

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