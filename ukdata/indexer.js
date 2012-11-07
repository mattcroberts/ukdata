var fs = require("fs");
var util = require("util");
var log = require("./Logger");
var lucifer = require("./Lucifer");
var htmlparser = require("htmlparser");
var async = require("async");
var _ = require("underscore");

var jobPath = process.argv[process.argv.length -1];
var Job = require(jobPath);
var jobInstance = new Job();

var Indexer = {
	extractContentFromDir: function(dirPath, batchSize, interval, complete) {

		fs.readdir(dirPath, function(err, files) {
			if (err) {
				log.debug("Indexer", err);
			}

			var batchResult = [];
			log.debug("indexer Setting up queue");
			var q = async.queue(function(){

				//convert to real array
				var args = Array.prototype.slice.call(arguments);
				jobInstance.worker.apply(jobInstance, args.concat(function add(jobResult){
					batchResult = batchResult.concat(jobResult);
				}));					
				
			}, 2);

			q.drain = function() {
				log.debug("Indexer", "Drained");

				batch = batches.shift();

				if (batch) {
					log.debug("Indexer", "Batches left " + batches.length);
					interval(null, batchResult)
					batchResult = [];

					process.nextTick(function() {
						q.push(batch);
					});
				} else {
					log.debug("Indexer", "All batches complete");

					complete();
				}

			};


			var batches = splitArray(files, batchSize).reverse();
			log.debug("Indexer", "Created " + batches.length + " batches");
			var batch = batches.shift();
			q.push(batch);
		});
	},

	parseHtml: function(path, callback) {
		var self = this;
		var result = [];

		var handler = new htmlparser.RssHandler(function(error, dom) {
			if (error) {
				log.error("indexer", error);
				callback(error);
				return error;
			}

			dom.forEach(function(node) {
				jobInstance.parser.call(self, node, function adder(toAdd) {
					result.push(toAdd);
				});
			});

			callback(error, result);
		});
		var parser = new htmlparser.Parser(handler);
		fs.readFile(path, "utf8", function(err, file) {

			if (err) {
				log.error("indexer", err);
				callback(error, null);
			}

			parser.parseComplete(file);
		});

	}
};

function splitArray(array, batchSize) {
	log.debug("Indexer", "Splitting " + array.length + " into " + batchSize + " batches");

	var batches = [];
	var batch = [];
	array.forEach(function(item, i) {

		batch.push(item);

		if (i % batchSize == 0) {
			batches.push(batch);
			batch = [];
		}
	});

	batches.push(batch);

	return batches;
}

jobInstance.init(Indexer);