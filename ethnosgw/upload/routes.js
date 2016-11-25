var upload = require('./controller')

module.exports = function(app){
	app.post('/uploadContent', upload.uploadContent)
}