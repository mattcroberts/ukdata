define([
	"backbone",
	"models/speech",
	"backbonePaginatable"
	],
	function(Backbone, Speech){
		var SpeechCollection = Backbone.Collection.extend({
			model:Speech,
			urlRoot:"/solr/query/member-speeches/",

			parse: function(response){
				return response.response.data.speeches;
			}
		});

		Backbone.actAs.Paginatable.init(SpeechCollection);

	return SpeechCollection;
});