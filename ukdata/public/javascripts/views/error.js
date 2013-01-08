define([
	"text!templates/error.html"], function(Terror){
	var ErrorView = Backbone.View.extend({

		id:"main",

		render: function(){
			this.$el.append(_.template(Terror, this.options));
		}
	});

	return ErrorView;
});