import { ObjectId } from "bson";
import {
  json
} from 'body-parser'

const Config = require('../config/config')
let configuration = new Config()

const TrackerUtils = require('../trackerUtils')

var mongoose = require('mongoose');
mongoose.connect(configuration.database.connection_endpoint);

// Models
let Account = require('../models/Account')
let Network = require('../models/Network')
let PublicAddressSubscription = require('../models/PublicAddressSubscription')
let WebPushNotification = require('../models/WebPushNotification')


// Routers
let accountRouter = require('express').Router()
let networkRouter = require('express').Router({ mergeParams: true })
let publicAddressSubscriptionRouter = require('express').Router({ mergeParams: true })
let webpushNotificationRouter = require('express').Router({ mergeParams: true })
let enabledNotificationMediaRouter = require('express').Router({ mergeParams: true })

let router = require('express').Router()

router.use((req: any, res: any, next: any) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

router.use(json({ type: '*/*' }))

router.use('/networks', networkRouter)
router.use('/accounts', accountRouter)
accountRouter.use('/:accountId/networks', networkRouter)
networkRouter.use('/:networkId/public-address-subscriptions', publicAddressSubscriptionRouter)
accountRouter.use('/:accountId/webpush-notifications', webpushNotificationRouter)
accountRouter.use('/:accountId/enabled-notification-medias', enabledNotificationMediaRouter)


// Get Account
// /accounts/:accountId
accountRouter.get('/:accountId', (req: any, res: any) => {
  Account.findOne({ uniqueId: req.params.accountId }, (err: Error, account: any) => {
    if (err) {
      console.error("Error fetching account. " + err)
      res.status(500).send(err)
    } else {
      if (account) {
        console.info("Account (uniqueId: " + account.uniqueId + ")")
        res.json(account)
      } else {
        console.error("Account not found (uniqueId: " + account.uniqueId + ")")
        res.status(404).send()
      }
    }
  })
})

// Create account
// /accounts
accountRouter.post('/', (req: any, res: any) => {
  let uniqueAccountId = req.body.ubid
  if (uniqueAccountId) {
    let account = new Account()
    account.uniqueId = uniqueAccountId
    account.save((err: Error, acc: any) => {
      if (err) {
        res.status(500).send({ message: "Error occured during save step" })
      } else {
        console.info("Account created (uniqueId: " + uniqueAccountId + ")")
        res.status(201).json(acc);
      }
    })
  } else {
    console.error("Bad request error with parameters : " + req.params)
    res.status(403).send({})
  }
})

// Create public-address-subscriptions
// /accounts/:accountId/networks/:networkId/public-address-subscriptions
publicAddressSubscriptionRouter.post('/', (req: any, res: any) => {
  // We just use webpush notifications, no parameters needed yet
  let publicAddress = req.body.publicAddress
  if (publicAddress) {
    let accountId = req.params.accountId
    let networkId = req.params.networkId
    Account.findOne({ uniqueId: accountId })
      .populate('webPushNotification')
      .exec((err: Error, account: any) => {
        if (err) {
          res.status(500)
          console.error("Error fetching account. " + err)
        } else {
          var publication = new PublicAddressSubscription()
          publication.publicAddress = publicAddress
          publication.network = account.network
          publication.save((err: Error, pub: any) => {
            account.publicAddressSubscriptions.push(pub)
            account.save((err: Error, account: any) => {
              if (err) {
                res.status(500)
                console.error("Error adding public address subscription on account")
              } else {
                if (account.webPushNotification) {
                  TrackerUtils.watchWebPush(networkId, publicAddress, getWebPushSubstriptionObject(account.webPushNotification))
                  res.status(201).send()
                } else {
                  res.status(500).send({message: 'No web push parameters found for this account'})
                }
              }
            })
          })

        }
      })
  }
})

// Create WebPushNotification
// /accounts/:accountId/webpush-notifications
webpushNotificationRouter.post('/', (req: any, res: any) => {
  let accountId = req.params.accountId
  Account.findOne({ uniqueId: accountId }, (err: Error, account: any) => {
    if (err) {
      console.error("Error occured fetching account " + accountId)
      res.status(500).send(err)
    }
    if (account) {
      let webPushNotif = new WebPushNotification()
      webPushNotif.endpoint = req.body.subscription.endpoint
      webPushNotif.p256dh = req.body.subscription.keys.p256dh
      webPushNotif.auth = req.body.subscription.keys.auth
      webPushNotif.save((err: Error, wpn: any) => {
        if (err) {
          console.error("Error saving webpush notification. " + err)
          res.status(500)
        }
        res.status(201).json(webPushNotif)
        account.webPushNotification = wpn
        account.save((err: Error) => {
          if (err) {
            console.error("Error setting webpush notification on account " + accountId)
            res.status(500)
          }
          console.info("WebPushNotifictaion set on account " + accountId)
        })
      })
    } else {
      res.status(403).send({ message: 'Bad parameters' })
    }
  })
})

// Get all networks
//networkRouter.get('/', (req: any, res: any) => {})

// Get all enabled medias for an account
//enabledNotificationMediaRouter.get('/', (req: any, res: any) => {})

let getWebPushSubstriptionObject = (webPushNotificationParameters: any) => {
  return {
    endpoint: webPushNotificationParameters.endpoint,
    keys: {
      p256dh: webPushNotificationParameters.p256dh,
      auth: webPushNotificationParameters.auth
    }
  }
}

module.exports = router
