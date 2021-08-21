"use strict";

const tools = require("../tools");
const mongoDataHandler = require("../../api/mongoDataHandler");
const HTMLParser = require("node-html-parser");
const got = require("got");

/**
 * Parse et stock le journal Reporterre
 * @returns {boolean}
 */
async function updateReporterre () {
    process.stdout.write("Update de Reporterre...");
    const endpoint = 'https://reporterre.net/spip.php?page=backend-simple';

    function getArticleAuthor(elem) {
        let authors = elem.querySelectorAll('.lienauteur');
        if (authors != null) {
            for (let i = 0; i < authors.length; i++) {
                authors[i] = authors[i].innerHTML.replace("&#8217;", "'");
            }
            authors = authors.join(', ');
        }
        return authors === "" || authors === [] ? undefined : authors;
    }

    await tools.getJsonFromRSSFeed(endpoint, async function(res) {
        let elem;
        let img_url;


        if (res.rss == null)
            return
        for (let i = 0; i < res.rss.channel[0].item.length; i++) {
            let article = res.rss.channel[0].item[i];
            let author = article['dc:creator'];
            if (author === undefined) {
                let bodyPageRes = await got(article.link.toString());
                let elemPageRes = HTMLParser.parse(bodyPageRes.body);
                author = getArticleAuthor(elemPageRes);
                author = author === undefined ? 'Inconnu' : author;
                console.log('Finally : ' + author)
            }
            elem = HTMLParser.parse(article.description);
            img_url = (elem.querySelector('img') == null ? null : elem.querySelector('img').getAttribute('src'));

            mongoDataHandler.mongoAddArticle(article.link.toString(), img_url,
                article.title.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, ""),
                new Date(article['dc:date']).toISOString(),
                elem.querySelector('p').text, author.toString(),
                'Reporterre', 'https://reporterre.net/',
                'https://reporterre.net/IMG/siteon0.png?1588262321');
        }
        console.log("Reporterre Sauvegardé");
    });
}

exports.updateReporterre = updateReporterre;