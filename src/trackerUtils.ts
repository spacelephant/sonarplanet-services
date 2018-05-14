import * as trackr from 'trackr-lib'
import * as webpush from 'web-push'

// VAPID keys should only be generated only once.
const VAP_ID_KEYS = webpush.generateVAPIDKeys();
const OPTIONS = {
  vapidDetails: {
    subject: 'mailto:support@sonarplanet.io',
    publicKey: VAP_ID_KEYS.publicKey,
    privateKey: VAP_ID_KEYS.privateKey
  }
}

const CONFIG = require('./config/config')
let configuration = new CONFIG()

function watch(networkid: string, address: string, subscription: any) {
  console.log('Watch local')
  const TRACKR_NODE_ADDRESS = configuration.trackers[networkid].url
  const ETHER_SCAN_URL = configuration.trackers[networkid].scannerUrl

  trackr.watch(TRACKR_NODE_ADDRESS, address, (transactionId: string) => {
    console.log('watch callback')
    let payload = {
      url: ETHER_SCAN_URL + transactionId
    }
    webpush.sendNotification(
      subscription,
      JSON.stringify(payload),
      OPTIONS).then(
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
