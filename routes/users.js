var express = require('express');
var router = express.Router();

module.exports = function(app){
	app.get('/search', routes.search);
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
