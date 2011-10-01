JSDIR = src/
BUILTDIR = js/
COMPRESSOR = yuicompressor/yuicompressor-2.4.6.jar
FILENAME = general.js
MINFILENAME = general-min.js

FILES = \
	$(JSDIR)utils.js \
	$(JSDIR)Canvas.js \
	$(JSDIR)EventModel.js \
	$(JSDIR)HttpRequestDelegate.js \
	$(JSDIR)Timeline.js \

all:$(FILES)
	cat $^ > $(BUILTDIR)$(FILENAME)

min: all 
	java -jar $(COMPRESSOR) $(BUILTDIR)$(FILENAME) > $(BUILTDIR)$(MINFILENAME) 
clean:
	rm $(BUILTDIR)$(FILENAME) $(BUILTDIR)$(MINFILENAME)
