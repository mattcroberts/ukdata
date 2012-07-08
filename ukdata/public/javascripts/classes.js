var Member = Backbone.Model.extend({
	urlRoot:"/solr/query/member"
});

var MemberCollection = Backbone.Collection.extend({
	model:Member,
	urlRoot:"/solr/query/all-members/"
});

var AppView = Backbone.View.extend({

	render:function(){

		
	}
});

var MembersView = Backbone.View.extend({

	subViews: [],

	el: "#container",

	initialize: function(){
		var self = this;
		this.memberCollection = new MemberCollection();
		this.memberCollection.itemsPerPage(10);
		this.memberCollection.fetch({
			success:function(){
				self.render();
			}
		});
	},

	events: {
		"click li.member a" : "showMember",
		"click ul.pagination li a" : "paginate"
	},

	paginate: function(e){
		var self = this;
		var pageNo = jQuery(e.target).data("pagination-page");

		this.memberCollection.loadPage(pageNo).done(function(){
			self.render();
		})


		e.preventDefault();
	},

	showMember: function(e){
		var anchor = jQuery(e.target);

		var id = anchor.data("member-id");

		router.navigate("member/" + id,{trigger:true});

		return false;
	},

	render:function(){

		var self = this;
		var template = _.loadTemplate("member-list", function(template){
			
			var compiled = _.template(template, {memberList: self.memberCollection});
			
			jQuery(self.el).html(compiled);
		});

		

	}
});

var MemberView = Backbone.View.extend({

	el: "#container",

	initialize: function(options){
		this.options = options;
	},

	render: function(){
		var self = this;
		var viewport = this.make("article",{"id":"viewport"});
		
		var template = _.loadTemplate("member-details", function(template){

			jQuery(viewport).append(_.template(template,{name: self.model.get("firstname") + " " + self.model.get("surname")}));
			jQuery(self.el).html(viewport);
		});
		
		
	}
});

var MyRouter = Backbone.Router.extend({

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
		var membersView = new MembersView();
	}
});


var UKDATA = {};
UKDATA.Templates = {};

jQuery(document).ready(function(){

	//pre-load
	_.loadTemplate("pagination");

	Backbone.actAs.Paginatable.init(MemberCollection);
	window.router = new MyRouter();

	Backbone.history.start({pushState: true});

	var appView = new AppView();

	appView.render();
});

