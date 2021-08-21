"use strict";

const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const mongoDataHandler = require("../api/mongoDataHandler");

const LaReleveEtLaPeste = require("./updateNews/LRELP");
const Reporterre = require("./updateNews/Reporterre");
const Fakir = require("./updateNews/Fakir");
const Politis = require("./updateNews/Politis");

/* GET news listing. */
router.get("/", (req, res) => {
    updateNews().then(r => process.stdout.write(r));

    mongoDataHandler.mongoGetArticles(articles => {
        res.contentType("application/json");
        res.json(articles);
    });
});

/**
 * Trie les deux articles en fonction de la date de parution.
 * @return {number}
 */
function dateCompareInArticle(article_a, article_b) {
    if (article_a['publicationDate'] > article_b['publicationDate'])
        return -1;
    if (article_a['publicationDate'] < article_b['publicationDate'])
        return 1;
    return 0;
}

async function updateNews() {
    const updateNewsFunctions = [
        LaReleveEtLaPeste.updateLRELP, // OK
        // updateNouveauJourJ, // Supprimé car le dernier article date du 24 octobre 2019
        // updateLesJours, // OK
        Reporterre.updateReporterre, // OK
        // updateEcoBretons, // OK
        Fakir.updateFakir, // OK
        Politis.updatePolitis, // OK
        // Une fois qu'un journal a une fonction permettant de récupérer tous
        // Les articles à partir de son flux rss, il faut rajouter la fonction ici.
    ];

    for (let i = 0; i < updateNewsFunctions.length; i++) {
        await updateNewsFunctions[i]();
    }
}

router.get('/sortedByDate', function(req, res) {
    updateNews().then(r => console.log(r));
    let sorted_news = {
        data: []
    }

    mongoDataHandler.mongoGetArticles(function(articles) {
        for (let i = 0; i < articles.length; i++)
            sorted_news.data.push(articles[i])
        sorted_news.data.sort(dateCompareInArticle)
        res.contentType('application/json');
        res.json(sorted_news);
    });
});

module.exports = router;
exports.updateNews = updateNews;
