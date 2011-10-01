
function gradient(context, xs, ys, xe, ye, color) {
	var startColor = lightColor(color);
	var grad = context.createLinearGradient(xs, ys, xe, ye);
	grad.addColorStop(0, startColor);
	grad.addColorStop(1, color);

	return grad;
}

function lightColor(hexColor) {
	hexColor = hexColor.replace("#", "");

	var value = 75;

	var r = parseInt(hexColor.substring(0,2), 16);
	var g = parseInt(hexColor.substring(2,4), 16);
	var b = parseInt(hexColor.substring(4,6), 16);
	
	r = r <= (255 - value) ? (r+value)%255 : r;
	g = g <= (255 - value) ? (g+value)%255 : g;
	b = b <= (255 - value) ? (b+value)%255 : b;
	
	r = r.toString(16);
	r = r.length < 2 ? "0"+r : r;

	g = g.toString(16);
	g = g.length < 2 ? "0"+g : g;
	
	b = b.toString(16);
	b = b.length < 2 ? "0"+b :b;
	
	var color = r.toString(16) + g.toString(16) + b.toString(16);
	return "#"+color;;



}

function getNbMonth(startDate, endDate) {
	var minDate = new Date(startDate);
	var maxDate = new Date(endDate);
	var diff = new Date(maxDate - minDate);
	var extra = 0;
	if(diff.getDate() >= 20) {
		extra++;
	}
	return (diff.getFullYear() - 1970)*12 + diff.getMonth() + extra;
}

function extend(sub, sup) {
	sub.prototype.__proto__ = sup.prototype;
	sub.superclass = sup;
}

function animatedTextRoundedRect(context, text, boxColor, textColor, sx, sy, ex, ey, width, r) {
	var totalWidth = ex-sx;
	var temp = boxColor;
	boxColor = temp;

	if(totalWidth - width < 2) {
		context.textRoundedRect(text, boxColor, textColor, sx, sy, ex, ey, r, false, true);
	} else {
		context.clearRect(sx, sy, width, ey-sy);
		width += (totalWidth - width) / 6; 
		context.textRoundedRect('', boxColor, textColor, sx, sy, sx + width, ey, r, false);
		ctx = context;
		var func =function(){ animatedTextRoundedRect(ctx, text, boxColor,textColor, sx, sy, ex, ey, width, r);}

		timer  = setTimeout(func, 40);
	}
}

CanvasRenderingContext2D.prototype.textRoundedRect = function(text, boxColor, textColor, sx, sy, ex, ey, r, anim, recalc) {
	if(anim) {
		var remainWidth = ex - sx;
		animatedTextRoundedRect(this, text, boxColor, textColor, sx, sy, ex, ey, 0, r);
	} else {
		this.save();
		this.fillStyle = boxColor;
		this.roundedRect(sx, sy, ex, ey, r);
		this.fill();
		this.restore();
		
		if (recalc) {
			this.font = "12pt Helvetica";	
		}
		
		this.save();
		this.textBaseline = "middle";
		this.textAlign = "center";
		centerX = sx + (ex - sx)/2;
		centerY = sy + (ey - sy)/2;
		this.fillStyle = textColor;
		this.fillText(text, centerX, centerY);
		this.restore();
	}
}


CanvasRenderingContext2D.prototype.roundedRect = function(sx,sy,ex,ey,r) {
	var r2d = Math.PI/180;
	if( ( ex - sx ) - ( 2 * r ) < 0 ) { r = ( ( ex - sx ) / 2 ); } //ensure that the radius isn't too large for x
	if( ( ey - sy ) - ( 2 * r ) < 0 ) { r = ( ( ey - sy ) / 2 ); } //ensure that the radius isn't too large for y
	this.beginPath();
	this.moveTo(sx+r,sy);
	this.lineTo(ex-r,sy);
	this.arc(ex-r,sy+r,r,r2d*270,r2d*360,false);
	this.lineTo(ex,ey-r);
	this.arc(ex-r,ey-r,r,r2d*0,r2d*90,false);
	this.lineTo(sx+r,ey);
	this.arc(sx+r,ey-r,r,r2d*90,r2d*180,false);
	this.lineTo(sx,sy+r);
	this.arc(sx+r,sy+r,r,r2d*180,r2d*270,false);
	this.closePath();
}

CanvasController = function(id) {
	this.context =  document.getElementById('canvas').getContext('2d');
	this.width = this.context.canvas.width;
	this.height = this.context.canvas.height;
}

CanvasController.prototype = {
	context : null,
	width : 0,
	height : 0,
	model : null,
	components : [],

	init : function(){
		hrd = new HttpRequestDelegate(this);
		hrd.getTypes();
	},

	typesDidLoad : function(json) {
		this.dictTypes = JSON.parse(json);
		hrd = new HttpRequestDelegate(this);
		hrd.getModel();
	},

	//callback of the xmlHttpRequest sended in the init function
	modelDidLoad : function(json) {
		this.modelLoaded = true;
		this.timeline = new Timeline(0, 0, this.width, 200);
		this.timeline.setModel(JSON.parse(json));
		this.timeline.setLegend(this.dictTypes);
		this.components.push(this.timeline);
		this.draw();

	},

	onclick : function(event) {
		canvas.timeline.onclick(event);
	},

	onmousemove : function(event) {
		if(this.timeline != null) {
			this.timeline.onmousemove(event);
		}
	},

	refreshComponent : function(comp) {
		comp.drawInContext(this.context);
	},

	draw : function() {
		for(comp in this.components) {
			this.components[parseInt(comp)].drawInContext(this.context);
		}
	},

	clean : function() {
		this.context.clearRect(0, 0, this.width, this.height);	
	},

}
EventModel = function(eventArray, dictTypes) {
	if (eventArray == null) {
		return;
	}
	var minDate = Date.parse("01/01/2015");
	var maxDate = 0;
	for (typeEvent in dictTypes) {
		//typeEvent = parseInt(typeEvent);
		for(ev in eventArray[typeEvent]) {
			ev = eventArray[typeEvent][ev];
			ev.start = Date.parse(ev.start);
			ev.end = Date.parse(ev.end);
			if(ev.start < minDate) {
				minDate = ev.start;
			}
			if(ev.end > maxDate) {
				maxDate = ev.end;
			}
			if (this[typeEvent] == null) {
				this[typeEvent] = [];
			}
			this[typeEvent].push(ev);
		}
		this.maxDate = maxDate;
		this.minDate = minDate;
	}
}

EventModel.prototype = {
	
}
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
var colors = {"0" : "#000000", "1" : "#005ff5", "2" : "#FF0000", "3" : "#3F8B19"};
var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var lineWidth = 2;
var yearHeaderHeight = 25;
var monthHeaderHeight = 20;
var monthLineColor ="#E8E8E8" ;
var legendLength = 100;
var radius = 5;
var graphStartY = yearHeaderHeight + monthHeaderHeight + 10;
var graphStartX = legendLength;

Timeline = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.drawingWidth = width - graphStartX;
	this.drawingHeight = height - graphStartY;
	this.height = height;
}

Timeline.prototype = {
	selectedFact : null,

	setModel : function(json) {
		this.factsByType = json;	
		this.getDuration();
	},
	
	setLegend : function(dict) {
		this.legend = dict;	
		var count = 0;
		for (key in dict) {
			count++;
		}
		this.factHeight = this.drawingHeight / count;
	},
	
	getDuration : function() {
		var maxDate = 0;
		var minDate = Date.parse("01/01/2015");
		
		for(typ in this.factsByType) {
			for(fact in this.factsByType[typ]) {
				fact = this.factsByType[typ][fact];
				fact.start = Date.parse(fact.start);
				fact.end = Date.parse(fact.end);
				if(fact.start <	minDate) {
					minDate = fact.start	
				}
				if(fact.end > maxDate) {
					maxDate = fact.end;
				}
			}	
		}
		this.start = minDate;
		this.end = maxDate;
		this.delta = getNbMonth(this.start, this.end);
	},
	
	drawYearBox : function(context, year, Length) {
		var grad = context.createLinearGradient(0,0,0,yearHeaderHeight);
		grad.addColorStop(0, "#5786f8");
		grad.addColorStop(1, "#005ff5");
		context.font = "15pt Helvetica"; 
		context.textRoundedRect(""+year, grad, "white", 0, 0, Length-1, yearHeaderHeight, radius);
	},

	drawGrid : function(context) {
	//	monthHeaderHeight = this.drawingHeight;	
		this.unit = this.drawingWidth / this.delta;
		
		context.save();
		var yearStart = 0;
		var yearLength = 0;
		var previousYear = new Date(this.start).getFullYear();
		var currentYear = 0;
		for(i=0; i<=this.delta; i++) {
			context.save();
			context.fillStyle = monthLineColor;
			context.fillRect(this.x + graphStartX + i*this.unit,this.y + yearHeaderHeight + 2*lineWidth, 1, monthHeaderHeight);
			context.restore();
			context.save();
			
			
			var aMonth = Date.parse("02/01/1970");
			var currentDate = new Date(this.start + i*aMonth);
			currentYear = currentDate.getFullYear();
			var dateStr = month[currentDate.getMonth()] + "";
			context.textBaseline = "top";
			context.fillText(dateStr,this.x + graphStartX + i*this.unit,this.y + yearHeaderHeight + 2*lineWidth	);
			
			if(i == this.delta) currentYear++;

			if(currentYear != previousYear) {
				yearLength = i*this.unit - yearStart; 
				context.save();
				context.translate(this.x + yearStart + graphStartX, this.y);
				this.drawYearBox(context, previousYear+"", yearLength);		
				yearStart = i*this.unit;
				previousYear = currentYear;
				context.restore();
			}

			context.restore();
		}


		context.restore();
	
	},

	drawModel : function(context) {
		context.save();
		for (typ in this.factsByType) {
			for(fact in this.factsByType[typ]) {
					fact = this.factsByType[typ][fact];
					this.drawFact(fact, context);
			}		
		}	
		context.restore();
	},
	
	animatedRoundedRect : function(context, color, x,y, ex, ey, radius, time, callback) {
		drawAnimatedRoundedRect(context, color, x, y, ex - x, ey - y, 0, radius, time, callback);	
	},

	getDateCoord : function(startDate, endDate) {
		
		var Length = getNbMonth(startDate, endDate)*this.unit;
		var startX = getNbMonth(this.start, startDate)*this.unit;
		
		return {"startX":startX, "endX" : startX + Length, "Length":Length};
	},

	drawFact : function(fact, context) {
		coord = this.getDateCoord(fact.start, fact.end);
		var y = parseInt(fact.type) * this.factHeight +this.y + graphStartY;
		var x = this.x + graphStartX;
		context.save();
		context.textAlign = "center";
		context.font = "12pt Helvetica";
		context.textBaseline = "middle";

		var color = colors[fact.type];
		
		var grad = gradient(context, x + coord.startX, y, x + coord.startX, y + this.factHeight, color);
	
		context.textRoundedRect(fact.name, grad, "white", x + coord.startX, y, x + coord.endX, y + this.factHeight, radius, true);
		
		context.restore();
	},

	drawInContext : function(context) {
		this.drawGrid(context);
		this.drawLegend(context);
		this.drawModel(context);
	},

	drawLegend : function(context) {
		var grad = context.createLinearGradient(0,0,0,yearHeaderHeight);
		grad.addColorStop(0, "#5786f8");
		grad.addColorStop(1, "#005ff5");
		for(ktype in this.legend) {
			type = this.legend[ktype];
			context.save();
			context.translate(this.x, graphStartY + (parseInt(ktype) * this.factHeight));
			context.font = "15pt Helvetica"; 
			context.textRoundedRect(type, grad, "white", 0, 0, legendLength - 10, this.factHeight - 2, radius, false); 
			
			
			context.restore();
				
		}
	},
	
	onclick : function(event) {
		if(this.selectedFact != null) {
			alert(this.selectedFact.name);
		}
	},

	onmousemove : function(event) {

		var container = document.getElementById('canvas');
		var offLeft = container.offsetLeft;
		var offTop = container.offsetTop;
		var startY = this.y + graphStartY;
		var endY = this.y + this.height;
		var y = event.layerY - startY - offLeft;
		var x = event.layerX - graphStartX+this.x - offTop;
		

		if (y >= 0 && y <= this.height) {
			t = parseInt(ktype);
			var indice = parseInt(y / this.factHeight);
			if(this.legend[""+indice] != null) {
				for(kfact in this.factsByType[""+indice]) {
					var fact = this.factsByType[""+indice][kfact];
					var coord = this.getDateCoord(fact.start, fact.end);
					if(x <= coord.endX && x >= coord.startX) {
						this.selectedFact = fact;
						return;
					}else {
						this.selectedFact = null;
					}
				}
			}else {
				this.selectedFact = null;
			}
		} else {
			this.selectedFact = null;
		}

	}

}


