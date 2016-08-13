
var total = document.getElementById('total');
var title = document.getElementById('title');
// var dateTime = document.getElementById('date-time');
var overallTime = document.getElementById('overall-time');
var lastTime = document.getElementById('last-krawl-time');
var numEls = document.getElementById('num-elements');
var linksFound = document.getElementById("links-found");



var counter = 0;
// var overallCnt;
var timer = setInterval(function(){
	counter+=100;
	lastTime.innerHTML = "seconds sinse last krawl: " + (counter/1000);
	// if( overallCnt )
		// overallTime.innerHTML	= "krawling for: " + ((overallCnt+counter)/1000) + " secs";
},100);

addon.port.on("passStats",function(data){

	total.innerHTML 	= "total pages krawled: "+data.meta.total;
	title.innerHTML 	= "Title: "+data.page.title;
	// dateTime.innerHTML 	= data.page.dateTime;
	// overallCnt			= data.meta.delta;
	numEls.innerHTML	= data.page.elementCnt + " elements found";
	linksFound.innerHTML= data.page.links.length + " links found:<br>";

	for (var i = 0; i < data.page.links.length; i++) {
		linksFound.innerHTML += data.page.links[i]+"<br>";
	}	
});