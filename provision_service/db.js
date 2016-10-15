/**
 * Created by mns on 10/14/16.
 */

/*
 Helper for Mongodb
 */

module.exports = {
    getMongo: function (mongoClient,dburl,callback) {
        mongoClient.connect(dburl, function (err, database) {
            if (err) {
                console.log(err)
            } else {
                callback(database)
            }
        });
    },

    getRedis : function (redisClient, callBack){

    }

}
