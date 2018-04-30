import * as express from 'express'
import {
  json
} from 'body-parser'
import * as webpush from 'web-push'
import * as trackr from 'trackr-lib'

const app = express()

// Adding type allow us to use $.post (crossDomain friendly) not $.ajax
app.use(json({ type: '*/*' }))

// VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();
const trackr_node_address = 'wss://sonarplanet-eth-node-noprod.cleverapps.io'
const etherScanUrl = 'https://rinkeby.etherscan.io/tx/'

const options = {
  vapidDetails: {
    subject: 'mailto:fabien.treguer@spacelephant.org',
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey
  }
}

function watch(address: string, subscription: PushSubscription) {
  console.log('Watch local')
  trackr.watch(trackr_node_address, address, (transactionId: string) => {
    console.log('watch callback')
    console.info('Send notif for address: ' + transactionId)
    let payload = {
      url: etherScanUrl + transactionId
    }
    webpush.sendNotification(
      subscription,
      JSON.stringify(payload),
      options).then(
        (response: any) => {
          console.info("Notification Sent (address: " + address + ",  end-point " + subscription.endpoint + ")")
        },
        (error: any) => {
          // TODO : unsubscribe on 410 ?
          // Error codes : http://autopush.readthedocs.io/en/latest/http.html#error-codes
          let bodyError = JSON.parse(error.body)
          console.error("Erreur " + error.statusCode + ". " + bodyError.message)
        }
      )
    },
    (err: string) => console.error(err) )
}

app.post('/register-to-notification', (req, res) => {
  console.log('Registration')
  let subscription: PushSubscription = req.body.subscription
  let address = req.body.address
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    watch(address, subscription)
    res.status(201).send({})
  } catch (error) {
    res.status(500).send({})
  }
})

app.listen(8080)
