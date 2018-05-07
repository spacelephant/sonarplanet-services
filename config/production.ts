import DefaultConfig from "./default";

const productionConfig = DefaultConfig;

productionConfig.networks.ethereumKovan.trackerUrl =
  "wss://sonarplanet-eth-node.cleverapps.io";

export default productionConfig;
