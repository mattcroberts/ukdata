define([
	"underscore"
	],
	function(_){
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

					var compiled = compilier(UKDATA.Templates[templateName]);
					if(callback){
						callback(compiled);
					}

					return compiled;
				}else if(callback){
					_.loadTemplate(templateName, function(source){
						callback(compilier(source));
					});

				}
				

				return false;
			}
		});
	}
);