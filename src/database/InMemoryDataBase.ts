import { ObjectId } from "bson";
import * as path from 'path'
import * as fs from 'fs'

const ENV_SUBST = require('env-subst')

let mkDirByPathSync = (targetDir: string) => {
  const SEP = path.sep;
  const INIT_DIR = path.isAbsolute(targetDir) ? SEP : '';
  const BASE_DIR = ''
  targetDir.split(SEP).reduce((parentDir, childDir) => {
    const CURRENT_DIR = path.resolve(BASE_DIR, parentDir, childDir);
    if (!fs.existsSync(CURRENT_DIR)) {
      fs.mkdirSync(CURRENT_DIR);
    }
    return CURRENT_DIR;
  }, INIT_DIR);
}

module.exports = function () {

  const ENGINE = require('tingodb')()
  const CONFIG = require('../config/config')
  let configuration = new CONFIG()

  let resolvedDatabasePath = ENV_SUBST(configuration.database.directory)

  console.log("Create database in directory: " + resolvedDatabasePath)
  mkDirByPathSync(resolvedDatabasePath)

  const DB = new ENGINE.Db(resolvedDatabasePath, {});

  const ACCOUNT_COLLECTION = DB.collection('Account')
  ACCOUNT_COLLECTION.createIndex({ uniqueId: 1 }, { unique: true })
  const PUBLIC_ADDRESS_SUBSCRIPTION_COLLECTION = DB.collection('PublicAddressSubscription')
  const WEB_PUSH_NOTIFICATION_COLLECTION = DB.collection('WebPushNotification')

  return {
    db: DB,
    accountCollection: ACCOUNT_COLLECTION,
    publicAddressSubscriptionCollection: PUBLIC_ADDRESS_SUBSCRIPTION_COLLECTION,
    webPushNotificationCollection: WEB_PUSH_NOTIFICATION_COLLECTION
  }
}
