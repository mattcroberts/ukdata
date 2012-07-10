var log = require("./Logger"),
	lucifer = require("./Lucifer"),
	ResponseWriter = require("./ResponseWriter");


/*
 * GET home page.
 */

module.exports = {

	index : function(req,res){

	    log.verbose("Default get handler",req.url);
	    res.render("index.html", {layout:false});
	},
	
	solr : {
		member : function(req, res){
  
			  var memberId = "\"uk.org.publicwhip/member/" + req.params.id + "\"";
			  lucifer.search({q:"id:" + memberId}, function(err, solrRes){

			      var result = ResponseWriter.writeMember(solrRes);

			      res.send(result[0]);
			  })

			},

		allmembers : function(req, res){
			var page = req.query.page;
			var itemsPerPage = req.query.itemsPerPage;

			var start = (page -1) * itemsPerPage;
			lucifer.search({rows:itemsPerPage, 
							start:start,
							group:true,
							"group.ngroups" : true,
							"group.field" : "hansard_id_i"}, 
							function(err, solrRes){

				var result = ResponseWriter.writeMember(solrRes);

				res.setHeader("X-Pagination-Total-Results",solrRes.grouped["hansard_id_i"].ngroups);
				res.send(result);
			})

		}
	}
};