var ResponseWriter = {
	writeMember : function (memberDocs){
		var result = [];

		memberDocs.forEach(function(doc){
			var member = {};
			member.id = doc.id.substring(doc.id.lastIndexOf("/") + 1);
			member.firstname = doc.firstname_t;
			member.surname = doc.lastname_t;
			result.push(member);
		});

		return result;
	}
};


module.exports = ResponseWriter;