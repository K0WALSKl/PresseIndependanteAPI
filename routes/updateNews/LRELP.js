"use strict";

const tools = require("../tools");
const mongoDataHandler = require("../../api/mongoDataHandler");
const HTMLParser = require("node-html-parser");
const got = require("got");

// eslint-disable-next-line jsdoc/require-jsdoc
async function updateLRELP() {
    // eslint-disable-next-line no-console
    console.log("Update de La Relève Et La Peste...");
    const endpoint = "https://lareleveetlapeste.fr/feed";

    // eslint-disable-next-line jsdoc/require-jsdoc
    function getArticleAuthor(elem) {
        let authors = elem.querySelector(".display-block.position-relative.font--l.letterspacing-m.c-black.fontsize-xs.breakpoint-m--fontsize-xxs.lineheight-1.width-100.textalign-center");

        if (authors === null) {
            return "Inconnu";
        }
        // eslint-disable-next-line require-unicode-regexp
        authors = authors.innerHTML.split("- ")[1].replace(/\t/g, "");
        authors = authors === "" || authors === null ? "Inconnu" : authors;
        return (authors);
    }

    await tools.getJsonFromRSSFeed(endpoint, async res => {
        let author;

        if (res.rss === null) {
            return false;
        }

        let pageRes;
        let elem;
        let articleImgUrl;

        for (const article of res.rss.channel[0].item) {
            pageRes = await got(article.link.toString());
            elem = HTMLParser.parse(pageRes.body);
            author = getArticleAuthor(elem);
            articleImgUrl = elem.querySelector(".attachment-post-thumbnail");
            if (articleImgUrl !== null) {
                articleImgUrl = articleImgUrl.getAttribute("data-lazy-src");
            }

            mongoDataHandler.mongoAddArticle(article.link.toString(), articleImgUrl, article.title.toString(),
                new Date(article.pubDate).toISOString(),
                // eslint-disable-next-line require-unicode-regexp
                article.description.toString().replace(/(<([^>]+)>)/gi, ""), author,
                "La Releve Et La Peste", "https://lareleveetlapeste.fr/",
                "https://pbs.twimg.com/profile_images/785417519377031168/LIUJdFMe.jpg");
        }
        if (tools.debugLevel === 1) {
            // eslint-disable-next-line no-console
            console.log("La Relève Et La Peste Sauvegardé\n");
        }
        return true;
    });
}

exports.updateLRELP = updateLRELP;
