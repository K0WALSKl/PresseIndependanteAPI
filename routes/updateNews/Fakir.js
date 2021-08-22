"use strict";

const tools = require("../tools");
const mongoDataHandler = require("../../api/mongoDataHandler");
const HTMLParser = require("node-html-parser");
const got = require("got");

// eslint-disable-next-line jsdoc/require-jsdoc
async function updateFakir() {
    if (tools.debugLevel === 1) {
        process.stdout.write("Update de Fakir...");
    }
    const endpoint = "https://www.fakirpresse.info/spip.php?page=backend";


    // eslint-disable-next-line jsdoc/require-jsdoc
    function getArticleImageUrl(elem) {
        let articleImgUrl = elem.querySelector(".article");

        if (articleImgUrl !== null) {
            articleImgUrl = articleImgUrl.querySelectorAll("img");
            if (tools.debugLevel === 1) {
                process.stdout.write(">>>\\n");
                process.stdout.write(articleImgUrl.length.toString());
            }
            if (articleImgUrl.length !== 0) {
                articleImgUrl = articleImgUrl[0].getAttribute("src");
            }
        }
        return (articleImgUrl);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    function getArticleAuthor(elem) {
        let authors = elem.querySelectorAll(".vcard");

        if (authors !== null) {
            for (let i = 0; i < authors.length; i++) {
                authors[i] = authors[i].querySelector("a").innerHTML;
            }
            authors = authors.join(", ");
        }
        return authors;
    }


    await tools.getJsonFromRSSFeed(endpoint, async res => {
        let elem;
        let pageRes;
        let articleImgUrl;
        let author;

        if (res.rss === null) {
            return;
        }
        for (const article of res.rss.channel[0].item) {
            pageRes = await got(article.link.toString());
            elem = HTMLParser.parse(pageRes.body);
            articleImgUrl = getArticleImageUrl(elem);
            author = getArticleAuthor(elem);

            mongoDataHandler.mongoAddArticle(
                article.link.toString(),
                // eslint-disable-next-line no-undefined
                articleImgUrl === undefined ? null : `https://www.fakirpresse.info/${articleImgUrl}`,
                article.title.toString(),
                new Date(article["dc:date"]).toISOString(),
                // eslint-disable-next-line require-unicode-regexp
                article.description.toString().replace(/(<([^>]+)>)/gi, ""),
                author === null ? "Inconnu" : author,
                "Fakir",
                "https://www.fakirpresse.info/",
                "https://www.fakirpresse.info/squelettes/css/img/logo.png"
            );

        }
        if (tools.debugLevel === 1) {
            process.stdout.write("Fakir Sauvegardé\n");
        }
    });
}

exports.updateFakir = updateFakir;
