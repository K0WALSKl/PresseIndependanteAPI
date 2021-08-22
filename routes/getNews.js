"use strict";

const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const mongoDataHandler = require("../api/mongoDataHandler");

const LaReleveEtLaPeste = require("./updateNews/LRELP");
const Reporterre = require("./updateNews/Reporterre");
const Fakir = require("./updateNews/Fakir");
const Politis = require("./updateNews/Politis");
const tools = require("./tools");

// eslint-disable-next-line jsdoc/require-jsdoc
async function updateNews() {
    const updateNewsFunctions = [
        LaReleveEtLaPeste.updateLRELP, // OK
        // updateNouveauJourJ, // Supprimé car le dernier article date du 24 octobre 2019
        // updateLesJours, // OK
        Reporterre.updateReporterre, // OK
        // updateEcoBretons, // OK
        Fakir.updateFakir, // OK
        Politis.updatePolitis // OK
        // Une fois qu'un journal a une fonction permettant de récupérer tous
        // Les articles à partir de son flux rss, il faut rajouter la fonction ici.
    ];

    for (let i = 0; i < updateNewsFunctions.length; i++) {
        await updateNewsFunctions[i]();
    }
}

/* GET news listing. */
router.get("/", (req, res) => {
    updateNews().then(r => process.stdout.write(r));
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
    updateNews().then(r => {
        if (tools.debugLevel === 1) {
            process.stdout.write(`${r}\n`);
        }
    });

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
exports.updateNews = updateNews;
