const mongoose = require("mongoose");
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDatabase = process.env.MONGO_DATABASE;
const mongoHost = process.env.MONGO_HOST;

/**
 * Permet de lancer la connexion à la BDD
 * @returns <void>
 */
function mongoConnect() {
    mongoose.connect(`mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/${mongoDatabase}?authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            console.log(`mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/${mongoDatabase}?authSource=admin`);
            console.log(`Error connecting to the database error : ${err}`);
            return false;
        }
        console.log(">> MongoDB connection OK");
    });
}

mongoose.connection.on("disconnected", () => {
    console.log(`mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/${mongoDatabase}?authSource=admin`);
    console.log("There was an error during the connection to MongoDB");
    process.exit(1);
});

process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        console.log("CTRL C hit. Disconnection successful.");
        console.log("Exit...");
        process.exit(0);
    });
});

exports.mongoConnect = mongoConnect;
