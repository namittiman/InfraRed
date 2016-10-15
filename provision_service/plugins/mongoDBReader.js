// Load mock data
var data = require("../mock.json");

exports.getUserKeys = function(userId, callback) {

    var allKeys = data.keys;
    var userKeys =[]
    allKeys.map(function(keyObj) {
      if (keyObj.user_id ===userId ){
        userKeys.push({ service: keyObj.service, access_key_id: keyObj.access_key_id, secret_access_key: keyObj.secret_access_key, });
      }
    });
  
    return callback(null, userKeys);

};