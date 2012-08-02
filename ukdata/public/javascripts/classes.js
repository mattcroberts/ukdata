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

	el: "#main",

	initialize: function(){
		var self = this;

		this.$el.empty();
		
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
		"click ul.pagination li a" : "paginate",
		"keyup input.searchInput" : "memberSearch"
	},

	memberSearch: function(e){
		var inputEl = jQuery(e.target);

		var userInput = inputEl.val();

		this.memberCollection.setUrlParam("query", userInput);

		var self = this;
		this.memberCollection.fetch().done(function(){
			self.render();
		});



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
		if(this.$el.has("input.searchInput").length < 1){
			this.renderHeader();
		}

		_.processTemplate("member-list", {memberList: self.memberCollection}, function(compiled){

			if(jQuery(".content", self.el).length < 1){
				self.$el.append(self.make("div", {class:"content"}));
			} 

			jQuery(".content", self.el).html(compiled);
		});

	},

	renderHeader: function(){
		console.log("rendering header");
		var self = this;
		_.processTemplate("member-list-header", {}, function(template){
			self.$el.append(template);
		});
	}
});

var MemberView = Backbone.View.extend({

	el: "#main",

	initialize: function(options){
		this.options = options;
	},

	render: function(){
		var self = this;
		var viewport = this.make("article",{"id":"viewport"});

		_.processTemplate("member-details", {model:self.model}, function(compiled){

			jQuery(viewport).append(compiled);
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

