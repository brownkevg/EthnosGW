var cache = require('mongo-atm');
var pageCache = new cache({ttl:60,limit:500});
exports.getMapData = function(callback){
	debugger;
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