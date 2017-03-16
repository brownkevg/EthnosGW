var cache = require('mongo-atm');
var pageCache = new cache({ttl:60,limit:500});
exports.getMapData = function(callback){
	dbClient.collection('media').distinct("country",{country:{$ne:""},country:{$exists:true}},function(err,results){
		callback(results)
	})
}
exports.getLanguages = function(callback){
	dbClient.collection("media").distinct("lng",function(err,languages){
		callback(languages);
	})
}