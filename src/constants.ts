import AuctionsABI from './raca-auction-abi.json'
import Bep20Abi from './raca-bep20-abi.json'
import NftAbi from './raca-nft-abi.json'

export const RacaAuctionsABI = AuctionsABI
export const RacaBep20Abi = Bep20Abi
export const RacaNftAbi = NftAbi

export const RacaAuctionsContract = '0xe97fdca0a3fc76b3046ae496c1502c9d8dfef6fc'
export const RacaBep20Contract = '0x12BB890508c125661E03b09EC06E404bc9289040'

export const getErrorMessage = (e: any) => {
  if (typeof e.data === 'object' && typeof e.data.message === 'string') {
    return e.data.message
  }

  if (typeof e.message === 'string') {
    return e.message
  }
}

export const ItemsListColSizes = {
  xs: {span: 12},
  md: {span: 8},
  lg: {span: 6},
  xl: {span: 3},
}

export const WalletItemsListColSizes = {
  xs: {span: 24},
  sm: {span: 12},
  md: {span: 8},
  lg: {span: 6},
  xl: {span: 4},
}
