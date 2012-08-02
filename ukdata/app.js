
/**
 * Module dependencies.
 */

var express = require("express"),
 	routes = require("./routes"),
  log = require("./Logger");

var app = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname + '/views');
  //app.use(express.bodyParser());
  app.use(express.methodOverride());

  //app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  })

// Routes
app.get("/solr/query/all-members/", routes.solr.allmembers);

app.get("/solr/query/member/:id", routes.solr.member);

app.get("*", routes.index);

app.listen(3000);
log.info("Express server listening on port " + app.address().port + " in " + app.settings.env + " mode");
