var countries = require('country-data').countries;

exports.upload = function(req,res){
	debugger;
	res.render('upload',{countries:sortCountries(countries.all)})
}

exports.uploadContent = function(req,res){
	// debugger;
	var content = req.body;
	content.views = 0;
	content.route = req.body.title.replace(/ /g,'-').toLowerCase();
	//Will need to check for the uniqueness of a route
	debugger;
	dbClient.collection('media').save(content,function(err, result){
		res.status(200).end(JSON.stringify({success:true}));
	})
}

function sortCountries(countries){
	countries.sort(function(a,b){
		if (a.name < b.name)
			return -1;
		if (a.name > b.name)
			return 1;
		return 0;
	})
	return countries
}