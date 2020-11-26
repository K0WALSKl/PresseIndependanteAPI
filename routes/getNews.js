var express = require('express');
var router = express.Router();
const tools = require('./tools');
const fs = require('fs');

/* GET news listing. */
router.get('/', function(req, res) {
    // Liste du nom des journaux (chaque nom correspond à un fichier json dans /news/<journal>.json)
    // tools.updateNews();
    const newspapers = ["LaReleveEtLaPeste", "NouveauJourJ"];
    const newspapersLinks = ["https://lareleveetlapeste.fr/", "http://www.nouveaujourj.fr/"];
    const newspapersSupport = ["https://fr.tipeee.com/la-releve-et-la-peste", "http://www.nouveaujourj.fr/"];
    const newsPapersImages = ["https://pbs.twimg.com/profile_images/785417519377031168/LIUJdFMe.jpg", "https://static.fnac-static.com/multimedia/Images/FR/NR/dd/78/6e/7239901/1540-1/tsp20150910164533/La-Releve-et-la-Peste.jpg"];

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

module.exports = router;
