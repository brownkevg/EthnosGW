var cache = require('mongo-atm');
var pageCache = new cache({ttl:60,limit:500});

exports.home = function(req,res){
	// debugger;
	var pageModel = {};
	var searchObj = {};
	pageCache.getMongo("media",searchObj,{mongoClient:dbClient, limit:10},function(results1){
		// debugger;
		pageModel.popular = results1;
		searchObj = {};
		pageCache.getMongo("media",searchObj,{mongoClient:dbClient, limit:10},function(results2){
			pageModel.recommended = results2
			res.render('home',{pageModel:pageModel});
		})
			
	})
	
	
}

exports.page = function(req,res){
	debugger;
}