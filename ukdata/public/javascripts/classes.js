var Member = Backbone.Model.extend({
	urlRoot:"/solr/query/member"
});

var MemberCollection = Backbone.Collection.extend({
	model:Member,
	url:"/solr/query/all-members"
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
		this.memberCollection.fetch({
			success:function(){
			self.render();
			}
		});
	},

	events: {
		"click li a" : "showMember"
	},

	showMember: function(e){
		var anchor = jQuery(e.target);

		var id = anchor.data("member-id");

		router.navigate("member/" + id,{trigger:true});

		return false;
	},

	render:function(){

		var self = this;
		var cont = jQuery("<ul></ul>");


		this.memberCollection.each(function(m){
			var template = "<li><a class=\"member\" href=\"#\" data-member-id=\"" + m.get("id") + "\">" + m.get("firstname") + "</a></li>";

			cont.append(template);
		});

		jQuery(this.el).html(cont);

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


jQuery(document).ready(function(){


	window.router = new MyRouter();

	Backbone.history.start({pushState: true});

	var appView = new AppView();

	appView.render();
});

