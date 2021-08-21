"use strict";

const tools = require("../tools");
const mongoDataHandler = require("../../api/mongoDataHandler");
const HTMLParser = require("node-html-parser");
const got = require("got");

/**
 *
 */
async function updateFakir() {
    process.stdout.write("Update de Fakir...");
    const endpoint = 'https://www.fakirpresse.info/spip.php?page=backend';

    /**
     * Parse le code HTML afin de récupérer le lien de l'image
     * @returns {string} img src attribute
     */
    function getArticleImageUrl(elem) {
        let articleImgUrl = elem.querySelector('.article');
        if (articleImgUrl != null) {
            articleImgUrl = articleImgUrl.querySelectorAll('img');
            console.log('>>>')
            console.log(articleImgUrl.length)
            if (articleImgUrl.length !== 0) {
                articleImgUrl = articleImgUrl[0].getAttribute('src');
            } else {
                return undefined
            }
        }
        return articleImgUrl;
    }

    function getArticleAuthor(elem) {
        let authors = elem.querySelectorAll('.vcard');

        if (authors != null) {
            for (let i = 0; i < authors.length; i++) {
                authors[i] = authors[i].querySelector('a').innerHTML;
            }
            authors = authors.join(', ');
        }
        return authors;
    }


    await tools.getJsonFromRSSFeed(endpoint, async function(res) {
        let elem;
        let pageRes;
        let articleImgUrl;
        let author;

        if (res.rss == null)
            return
        for (const article of res.rss.channel[0].item) {
            pageRes = await got(article.link.toString())
            elem = HTMLParser.parse(pageRes.body);
            articleImgUrl = getArticleImageUrl(elem);
            author = getArticleAuthor(elem);

            // jsonArticles.push({
            //     url: article.link.toString(),
            //     imageUrl: articleImgUrl == null ? null : 'https://www.fakirpresse.info/' + articleImgUrl,
            //     title: article.title.toString(),
            //     publicationDate: new Date(article['dc:date']).toISOString(),
            //     description: article.description.toString().replace(/(<([^>]+)>)/gi, ""),
            //     author: author == null ? 'Inconnu' : author,
            //     articleSource: {
            //         name: 'Fakir',
            //         url: 'https://www.fakirpresse.info/',
            //         imageUrl: 'https://www.fakirpresse.info/squelettes/css/img/logo.png',
            //     },
            // });
            mongoDataHandler.mongoAddArticle(
                article.link.toString(),
                articleImgUrl === undefined ? null : 'https://www.fakirpresse.info/' + articleImgUrl,
                article.title.toString(),
                new Date(article['dc:date']).toISOString(),
                article.description.toString().replace(/(<([^>]+)>)/gi, ""),
                author == null ? 'Inconnu' : author,
                'Fakir',
                'https://www.fakirpresse.info/',
                'https://www.fakirpresse.info/squelettes/css/img/logo.png'
            );

        }
        console.log("Fakir Sauvegardé");
    });
}

exports.updateFakir = updateFakir;