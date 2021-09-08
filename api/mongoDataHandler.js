"use strict";

const mongoose = require("mongoose");
const Articles = require("./models/ArticleSchema");
const tools = require("../routes/tools");
const Article = mongoose.model("Articles");

// eslint-disable-next-line jsdoc/require-jsdoc
function mongoAddArticle(url, imageUrl, title, publicationDate, description, author, articleSourceName
    , articleSourceUrl, articleSourceImageUrl) {
    if (!url || !imageUrl || !title || !publicationDate || !description || !author || !articleSourceName ||
        !articleSourceUrl || !articleSourceImageUrl) {
        // eslint-disable-next-line no-console
        console.log("mongoAddArticle : A parameter is missing : \n");
        // eslint-disable-next-line no-console
        console.log(`url : ${url}\n`);
        // eslint-disable-next-line no-console
        console.log(`imageUrl : ${imageUrl}\n`);
        // eslint-disable-next-line no-console
        console.log(`title : ${title}\n`);
        // eslint-disable-next-line no-console
        console.log(`publicationDate : ${publicationDate}\n`);
        // eslint-disable-next-line no-console
        console.log(`description : ${description}\n`);
        // eslint-disable-next-line no-console
        console.log(`author : ${author}\n`);
        // eslint-disable-next-line no-console
        console.log(`articleSourceName : ${articleSourceName}\n`);
        // eslint-disable-next-line no-console
        console.log(`articleSourceUrl : ${articleSourceUrl}\n`);
        // eslint-disable-next-line no-console
        console.log(`articleSourceImageUrl : ${articleSourceImageUrl}\n`);
        return false;
    }

    if (!Articles) {
        // eslint-disable-next-line no-console
        console.log("It seems that the Articles model is not up ?");
    }

    Article.findOne({ url }, (err, article) => {
        if (err) {
            // eslint-disable-next-line no-console
            console.log(`${err}\n`);
        }
        if (article) {
            if (tools.debugLevel === 2) {
                // eslint-disable-next-line no-console
                console.log(`Article "${title}" has already been saved (${articleSourceName})\n`);
            }
        } else {
            const newArticle = new Article({
                url,
                imageUrl,
                title,
                publicationDate,
                description,
                author,
                articleSource: {
                    name: articleSourceName,
                    url: articleSourceUrl,
                    imageUrl: articleSourceImageUrl
                }
            });

            newArticle.save().then(() => {
                if (tools.debugLevel === 2) {
                    // eslint-disable-next-line no-console
                    console.log("Article saved\n");
                }
                return true;
            });
        }
    });
    return true;
}

// eslint-disable-next-line jsdoc/require-jsdoc
function mongoGetArticles(callback) {
    const articlesJson = [];

    Article.find({}).select("-__v -_id").then(articles => {
        articles.forEach(article => {
            if (article) {
                articlesJson.push(article);
            } else {
                if (tools.debugLevel === 2) {
                    // eslint-disable-next-line no-console
                    console.log("Couldn't get the article in the mongoGetArticle method\n");
                }
            }
        });

        // console.log("En tout : " + articles_json.length)
        callback(articlesJson);
    }).catch(err => {
        // eslint-disable-next-line no-console
        console.log(`${err}\n`);
        callback(false);
    });
    return null;
}

exports.mongoAddArticle = mongoAddArticle;
exports.mongoGetArticles = mongoGetArticles;
