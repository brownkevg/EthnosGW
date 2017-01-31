var crypto    = require('crypto');

exports.addNewAccount = function(firstname, lastname, username, password, email, role, callback)
{
  var accounts = dbClient.collection('users');
  username = username.toLowerCase();
  accounts.findOne({user:username}, function(e,o){
    if(o){
      callback('username-taken');
    } else if(password === ""){
      callback('password-blank');
    } else {
      saltAndHash(password, function(hash){
        accounts.insert({
          firstname: firstname,
          lastname: lastname,
          // user: username,
          email: email,
          password: hash,
          // role: role
        },function(err,record){callback('success')});
      });
    }
  });
}
exports.createHashedPassword = function(plainPass, callback){
  saltAndHash(plainPass, function(hash){
    callback(hash);
  });
}
exports.validPassword = function(plainPass, hashedPass)
{
  var salt = hashedPass.substr(0, 10);
  var validHash = salt + md5(plainPass + salt);
  return(hashedPass === validHash);
}
var generateSalt = function()
{
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
  var salt = '';
  for (var i = 0; i < 10; i++) {
    var p = Math.floor(Math.random() * set.length);
    salt += set[p];
  }
  return salt;
}

var md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
  var salt = generateSalt();
  callback(salt + md5(pass + salt));
}