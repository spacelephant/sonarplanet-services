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

const networkList = [
  defaultEthereumKovan,
  defaultEthereumMainnet
];

const getNetworkList = (networks:Array<Network>, trackr:boolean) => {
  let list = new Array<Array<string>>();
  networks.forEach(network => {
    if (trackr){
      list.push([network.networkId, network.trackerUrl, network.scannerUrl]);}
    else {
      list.push([network.networkId, network.label]);}
  });
  return list;
};

const defaultNetworks: Networks = {
  networks: getNetworkList(networkList, false),
  fullNetworks: getNetworkList(networkList, true)
};

const defaultConfig: Config = {
  server: defaultServer,
  support: defaultSupport,
  networks: defaultNetworks,
  database: defaultDB,
};

export default defaultConfig;