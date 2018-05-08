module.exports = function () {
  switch (process.env.NODE_ENV || 'development') {
    case 'test':
      return {
        database: {
          directory: "storage/test/db_storage"
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
          directory: "storage/dev/db_storage"
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
          directory: "${BUCKET_FOLDER}/db_storage"
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
          directory: "${BUCKET_FOLDER}/db_storage"
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
