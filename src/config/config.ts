module.exports = function () {
  switch (process.env.NODE_ENV || 'development') {
    case 'test':
      return {
        database: {
          directory: "/memoryDB_Test/"
        },
        trackers: {
          ETHEREUM_KOVAN: {
            url: 'wss://sonarplanet-eth-node-noprod.cleverapps.io',
            scannerUrl: 'https://kovan.etherscan.io/tx/'
          }
        }
      }
    case 'integration':
      return {
        database: {
          directory: "/memoryDB_INTEGRATION/"
        },
        trackers: {
          ETHEREUM_KOVAN: {
            url: 'wss://sonarplanet-eth-node-noprod.cleverapps.io',
            scannerUrl: 'https://kovan.etherscan.io/tx/'
          }
        }
      }
    case 'development':
      return {
        database: {
          directory: "/memoryDB_DEVELOPMENT/"
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
          directory: "/memoryDB_PROD/"
        },
        trackers: {
          ETHEREUM_KOVAN: {
            url: 'wss://sonarplanet-eth-node-noprod.cleverapps.io',
            scannerUrl: 'https://kovan.etherscan.io/tx/'
          }
        }
      }
  }
}
