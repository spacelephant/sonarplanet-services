import * as trackr from 'trackr-lib'
import * as webpush from 'web-push'

// VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();
const options = {
  vapidDetails: {
    subject: 'mailto:support@sonarplanet.io',
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey
  }
}

const Config = require('./config/config')
let configuration = new Config()

function watch(networkid: string, address: string, subscription: any) {
  console.log('Watch local')
  const trackr_node_address = configuration.trackers[networkid].url
  const etherScanUrl = configuration.trackers[networkid].scannerUrl

  trackr.watch(trackr_node_address, address, (transactionId: string) => {
    console.log('watch callback')
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
          // Error codes : http://autopush.readthedocs.io/en/latest/http.html#error-code
          console.error("Erreur occured during webpush notification creation. " + error)
        }
      )
  },
  (err: Error) => console.error(err))
}

module.exports = {
  watchWebPush: watch
}
