export interface Network {
  networkId: string;
  label: string;
  trackerUrl: string;
  scannerUrl: string;
}

export interface Networks {
  networks: Array<Array<string>>;
  fullNetworks: Array<Array<string>>;
}

export interface Server {
  port: number;
}

export interface Support {
  mailto: string;
}

export interface Database {
  directory: String;
}

export interface Config {
  server?: Server;
  support?: Support;
  networks?: Networks;
  database?: Database;
}
