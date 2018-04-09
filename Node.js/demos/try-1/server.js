// CRUD
// create, read, update, delete

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.listen(8000, () => {

    console.log('Server started!');
  });

  app.route('/api/cats/:name').get((req, res) => {

    // according to the param 'name'
    const requestedName = req.params.name;
    res.send({name: requestedName});

    // # general response #
    // res.send({
    //   cats: [{ name: 'lily' }, { name: 'lucy' }]
    // });

  });


  app.use(bodyParser.json());
    app.route('/api/cats').post((req, res) => {
    res.send(201, req.body);
  });

  app.route('/api/cats/:name').put((req, res) => {
    res.send(200, req.body);
  });

  app.route('/api/cats/:name').delete((req, res) => {
    res.sendStatus(204);
  });

