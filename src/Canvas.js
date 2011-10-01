
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
