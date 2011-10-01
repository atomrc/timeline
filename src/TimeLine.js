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


