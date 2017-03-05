var express = require('express');
var router = express.Router();

module.exports = function(app){
	app.get('/search', routes.search);
}
module.exports = function(app){
	app.get('/upload', routes.upload);
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
