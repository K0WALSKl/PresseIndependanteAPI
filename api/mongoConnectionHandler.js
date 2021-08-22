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
                process.stderr.write(`mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/${mongoDatabase}?authSource=admin\n`);
                process.stdout.write(`Error connecting to the database error : ${err}\n`);
                return false;
            }
            process.stdout.write(">> MongoDB connection OK\n");
            return true;
        });
    return true;
}

mongoose.connection.on("disconnected", () => {
    process.stdout.write(`mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}/${mongoDatabase}?authSource=admin\n`);
    process.stdout.write("There was an error during the connection to MongoDB\n");
    // eslint-disable-next-line node/no-process-exit
    process.exit(1);
});

process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        process.stdout.write("CTRL C hit. Disconnection successful.\n");
        process.stdout.write("Exit...\n");
        // eslint-disable-next-line node/no-process-exit
        process.exit(0);
    });
});

exports.mongoConnect = mongoConnect;
