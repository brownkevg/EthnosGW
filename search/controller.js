var functions = require('../miscFunctions/functions')
exports.search=function(req,res){
	var query = req.query.searchTerm;
	find(query,function(searchResults){
		functions.getMapData(function(mapData){
			res.render('search',{results:searchResults,mapData:mapData})
		})
	});
	
}

var find = function(query,callback){
	var pageSize = 20;
	var searchString = {$text:{$search:query,$language:"en"}};
	dbClient.collection('media').find(searchString,{ score: { $meta: "textScore" },title:1,contentType:1,album:1,artist:1,publisher:1,genre:1,description:1,lng:1,country:1,views:1,route:1}).toArray(function(err,results){
		callback(results);
	})
}