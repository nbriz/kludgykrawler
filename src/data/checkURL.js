self.port.emit( "ran" );
// via: http://stackoverflow.com/a/21553982/1104148
function getLocation(href) {
	var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
	return match && {
		protocol: match[1],
		host: match[2],
		hostname: match[3],
		port: match[4],
		pathname: match[5],
		search: match[6],
		hash: match[7]
	}
}

var parsed = getLocation( window.location.toString() );
// if didn't parse, add a "/" ( b/c "http://nickbriz.com"==null, so try "http://nickbriz.com/")
if( !parsed ) parsed = getLocation( window.location.toString()+"/" );

// if parsed, check that URL has tags...
if( document.body ){
	var links = document.body.getElementsByTagName("a");
	if( links.length > 0 ){
		// if so pass it along
		self.port.emit( "location", window.location.toString() );
	} else {
		// otherwise don't
		self.port.emit( "location", null );
	}
}
else {
	self.port.emit( "location", null );
}





