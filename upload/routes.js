var upload = require('./controller')

module.exports = function(app){
	app.post('/uploadContent', upload.uploadContent);
	app.get('/upload', function(req,res){
		res.render('upload1')
	});
	app.get('/upload2', upload.upload);
}