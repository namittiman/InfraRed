var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var ReservationSchema = new Schema({
  UserId: String,
  Reservation: Schema.Types.Mixed
});

mongoose.model('Reservation', ReservationSchema);