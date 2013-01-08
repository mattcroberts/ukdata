define([
	"backbone",
	"underscore",
	"jquery",
	"collections/speech",
	"text!templates/member-details.html",
	"text!templates/member-speeches.html"],
	function(Backbone, _, jQuery, SpeechCollection, TmemberDetails, TmemberSpeeches){
		var MemberView = Backbone.View.extend({

		id: "#main",

		initialize: function(options){
			this.options = options;
		},

		events:{
			"click a.contextLink": "showFullSpeech"
		},

		render: function(){
			var self = this;

			var memberHtml = _.template(TmemberDetails,{model:self.model});

			this.$el.append(memberHtml);
			
			var speeches = new SpeechCollection();
			speeches.setUrlParam("memberId", this.model.get("id"));

			//render speeches
			speeches.fetch().then(function(){
				var speechesHtml = _.template(TmemberSpeeches,{speeches:speeches});
				self.$el.find("#speeches").html(speechesHtml);
			});
		},

		showFullSpeech: function(e){
			var speechId = jQuery(e.target).parents("article[data-speech-id]").data("speech-id");
			Backbone.history.navigate("/speech/" + speechId,{trigger:true});

			e.preventDefault();
		}
			

	});

	return MemberView;
});