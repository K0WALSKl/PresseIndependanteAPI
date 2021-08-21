"use strict";

const xmlParser = require("xml2js").parseString;
const request = require("request");

/**
 * Récupère le flux xml d'un site et le converti en json
 * @returns {json}
 */
async function getJsonFromRSSFeed(endpoint, callback) {
    request(endpoint, (err, res, body) => {
        if (err) {
            callback(err);
        }
        xmlParser(body, function (err, res) {
            callback(res);
        });
    });
}

module.exports = {
    getJsonFromRSSFeed
};
