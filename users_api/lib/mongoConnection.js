var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', function(err) {
    console.log(err);
});

db.once('open', function() {
    console.info('Connection succesful');
});

mongoose.connect('mongodb://localhost/algorath_test');