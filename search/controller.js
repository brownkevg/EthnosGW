var functions = require('../miscFunctions/functions')
exports.search=function(req,res){
	var searchString = {$and:[]};
	if(typeof req.query.searchTerm !== 'undefined' && req.query.searchTerm !== "") searchString.$text = {$search:req.query.searchTerm,$language:"en"}
	if(typeof req.query.language !== 'undefined' && req.query.language !== "") searchString.$and.push({"lng":req.query.language})
	if(typeof req.query.location !== 'undefined' && req.query.location !== "") searchString.$and.push({"location":req.query.location}) // Ask about this. Should it be location, or country
	if(typeof req.query.genre !== 'undefined' && req.query.genre !== "") searchString.$and.push({"genre":req.query.genre})
	if(typeof req.query.artForm !== 'undefined' && req.query.artForm !== "") searchString.$and.push({"contentType":req.query.artForm})
	debugger;
	find(searchString,function(searchResults){
		functions.getMapData(function(mapData){
			res.render('search',{results:searchResults,mapData:mapData})
		})
	});
	
}

var find = function(searchString,callback){
	console.log(searchString)
	var pageSize = 20;
	dbClient.collection('media').find(searchString,{ score: { $meta: "textScore" },title:1,contentType:1,album:1,artist:1,publisher:1,genre:1,description:1,lng:1,country:1,views:1,route:1}).toArray(function(err,results){
		callback(results);
	})
}