
const mongoose = require('mongoose');
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDatabase = process.env.MONGO_DATABASE;
const mongoHost = process.env.MONGO_HOST;

mongoConnect = function() {
    mongoose.connect(`mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/${mongoDatabase}?authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) {
            console.log(`mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/${mongoDatabase}?authSource=admin`);
            console.log("Error connecting to the database error : " + err);
            return false
        }
        console.log(">> MongoDB connection OK");
    });
}

mongoose.connection.on('disconnected', function() {
    console.log(`mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/${mongoDatabase}?authSource=admin`);
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
