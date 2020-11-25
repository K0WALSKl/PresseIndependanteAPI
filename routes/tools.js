const xmlParser = require('xml2js').parseString;
const request = require('request');
const fs = require('fs');

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


let updateLRELP = async function() {
    console.log("Update de La Relève Et La Peste...");
    const endpoint = 'https://lareleveetlapeste.fr/feed';
    let json = await getJsonFromRSSFeed(endpoint, function(res) {
        let jsonArticles = [];

        res.rss.channel[0].item.forEach(article => {
            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: null,
                title: article.title.toString(),
                publicationDate: article.pubDate.toString(),
                description: article.description.toString(),
                author: "Inconnu"
            });
        })
        console.log("RSS de La Relève Et La Peste récupéré. Sauvegarde...")
        fs.unlinkSync('./news/LaReleveEtLaPeste.json');
        fs.writeFileSync('./news/LaReleveEtLaPeste.json', JSON.stringify(jsonArticles, null, '\t'));
        console.log("La Relève Et La Peste Sauvegardé");
    });
}

let updateNouveauJour = async function() {
    console.log("Update du NouveauJourJ...");
    const endpoint = 'http://www.nouveaujourj.fr/?format=feed';
    let json = await getJsonFromRSSFeed(endpoint, function(res) {
        let jsonArticles = [];

        res.rss.channel[0].item.forEach(article => {
            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: null,
                title: article.title.toString(),
                publicationDate: article.pubDate.toString(),
                description: article.description.toString(),
                author: article['author'] == undefined ? "Inconnu" : article['author'].toString()
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

        res.rss.channel[0].item.forEach(article => {
            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: null,
                title: article.title.toString(),
                publicationDate: article.pubDate.toString(),
                description: article.description.toString(),
                author: "Inconnu"
            });
        })
        console.log("RSS du Les Jours récupéré. Sauvegarde...")
        fs.unlinkSync('./news/LesJours.json');
        fs.writeFileSync('./news/LesJours.json', JSON.stringify(jsonArticles, null, '\t'));
        console.log("Les Jours Sauvegardé");
    });
}

// En abs du fichier car je ne sais pas comment est géré l'appel des fonctions qui sont définis après (genre en C)
let updateNews = async function() {
    const updateNewsfunctions = [
        updateLRELP,
        updateNouveauJour,
        updateLesJours
        // Une fois qu'un journal a une fonction permettant de récupérer tous
        // Les articles à partir de son flux rss, il faut rajouter la fonction ici.
    ];

    for (var i = 0; i < updateNewsfunctions.length; i++) {
        await updateNewsfunctions[i]();
    }
}

module.exports = {
    getJsonFromRSSFeed : getJsonFromRSSFeed,
    updateNews : updateNews,
    updateLRELP: updateLRELP,
};
