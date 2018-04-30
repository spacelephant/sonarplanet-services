## Sonar Planet Services
### Description
Sonar Planet Services is a Javascript backend to track transactions that directly impact an ethereum address. It uses [trackr-lib](https://github.com/sonarplanet/trackr-lib) to connect backend to ethereum node and [web-push](https://github.com/web-push-libs/web-push) lib for push notifications in browser.

Stack:
* [NodeJS](https://nodejs.org)
* [Express](https://github.com/expressjs/express)
* [Nodemon](https://github.com/remy/nodemon/)
* [Yarn](https://yarnpkg.com)

### Variables
```
trackr_node_address = Ethereum node url (web socket)
etherScanUrl = [etherscan.io](https://etherscan.io/) subdomain url
```


### Launch
Install dependances:
```
yarn
```

Launch backend:
```
yarn start
```

Or launch backend with automatic dev reload:
```
yarn dev
```

The API will be available at `http://localhost:8080/`

## Ethereum node (Ubuntu)
### Install go-ethereum
go-ethereum installation detailed [here](https://github.com/ethereum/go-ethereum)
```
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```

### Launch node
```
geth --config rinkeby.fast.toml console
```

Web socket default port: 8546


rinkeby.fast.toml file example:
```
# Note: this config doesn't contain the genesis block.

[Eth]
NetworkId = 4
SyncMode = "fast"
LightPeers = 100
DatabaseCache = 384
GasPrice = 18000000000
EnablePreimageRecording = false

[Eth.Ethash]
CacheDir = "ethash"
CachesInMem = 2
CachesOnDisk = 3
DatasetDir = "/home/fabien/.ethash"
DatasetsInMem = 1
DatasetsOnDisk = 2
PowMode = 0

[Eth.TxPool]
NoLocals = false
Journal = "transactions.rlp"
Rejournal = 3600000000000
PriceLimit = 1
PriceBump = 10
AccountSlots = 16
GlobalSlots = 4096
AccountQueue = 64
GlobalQueue = 1024
Lifetime = 10800000000000

[Eth.GPO]
Blocks = 20
Percentile = 60

[Shh]
MaxMessageSize = 1048576
MinimumAcceptedPOW = 2e-01

[Node]
DataDir = "."
IPCPath = "geth.ipc"
HTTPHost = "0.0.0.0"
HTTPPort = 8545
HTTPCors = ["“*”"]
HTTPVirtualHosts = ["localhost"]
HTTPModules = ["net", "web3", "eth", "shh"]
WSHost = "0.0.0.0"
WSPort = 8546
WSOrigins = ["*"]
WSModules = ["net", "web3", "eth", "shh"]

[Node.P2P]
MaxPeers = 25
NoDiscovery = false
BootstrapNodes = ["enode://a24ac7c5484ef4ed0c5eb2d36620ba4e4aa13b8c84684e1b4aab0cebea2ae45cb4d375b77eab56516d34bfbd3c1a833fc51296ff084b770b94fb9028c4d25ccf@52.169.42.101:30303", "enode://343149e4feefa15d882d9fe4ac7d88f885bd05ebb735e547f12e12080a9fa07c8014ca6fd7f373123488102fe5e34111f8509cf0b7de3f5b44339c9f25e87cb8@52.3.158.184:30303", "enode://b6b28890b006743680c52e64e0d16db57f28124885595fa03a562be1d2bf0f3a1da297d56b13da25fb992888fd556d4c1a27b1f39d531bde7de1921c90061cc6@159.89.28.211:30303"]
BootstrapNodesV5 = ["enode://a24ac7c5484ef4ed0c5eb2d36620ba4e4aa13b8c84684e1b4aab0cebea2ae45cb4d375b77eab56516d34bfbd3c1a833fc51296ff084b770b94fb9028c4d25ccf@52.169.42.101:30303", "enode://343149e4feefa15d882d9fe4ac7d88f885bd05ebb735e547f12e12080a9fa07c8014ca6fd7f373123488102fe5e34111f8509cf0b7de3f5b44339c9f25e87cb8@52.3.158.184:30303", "enode://b6b28890b006743680c52e64e0d16db57f28124885595fa03a562be1d2bf0f3a1da297d56b13da25fb992888fd556d4c1a27b1f39d531bde7de1921c90061cc6@159.89.28.211:30303"]
StaticNodes = []
TrustedNodes = []
ListenAddr = ":30303"
EnableMsgEvents = false

[Dashboard]
Host = "localhost"
Port = 8080
Refresh = 5000000000
```
