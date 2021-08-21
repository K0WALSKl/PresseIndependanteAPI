"use strict";

const tools = require("../tools");
const mongoDataHandler = require("../../api/mongoDataHandler");
const HTMLParser = require("node-html-parser");
const got = require("got");

/**
 * Parse et stock le journal La Relève Et La Peste
 * @returns {boolean}
 */
async function updateLRELP() {
    process.stdout.write("Update de La Relève Et La Peste...");
    const endpoint = 'https://lareleveetlapeste.fr/feed';

    function getArticleAuthor(elem) {
        let authors = elem.querySelector('.display-block.position-relative.font--l.letterspacing-m.c-black.fontsize-xs.breakpoint-m--fontsize-xxs.lineheight-1.width-100.textalign-center');
        if (authors == null)
            return undefined;
        authors = authors.innerHTML.split("- ")[1].replace(/\t/g, '');
        return authors === "" || authors === null ? undefined : authors;
    }

    await tools.getJsonFromRSSFeed(endpoint, async function(res) {
        let author;

        if (res.rss == null)
            return

        let pageRes;
        let elem;
        let articleImgUrl;
        for (const article of res.rss.channel[0].item) {
            pageRes = await got(article.link.toString())
            elem = HTMLParser.parse(pageRes.body);
            author = getArticleAuthor(elem);
            articleImgUrl = elem.querySelector('.attachment-post-thumbnail');
            if (articleImgUrl != null)
                articleImgUrl = articleImgUrl.getAttribute('data-lazy-src');

            mongoDataHandler.mongoAddArticle(article.link.toString(), articleImgUrl, article.title.toString(),
                new Date(article.pubDate).toISOString(),
                article.description.toString().replace(/(<([^>]+)>)/gi, ""), author,
                'La Releve Et La Peste', 'https://lareleveetlapeste.fr/',
                'https://pbs.twimg.com/profile_images/785417519377031168/LIUJdFMe.jpg');
        }
        console.log("La Relève Et La Peste Sauvegardé");
        return true
    });
}

exports.updateLRELP = updateLRELP;