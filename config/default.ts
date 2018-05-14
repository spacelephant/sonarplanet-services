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
  trackerUrl: 'wss://sonarplanet-eth-node-noprod.cleverapps.io',
  scannerUrl: 'https://kovan.etherscan.io/tx/',
};

const defaultNetworks: Networks = {
  ethereumKovan: defaultEthereumKovan,
};

const defaultConfig: Config = {
  server: defaultServer,
  support: defaultSupport,
  networks: defaultNetworks,
  database: defaultDB,
};

export default defaultConfig;
