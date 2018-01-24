
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    connections: Array
});

var User = mongoose.model('User', userSchema);