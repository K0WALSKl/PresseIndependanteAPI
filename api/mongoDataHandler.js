const mongoose = require('mongoose');
const articleSchema = require('./models/ArticleSchema');
const Article = mongoose.model('Articles')

mongoAddArticle = function (url, imageUrl, title, publicationDate, description, author, articleSourceName, articleSourceUrl, articleSourceImageUrl) {
    if (!url || !imageUrl || !title || !publicationDate || !description || !author || !articleSourceName
        || !articleSourceUrl || !articleSourceImageUrl) {
        console.log('mongoAddArticle : A parameter is missing : ');
        console.log('url : ' + url);
        console.log('imageUrl : ' + imageUrl);
        console.log('title : ' + title);
        console.log('publicationDate : ' + publicationDate);
        console.log('description : ' + description);
        console.log('author : ' + author);
        console.log('articleSourceName : ' + articleSourceName);
        console.log('articleSourceUrl : ' + articleSourceUrl);
        console.log('articleSourceImageUrl : ' + articleSourceImageUrl);
        return false;
    }

    Article.findOne({url: url}, function (err, article) {
        if (err) console.log(err);
        if (article) {
            console.log('Article "' + title + '" has already been saved (' + articleSourceName + ')');
        } else {
            const newArticle = new Article({
                url: url,
                imageUrl: imageUrl,
                title: title,
                publicationDate: publicationDate,
                description: description,
                author: author,
                articleSource: {
                    name: articleSourceName,
                    url: articleSourceUrl,
                    imageUrl: articleSourceUrl
                }
            })
            newArticle.save().then(() => {
                console.log('Article saved');
                return true
            })
        }
    });
}

mongoGetArticles = function(callback) {
    let articles_json = []

    Article.find({}).then((articles) => {
        articles.forEach(function (article) {
            console.log('doing' + article.title)
            if (article) {
                articles_json.push(article)
            } else {
                console.log("Couldn't get the article in the mongoGetArticle method");
            }
        });
        console.log("En tout : " + articles_json.length)
        callback(articles_json);
    }).catch((err) => {
        console.log(err)
        callback(false)
    });
    return null;
}

exports.mongoAddArticle = mongoAddArticle;
exports.mongoGetArticles = mongoGetArticles;