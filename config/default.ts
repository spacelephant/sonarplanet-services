import { Config, Server, Support, Networks, Network, Database } from './types';

const defaultDB: Database = {
  directory: 'storage/test/db_storage',
};

const defaultServer: Server = {
  port: 8080,
};

const defaultSupport: Support = {
  mailto: 'support@sonarplanet.io',
};

const defaultEthereumKovan: Network = {
  networkId: 'defaultEthereumKovan',
  label: 'Ethereum Kovan',
  trackerUrl: 'ws://localhost:8081',
  scannerUrl: 'https://kovan.etherscan.io/tx/',
};

const defaultEthereumMainnet: Network = {
  networkId: 'defaultEthereumMainnet',
  label: 'Ethereum Mainnet',
  trackerUrl: 'wss://eth-node-mainnet.cleverapps.io',
  scannerUrl: 'https://etherscan.io/tx/',
};

const defaultNetworks: Networks = {
  networks: [
    defaultEthereumKovan,
    defaultEthereumMainnet
  ],
};

const defaultConfig: Config = {
  server: defaultServer,
  support: defaultSupport,
  networks: defaultNetworks,
  database: defaultDB,
};

export default defaultConfig;