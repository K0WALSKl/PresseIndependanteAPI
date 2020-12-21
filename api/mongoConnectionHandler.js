
const mongoose = require('mongoose');
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDatabase = process.env.MONGO_DATABASE

mongoConnect = function() {
    mongoose.connect(`mongodb://${mongoUsername}:${mongoPassword}@db/${mongoDatabase}?authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) {
            console.log("Error connecting to the database error : " + err);
            return false
        }
        console.log(">> MongoDB connection OK");
    });
}

mongoose.connection.on('disconnected', function() {
    console.log("There was an error during the connection to MongoDB");
    process.exit(1);
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log("CTRL C hit. Disconnection successful.")
        console.log("Exit...")
        process.exit(0)
    })
})

exports.mongoConnect = mongoConnect;
