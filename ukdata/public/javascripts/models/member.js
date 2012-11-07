define([
	"backbone"
	], 
	function(Backbone){
		var Member = Backbone.Model.extend({
			urlRoot:"/solr/query/member",

			parse: function(response){

				if(response.response){
					return response.response.data.members[0];	
				}else{
					return response;
				}
				
			}
		});

		return Member;
	}
);