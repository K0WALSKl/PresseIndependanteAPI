var express = require('express');
var router = express.Router();
const tools = require('./tools');
const fs = require('fs');

/* GET news listing. */
router.get('/', function(req, res) {
    // Liste du nom des journaux (chaque nom correspond à un fichier json dans /news/<journal>.json)
    const newspapers = ["LaReleveEtLaPeste", "NouveauJourJ"];

    // Tableau de json contenant tous les articles
    let all_news = [];

    for (let i = 0; i < newspapers.length; i++) {
        let file = fs.readFileSync("./news/" + newspapers[i] + ".json", 'utf-8');
        all_news.push({
            "news_paper": newspapers[i],
            "articles": JSON.parse(file),
        })
        console.log("done")
    }
    res.contentType('application/json');
    res.json(all_news);
});

module.exports = router;
