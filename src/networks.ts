export type Network = {
  key: string,
  title: string,
  main?: string,
  graph?: string,
  payments?: string,
}

export type Networks = {
  [key: number] : Network,
}

const networks : Networks = {
  56: {
    key: 'binance',
    title: 'BSC',
  },
  31337: {
    key: 'hardhat',
    title: 'Hardhat',
  },
}

export const networkIds = () =>
  Object.keys(networks).map((key) => Number(key))

export default networks
