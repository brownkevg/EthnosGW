var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ethnos' });
});

router.get('/upload', function(req, res, next) {
	res.render('upload', {title: 'Upload'});
});

module.exports = router;

router.get('/search', function(req, res, next) {
	res.render('search', {title: 'Ethnos'})
<<<<<<< HEAD
=======
})
router.get('/media', function(req, res, next){
	res.render('media', {title: "Media Example"});
})
router.get('/testPage', function(req, res, next){
	dbClient.collection('media').find({}).toArray(function(err, docs){
    	res.render('testPage',{'media':docs});
     });
})
>>>>>>> MongoDb

})
module.exports = router;
