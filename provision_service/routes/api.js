var express = require('express');
var router = express.Router();

var mongoDBReader = require('../plugins/mongoDBReader');

// Applying middleware to all routes in the router
router.use(function(req, res, next) {
  next();
});


router.use('/users/:userId/keys', function(req, res) {
  var userId = req.params.userId;
   mongoDBReader.getUserKeys(userId, function(error, response) {
    if (error) {
      return res.status(500).json({code: 500, error: error.message})
    }
    return res.status(200).json({keys: response});
  });
});

router.use('/', function(req, res) {
  
    return res.status(200).json({message:"Welcome"});

});


module.exports = router;