
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
