var log = require("./Logger");

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
		member.id = memberDoc.id.substring(memberDoc.id.lastIndexOf("/") + 1);
		member.firstname = memberDoc.firstname_t;
		member.surname = memberDoc.lastname_t;
		return member;
	},

	writeMember: function(solrResp){
		log.debug("Parsing", solrResp);
		if(solrResp.responseHeader.params.group){
			var groupField = solrResp.responseHeader.params["group.field"];
			return this.memberFromGroups(solrResp.grouped[groupField].groups);
		}else{
			return this.memberFromDocs(solrResp.response.docs);
		}

		return null;

	}
};


module.exports = ResponseWriter;