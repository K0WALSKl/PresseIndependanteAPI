"use strict";

const xmlParser = require("xml2js").parseString;
const request = require("request");

const debugLevel = parseInt(process.env.DEBUG_LEVEL, 10);

// eslint-disable-next-line jsdoc/require-jsdoc
async function getJsonFromRSSFeed(endpoint, callback) {
    request(endpoint, (err, res, body) => {
        if (err) {
            callback(err);
            return false;
        }
        xmlParser(body, (error, result) => {
            if (error) {
                process.stderr.write(err);
            }
            callback(result);
            return true;
        });
        return true;
    });
    return true;
}

exports.getJsonFromRSSFeed = getJsonFromRSSFeed;
exports.debugLevel = debugLevel;
