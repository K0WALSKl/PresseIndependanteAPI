"use strict";

const tools = require("../tools");
const mongoDataHandler = require("../../api/mongoDataHandler");
const HTMLParser = require("node-html-parser");
const got = require("got");

/**
 * Parse et stock le journal Politis
 * @return {Promise<boolean>}
 */
async function updatePolitis() {
    process.stdout.write("Update de Politis...");
    const endpoint = 'https://www.politis.fr/rss.xml';

    function getArticleAuthor(elem) {
        let authors = elem.querySelector('.article-author-sign');
        if (authors == null)
            return undefined;
        authors = elem.querySelector('h5').querySelectorAll('span')
        if (authors != null) {
            for (let i = 0; i < authors.length; i++) {
                authors[i] = authors[i].querySelector('a').innerHTML;
            }
            authors = authors.join(', ');
            console.log(authors);
        }
        console.log(authors);
        return authors === "" || authors === null ? undefined : authors;
    }

    function getArticleImageUrl(elem) {
        let articleImgUrl = elem.querySelector('.hidden');
        if (articleImgUrl != null) {
            articleImgUrl = articleImgUrl.getAttribute('src');
        }
        // console.log(": ");
        // console.log(": " + articleImgUrl);
        return articleImgUrl;
    }

    await tools.getJsonFromRSSFeed(endpoint, async function(res) {
        let author;
        let pageRes;
        let elem;
        let articleImgUrl;

        if (res.rss == null)
            return false

        for (const article of res.rss.channel[0].item) {
            if (!article.title.toString().includes('[Blog]')) {
                pageRes = await got(article.link.toString())
                console.log(article.link.toString());
                elem = HTMLParser.parse(pageRes.body);
                author = getArticleAuthor(elem);
                articleImgUrl = getArticleImageUrl(elem);

                mongoDataHandler.mongoAddArticle(
                    article.link.toString(),
                    articleImgUrl,
                    article.title.toString(),
                    new Date(article.pubDate).toISOString(),
                    article.description ?
                        article.description.toString().replace(/(<([^>]+)>)/gi, "") :
                        '',
                    author === undefined ? 'Inconnu' : author,
                    'Politis',
                    'https://www.politis.fr/',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Logo_de_Politis.svg/640px-Logo_de_Politis.svg.png?1612704632098'
                )

            }
        }
        // console.log("RSS de Politis récupéré. Sauvegarde...")
        // fs.unlinkSync('./news/Politis.json');
        // fs.writeFileSync('./news/Politis.json', JSON.stringify(jsonArticles, null, '\t'));
        console.log("Politis Sauvegardé");
    });
}

exports.updatePolitis = updatePolitis;