const xmlParser = require('xml2js').parseString;
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


let InjectArticleSourceFromName = function(articleSourceName) {
    for (newspaper in globals.supportedWebsites.newspapers) {
        if (newspaper.name === articleSourceName)
            return newspaper
    }
    return undefined;
}

let updateLRELP = async function() {
    console.log("Update de La Relève Et La Peste...");
    const endpoint = 'https://lareleveetlapeste.fr/feed';
    let json = await getJsonFromRSSFeed(endpoint, function(res) {
        let jsonArticles = [];

        if (res.rss == null)
            return
        res.rss.channel[0].item.forEach(async article => {
            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: await get_article_image("La Relève Et La Peste", article.link),
                title: article.title.toString(),
                publicationDate: new Date(article.pubDate).toISOString(),
                description: article.description.toString(),
                author: "Inconnu",
                articleSource: {
                    name: 'LaReleveEtLaPeste',
                    url: 'https://lareleveetlapeste.fr/',
                    // support_url: 'https://fr.tipeee.com/la-releve-et-la-peste',
                    imageUrl: 'https://pbs.twimg.com/profile_images/785417519377031168/LIUJdFMe.jpg',
                },
            });
        })
        console.log("RSS de La Relève Et La Peste récupéré. Sauvegarde...")
        fs.unlinkSync('./news/LaReleveEtLaPeste.json');
        fs.writeFileSync('./news/LaReleveEtLaPeste.json', JSON.stringify(jsonArticles, null, '\t'));
        console.log("La Relève Et La Peste Sauvegardé");
    });
}

let updateNouveauJourJ = async function() {
    console.log("Update du NouveauJourJ...");
    const endpoint = 'http://www.nouveaujourj.fr/?format=feed';
    let json = await getJsonFromRSSFeed(endpoint, function(res) {
        let jsonArticles = [];

        if (res.rss == null)
            return
        res.rss.channel[0].item.forEach(article => {
            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: 'https://lenergeek.com/wp-content/uploads/2019/07/eolienne-haliade-general-electric.jpeg',
                title: article.title.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, ""),
                publicationDate: new Date(article.pubDate).toISOString(),
                description: article.description.toString().replace(/[^\x00-\x7F]/g, ""),
                author: article['author'] == undefined ? "Inconnu" : article['author'].toString(),
                articleSource: {
                    name: 'NouveauJourJ',
                    url: 'http://www.nouveaujourj.fr/',
                    // support_url: 'http://www.nouveaujourj.fr/',
                    imageUrl: 'https://static.fnac-static.com/multimedia/Images/FR/NR/dd/78/6e/7239901/1540-1/tsp20150910164533/La-Releve-et-la-Peste.jpg',
                },
            });
        })
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
                    name: 'LesJours',
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
            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: elem.querySelector('img').getAttribute('src'),
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



// En abs du fichier car je ne sais pas comment est géré l'appel des fonctions qui sont définis après (genre en C)
let updateNews = async function() {
    const updateNewsfunctions = [
        updateLRELP,
        updateNouveauJourJ,
        updateLesJours,
        updateReporterre,
        updateEcoBretons,
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
