'use strict';
let express = require('express');
let routes = require('./api/routes');
let bodyParser = require('body-parser');
let app = express();
let morgan = require('morgan');
let path = require('path');
let ENVIRONMENT = process.env.ENV;

app.use((req, res, next) => {
  req.start = Date.now();
  next();
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './app')));
app.use(routes);

if (ENVIRONMENT !== 'dev') {
  app.use(morgan('dev'));
}
app.use('/scripts', express.static('node_modules/angular-simple-sidebar'));

// Swagger API docs.
app.use('/docs', express.static(path.join(__dirname, './api/docs')));

app.get('*', (req, res) => {
  res.sendFile('index.html', {
    root: ('./app')
  });
});

app.listen(3000, () => {
  console.log('Express server is listening on port 3000');
});

module.exports = app;