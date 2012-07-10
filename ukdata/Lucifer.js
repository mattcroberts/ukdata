//Solr wrapper
//Lucifer ("light bringing") is a working name

var solr = require("solr").createClient({port:8080}),
	log = require("./Logger");

var Lucifer = {
	search: function(options, cb){
		var callback = function(err, resp){
			
			
			var responseJ = JSON.parse(resp);
			log.debug("Solr response", responseJ);

			cb(err,responseJ);
		}

		log.debug("Solr Request", options);


		solr.query(options.q || "*:*", options, callback);
	}
};

module.exports = Lucifer;