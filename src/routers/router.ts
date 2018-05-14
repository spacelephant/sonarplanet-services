import {
  json
} from 'body-parser'

import * as express from 'express'

const TRACKER_UTILS = require('../trackerUtils')

const IN_MEMORY_DB = require('../database/InMemoryDataBase')
let database = new IN_MEMORY_DB()

// Routers
let accountRouter = express.Router()
let networkRouter = express.Router({ mergeParams: true })
let publicAddressSubscriptionRouter = express.Router({ mergeParams: true })
let webpushNotificationRouter = express.Router({ mergeParams: true })
let enabledNotificationMediaRouter = express.Router({ mergeParams: true })

let router = express.Router()

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
  database.accountCollection.findOne({ uniqueId: req.params.accountId }, (err: Error, account: any) => {
    if (err) {
      console.error("Error fetching account. " + err)
      res.status(500).send()
    } else {
      if (account) {
        console.info("Fetching Account (uniqueId: " + account.uniqueId + ")")
        res.status(200).json(account).send()
      } else {
        console.info("Account not found (uniqueId: " + req.params.accountId + ")")
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
    let accountObject = {
      uniqueId: uniqueAccountId
    }
    database.accountCollection.insert(accountObject, (err: Error, acc: any) => {
      if (err) {
        res.status(500).send({ message: err.message })
      } else {
        console.info("Account created (uniqueId: " + uniqueAccountId + ")")
        res.status(201).json(acc[0]);
      }
    })
  } else {
    console.error("Bad request error")
    res.status(400).send({})
  }
})

// Create public-address-subscriptions
// /accounts/:accountId/networks/:networkId/public-address-subscriptions
publicAddressSubscriptionRouter.post('/', (req: any, res: any) => {
  // We just use webpush notifications, no parameters needed yet
  let accountId = req.params.accountId
  let networkId = req.params.networkId

  database.accountCollection.findOne({ uniqueId: accountId }, (err: Error, account: any) => {
    if (err) {
      console.error("Error fetching account for public address subscription. " + err)
      res.status(500).send()
    } else {
      if (account) {
        let publicAddress = req.body.publicAddress
        if (publicAddress) {
          let publication = {
            publicAddress: publicAddress,
            network: networkId
          }
          database.publicAddressSubscriptionCollection.insert(publication, (errPUB: Error, pub: any) => {
            if (errPUB) {
              console.error("Error creating public address subscription. " + errPUB.message)
            } else {
              let updateOrSet = {}
              if (account.publicAddressSubscriptions) {
                updateOrSet = { $push: { publicAddressSubscriptions: pub[0]._id } }
              } else {
                updateOrSet = { $set: { publicAddressSubscriptions: [pub[0]._id] } }
              }
              database.accountCollection.update({ _id: account._id }, updateOrSet, (errUPT: Error, response: any) => {
                if (errUPT) {
                  console.error("Error adding public address subscription on account. " + errUPT.message)
                  res.status(500).send()
                } else {
                  if (account.webPushNotification) {
                    database.webPushNotificationCollection.findOne({ _id: account.webPushNotification }, (err: Error, wpn: any) => {
                      if (err) {
                        console.error("Error fetching webpush notification parameters for account " + account.uniqueId + ' ' + err.message)
                        res.status(500).send()
                      } else {
                        TRACKER_UTILS.watchWebPush(networkId, publicAddress, getWebPushSubscriptionObject(wpn))
                        res.status(201).json(pub[0]).send()
                      }
                    })
                  } else {
                    res.status(500).send({ message: 'No web push parameters found for this account' })
                  }
                }
              })
            }
          })
        } else {
          console.error('Error parsing public address subscription parameters.')
          res.status(400).send()
        }
      } else {
        res.status(404).send()
      }
    }
  })
})

// Create WebPushNotification
// /accounts/:accountId/webpush-notifications
webpushNotificationRouter.post('/', (req: any, res: any) => {
  let accountId = req.params.accountId
  database.accountCollection.findOne({ uniqueId: accountId }, (err: Error, account: any) => {
    if (err) {
      console.error("Error occured fetching account " + accountId + ' ' + err.message)
      res.status(500).send()
    }
    if (account) {
      let webPushNotif
      try {
        webPushNotif = {
          endpoint: req.body.subscription.endpoint,
          p256dh: req.body.subscription.keys.p256dh,
          auth: req.body.subscription.keys.auth
        }
      } catch (e) {
        console.error('Error parsing parameters. ' + e)
        res.status(400).send()
      }
      if (webPushNotif) {
        database.webPushNotificationCollection.insert(webPushNotif, (errWPN: Error, wpn: any) => {
          if (errWPN) {
            console.error("Error saving webpush notification. " + errWPN.message)
            res.status(500)
          } else {
            database.accountCollection.update({ _id: account._id }, { $set: { webPushNotification: wpn[0]._id } }, (errUPT: Error) => {
              if (errUPT) {
                console.error("Error setting webpush notification on account " + accountId + ' ' + errUPT.message)
                res.status(500).send()
              } else {
                console.info("WebPushNotifictaion set on account " + accountId)
                res.status(201).json(wpn[0]).send()
              }
            })
          }
        })
      }
    } else {
      res.status(404).send()
    }
  })
})

// Get all networks
// networkRouter.get('/', (req: any, res: any) => {})

// Get all enabled medias for an account
// enabledNotificationMediaRouter.get('/', (req: any, res: any) => {})

let getWebPushSubscriptionObject = (webPushNotificationParameters: any) => {
  return {
    endpoint: webPushNotificationParameters.endpoint,
    keys: {
      p256dh: webPushNotificationParameters.p256dh,
      auth: webPushNotificationParameters.auth
    }
  }
}

module.exports = router
