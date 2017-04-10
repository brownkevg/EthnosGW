var express = require('express');
var router = express.Router();
// AWS
var fs = require('fs');
var S3FS = require('s3fs');
var s3fsImpl = new S3FS('ethnosgw', {signatureVersion: 'v4', region: 'us-east-2'});
var multiparty = require('connect-multiparty'),
multipartyMiddleware = multiparty();
router.use(multipartyMiddleware);
var bucketName = 'ethnosgw';
var countries = require('country-data').countries;
// end AWS

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Glow' });
// });
// ************* temp routes for design
router.get('/upload', function(req, res, next){
	res.render('upload1',{user:req.user});
})
router.get('/upload1', function(req, res, next){
	res.render('upload1',{user:req.user});
})
router.get('/upload2', function(req, res, next){
	res.render('upload2',{user:req.user});
})
router.get('/upload3', function(req, res, next){
	res.render('upload3', {user:req.user,countries:sortCountries(countries.all)});
})
router.get('/upload4', function(req, res, next){
	res.render('upload4',{user:req.user});
})
router.get('/success', function(req, res, next){
	res.render('success',{user:req.user});
})
// ************* end temp routes
router.get('/news', function(req, res, next){
	res.render('news',{user:req.user});
})
router.get('/media', function(req, res, next){
	res.render('media', {title: "Media Example"});
})
router.get('/testPage', function(req, res, next){
	dbClient.collection('media').find({}).toArray(function(err, docs){
    	res.render('testPage',{'media':docs});
     });
})

/* mongodb */
router.get('/userlist', function(req,res){
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.render('userlist',{
			"userlist" : docs
		});
	});
});

/* AWS bucket */
router.post('/testPost', function(req, res){
	// console.log(req.files.fileLocation);
	var file = req.files.fileLocation;
	var stream = fs.createReadStream(file.path);
	var fileName = file.originalFilename.replace(/ - /g,"_").replace(/ /g,"-")
	return s3fsImpl.writeFile(/*file.originalFilename*/fileName, stream).then(function(){
		fs.unlink(file.path, function(err){
			if(err)
				console.error(err);
		})
		res.render('upload2',{user:req.user,countries:sortCountries(countries.all), filePath:"https://s3.us-east-2.amazonaws.com/ethnosgw/"+fileName})
		// res.render('upload2',{filePath:"https://s3.us-east-2.amazonaws.com/ethnosgw/" + file.fileName, countries:sortCountries(countries.all)});
	});
});
// album cover
router.post('/cover', function(req, res){
	// console.log(req.body.skip);
	if(req.body.skip == "true"){
		res.render('upload4',{user:req.user,countries:sortCountries(countries.all), filePath:req.body.filePath, filePathCover:""})
	}else{
		var file = req.files.fileLocation;
		var stream = fs.createReadStream(file.path);
		return s3fsImpl.writeFile(file.originalFilename, stream).then(function(){
			fs.unlink(file.path, function(err){
				if(err)
					console.error(err);
			})
			res.render('upload4',{user:req.user,countries:sortCountries(countries.all), filePath:req.body.filePath, filePathCover:"https://s3.us-east-2.amazonaws.com/ethnosgw/"+file.name})
		});
	}
});
// additional file(s)
router.post('/additionalFile', function(req, res){
	// console.log(req.files.fileLocation);
	if(req.body.skip == "true"){
		res.render('upload3',{user:req.user, countries:sortCountries(countries.all), filePath:req.body.filePath, filePathCover:req.body.filePathCover, additionalFile:""})
	}else{
		var file = req.files.fileLocation;
		var stream = fs.createReadStream(file.path);
		return s3fsImpl.writeFile(file.originalFilename, stream).then(function(){
			fs.unlink(file.path, function(err){
				if(err)
					console.error(err);
			})
			res.render('upload3',{user:req.user, countries:sortCountries(countries.all), filePath:req.body.filePath, filePathCover:req.body.filePathCover, additionalFile:"https://s3.us-east-2.amazonaws.com/ethnosgw/"+file.name})
			
		});
	}
});
/* end AWS bucket */

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

module.exports = router;