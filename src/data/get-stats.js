

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

function absolute(base, relative) {
	// via: http://stackoverflow.com/a/14780463/1104148
    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
                 // (omit if "base" is the current folder without trailing slash)
    for (var i=0; i<parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
}



var items = document.body.getElementsByTagName("*");
var links = document.body.getElementsByTagName("a");
var e = items.length; 
var l = [];

// get all the links
for (var i = 0; i < links.length; i++) {
	var href = links[i].getAttribute('href');
	if( href ){
		// if newPage is relative path...
		if( href.match(/https?\:/) == null ){
			if( href.indexOf("//")==0) {
				href = "http:" + href; // ...it's absolute now
			} else if( href.indexOf("/")==0 ){
				href = href.substring(1,href.length);
				href = absolute( window.location.toString(), href ); // ...convert to absolute
			} else {
				href = absolute( window.location.toString(), href ); // ...convert to absolute
			}
		}

		// blacklist --------------
		if( href.indexOf("facebook.com")>=0 || href.indexOf("twitter.com")>=0 ||
			href.indexOf("google.com")>=0 ||href.indexOf("vimeo.com")>=0 ||
			href.indexOf("youtube.com")>=0 || href.indexOf("eventbrite.com")>=0){
			// fuck that shit
		}
		// if we still got something, add it to list...
		else if( href ) l.push( href );
	}
}


var stats = {
	title: document.title,
	dateTime: dateTime(),
	elementCnt: e,
	links: l
};

// pass along new stats bax to index.js
self.port.emit( 'newStats', stats );