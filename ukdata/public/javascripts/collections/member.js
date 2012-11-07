define([
	"backbone",
	"models/member",
	"backbonePaginatable"
	],
	function(Backbone, Member){
		var MemberCollection = Backbone.Collection.extend({
		model:Member,
		urlRoot:"/solr/query/all-members/",

		parse: function(response){
			return response.response.data.members;
		}
	});

	Backbone.actAs.Paginatable.init(MemberCollection);

	return MemberCollection;
});