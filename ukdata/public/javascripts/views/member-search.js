define([
	"backbone",
	"underscore",
	"jquery",
	"collections/member",
	"text!templates/member-list.html",
	"text!templates/member-list-header.html",
	"text!templates/pagination.html"],
	function(Backbone, _, jQuery, MemberCollection, TmemberList, TmemberListHeader, Tpagination){
		var MemberSearch = Backbone.View.extend({

		subViews: [],

		el: "#main",

		initialize: function(){
			var self = this;

			this.$el.empty();
			
			this.memberCollection = new MemberCollection();
			this.memberCollection.itemsPerPage(10);
			this.memberCollection.fetch().done(function(){
				self.render();
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

			Backbone.history.navigate("member/" + id,{trigger:true});

			return false;
		},

		render:function(){

			if(this.$el.has("input.searchInput").length < 1){
				this.renderHeader();
			}

			if(jQuery(".content", this.el).length < 1){
				this.$el.append(this.make("div", {class:"content"}));
			} 

			var listHtml = _.template(TmemberList,{memberList: this.memberCollection});
			var paginationHtml = _.template(Tpagination, this.memberCollection.paginationInfo());

			jQuery(".content", this.el).html(listHtml + paginationHtml);

		},

		renderHeader: function(){
			console.log("rendering header");

			var template = _.template(TmemberListHeader,{});
			this.$el.append(template);
		}
	});

	return MemberSearch;
});