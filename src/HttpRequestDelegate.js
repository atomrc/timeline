HttpRequestDelegate = function(sender) {
	this.sender = sender;	
}

HttpRequestDelegate.prototype = {
	sender : null,

	getRequest : function() {
		var xhr = null; 
	 
		if(window.XMLHttpRequest) // Firefox et autres
			xhr = new XMLHttpRequest(); 
		else if(window.ActiveXObject){ // Internet Explorer 
			try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
			       xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
		else { // XMLHttpRequest non supporté par le navigateur 
			alert("Votre navigateur ne supporte pas les objets XMLHTTPRequest..."); 
			xhr = false; 
		}
		xhr.sender = this.sender;
		return xhr;
	},

	getModel : function() {
		xhr = this.getRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
				try {  
					this.sender.modelDidLoad(xhr.responseText);
				} catch(e) {
					throw e;
				}
	        	}
		}
		xhr.open ('GET', 'requests/getModel.php', true);
		xhr.send(null);
	},

	getTypes : function() {
		xhr = this.getRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			try {
				this.sender.typesDidLoad(xhr.responseText);
			} catch(e) {
				throw e;
			}
																		}
		}
		xhr.open('GET', 'requests/getTypes.php', true);
		xhr.send(null);

	}
}
