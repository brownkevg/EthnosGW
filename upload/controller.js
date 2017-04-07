var countries = require('country-data').countries;

// exports.upload = function(req,res){
// 	var fileName = req.fileName;
// 	var dataObj = {countries:sortCountries(countries.all)}
// 	if(typeof fileName !== 'undefined')
// 		dataObj.filePath = "https://s3.us-east-2.amazonaws.com/ethnosgw/"+fileName
// 	res.render('upload2',dataObj)
// }

exports.uploadContent = function(req,res){
	var content = req.body;
	if(typeof req.user !== 'undefined') // Need to do checks for whether they are logged in or not.
		content.user = req.user.local.email;
	content.views = 0;
	content.route = req.body.title.replace(/ |\./g,'-').toLowerCase(); // replace " " and "."
	//Will need to check for the uniqueness of a route
	dbClient.collection('media').save(content,function(err, result){
		res.render('success');
	})
}

// function sortCountries(countries){
// 	countries.sort(function(a,b){
// 		if (a.name < b.name)
// 			return -1;
// 		if (a.name > b.name)
// 			return 1;
// 		return 0;
// 	})
// 	return countries
// }