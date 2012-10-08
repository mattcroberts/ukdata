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

			      var response = ResponseWriter.writeMember(solrRes);

			      res.send(response);
			  })

			},

		allmembers : function(req, res){
			var groupField = "personId";

			var page = req.query.page;
			var itemsPerPage = req.query.itemsPerPage;
			var query = (req.query.query || "*:*") + " AND ukdType:member";

			var start = (page -1) * itemsPerPage;
			lucifer.groupedSearch({q:query,
							rows:itemsPerPage, 
							start:start,
							"group.field" : groupField,
							"group.sort" : "fromdate_t desc"}, 
							function(err, solrRes){

				var result = ResponseWriter.writeMember(solrRes);

				res.setHeader("X-Pagination-Total-Results",solrRes.grouped[groupField].ngroups);
				res.send(result);
			})

		},

		memberSpeeches: function(req, res){
	

			lucifer.join("id", "memberId", "id:\"uk.org.publicwhip/member/" + req.query.memberId + "\"", function(err, solrRes){
				var result = ResponseWriter.writeSpeeches(solrRes);

				res.setHeader("X-Pagination-Total-Results",solrRes.response.numFound);
				res.send(result);
			})
		}
	}
};