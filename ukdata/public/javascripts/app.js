_.mixin({
	loadTemplate: function(templateName, callback){

		jQuery.get("/templates/" + templateName + ".html", function(data){
			callback(data);
		});
	}
});