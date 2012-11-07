require.config({
	paths:{
		jquery:"lib/jquery-1.8.2.min",
		underscore:"lib/underscore",
		backbone:"lib/backbone",
		backbonePaginatable:"lib/Backbone.actAs.Paginatable",
		text:"lib/text",
		templates:"/templates"
	},

	shim:{
		underscore:{
			exports:"_"
		},
		backbone:{
			deps:["underscore", "jquery"],
			exports:"Backbone"
		},
		backbonePaginatable:["backbone"]
	}
});

require([
	"app"
	],
	function(app){
		app.init();
	}
);