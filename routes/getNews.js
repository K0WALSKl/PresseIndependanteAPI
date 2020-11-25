var express = require('express');
var router = express.Router();
const tools = require('./tools');
const fs = require('fs');

let get_all_news = function(callback) {
    const newspapers = ["LaReleveEtLaPeste", "NouveauJour"];
    let all_news = [];

    for (var i = 0; i < all_news.length; i++) {
        let file = fs.readFileSync("./news/" + newspapers[i] + ".json", 'utf-8');
        all_news.push({
            "source": newspapers[i],
            "articles": JSON.parse(file),
        })
        console.log("done")
    }
    console.log(JSON.stringify(all_news, null, '\t'))
    return all_news
}

/* GET news listing. */
router.get('/', function(req, res) {
    // tools.updateNews();
    // tools.updateLRELP();
    // let file = fs.readFile('./news/LaReleveEtLaPeste.json', function (err, data) {
    //     res.contentType('application/json');
    //     res.json({
    //         "news_paper": 'La Relève Et La Peste',
    //         "articles": JSON.parse(data),
    //     });
    // });

    const newspapers = ["LaReleveEtLaPeste", "NouveauJour"];
    let all_news = [];

    for (let i = 0; i < newspapers.length; i++) {
        let file = fs.readFileSync("./news/" + newspapers[i] + ".json", 'utf-8');
        all_news.push({
            "news_paper": newspapers[i],
            "articles": JSON.parse(file),
        })
        console.log("done")
    }
    console.log(JSON.stringify(all_news, null, '\t'))
    res.contentType('application/json');
    res.json(all_news);
    //
    // get_all_news(function (data) {
    //     res.contentType('application/json');
    //     res.json(data);
    // }).then(r => res.json(r));

});

module.exports = router;
