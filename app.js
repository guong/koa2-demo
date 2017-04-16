const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');

const index = require('./routes/index');
const users = require('./routes/users');


const http = require('http');
const server = http.createServer(app.callback());
server.listen('3000');

const sass = require('node-sass');
const fs = require('fs');
var result = sass.render({ file: __dirname + '/public/stylesheets/style.sass' }, function(err, result) {
    if (err) console.log(err);
    fs.writeFile(__dirname + '/public/stylesheets/style.css', result.css, function(err) {
        if (err) console.log(err);
        console.log("Stats: build css ok.");
    });
});
// error handler
onerror(app);

// middlewares
app.use(bodyparser);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
    extension: 'jade'
}));

// logger
app.use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

module.exports = app;