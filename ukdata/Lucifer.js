//Solr wrapper
//Lucifer ("light bringing") is a working name

var solr = require("solr").createClient({port:8080}),
	log = require("./Logger"),
	_ = require("underscore");

var Lucifer = {
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