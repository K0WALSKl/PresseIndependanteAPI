"use strict";

const tools = require("../tools");
const mongoDataHandler = require("../../api/mongoDataHandler");
const HTMLParser = require("node-html-parser");
const got = require("got");

// eslint-disable-next-line jsdoc/require-jsdoc
async function updatePolitis() {
    // eslint-disable-next-line no-console
    console.log("Update de Politis...");
    const endpoint = "https://www.politis.fr/rss.xml";

    // eslint-disable-next-line jsdoc/require-jsdoc
    function getArticleAuthor(elem) {
        let authors = elem.querySelector(".article-author-sign");

        if (authors === null) {
            return "";
        }
        authors = elem.querySelector("h5").querySelectorAll("span");
        if (authors !== null) {
            for (let i = 0; i < authors.length; i++) {
                authors[i] = authors[i].querySelector("a").innerHTML;
            }
            authors = authors.join(", ");
            if (tools.debugLevel === 2) {
                // eslint-disable-next-line no-console
                console.log(`${authors}\n`);
            }
        }
        if (tools.debugLevel === 2) {
            // eslint-disable-next-line no-console
            console.log(`${authors}\n`);
        }
        return authors === "" || authors === null ? "Inconnu" : authors;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function getArticleImageUrl(elem) {
        let articleDiapo = elem.querySelectorAll(".diapo-img");
        let articleImgUrl = elem.querySelector(".hidden");


        if (articleDiapo.length !== 0) {
            articleDiapo = articleDiapo[0]
                .getAttribute("style")
                .replace("background-image: url(", "")
                .replace(");", "");
            return articleDiapo;
        }

        if (typeof articleImgUrl !== "undefined") {
            articleImgUrl = articleImgUrl.getAttribute("src");
        }
        return articleImgUrl;
    }

    await tools.getJsonFromRSSFeed(endpoint, async res => {
        let author;
        let pageRes;
        let elem;
        let articleImgUrl;

        if (res.rss === null) {
            return false;
        }

        for (const article of res.rss.channel[0].item) {
            if (!article.title.toString().includes("[Blog]")) {
                pageRes = await got(article.link.toString());
                if (tools.debugLevel === 2) {
                    // eslint-disable-next-line no-console
                    console.log(`${article.link.toString()}\n`);
                }
                elem = HTMLParser.parse(pageRes.body);
                author = getArticleAuthor(elem);
                articleImgUrl = getArticleImageUrl(elem);

                mongoDataHandler.mongoAddArticle(
                    article.link.toString(),
                    articleImgUrl,
                    article.title.toString(),
                    new Date(article.pubDate).toISOString(),
                    article.description
                        // eslint-disable-next-line require-unicode-regexp
                        ? article.description.toString().replace(/(<([^>]+)>)/gi, "")
                        : "",
                    // eslint-disable-next-line no-undefined
                    author === undefined ? "Inconnu" : author,
                    "Politis",
                    "https://www.politis.fr/",
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Logo_de_Politis.svg/640px-Logo_de_Politis.svg.png?1612704632098"
                );

            }
        }
        if (tools.debugLevel === 2) {
            // eslint-disable-next-line no-console
            console.log("Politis Sauvegardé");
        }
        return true;
    });
}

exports.updatePolitis = updatePolitis;
