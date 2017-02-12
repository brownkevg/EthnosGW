var pages = require('./controller')

module.exports = function(app){
	app.get('/', pages.home);
	app.get('/*', pages.page); //NOTE: leave this as the last route. All routes not pre-defined will default to here. This will be all individual back-pages.
}