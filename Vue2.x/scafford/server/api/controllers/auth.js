var jwtGenerator = require('jsonwebtoken');

module.exports = function (router, auth) {

  // helper: same as client side
  var roles = {
    admin: 'Admin',
    modifier: 'Modifier',
    viewer: 'Viewer'
  };

  // mock data
  var userRoles = {
    'Anna': {
      'roles': [roles.admin]
    },
    'Bill': {
      'roles': [roles.modifier]
    },
    'Craig': {
      'roles': [roles.viewer]
    },
    'Daisy': {
      'roles': [roles.admin, roles.viewer]
    }
  };

  // configuration of component permissions
  router.get('/componentPermissions', auth, function (req, res) {
    var componentPermissions = {
      'one': [roles.admin],
      'two': [roles.modifier],
      'three': [roles.viewer]
    };

    res.status(200).json({
      data: componentPermissions
    });
  });


  // login method
  router.post('/login', function (req, res) {
    var username = req.body.username;
    if(Object.keys(userRoles).indexOf(username) > -1){
      var expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);

      var token = jwtGenerator.sign({
        username: username,
        userRoles: userRoles[username]['roles'] || [roles.viewer]
      }, process.env.JWT_SECRET);

      res.status(200).json({
        token: token
      });
    } else {
      res.status(401).json({
        code: 1,
        msg: 'login failed'
      });
    }
  });

  // configuration of element permissions
  router.get('/elementPermissions', auth, function (req, res) {
    var elementPermissions = {
      delete: [roles.admin, roles.modifier],
      review: [roles.viewer],
      edit: [roles.modifier],
      audit: [roles.admin]
    };

    res.status(200).json({
      data: elementPermissions
    });
  });


  router.get('/valid-service', auth, function (req, res) {
    res.status(200).json({
      data: 'This is a protected service based on login token'
    });
  });
};
