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
				var self = this;
				console.log("show member "+ id);
				var member = new Member({"id":id});

				var mv = new MemberView();
				member.fetch({success: function(data){

					mv.model = data;
					mv.render();

					self.showView(mv);
				}})
				
			},

			defaultAction: function(actions){
				var memberSearch = new MemberSearch();
				memberSearch.render();
				this.showView(memberSearch);
				
			},

			showView: function(view){

				if(this.currentView){
					this.currentView.remove();
					this.currentView.unbind();
				}

				this.currentView = view;
				
				jQuery(".content.container").append(view.el);
			}
		});

		return MyRouter;
		
});