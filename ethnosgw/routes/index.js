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
// end AWS

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Glow' });
// });

router.get('/search', function(req, res, next) {
	res.render('search', {title: 'Glow'})
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
	console.log(req.files.uploadFile);
	var file = req.files.uploadFile;
	var stream = fs.createReadStream(file.path);
	return s3fsImpl.writeFile(file.originalFilename, stream).then(function(){
		fs.unlink(file.path, function(err){
			if(err)
				console.error(err);
		})
		res.redirect('/upload');
	});
});
/* end AWS bucket */

module.exports = router;