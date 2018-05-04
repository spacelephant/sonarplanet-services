var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PublicAddressSubscriptionSchema   = new Schema({
  publicAddress: String,
  network: { type: Schema.Types.ObjectId, ref:'Network' }
});

module.exports = mongoose.model('PublicAddressSubscription', PublicAddressSubscriptionSchema);
