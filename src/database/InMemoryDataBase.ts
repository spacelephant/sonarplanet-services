import { ObjectId } from "bson";
import * as path from 'path'
import * as fs from 'fs'

const envSubst = require('env-subst')

let mkDirByPathSync = (targetDir: string) => {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = ''
  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    if (!fs.existsSync(curDir)) {
      fs.mkdirSync(curDir);
    }
    return curDir;
  }, initDir);
}

module.exports = function () {

  var Engine = require('tingodb')()
  const Config = require('../config/config')
  let configuration = new Config()

  let resolvedDatabasePath = envSubst(configuration.database.directory)

  console.log("Create database in directory: " + resolvedDatabasePath)
  mkDirByPathSync(resolvedDatabasePath)

  var db = new Engine.Db(resolvedDatabasePath, {});

  var accountCollection = db.collection('Account')
  accountCollection.createIndex({ uniqueId: 1 }, { unique: true })
  var publicAddressSubscriptionCollection = db.collection('PublicAddressSubscription')
  var webPushNotificationCollection = db.collection('WebPushNotification')

  return {
    db: db,
    accountCollection: accountCollection,
    publicAddressSubscriptionCollection,
    webPushNotificationCollection: webPushNotificationCollection
  }
}
