"use strict";

const tools = require("../tools");
const mongoDataHandler = require("../../api/mongoDataHandler");
const HTMLParser = require("node-html-parser");

// eslint-disable-next-line jsdoc/require-jsdoc
async function updateAlter1fo() {
    // eslint-disable-next-line no-console
    console.log("Update de Alter1fo...");
    const endpoint = "http://alter1fo.com/feed";

    await tools.getJsonFromRSSFeed(endpoint, async res => {
        if (res === null || res.rss === null) {
            return;
        }
        res.rss.channel[0].item.forEach(article => {
            const elemDescription = HTMLParser.parse(article.description);
            const elemContentEncoded = HTMLParser.parse(article["content:encoded"]);

            const link = article.link.toString();
            const imgUrl = elemContentEncoded.querySelector("img").getAttribute("src");
            const title = article.title[0];
            const pubDate = new Date(article.pubDate).toISOString();
            const description = elemDescription.toString();
            const author = article["dc:creator"].toString();

            mongoDataHandler.mongoAddArticle(
                link,
                imgUrl,
                title,
                pubDate,
                description,
                author,
                "Alter1fo",
                "http://alter1fo.com/",
                "http://alter1fo.com/wp-content/themes/wp-alter1fo/img/alter1fo.png"
            );
        });
        if (tools.debugLevel === 2) {
            // eslint-disable-next-line no-console
            console.log("Alter1fo Sauvegardé\n");
        }
    });
}

exports.updateAlter1fo = updateAlter1fo;
