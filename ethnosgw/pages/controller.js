var cache = require('mongo-atm');
var pageCache = new cache({ttl:60,limit:500});
var url = require('url');
var countries = require('country-data').countries;

exports.home = function(req,res){
	if (typeof dbClient == 'undefined'){
		return res.render('home');
	}
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
	var page = url.parse(String(req.url).replace(/[^0-9A-Za-z\-\_\/\?]/g,'')).pathname.substring(1);
	if(page==="" || page == "/"){
		exports.home(req,res);
		return;
	}
	var searchObj = {route: {$regex:'^' + page + '$',$options:'i'}}
	pageCache.getMongo("media",searchObj,{mongoClient:dbClient},function(results){
		if(results == null || results.length !== 1){
			res.status(404);
			res.render('error',{title:'Error: 404',msg:"Sorry, we couldn't find the page you were looking for.", url:url});
			return;
		}
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

// remove if not used
function noDB(res){
	res.render('search');
}