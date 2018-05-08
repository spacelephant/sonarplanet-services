import { ObjectId } from "bson";
module.exports = function () {

  var Engine = require('tingodb')()
  const Config = require('../config/config')
  let configuration = new Config()

  let dbPath = require('os').homedir() + configuration.database.directory

  var fs = require('fs');

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }

  var db = new Engine.Db(dbPath, {});

  var accountCollection = db.collection('Account')
  accountCollection.createIndex({uniqueId: 1}, {unique: true})
  var publicAddressSubscriptionCollection = db.collection('PublicAddressSubscription')
  var webPushNotificationCollection = db.collection('WebPushNotification')

  return {
    db: db,
    accountCollection: accountCollection,
    publicAddressSubscriptionCollection,
    webPushNotificationCollection: webPushNotificationCollection
  }
}
