define([
	"underscore", 
	"backbone",
	"router"
	],
	function(_, Backbone, MyRouter){
		function init(){

			var router = new MyRouter();
		};
		return {
			init: init
		}
});