module.exports = function () {
  switch (process.env.NODE_ENV || 'development') {
    case 'development':
      return {
        database: {
          connection_endpoint: 'mongodb://uqqpwaajccfrstq:ZDzAtjKYQh1xRiGnXHrH@bijuw4buehqzxzi-mongodb.services.clever-cloud.com:27017/bijuw4buehqzxzi'
        },
        trackers: {
          ETHEREUM_KOVAN: {
            url: 'wss://sonarplanet-eth-node-noprod.cleverapps.io',
            scannerUrl: 'https://kovan.etherscan.io/tx/'
          }
        }
      }
    case 'production':
      return {
        database: {
          connection_endpoint: ''
        },
        trackers: {
          ETHEREUM_KOVAN: {
            url: '',
            scannerUrl: ''
          }
        }
      }
  }
}
