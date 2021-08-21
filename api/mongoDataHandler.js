const mongoose = require("mongoose");

const Articles = require("./models/ArticleSchema");
const Article = mongoose.model("Articles");

/**
 * Permet l'ajout d'un article
 * @returns {boolean}
 */
function mongoAddArticle(url, imageUrl, title, publicationDate, description, author, articleSourceName, articleSourceUrl, articleSourceImageUrl) {
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

    if (!Articles)
        process.stderr.write("It seems that the Articles model is not up ?");

    Article.findOne({ url }, (err, article) => {
        if (err) {
            console.log(err);
        }
        if (article) {
            console.log(`Article "${title}" has already been saved (${articleSourceName})`);
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
                console.log("Article saved");
                return true;
            });
        }
    });
}

mongoGetArticles = function(callback) {
    const articles_json = [];

    Article.find({}).then(articles => {
        articles.forEach(article => {

            // console.log('doing' + article.title)
            if (article) {
                articles_json.push(article);
            } else {
                console.log("Couldn't get the article in the mongoGetArticle method");
            }
        });

        // console.log("En tout : " + articles_json.length)
        callback(articles_json);
    }).catch(err => {
        console.log(err);
        callback(false);
    });
    return null;
};

exports.mongoAddArticle = mongoAddArticle;
exports.mongoGetArticles = mongoGetArticles;
