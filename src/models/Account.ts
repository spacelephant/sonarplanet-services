var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
  uniqueId: String,
  publicAddressSubscriptions: [{type: Schema.Types.ObjectId, ref: 'PublicAddressSubscription'}],
  webPushNotification: {type: Schema.Types.ObjectId, ref: 'WebPushNotification'},
  notificationMedias: [{type: Schema.Types.ObjectId, ref: 'NotificationMedia'}]
});

module.exports = mongoose.model('Account', AccountSchema);
