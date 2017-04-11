var cache = require('mongo-atm');
var pageCache = new cache({ttl:60,limit:500});
var lookup = require('country-data').lookup;
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
exports.getCountries = function(callback){
	dbClient.collection("media").distinct("country",function(err,countries){
		var converted = [];
		for(var i = 0; i < countries.length; i++)
			converted.push(lookup.countries({alpha2:countries[i]})[0].name)
		callback(sortCountries(converted));
	})
}

function sortCountries(countries){
	countries.sort(function(a,b){
		if (a < b)
			return -1;
		if (a > b)
			return 1;
		return 0;
	})
	return countries
}