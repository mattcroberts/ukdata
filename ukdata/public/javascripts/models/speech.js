define([
	"backbone"],
	function(BackBone){
		var Speech = Backbone.Model.extend({
			urlRoot:"/solr/query/speech"
		});
		
		return Speech;
	}
);