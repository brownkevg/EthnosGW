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
				functions.getLanguages(function(languageData){
					// debugger;
					getCountryCounts(function(countryCounts){
						// debugger;
						res.render('home',{pageModel:pageModel,mapData:mapData,user:req.user,languageData:languageData,countryCounts:countryCounts});
					})		
				})
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
	pageCache.getMongo("media",searchObj,{mongoClient:dbClient,limit:1},function(results){
		if(results == null || results.length !== 1){
			res.status(404);
			res.render('error',{title:'Error: 404',msg:"Sorry, we couldn't find the page you were looking for.", url:url});
			return;
		}
		var mediaData = results[0];
		searchObj = {user:mediaData.user};
		pageCache.getMongo("media",searchObj,{mongoClient:dbClient,limit:3},function(artistResults){
			searchObj = {user:mediaData.user,album:mediaData.album}
			pageCache.getMongo("media",searchObj,{mongoClient:dbClient,limit:3},function(albumResults){
				searchObj = {country:mediaData.country} // ********** Need to figure out how we are querying related content. Which parameters? **********
				pageCache.getMongo("media",searchObj,{mongoClient:dbClient,limit:2},function(relatedResults){
					dbClient.collection('media').update({_id:mongo.ObjectId(mediaData._id)},{$inc:{views:1}},{upsert:false},function(err,results){
						res.render('media',{pageModel:mediaData,user:req.user,moreFromArtist:artistResults,moreFromAlbum:albumResults,relatedContent:relatedResults});
					});
				});
			});
		});
	});
};

function getCountryCounts(callback){
	dbClient.collection('media').aggregate([{$group:{_id:"$country",count:{$sum:1}}}],function(err,results){
		for(var i = 0; i < results.length; i++){
			results[i].name = countries[results[i]._id].name
		}
		results.sort(function(a, b){
		    if(a.name < b.name) return -1;
		    if(a.name > b.name) return 1;
		    return 0;
		})
		callback(results)
	})
	
}



// remove if not used
function noDB(res){
	res.render('search');
}