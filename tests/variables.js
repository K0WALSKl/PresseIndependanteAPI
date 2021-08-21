"use strict";

const host = "http://127.0.0.1:3000";

const articleSourcesName = [
    "Eco-Bretons",
    "Fakir",
    "La Releve Et La Peste",
    "Politis",
    "Reporterre"
];

const getArticlesSortedByDate = {
    url: `${host}/getNews/sortedByDate`,
    method: "GET",
    json: true,
    headers: {
        "content-type": "application/json"
    }
};

module.exports = {
    articleSourcesName,
    getArticlesSortedByDate
};
