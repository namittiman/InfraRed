module.exports = function(app){
    var keys = require('./controllers/keys');
    var reservations = require('./controllers/reservations');
    app.post('/users/:UserId/keys', keys.post_keys);
    app.post('/users/:UserId/reservations', reservations.post_reservations);
    app.get('/users/:UserId/reservations', reservations.get_reservations);

}