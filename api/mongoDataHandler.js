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
        process.stdout.write("mongoAddArticle : A parameter is missing : ");
        process.stdout.write(`url : ${url}`);
        process.stdout.write(`imageUrl : ${imageUrl}`);
        process.stdout.write(`title : ${title}`);
        process.stdout.write(`publicationDate : ${publicationDate}`);
        process.stdout.write(`description : ${description}`);
        process.stdout.write(`author : ${author}`);
        process.stdout.write(`articleSourceName : ${articleSourceName}`);
        process.stdout.write(`articleSourceUrl : ${articleSourceUrl}`);
        process.stdout.write(`articleSourceImageUrl : ${articleSourceImageUrl}`);
        return false;
    }

    if (!Articles) {
        process.stderr.write("It seems that the Articles model is not up ?");
    }

    Article.findOne({ url }, (err, article) => {
        if (err) {
            process.stderr.write(`${err}\n`);
        }
        if (article) {
            if (tools.debugLevel === 1) {
                process.stdout.write(`Article "${title}" has already been saved (${articleSourceName})\n`);
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
                    imageUrl: articleSourceUrl
                }
            });

            newArticle.save().then(() => {
                if (tools.debugLevel === 1) {
                    process.stdout.write("Article saved\n");
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

    Article.find({}).then(articles => {
        articles.forEach(article => {
            if (article) {
                articlesJson.push(article);
            } else {
                if (tools.debugLevel === 1) {
                    process.stderr.write("Couldn't get the article in the mongoGetArticle method\n");
                }
            }
        });

        // console.log("En tout : " + articles_json.length)
        callback(articlesJson);
    }).catch(err => {
        process.stderr.write(`${err}\n`);
        callback(false);
    });
    return null;
}

exports.mongoAddArticle = mongoAddArticle;
exports.mongoGetArticles = mongoGetArticles;
