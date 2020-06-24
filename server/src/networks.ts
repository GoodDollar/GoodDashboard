
const networks = {
  42: {
    network_id: 42,
    web3Transport: "HttpProvider",
    httpWeb3Provider: `https://kovan.infura.io/v3/${process.env.INFURA_API}`,
    websocketWeb3Provider: "wss://kovan.infura.io/ws"
  },
  4447: { // develop
    network_id: 4447,
    web3Transport: "HttpProvider",
    httpWeb3Provider: "http://localhost:9545/",
    websocketWeb3Provider: "ws://localhost:9545/ws"
  },
  122: { // fuse, staging, production
    network_id: 122,
    web3Transport: "WebSocket",
    httpWeb3Provider: "https://rpc.fuse.io/",
    websocketWeb3Provider: "wss://rpc.fuse.io/ws"
  },
  3: { // fuse-mainnet
    network_id: 3,
    web3Transport: "WebSocket",
    httpWeb3Provider: "https://rpc.fuse.io/",
    websocketWeb3Provider: "wss://rpc.fuse.io/ws"
  }
};

export default networks;
