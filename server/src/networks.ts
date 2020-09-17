import { once } from 'lodash'

export default once(() => {
  const { ALCHEMY_API, INFURA_API, FUSE_RPC } = process.env

  return {
    1: {
      // production-mainnet
      network_id: 1,
      web3Transport: 'HttpProvider',
      httpWeb3Provider: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API}`,
      websocketWeb3Provider: 'wss://mainnet.infura.io/ws',
    },
    3: {
      // fuse-mainnet
      network_id: 3,
      web3Transport: 'HttpProvider',
      httpWeb3Provider: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API}`,
      websocketWeb3Provider: 'wss://ropsten.infura.io/ws',
    },
    42: {
      network_id: 42,
      web3Transport: 'HttpProvider',
      httpWeb3Provider: `https://kovan.infura.io/v3/${INFURA_API}`,
      websocketWeb3Provider: 'wss://kovan.infura.io/ws',
    },
    4447: {
      // develop
      network_id: 4447,
      web3Transport: 'HttpProvider',
      httpWeb3Provider: 'http://localhost:9545/',
      websocketWeb3Provider: 'ws://localhost:9545/ws',
    },
    122: {
      // fuse, staging, production
      network_id: 122,
      web3Transport: 'HttpProvider',
      httpWeb3Provider: FUSE_RPC || 'https://fuse.gooddollar.org/',
      websocketWeb3Provider: 'wss://rpc.fuse.io/ws',
    },
  }
})
