var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

module.exports = function(app){
	app.get('/login', function(req, res){
		res.render('login', {title:'Login'});
	});
	app.post('/login',
		passport.authenticate('local', {
			successReturnToOrRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		})
	);
	app.get('/logout', function(req, res){
		if(typeof req.user != 'undefined'){
			for(var i in webAdminClients){
				if(req.user.user == webAdminClients[i].username){
					var simpleUser = webAdminClients.splice(i, 1); //remove client from list immediately
				}
			}
			if(typeof simpleUser !== 'undefined'){
				io.sockets.emit('userListUpdated', {user: simpleUser[0], list: webAdminClients});
			}
			console.log(req.user.user + ' has logged out.');
			req.logout();
		}
		res.redirect('/');
	});
	// app.all('/*',ensureLoggedIn('/login'));
	app.get('/defaultroute',function(req,res){
		res.redirect(req.session.req.user.route || "/");
	});
}