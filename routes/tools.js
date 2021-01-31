const xmlParser = require('xml2js').parseString;
const got = require('got');
const request = require('request');
const fs = require('fs');
const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const globals = require('../globals');
const HTMLParser = require('node-html-parser');

let getJsonFromRSSFeed = async function(endpoint, callback) {
    request(endpoint, (err, res, body) => {
        if (err) {
            callback(err);
        }
        xmlParser(body, function (err, res) {
            callback(res);
        });
    });
}

// async function asyncForEach(array, callback) {
//     for (let index = 0; index < array.length; index++) {
//         await callback(array[index], index, array);
//     }
// }

let updateLRELP = async function() {
    console.log("Update de La Relève Et La Peste...");
    const endpoint = 'https://lareleveetlapeste.fr/feed';
    let json = await getJsonFromRSSFeed(endpoint, async function(res) {
        let jsonArticles = [];

        if (res.rss == null)
            return

        for (const article of res.rss.channel[0].item) {
            pageRes = await got(article.link.toString())
            elem = HTMLParser.parse(pageRes.body);
            articleImgUrl = elem.querySelector('.attachment-post-thumbnail');
            if (articleImgUrl != null)
                articleImgUrl = articleImgUrl.getAttribute('data-lazy-src');

            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: articleImgUrl,
                title: article.title.toString(),
                publicationDate: new Date(article.pubDate).toISOString(),
                description: article.description.toString().replace(/(<([^>]+)>)/gi, ""),
                author: "Inconnu",
                articleSource: {
                    name: 'La Releve Et La Peste',
                    url: 'https://lareleveetlapeste.fr/',
                    // support_url: 'https://fr.tipeee.com/la-releve-et-la-peste',
                    imageUrl: 'https://pbs.twimg.com/profile_images/785417519377031168/LIUJdFMe.jpg',
                },
            });
        }
        console.log("RSS de La Relève Et La Peste récupéré. Sauvegarde...")
        fs.unlinkSync('./news/LaReleveEtLaPeste.json');
        fs.writeFileSync('./news/LaReleveEtLaPeste.json', JSON.stringify(jsonArticles, null, '\t'));
        console.log("La Relève Et La Peste Sauvegardé");
    });
}

let updateNouveauJourJ = async function() {
    console.log("Update du NouveauJourJ...");
    const endpoint = 'http://www.nouveaujourj.fr/?format=feed';
    let json = await getJsonFromRSSFeed(endpoint, async function(res) {
        let jsonArticles = [];
        let pageRes;
        let elem;
        let img_url;

        if (res.rss == null) {
            console.log("rss field == null")
            return
        }

        let i = 0;
        for (const article of res.rss.channel[0].item) {
            elem = HTMLParser.parse(article.description)
            img_url = null;
            if (elem.querySelector('img') != null) {
                img_url = elem.querySelector('img').getAttribute('src')
            } else {
                pageRes = await got(article.link.toString())
                elem = HTMLParser.parse(pageRes.body);
                if (i === 0) {
                    console.log(article.link)
                    // console.log(pageRes)
                    console.log('QuerySelectorAll img[4]');
                    console.log(elem.querySelectorAll('img')[4]);
                    console.log('itemPage');
                    // console.log(elem.querySelector('.item-page'));
                    console.log(elem.querySelector('.item-page').querySelector('img'));
                }
                i++;
                if (elem.querySelector('.item-page') != null && elem.querySelector('img') != null) {
                    img_url = elem.querySelector('.item-page').querySelector('img')
                    if (img_url)
                        img_url = img_url.getAttribute('src');
                    else
                        img_url = null;
                }
                else
                    img_url = 'https://api.tipeee.com/cache/20200608141825/media/1200/630/zoom/1068263/202006085ede2c920dd3b.jpeg'
            }
            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: img_url == null ? 'https://api.tipeee.com/cache/20200608141825/media/1200/630/zoom/1068263/202006085ede2c920dd3b.jpeg' : img_url,
                title: article.title.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, ""),
                publicationDate: new Date(article.pubDate).toISOString(),
                description: elem.querySelectorAll('p')[elem.querySelectorAll('p').length - 1].innerHTML,
                author: article['author'] == undefined ? "Inconnu" : article['author'].toString(),
                articleSource: {
                    name: 'NouveauJourJ',
                    url: 'http://www.nouveaujourj.fr/',
                    // support_url: 'http://www.nouveaujourj.fr/',
                    imageUrl: 'https://api.tipeee.com/cache/20200608141825/media/1200/630/zoom/1068263/202006085ede2c920dd3b.jpeg',
                },
            });
        }

        // for (let i = 0; i <= res.rss.channel[0].item.length; i++) {
        //     elem = HTMLParser.parse(res.rss.channel[0].item[i].description)
        //     img_url = null;
        //     if (elem.querySelector('img') != null) {
        //         img_url = elem.querySelector('img').getAttribute('src')
        //     } else {
        //         console.log(res.rss.channel[0].item[i].link.toString());
        //         pageRes = await request.get(res.rss.channel[0].item[i].link.toString());
        //         console.log(pageRes.body);
        //         img_url = 'https://api.tipeee.com/cache/20200608141825/media/1200/630/zoom/1068263/202006085ede2c920dd3b.jpeg'
        //     }
        //     jsonArticles.push({
        //         url: res.rss.channel[0].item[i].link.toString(),
        //         imageUrl: img_url == null ? 'https://api.tipeee.com/cache/20200608141825/media/1200/630/zoom/1068263/202006085ede2c920dd3b.jpeg' : img_url,
        //         title: res.rss.channel[0].item[i].title.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, ""),
        //         publicationDate: new Date(res.rss.channel[0].item[i].pubDate).toISOString(),
        //         description: elem.querySelectorAll('p')[elem.querySelectorAll('p').length - 1].innerHTML,
        //         author: res.rss.channel[0].item[i]['author'] == undefined ? "Inconnu" : res.rss.channel[0].item[i]['author'].toString(),
        //         articleSource: {
        //             name: 'NouveauJourJ',
        //             url: 'http://www.nouveaujourj.fr/',
        //             // support_url: 'http://www.nouveaujourj.fr/',
        //             imageUrl: 'https://api.tipeee.com/cache/20200608141825/media/1200/630/zoom/1068263/202006085ede2c920dd3b.jpeg',
        //         },
        //     });
        // }
        //
        //
        // res.rss.channel[0].item.map(article => {
        //     elem = HTMLParser.parse(article.description)
        //     img_url = null;
        //     if (elem.querySelector('img') != null) {
        //         img_url = elem.querySelector('img').getAttribute('src')
        //     } else {
        //         img_url = 'https://api.tipeee.com/cache/20200608141825/media/1200/630/zoom/1068263/202006085ede2c920dd3b.jpeg'
        //     }
        //     jsonArticles.push({
        //         url: article.link.toString(),
        //         imageUrl: img_url == null ? 'https://api.tipeee.com/cache/20200608141825/media/1200/630/zoom/1068263/202006085ede2c920dd3b.jpeg' : img_url,
        //         title: article.title.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, ""),
        //         publicationDate: new Date(article.pubDate).toISOString(),
        //         description: elem.querySelectorAll('p')[elem.querySelectorAll('p').length - 1].innerHTML,
        //         author: article['author'] == undefined ? "Inconnu" : article['author'].toString(),
        //         articleSource: {
        //             name: 'NouveauJourJ',
        //             url: 'http://www.nouveaujourj.fr/',
        //             // support_url: 'http://www.nouveaujourj.fr/',
        //             imageUrl: 'https://api.tipeee.com/cache/20200608141825/media/1200/630/zoom/1068263/202006085ede2c920dd3b.jpeg',
        //         },
        //     });
        // }
        // )
        console.log("RSS du NouveauJourJ récupéré. Sauvegarde...")
        fs.unlinkSync('./news/NouveauJourJ.json');
        fs.writeFileSync('./news/NouveauJourJ.json', JSON.stringify(jsonArticles, null, '\t'));
        console.log("NouveauJourJ Sauvegardé");
    });
}

let updateLesJours = async function() {
    console.log("Update du Les Jours...");
    const endpoint = 'https://lesjours.fr/rss.xml';
    let json = await getJsonFromRSSFeed(endpoint, function(res) {
        let jsonArticles = [];

        if (res.rss == null)
            return
        res.rss.channel[0].item.forEach(article => {
            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: article.enclosure[0]['$'].url,
                title: article.title.toString(),
                description: article.description.toString(),
                publicationDate: new Date(article.pubDate).toISOString(),
                author: "Inconnu",
                articleSource: {
                    name: 'Les Jours',
                    url: 'https://lesjours.fr/',
                    // support_url: 'https://lesjours.fr/abonnement/jouriste',
                    imageUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/4/4c/Les_Jours.svg/1280px-Les_Jours.svg.png',
                },
            });
        })
        console.log("RSS du Les Jours récupéré. Sauvegarde...")
        fs.unlinkSync('./news/LesJours.json');
        fs.writeFileSync('./news/LesJours.json', JSON.stringify(jsonArticles, null, '\t'));
        console.log("Les Jours Sauvegardé");
    });
}

let updateReporterre = async function() {
    console.log("Update de Reporterre...");
    const endpoint = 'https://reporterre.net/spip.php?page=backend-simple';
    let json = await getJsonFromRSSFeed(endpoint, function(res) {
        let jsonArticles = [];
        let elem;

        if (res.rss == null)
            return
        res.rss.channel[0].item.forEach(article => {
            elem = HTMLParser.parse(article.description)
            img_url = (elem.querySelector('img') == null ? null : elem.querySelector('img').getAttribute('src'));
            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: img_url,
                title: article.title.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, ""),
                publicationDate: new Date(article['dc:date']).toISOString(),
                description: elem.querySelector('p').text,
                author: article['dc:creator'] == undefined ? "Inconnu" : article['dc:creator'].toString(),
                articleSource: {
                    name: 'Reporterre',
                    url: 'https://reporterre.net/',
                    // support_url: 'http://www.nouveaujourj.fr/',
                    imageUrl: 'https://reporterre.net/IMG/siteon0.png?1588262321',
                },
            });
        })
        console.log("RSS de Reporterre récupéré. Sauvegarde...")
        fs.unlinkSync('./news/Reporterre.json');
        fs.writeFileSync('./news/Reporterre.json', JSON.stringify(jsonArticles, null, '\t'));
        console.log("Reporterre Sauvegardé");
    });
}

let updateEcoBretons = async function() {
    console.log("Update de EcoBretons...");
    const endpoint = 'https://www.eco-bretons.info/feed';
    let json = await getJsonFromRSSFeed(endpoint, function(res) {
        let jsonArticles = [];
        let elem;

        if (res.rss == null)
            return
        res.rss.channel[0].item.forEach(article => {
            elem = HTMLParser.parse(article.description)
            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: (elem.querySelector('img') == null) ? 'https://www.eco-bretons.info/wp-content/uploads/2019/07/logo-non-transparent.png' : elem.querySelector('img').getAttribute('src'),
                title: article.title.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, ""),
                publicationDate: new Date(article['pubDate']).toISOString(),
                description: elem.querySelector('p').text,
                author: article['dc:creator'] == undefined ? "Inconnu" : article['dc:creator'].toString(),
                articleSource: {
                    name: 'Eco-Bretons',
                    url: 'https://www.eco-bretons.info/',
                    // support_url: 'http://www.nouveaujourj.fr/',
                    imageUrl: 'https://www.eco-bretons.info/wp-content/uploads/2019/07/logo-non-transparent.png',
                },
            });
        })
        console.log("RSS de EcoBretons récupéré. Sauvegarde...")
        fs.unlinkSync('./news/Eco-Bretons.json');
        fs.writeFileSync('./news/Eco-Bretons.json', JSON.stringify(jsonArticles, null, '\t'));
        console.log("EcoBretons Sauvegardé");
    });
}

let updateFakir = async function() {
    console.log("Update de Fakir...");
    const endpoint = 'https://www.fakirpresse.info/spip.php?page=backend';

    function getArticleImageUrl(elem) {
        let articleImgUrl = elem.querySelector('.article');
        if (articleImgUrl != null) {
            articleImgUrl = articleImgUrl.querySelectorAll('img');
            if (articleImgUrl != null) {
                articleImgUrl = articleImgUrl[0].getAttribute('src');
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


    let json = await getJsonFromRSSFeed(endpoint, async function(res) {
        let jsonArticles = [];
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

            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: articleImgUrl == null ? null : 'https://www.fakirpresse.info/' + articleImgUrl,
                title: article.title.toString(),
                publicationDate: new Date(article['dc:date']).toISOString(),
                description: article.description.toString().replace(/(<([^>]+)>)/gi, ""),
                author: author == null ? 'Inconnu' : author,
                articleSource: {
                    name: 'Fakir',
                    url: 'https://www.fakirpresse.info/',
                    imageUrl: 'https://www.fakirpresse.info/squelettes/css/img/logo.png',
                },
            });
        }
        console.log("RSS de Fakir récupéré. Sauvegarde...")
        fs.unlinkSync('./news/Fakir.json');
        fs.writeFileSync('./news/Fakir.json', JSON.stringify(jsonArticles, null, '\t'));
        console.log("Fakir Sauvegardé");
    });
}

// En abs du fichier car je ne sais pas comment est géré l'appel des fonctions qui sont définis après (genre en C)
let updateNews = async function() {
    const updateNewsfunctions = [
        // updateLRELP, // OK
        // updateNouveauJourJ, // Supprimé car le dernier article date du 24 octobre 2019
        // updateLesJours, // OK
        // updateReporterre, // OK
        // updateEcoBretons, // OK
        updateFakir, // OK
        // Une fois qu'un journal a une fonction permettant de récupérer tous
        // Les articles à partir de son flux rss, il faut rajouter la fonction ici.
    ];

    for (var i = 0; i < updateNewsfunctions.length; i++) {
        await updateNewsfunctions[i]();
    }
}

let get_article_image = async function (sourceName, article_url) {
    let image_link;
    let xpath = undefined;

    console.log(sourceName)
    // if (sourceName.toString() == "La Relève Et La Peste")
        xpath = "/html/body/div[2]/div/div/div/section[2]/div/div/div[1]/img";

    if (xpath === undefined){
        console.log("Nope")
        return ""
    }
    let driver = new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(new firefox.Options().headless())
        .usingServer('http://52.169.120.202:4444/wd/hub')
        .build();

    try {
        // console.log("link " + article_url)
        await driver.get(article_url);
        image_link = await driver.findElement(By.xpath(xpath)).getAttribute("src");
        console.log("in : " + image_link)
    } finally {
        await driver.quit();
    }

    return image_link;
}

module.exports = {
    getJsonFromRSSFeed : getJsonFromRSSFeed,
    updateNews : updateNews,
    updateLRELP: updateLRELP,
    updateReporterre: updateReporterre,
    updateEcoBretons: updateEcoBretons,
    get_article_image: get_article_image,
};
