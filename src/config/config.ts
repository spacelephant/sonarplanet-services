module.exports = function () {
  switch (process.env.NODE_ENV || 'development') {
    case 'development':
      return {
        trackers: {
          ETHEREUM_KOVAN: {
            url: 'wss://sonarplanet-eth-node-noprod.cleverapps.io',
            scannerUrl: 'https://kovan.etherscan.io/tx/'
          }
        }
      }
    case 'production':
      return {
        trackers: {
          ETHEREUM_KOVAN: {
            url: '',
            scannerUrl: ''
          }
        }
      }
  }
}
