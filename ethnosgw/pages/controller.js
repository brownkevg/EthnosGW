var cache = require('mongo-atm');
var pageCache = new cache({ttl:60,limit:500});
var countries = require('country-data').countries;

exports.home = function(req,res){
	var pageModel = {};
	var searchObj = {};
	pageCache.getMongo("media",searchObj,{mongoClient:dbClient, limit:10, sort:{_id:-1}},function(results1){
		pageModel.popular = results1;
		searchObj = {};
		pageCache.getMongo("media",searchObj,{mongoClient:dbClient, limit:10},function(results2){
			pageModel.recommended = results2
			getMapData(function(mapData){
				res.render('home',{pageModel:pageModel,mapData:mapData});
			})	
		})		
	})
}

exports.page = function(req,res){
	var searchObj = {artist:"Michael Balonek"}
	pageCache.getMongo("media",searchObj,{mongoClient:dbClient},function(results){
		res.render('media',{pageModel:results[0]});
	})
}

var getMapData = function(callback){
	var searchObj = {$and:[{country:{$ne:""}},{country:{$exists:true}}]}
	pageCache.getMongo("media",searchObj,{mongoClient:dbClient},function(results){
		var countries = []
		var item = {};
		for(var i = 0; i < results.length; i++){
			countries.push(results[i].country)
		}
		callback(countries);
	})
}