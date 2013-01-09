({
    appDir: "../public",
    dir: "../public-prod",
    baseUrl:"javascripts",
	modules:[
		{
			name: "bootstrap",
			include:[
				"bootstrap"
			]	
		}]
    ,
   paths:{
    jquery:"lib/jquery-1.8.2.min",
    underscore:"lib/underscore",
    backbone:"lib/backbone",
    backbonePaginatable:"lib/Backbone.actAs.Paginatable",
    text:"lib/text",
    templates:"../templates"
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
  },
  removeCombined:true
})