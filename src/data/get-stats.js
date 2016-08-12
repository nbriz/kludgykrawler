

function dateTime(){
	// via: http://stackoverflow.com/a/10211214/1104148
	var currentdate = new Date(); 
	var datetime = "Krawl Time: " + currentdate.getDate() + "/"
		+ (currentdate.getMonth()+1)  + "/" 
		+ currentdate.getFullYear() + " @ "  
		+ currentdate.getHours() + ":"  
		+ currentdate.getMinutes() + ":" 
		+ currentdate.getSeconds();
	return datetime;
}

var items = document.body.getElementsByTagName("*");
var links = document.body.getElementsByTagName("a");
var e = items.length; 
// var k = 0; 
// var p = 0; 
var l = [];

// // count periods && k's
// for (var i = 0; i<items.length; i++) {
// 	// if element has text 
// 	if( items[i].innerText.length>0){
// 		// loop through all chars in text
// 		for (var j = 0; j < items[i].innerText.length; j++) {
// 			if( items[i].innerText[j] == "k" ) k++; // inc for every "k"
// 			if( items[i].innerText[j] == "." ) p++; // inc for every "."
// 		};
// 	}
// }

// get all the links
for (var i = 0; i < links.length; i++) {
	l.push( links[i].getAttribute('href') );
}


var stats = {
	title: document.title,
	dateTime: dateTime(),
	elementCnt: e,
	// kCnt: k,
	// periodCnt: p,
	links: l
};

self.port.emit( 'newStats', stats );