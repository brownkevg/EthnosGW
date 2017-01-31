var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	loginServices = require('./services');

module.exports = function(SessionStore){
	passport.use(new LocalStrategy(
		function(username, password, done) {
			var accounts = dbClient.collection('users');
			username = username.toLowerCase();
			accounts.findOne({ user: username, $or:[{disabled:{$exists:false}},{disabled:false}] }, function(err, user) {
				if (err) { 
					return done(err); 
				}
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				if (!loginServices.validPassword(password, user.password)) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				console.log(user.user + ' has logged in.');
				return done(null, user);
			});
		}
	));
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj,done){
		// NOTE: this code no longer works with new session structure
		// loginServices.returnUsers(SessionStore, function(userArray){
		// 	var userString = "";
		// 	userArray.forEach(function(item){
		// 		userString += "\n\t" + item.name + " (Session: " + item.sessionId + ")";
		// 	});
		// 	console.log("Currently logged in: " + userString);
		// });
		done(null,obj);
	});
}