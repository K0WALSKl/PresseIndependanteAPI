"use strict";

const host = "http://localhost:3000";

const articleSourceNamePresence = {
    "Eco-Bretons": false,
    Fakir: false,
    "La Releve Et La Peste": false,
    Politis: false,
    Reporterre: false,
    Alter1fo: false
};

const getArticlesSortedByDate = {
    url: `${host}/getNews/sortedByDate`,
    method: "GET",
    json: true,
    headers: {
        "content-type": "application/json"
    }
};

module.exports = {
    getArticlesSortedByDate,
    articleSourceNamePresence
};
