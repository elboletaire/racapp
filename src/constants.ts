import AuctionsABI from './raca-auction-abi.json'
import Bep20Abi from './raca-bep20-abi.json'
import NftAbi from './raca-nft-abi.json'

export const RacaAuctionsABI = AuctionsABI
export const RacaBep20Abi = Bep20Abi
export const RacaNftAbi = NftAbi

export const RacaAuctionsContract = '0x7b4452dd6c38597fa9364ac8905c27ea44425832'
export const RacaPotionsContract = '0x51353799f8550c9010a8b0cbfe6c02ca96e026e2'
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
