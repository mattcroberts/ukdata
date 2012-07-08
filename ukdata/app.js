
/**
 * Module dependencies.
 */

var express = require('express'),
 	routes = require('./routes'),
 	solr = require("solr"),
  ResponseWriter = require("./ResponseWriter");

var solrClient = solr.createClient({port:8080});

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.static(__dirname + '/public', { maxAge: 31557600000 }));
  app.use(express.static(__dirname + '/javascripts'));
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  })

// Routes


app.get("/solr/query/all-members/", function(req, res){

  var page = req.query.page;
  var itemsPerPage = req.query.itemsPerPage;

  var start = (page -1) * itemsPerPage;
	
  
	solrClient.query("*:*", {rows:itemsPerPage, start:start}, function(options, solrRes){

      solrResJ = JSON.parse(solrRes);
      var result = ResponseWriter.writeMember(solrResJ.response.docs);

      res.setHeader("X-Pagination-Total-Results",solrResJ.response.numFound);
		  res.send(result);
	})

});

app.get("/solr/query/member/:id", function(req, res){
  
  var memberId = "\"uk.org.publicwhip/member/" + req.params.id + "\"";
  solrClient.query("id:" + memberId, {rows:10}, function(options, solrRes){

      solrResJ = JSON.parse(solrRes);

      var result = ResponseWriter.writeMember(solrResJ.response.docs);

      res.send(result[0]);
  })

});

app.get('*', function(req,res){

    console.log(req.url);

    res.render("index.html", {layout:false});
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
