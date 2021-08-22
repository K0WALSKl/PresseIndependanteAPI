"use strict";

const express = require("express");
const path = require("path");
const logger = require("morgan");
const cron = require("node-cron");

const indexRouter = require("./routes/index");

const mongoHandler = require("./api/mongoConnectionHandler");
const getNews = require("./routes/getNews");
const tools = require("./routes/tools");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// eslint-disable-next-line no-underscore-dangle
app.engine("pug", require("pug").__express);
app.use("/", indexRouter);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

mongoHandler.mongoConnect();

app.use("/getNews", getNews);
if (tools.debugLevel === 0) {
    getNews.updateNews();
}

cron.schedule("*/15 * * * *", () => { // 15 minutes
    getNews.updateNews().then(r => process.stdout.write(r));
});

module.exports = app;
