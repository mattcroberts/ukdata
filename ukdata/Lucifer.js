//Solr wrapper
//Lucifer ("light bringing") is a working name

var solr = require("solr").createClient({port:8080}),
	log = require("./Logger"),
	http = require("http"),
	_ = require("underscore");

var Lucifer = {

	addSpeech: function(speechId, memberId, content){

		var doc = {
			id: speechId,
			ukdType: "speech",
			memberId: memberId,
			content_t: content
		};

		log.debug("Adding speech", doc)
		this._add([doc]);
	},

	addSpeeches: function(speeches){
		var docs = [];
		speeches.forEach(function(speech){

			var doc = {
				id: speech.id,
				ukdType: "speech",
				memberId: speech.speakerId,
				content_t: speech.content
			};

			docs.push(doc);
		});
		this._add(docs);
	},

	_add: function(docs){

		log.debug("Lucifer Adding docs", docs.length);
		var options = {
			port:8080,
			host: "localhost",
			path: "/solr/update?commit=true",
			method: "POST"
		}
		
		var data = {
			
			add: docs,
			commit: {}
		}
		var request = http.request(options, function(response){
			log.debug("Solr Response code", response.CODE);
			var buffer = "";
			response.on("data", function(chunk){
				buffer += chunk;
			});
			
			response.on("end", function(){
				log.debug("solr add response", buffer);
			})
		});

		request.setHeader("content-type", "application/json");

		request.write(JSON.stringify(data), "utf8");
		//log.debug("Lucifer*", data);
		request.end();
	},

	query: function(options, cb){
		var cb = cb || function(){};

		var callback = function(err, resp){
			
			
			var responseJ = JSON.parse(resp);
			log.debug("Solr response", responseJ);

			cb(err,responseJ);
		}
		
		log.debug("Solr Request", options);


		solr.query(options.q, options, callback);
	},

	search: function(options, callback){
		this.query(this._prepareOptions(options), callback);
	},

	groupedSearch: function(options, callback){
		this.query(this._prepareOptions(options,{grouped:true}), callback);
	},

	join: function(fromField, toField, where, callback){
		this.query(this._prepareOptions({
			fq: "{!join from=" + fromField + " to=" + toField + "}" + where
		}), callback);
	},

	_prepareOptions: function(options, config){
		var config = config || {};

		var defaultOptions = this._getDefaultSearchConfig(config);

		return _.extend(defaultOptions,options);		
	},

	_getDefaultSearchConfig: function(config){
		var global = {
			q:"*:*",
			start: 0,
			rows: 10,
			qf: "firstname_t lastname_t",
			defType: "edismax"
		}

		var extra = {};

		if(config.grouped){
			extra.group = true;
			extra["group.ngroups"] = true;
		}

		return _.extend(global,extra);
	}
};

module.exports = Lucifer;