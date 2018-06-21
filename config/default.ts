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

const allNetworks = {//{a:'a',b:'b', ...}
  defaultEthereumKovan:defaultEthereumKovan,
  defaultEthereumMainnet:defaultEthereumMainnet
}

const createNetworks = (networks:Array<Network>) => {
  let array = new Array<Array<string>>();
  networks.forEach(network => {
    array.push([network.networkId, network.label]);
  });
  return array;
};

const defaultNetworks: Networks = {
  networks: createNetworks([defaultEthereumKovan, defaultEthereumMainnet]),//['a','b', ...]
  allNetworks: allNetworks
};

const defaultConfig: Config = {
  server: defaultServer,
  support: defaultSupport,
  networks: defaultNetworks,
  database: defaultDB,
};

export default defaultConfig;
