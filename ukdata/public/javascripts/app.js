_.mixin({
	loadTemplate: function(templateName, callback){

		callback = callback || jQuery.noop;
		
		jQuery.get("/templates/" + templateName + ".html", function(data){

			UKDATA.Templates[templateName] = data;
			callback(data);
		});
	},

	processTemplate: function(templateName, data, callback){

		function compilier(source){
			return _.template(source, {data: data});
		}

		if(UKDATA.Templates[templateName]){
			return compilier(UKDATA.Templates[templateName]);
		}else if(callback){
			_.loadTemplate(templateName, function(source){
				callback(compilier(source));
			});
		}
		

		return false;
	}
});