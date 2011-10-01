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
