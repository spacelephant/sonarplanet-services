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

function watch(networkId: string, address: string, subscription: any) {
  let networkList:Array<Array<string>> = CONFIG.get('networks.fullNetworks');
  let network:Array<string> = networkList.filter(networks => networks[0] === networkId)[0];
  console.log('Watch local');
  trackr.watch(
    network[1],
    address,
    (transactionId: string) => {
      console.log('watch callback');
      let payload = {
        url: network[2] + transactionId,
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