var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ethnos' });
});

router.get('/search', function(req, res, next) {
	debugger;
	res.render('search', {title: 'Ethnos'})
})

module.exports = router;
