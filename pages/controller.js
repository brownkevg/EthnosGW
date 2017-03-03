var mongo = require('mongodb');
var cache = require('mongo-atm');
var pageCache = new cache({ttl:60,limit:500});
var url = require('url');
var countries = require('country-data').countries;
var functions = require('../miscFunctions/functions')

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
			functions.getMapData(function(mapData){
				res.render('home',{pageModel:pageModel,mapData:mapData, user:req.user});
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
		var mediaData = results[0];
		dbClient.collection('media').update({_id:mongo.ObjectId(mediaData._id)},{$inc:{views:1}},{upsert:false},function(err,results){
			res.render('media',{pageModel:mediaData,user:req.user});
		})
		
	})
}



// remove if not used
function noDB(res){
	res.render('search');
}