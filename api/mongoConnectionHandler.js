"use strict";

const mongoose = require("mongoose");
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDatabase = process.env.MONGO_DATABASE;
const mongoHost = process.env.MONGO_HOST;

// eslint-disable-next-line jsdoc/require-jsdoc
function mongoConnect() {
    mongoose.connect(`mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/${mongoDatabase}?authSource=admin`,
        { useNewUrlParser: true, useUnifiedTopology: true }, err => {
            if (err) {
                // eslint-disable-next-line no-console
                console.log(`mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/${mongoDatabase}?authSource=admin\n`);
                // eslint-disable-next-line no-console
                console.log(`Error connecting to the database error : ${err}\n`);
                return false;
            }
            // eslint-disable-next-line no-console
            console.log(">> MongoDB connection OK\n");
            return true;
        });
    return true;
}

mongoose.connection.on("disconnected", () => {
    // eslint-disable-next-line no-console
    console.log(`mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/${mongoDatabase}?authSource=admin\n`);
    // eslint-disable-next-line no-console
    console.log("There was an error during the connection to MongoDB\n");
    // eslint-disable-next-line node/no-process-exit
    process.exit(1);
});

process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        // eslint-disable-next-line no-console
        console.log("CTRL C hit. Disconnection successful.\n");
        // eslint-disable-next-line no-console
        console.log("Exit...\n");
        // eslint-disable-next-line node/no-process-exit
        process.exit(0);
    });
});

exports.mongoConnect = mongoConnect;
