var log = require("./Logger"),
	_ = require("underscore");

var ResponseWriter = {
	memberFromDocs : function (memberDocs){
		var self = this;
		var result = [];

		memberDocs.forEach(function(doc){
			result.push(self.processMember(doc));
		});

		return result;
	},

	memberFromGroups: function(groups){

		var self = this;
		var result = [];

		groups.forEach(function(group){
			result.push(self.processMember(group.doclist.docs[0]));
		});

		return result;
	},

	processMember: function(memberDoc){
		var member = {};
		var mapping = {
			firstname : "firstname_t",
			surname : "lastname_t",
			party : "party_t",
			constituency : "constituency_t",
			fromDate : "fromdate_t",
			toDate : "todate_t",
			timestamp : "timestamp"
		};
		member.id = memberDoc.id.substring(memberDoc.id.lastIndexOf("/") + 1);
		
		_.each(mapping, function(fieldName, attribute){
			if(memberDoc[fieldName]){
				member[attribute] = memberDoc[fieldName];
			}
		})
		return member;
	},

	writeMember: function(solrResp){

		var response = {response:{
							header:{},
							data:{},
							metadata:{}}};

		response.response.header = this.generateResponseHeader(solrResp);
		response.response.metadata = this.generateResponseMetadata(solrResp);

		if(solrResp.responseHeader.params.group){
			var groupField = solrResp.responseHeader.params["group.field"];
			response.response.data.members =  this.memberFromGroups(solrResp.grouped[groupField].groups);
		}else{
			response.response.data.members =  this.memberFromDocs(solrResp.response.docs);
		}

		
		return response;

	},

	writeSpeeches: function(solrResp){
		var response = {response:{
							header:{},
							data:{},
							metadata:{}}};

		response.response.header = this.generateResponseHeader(solrResp);
		response.response.metadata = this.generateResponseMetadata(solrResp);
		response.response.data.speeches = [];

		debugger;
		solrResp.response.docs.forEach(function(speechDoc){
			response.response.data.speeches.push(speechDoc);
		})

		return response;
	},

	generateResponseHeader: function(solrResp){},
	generateResponseMetadata: function(solrResp){
		var metadata = {};

		if(solrResp["facet_counts"]){
			metadata.facets = {"fields":{}};

			solrResp["facet_counts"]["facet_fields"].forEach(function(facet, facetName){
				metadata.facets.fields[facetName] = facet;
			});
			
		}
		

	}
};


module.exports = ResponseWriter;