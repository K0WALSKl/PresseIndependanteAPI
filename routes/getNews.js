"use strict";

const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const mongoDataHandler = require("../api/mongoDataHandler");

const LaReleveEtLaPeste = require("./updateNews/LRELP");
const Reporterre = require("./updateNews/Reporterre");
const Fakir = require("./updateNews/Fakir");
const Politis = require("./updateNews/Politis");
const EcoBretons = require("./updateNews/EcoBretons");

const tools = require("./tools");

// eslint-disable-next-line jsdoc/require-jsdoc
async function updateNews() {
    const updateNewsFunctions = [
        LaReleveEtLaPeste.updateLRELP, // OK
        // updateNouveauJourJ, // Supprimé car le dernier article date du 24 octobre 2019
        // updateLesJours, // OK
        Reporterre.updateReporterre, // OK
        EcoBretons.updateEcoBretons, // OK
        Fakir.updateFakir, // OK
        Politis.updatePolitis // OK
        // Once a NewsSource is ready to send the JSON, the function that allows to do it must
        // be added there
    ];

    for (let i = 0; i < updateNewsFunctions.length; i++) {
        await updateNewsFunctions[i]();
    }
}

/* GET news listing. */
router.get("/", (req, res) => {
    // eslint-disable-next-line no-console
    updateNews().then(r => console.log(r));
    mongoDataHandler.mongoGetArticles(articles => {
        res.contentType("application/json");
        res.json(articles);
    });
});

// eslint-disable-next-line jsdoc/require-jsdoc
function dateCompareInArticle(articleA, articleB) {
    if (articleA.publicationDate > articleB.publicationDate) {
        return -1;
    }
    if (articleA.publicationDate < articleB.publicationDate) {
        return 1;
    }
    return 0;
}

router.get("/sortedByDate", (req, res) => {
    if (tools.debugLevel === 2) {
        updateNews().then(r => {
            // eslint-disable-next-line no-console
            console.log(r);
        });
    }

    const sortedNews = {
        data: []
    };

    mongoDataHandler.mongoGetArticles(articles => {
        for (let i = 0; i < articles.length; i++) {
            sortedNews.data.push(articles[i]);
        }
        sortedNews.data.sort(dateCompareInArticle);
        res.contentType("application/json");
        res.json(sortedNews);
    });
});

module.exports = router;
module.exports.updateNews = updateNews;
