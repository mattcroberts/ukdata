define([
	"underscore",
	"backbone",
	"models/member",
	"views/member", 
	"views/member-search"
	], 
	function(_, Backbone, Member, MemberView, MemberSearch){
		var MyRouter = Backbone.Router.extend({

			initialize: function(){
				Backbone.history.start({pushState: true});
			},
			
			routes:{
				"member/:id":"member",
				"*actions":"defaultAction"
			},

			member: function(id){
				console.log("show member "+ id);
				var member = new Member({"id":id});

				var mv = new MemberView();
				member.fetch({success: function(data){

					mv.model = data;
					mv.render();
				}})
				
			},

			defaultAction: function(actions){
				var memberSearch = new MemberSearch();
			}
		});

		return MyRouter;
		
});