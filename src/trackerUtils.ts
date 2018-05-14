import * as trackr from 'trackr-lib';
import * as webpush from 'web-push';
import * as CONFIG from 'config';

// VAPID keys should only be generated only once.
const VAP_ID_KEYS = webpush.generateVAPIDKeys();
const OPTIONS = {
  vapidDetails: {
    subject: 'mailto:' + CONFIG.get('support.mailto'),
    publicKey: VAP_ID_KEYS.publicKey,
    privateKey: VAP_ID_KEYS.privateKey,
  },
};

function watch(networkid: string, address: string, subscription: any) {
  console.log('Watch local');
  const TRACKR_NODE_ADDRESS = CONFIG.get('networks.ethereumKovan.trackerUrl');
  const ETHER_SCAN_URL = CONFIG.get('networks.ethereumKovan.scannerUrl');

  trackr.watch(
    TRACKR_NODE_ADDRESS,
    address,
    (transactionId: string) => {
      console.log('watch callback');
      let payload = {
        url: ETHER_SCAN_URL + transactionId,
      };
      webpush.sendNotification(subscription, JSON.stringify(payload), OPTIONS).then(
        (response: any) => {
          console.info('Notification Sent (address: ' + address + ',  end-point ' + subscription.endpoint + ')');
        },
        (error: any) => {
          // TODO : unsubscribe on 410 ?
          // Error codes : http://autopush.readthedocs.io/en/latest/http.html#error-code
          console.error('Erreur occured during webpush notification creation. ' + error);
        },
      );
    },
    (err: Error) => console.error(err),
  );
}

module.exports = {
  watchWebPush: watch,
};
