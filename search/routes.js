var search = require('./controller')
module.exports = function(app){
	app.get('/search', search.search);
	// app.get('/find', search.find);
}