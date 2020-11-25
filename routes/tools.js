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
    const endpoint = 'https://lareleveetlapeste.fr/feed';
    let json = await getJsonFromRSSFeed(endpoint, function(res) {
        let jsonArticles = [];

        console.log(res.rss.channel[0].item);
        res.rss.channel[0].item.forEach(article => {
            console.log(article)
            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: null,
                title: article.title.toString(),
                publicationDate: article.pubDate.toString(),
                description: article.description.toString(),
                author: article['dc:creator'] == undefined ? "Inconnu" : article['dc:creator'].toString()
            });
        })
        fs.unlinkSync('./news/LaReleveEtLaPeste.json');
        fs.writeFileSync('./news/LaReleveEtLaPeste.json', JSON.stringify(jsonArticles, null, '\t'));
    });
}

let updateNouveauJour = async function() {
        const endpoint = 'http://www.nouveaujourj.fr/?format=feed';
    let json = await getJsonFromRSSFeed(endpoint, function(res) {
        let jsonArticles = [];

        console.log(res.rss.channel[0].item);
        res.rss.channel[0].item.forEach(article => {
            console.log(article)
            jsonArticles.push({
                url: article.link.toString(),
                imageUrl: null,
                title: article.title.toString(),
                publicationDate: article.pubDate.toString(),
                description: article.description.toString(),
                author: article['author'] == undefined ? "Inconnu" : article['author'].toString()
            });
        })
        fs.unlinkSync('./news/NouveauJour.json');
        fs.writeFileSync('./news/NouveauJour.json', JSON.stringify(jsonArticles, null, '\t'));
    });
}



// En abs du fichier car je ne sais pas comment est géré l'appel des fonctions qui sont définis après (genre en C)
let updateNews = async function() {
    const updateNewsfunctions = [
        updateLRELP,
        updateNouveauJour,
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
