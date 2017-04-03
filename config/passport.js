var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport){
	// used to serialize the user for the session
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	//used to deserialize the user
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		// firstNameField: 'firstName',
		// lastnameField: 'lastName',
		passReqToCallback: true // allows us to pass back the entire requrest to the callback
	},
	function(req, email, password, /*firstName, lastName,*/ done){
		// asynchronous
		// User.findOne won't fire unless data is sent back
		process.nextTick(function(){
			// checking if user trying to login already exists
			// var accounts = dbClient.collection('users');
			User.findOne({'local.email':email}, function(err, user){
				if(err)
					return done(err);

				// check to see if there is already a user with that email
				if(user){
					return done(null, false, req.flash('signupMessage', 'There already exists an account with that email.'))
				} else {
					// create new user
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.local.firstName = req.body.firstName;
					newUser.local.lastName = req.body.lastName;
					var route = req.body.firstName + req.body.lastName;
					newUser.route = route.replace(/ /g,'-').toLowerCase();
					newUser.bio = "";

					newUser.save(function(err){
						if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));


	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		// var accounts = dbClient.collection('users');
		User.findOne({'local.email':email}, function(err, user){
			if(err)
				return done(err);

			if(!user)
				return done(null, false, req.flash('loginMessage', 'No user found.'));

			if(!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

			return done(null, user);
		});
	}));
};