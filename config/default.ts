import { Config, Server, Support, Networks, Network } from "./types";

const defaultServer: Server = {
  port: 8080
};

const defaultSupport: Support = {
  mailto: "fabien.treguer@spacelephant.org"
};

const defaultEthereumKovan: Network = {
  trackerUrl: "wss://sonarplanet-eth-node-noprod.cleverapps.io",
  scannerUrl: "https://kovan.etherscan.io/tx/"
};

const defaultNetworks: Networks = {
  ethereumKovan: defaultEthereumKovan
};

const defaultConfig: Config = {
  server: defaultServer,
  support: defaultSupport,
  networks: defaultNetworks
};

export default defaultConfig;
