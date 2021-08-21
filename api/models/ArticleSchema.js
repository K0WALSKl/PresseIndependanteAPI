"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    url: String,
    imageUrl: String,
    title: String,
    publicationDate: Date,
    description: String,
    author: String,
    articleSource: {
        name: String,
        url: String,
        imageUrl: String
    }
});

ArticleSchema.methods.addArticle = function(url, imageUrl, title, publicationDate, description, author,
    articleSourceName, articleSourceUrl, articleSourceImageUrl) {
    process.stdout.write("Début Add Ticket");
    this.url = url;
    this.imageUrl = imageUrl;
    this.title = title;
    this.publicationDate = publicationDate;
    this.description = description;
    this.author = author;
    this.articleSource.name = articleSourceName;
    this.articleSource.url = articleSourceUrl;
    this.articleSource.imageUrl = articleSourceImageUrl;
    process.stdout.write("Fin Add Article");
};

module.exports = mongoose.model("Articles", ArticleSchema);
