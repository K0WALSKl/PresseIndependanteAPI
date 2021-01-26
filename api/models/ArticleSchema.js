const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    url: String,
    imageUrl: String,
    title: String,
    publicationDate: Date,
    description: String,
    author: String,
    articleSource: {
        name: String,
        url: String,
        imageUrl: String,
    },
});

ArticleSchema.methods.addTicket = function(user_id, date_takeoff, massage, no_gravity_meal, no_gravity_pool) {
    console.log("Début Add Ticket");
    this.id_user = user_id;
    this.date_takeoff = date_takeoff;
    this.date_creation = new Date();
    this.massage = massage;
    this.no_gravity_meal = no_gravity_meal;
    this.no_gravity_pool = no_gravity_pool;
    console.log("Fin Add Ticket");
}

var Article = module.exports = mongoose.model('Articles', ArticleSchema);
