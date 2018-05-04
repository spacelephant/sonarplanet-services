var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var WebPushNotificationSchema   = new Schema({
  endpoint: String,
  p256dh: String,
  auth: String
});

module.exports = mongoose.model('WebPushNotification', WebPushNotificationSchema);
