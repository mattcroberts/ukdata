var fs = require("fs");
var util = require("util");
var log = require("./Logger");
var lucifer = require("./Lucifer");
var htmlparser = require("htmlparser");
var async = require("async");
var cluster = require("cluster");
var os = require("os");

var DEBATES_PATH = "C:/Users/matt/ukdata/rsync/debates/";
//var DEBATES_PATH = "C:/Users/matt/ukdata/debate test/";

function splitArray(array, batchSize){
	log.debug("Indexer", "Splitting " + array.length + " into " + batchSize + " batches");

	var batches = [];
	var batch = [];
	array.forEach(function(item, i){

		batch.push(item);

		if(i % batchSize == 0){
			batches.push(batch);
			batch = [];
		}
	});

	batches.push(batch);

	return batches;
}

function extractContentFromDir(dirPath, batchSize, interval, complete){

	fs.readdir(dirPath, function(err, files){
		if(err){
			log.debug("Indexer", err);
		}

		var batches = splitArray(files, batchSize);
		log.debug("Indexer", "Created " + batches.length + " batches");
		var batch = batches.shift();
		var batchResult = [];
		log.debug("indexer Setting up queue");
		var q = async.queue(function(filepath, cb){

			if(filepath.indexOf(".xml") > 1){
				
				parseHtml(dirPath + filepath, function(err, result){
					if(err){
						log.error("indexer", err);	
					}
					
					log.debug("indexer", "found " + result.length + " speeches in " + filepath);
					batchResult = batchResult.concat(result);
					cb();
				});				
			}else{
				cb(false);
			}


		},1);

		q.drain = function(){
			log.debug("Indexer", "Drained");

			batch = batches.shift();

			if(batch){
				log.debug("Indexer", "Batches left " + batches.length);
				interval(null, batchResult)
				batchResult = [];

				process.nextTick(function(){
					q.push(batch);
				});
			}else{
				log.debug("Indexer", "All batches complete");

				complete();
			}

		};

		
		q.push(batch);
	});	
}


function parseHtml(path, callback){

	var iSpeeches = [];

	var handler = new htmlparser.RssHandler(function (error, dom) {
		if(error){
			log.error("indexer", error);
			callback(error);
			return error;
		}

    	dom.forEach(function(node){
    		if(node.name == "publicwhip"){

    			var speeches = node.children.filter(function(node){
    				return node.name == "speech" && node.attribs.speakerid;
    			});

    			speeches.forEach(function(speechNode){
    				var iSpeech = {};
    				iSpeech.id = speechNode.attribs.id;
    				iSpeech.speakerId = speechNode.attribs.speakerid;
    				if(!!speechNode.children && speechNode.children.length > 0){
    					iSpeech.content = flatternText(speechNode.children[0]);
    				} 
    				iSpeeches.push(iSpeech);
    			});

    		}
    	});

    	callback(error, iSpeeches);
	});
	var parser = new htmlparser.Parser(handler);
	fs.readFile(path, "utf8", function(err, file){

		if(err){
			log.error("indexer", err);
			callback(error, null);
		}

		parser.parseComplete(file);
	});
	
}


var flatternText = function(root){
	var result = "";
	if(!root.children) return result;

	root.children.forEach(function(child){
		switch(child.type){
			case "text":
				result += child.data;
				return;
			case "tag":
				result += "<" + child.name + ">" + flatternText(child) + "</" + child.name + ">";
				return;
		}
	});

	return result;
}





extractContentFromDir(DEBATES_PATH, 100, function interval(err, speeches){
	if(err){
		log.error("indexer", err);
	}
	log.debug("speeches!", speeches.length);
	lucifer.addSpeeches(speeches);
}, function complete(){

});	







