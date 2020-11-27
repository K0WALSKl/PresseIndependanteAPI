var express = require('express');
var router = express.Router();
const tools = require('./tools');
const fs = require('fs');
const newspapers = ["LaReleveEtLaPeste", "NouveauJourJ", "LesJours"];
const newspapersLinks = ["https://lareleveetlapeste.fr/", "http://www.nouveaujourj.fr/", "https://lesjours.fr/"];
const newspapersSupport = ["https://fr.tipeee.com/la-releve-et-la-peste", "http://www.nouveaujourj.fr/", "https://lesjours.fr/abonnement/jouriste"];
const newsPapersImages = ["https://pbs.twimg.com/profile_images/785417519377031168/LIUJdFMe.jpg", "https://static.fnac-static.com/multimedia/Images/FR/NR/dd/78/6e/7239901/1540-1/tsp20150910164533/La-Releve-et-la-Peste.jpg", "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4c/Les_Jours.svg/1280px-Les_Jours.svg.png"];

/* GET news listing. */
router.get('/', function(req, res) {
    // Liste du nom des journaux (chaque nom correspond à un fichier json dans /news/<journal>.json)
    tools.updateNews();

    // Tableau de json contenant tous les articles
    let all_news = {
        data: []
    };

    for (let i = 0; i < newspapers.length; i++) {
        let file = fs.readFileSync("./news/" + newspapers[i] + ".json", 'utf-8');
        all_news.data.push({
            "news_paper": newspapers[i],
            "url": newspapersLinks[i],
            "donationUrl": newspapersSupport[i],
            "imageUrl": newsPapersImages[i],
            "articles": JSON.parse(file),
        })
        console.log("done")
    }
    res.contentType('application/json');
    res.json(all_news);
});

function dateComapteInArticle(article_a, article_b) {
    if (article_a['publicationDate'] > article_b['publicationDate'])
        return -1;
    if (article_a['publicationDate'] < article_b['publicationDate'])
        return 1;
    return 0;
}

router.get('/sortedByDate', function(req, res) {
    let all_news = {
        data: []
    };
    let sorted_news = {
        data: []
    }

    for (let i = 0; i < newspapers.length; i++) {
        let file = fs.readFileSync("./news/" + newspapers[i] + ".json", 'utf-8');
        all_news.data.push({
            "articles": JSON.parse(file),
        })
    }
    for (let i = 0; i < all_news.data.length; i++) {
        for (let j = 0; j < all_news.data[i].articles.length; j++) {
            sorted_news.data.push(all_news.data[i].articles[j])
        }
    }
    sorted_news.data.sort(dateComapteInArticle)
    res.contentType('application/json');
    res.json(sorted_news);
});

module.exports = router;
