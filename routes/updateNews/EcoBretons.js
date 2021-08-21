"use strict";

const tools = require("../tools");
const mongoDataHandler = require("../../api/mongoDataHandler");
const HTMLParser = require("node-html-parser");

/**
 * Parse et stock le journal EcoBretons
 * @returns {boolean}
 */
async function updateEcoBretons() {
    process.stdout.write("Update de EcoBretons...");
    const endpoint = 'https://www.eco-bretons.info/feed';
    await tools.getJsonFromRSSFeed(endpoint, function(res) {
        let elem;

        if (res.rss == null)
            return
        res.rss.channel[0].item.forEach(article => {
            elem = HTMLParser.parse(article.description)

            mongoDataHandler.mongoAddArticle(
                article.link.toString(),
                (elem.querySelector('img') == null) ?
                    'https://www.eco-bretons.info/wp-content/uploads/2019/07/logo-non-transparent.png' :
                    elem.querySelector('img').getAttribute('src'),
                article.title.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, ""),
                new Date(article['pubDate']).toISOString(),
                article.description.toString().replace(/(<([^>]+)>)/gi, ""),
                article['dc:creator'] === undefined ? "Inconnu" : article['dc:creator'].toString(),
                'Eco-Bretons',
                'https://www.eco-bretons.info/',
                'https://www.eco-bretons.info/wp-content/uploads/2019/07/logo-non-transparent.png'
            );

        })
        console.log("EcoBretons Sauvegardé");
    });
}

exports.updateEcoBretons = updateEcoBretons;