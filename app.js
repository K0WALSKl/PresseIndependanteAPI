var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cron = require('node-cron');

var indexRouter = require('./routes/index');
const getNews = require('./routes/getNews');
const mongoConnect = require('./api/mongoConnectionHandler');
const tools = require('./routes/tools');

var app = express();

// mongoConnect.mongoConnect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/getNews', getNews);

cron.schedule('*/15 * * * *', () => { // 15 minutes
   tools.updateNews().then(r => console.log(r));
});

module.exports = app;
