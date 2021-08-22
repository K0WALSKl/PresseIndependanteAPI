"use strict";

const tools = require("../tools");
const mongoDataHandler = require("../../api/mongoDataHandler");
const HTMLParser = require("node-html-parser");
const got = require("got");

// eslint-disable-next-line jsdoc/require-jsdoc
async function updateReporterre() {
    // eslint-disable-next-line no-console
    console.log("Update de Reporterre...");
    const endpoint = "https://reporterre.net/spip.php?page=backend-simple";

    // eslint-disable-next-line jsdoc/require-jsdoc
    function getArticleAuthor(elem) {
        let authors = elem.querySelectorAll(".lienauteur");

        if (authors !== null) {
            for (let i = 0; i < authors.length; i++) {
                authors[i] = authors[i].innerHTML.replace("&#8217;", "'");
            }
            authors = authors.join(", ");
        }
        return authors === "" || authors === [] ? "Inconnu" : authors;
    }

    await tools.getJsonFromRSSFeed(endpoint, async res => {
        let elem;
        let imgUrl;


        if (res.rss === null) {
            return;
        }
        for (let i = 0; i < res.rss.channel[0].item.length; i++) {
            const article = res.rss.channel[0].item[i];
            let author = article["dc:creator"];

            // eslint-disable-next-line no-undefined
            if (author === undefined) {
                const bodyPageRes = await got(article.link.toString());
                const elemPageRes = HTMLParser.parse(bodyPageRes.body);

                author = getArticleAuthor(elemPageRes);
                // eslint-disable-next-line no-undefined
                author = author === undefined ? "Inconnu" : author;
                if (tools.debugLevel === 1) {
                    // eslint-disable-next-line no-console
                    console.log(`Finally : ${author.toString()}`);
                }
            }
            elem = HTMLParser.parse(article.description);
            imgUrl = (elem.querySelector("img") === null ? null : elem.querySelector("img").getAttribute("src"));

            mongoDataHandler.mongoAddArticle(article.link.toString(), imgUrl,
                // eslint-disable-next-line no-control-regex,require-unicode-regexp
                article.title.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, ""),
                new Date(article["dc:date"]).toISOString(),
                elem.querySelector("p").text, author.toString(),
                "Reporterre", "https://reporterre.net/",
                "https://reporterre.net/IMG/siteon0.png?1588262321");
        }
        if (tools.debugLevel === 1) {
            // eslint-disable-next-line no-console
            console.log("Reporterre Sauvegardé\n");
        }
    });
}

exports.updateReporterre = updateReporterre;
