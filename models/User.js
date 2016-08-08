var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		maxlength: 40,
		required: [true, "Desculpe, mas aqui todos tem nome!"]
	},
	username: {
		type: String,
		minlength: 3,
		maxlength: 40,
		required: [true, "Desculpe, selecione um username!"]
	},
	email: {
		type: String,
		minlength: 3,
		maxlength: 40,
		required: [true, "Desculpe, mas não!"]
	},
	password: {
		type: String,
		required: true
	},
	token : String
});

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema)