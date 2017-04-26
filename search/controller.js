var functions = require('../miscFunctions/functions')
exports.search=function(req,res){
	var searchString = {};
	if(typeof req.query.searchTerm !== 'undefined' && req.query.searchTerm !== ""){
		searchString.$text = {$search:req.query.searchTerm,$language:"en"}
	}
	if(typeof req.query.language !== 'undefined' && req.query.language !== ""){
		if(typeof searchString.$and === 'undefined') searchString.$and = [];
		var language = JSON.parse(req.query.language)
		searchString.$and.push({"lng":language[0]})
	} 
	if(typeof req.query.country !== 'undefined' && req.query.country !== ""){
		if(typeof searchString.$and === 'undefined') searchString.$and = [];
		searchString.$and.push({"country":req.query.country})
	}
	if(typeof req.query.genre !== 'undefined' && req.query.genre !== ""){
		if(typeof searchString.$and === 'undefined') searchString.$and = [];
		searchString.$and.push({"genre":req.query.genre})
	}
	if(typeof req.query.artForm !== 'undefined' && req.query.artForm !== ""){
		if(typeof searchString.$and === 'undefined') searchString.$and = [];
		searchString.$and.push({"contentType":req.query.artForm})
	}
	find(searchString,function(searchResults){
		functions.getMapData(function(mapData){
			functions.getLanguages(function(languageData){
				functions.getCountries(function(countryData){
					res.render('search',{results:searchResults,mapData:mapData,languageData:languageData,countryData:countryData})
				});
			});
		});
	});
	
}

var find = function(searchString,callback){
	dbClient.collection('media').find(searchString,{ score: { $meta: "textScore" },title:1,contentType:1,album:1,artist:1,publisher:1,genre:1,description:1,lng:1,country:1,views:1,route:1,filePathCover:1}).toArray(function(err,results){
		callback(results);
	})
}