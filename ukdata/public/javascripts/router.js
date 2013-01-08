define([
	"underscore",
	"backbone",
	"models/member",
	"views/member", 
	"views/member-search",
	"views/error"
	], 
	function(_, Backbone, Member, MemberView, MemberSearch, ErrorView){
		var MyRouter = Backbone.Router.extend({

			initialize: function(){
				Backbone.history.start({pushState: true});
			},
			
			routes:{
				"member/:id":"member",
				"":"index",
				"*actions":"pageNotFound"
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

			index: function(actions){
				var memberSearch = new MemberSearch();
				memberSearch.render();
				this.showView(memberSearch);
				
			},

			pageNotFound: function(){
				var errorView = new ErrorView({
					code:404
				});

				errorView.render();
				this.showView(errorView);
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