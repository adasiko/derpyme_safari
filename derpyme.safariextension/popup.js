safari.application.addEventListener("popover", popoverHandler, true);

function popoverHandler(event){
	var url = safari.application.activeBrowserWindow.activeTab.url;
	if(test_valid(url)) {
		url=encodeURIComponent(url);
		var reqUrl=new XMLHttpRequest();
		document.getElementById('url_input').value='Wait...';
		reqUrl.open('GET', 'http://api.derpy.me/v2/shorten.json?url='+url, true);
		reqUrl.onreadystatechange = function () {
			if(reqUrl.readyState==4) {
				if(reqUrl.status==200) {
					var serverResponse=JSON.parse(reqUrl.responseText);
					if(serverResponse.code==200) {
						document.getElementById('url_input').value='http:'+serverResponse.data.short;
						document.getElementById('url_input').focus();
						document.getElementById('url_input').select();
					} else {
						document.getElementById('url_input').value=serverResponse.status+': '+serverResponse.message;
					} 
				}
			}
			else
			{
				document.getElementById('url_input').value='I just don\'t know what went wrong';
				console.log('readyState: '+reqUrl.readyState);
			}
		};
		reqUrl.timeout=15000;
		reqUrl.onntimeout=function() {
			document.getElementById('url_input').value='Error: timeout';
		};
		reqUrl.send();
	} else {
		document.getElementById('url_input').value='Error: Invalid or missing URL';
	}
};

function test_valid(link) {
	var url = link;
	var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	var urltest = urlRegex.test(url);
	return urltest;
}
