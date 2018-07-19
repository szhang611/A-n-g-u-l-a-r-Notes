require('dotenv').load();
var http = require('http');
var express = require('express');
var morgan = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);

var routes = require('./api/index');


app.use(methodOverride());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Cross Origin middleware
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  } else {
    next();
  }
});

app.use('/api', routes);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});

server.listen(8808);
console.log('Express server listening on port: ' + server.address().port);
