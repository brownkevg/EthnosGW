var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

module.exports = function(app, passport){

	app.get('/login', function(req, res){
		res.render('login', {message: req.flash('loginMessage')})
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login',{
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/signup', function(req, res){
		res.render('signup', {message: req.flash('signupMessage')})
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup',{
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile', {
			user: req.user // get the user out of the session and pass to template
		})
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next){
		// if user is authenticated in the session, carry on
		if(req.isAuthenticated())
			return next();

		res.redirect('/');
	}
}