"use strict";

const tools = require("../tools");
const mongoDataHandler = require("../../api/mongoDataHandler");
const HTMLParser = require("node-html-parser");

// eslint-disable-next-line jsdoc/require-jsdoc
async function updateEcoBretons() {
    if (tools.debugLevel === 2) {
        // eslint-disable-next-line no-console
        console.log("Update de EcoBretons...");
    }
    const endpoint = "https://www.eco-bretons.info/feed";

    await tools.getJsonFromRSSFeed(endpoint, res => {
        let elem;

        if (res.rss === null) {
            return;
        }
        res.rss.channel[0].item.forEach(article => {
            elem = HTMLParser.parse(article.description);

            mongoDataHandler.mongoAddArticle(
                article.link.toString(),
                (elem.querySelector("img") === null)
                    ? "https://www.eco-bretons.info/wp-content/uploads/2019/07/logo-non-transparent.png"
                    : elem.querySelector("img").getAttribute("src"),
                // eslint-disable-next-line no-control-regex,require-unicode-regexp
                article.title.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, ""),
                new Date(article.pubDate).toISOString(),
                // eslint-disable-next-line require-unicode-regexp
                article.description.toString().replace(/(<([^>]+)>)/gi, ""),
                // eslint-disable-next-line no-undefined
                article["dc:creator"] === undefined ? "Inconnu" : article["dc:creator"].toString(),
                "Eco-Bretons",
                "https://www.eco-bretons.info/",
                "https://www.eco-bretons.info/wp-content/uploads/2019/07/logo-non-transparent.png"
            );

        });
        if (tools.debugLevel === 2) {
            // eslint-disable-next-line no-console
            console.log("EcoBretons Sauvegardé\n");
        }
    });
}

exports.updateEcoBretons = updateEcoBretons;
