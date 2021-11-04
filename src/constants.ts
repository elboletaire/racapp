import { message } from 'antd'
import axios from 'axios'
import { ethers } from 'ethers'
import AuctionsABI from './raca-auction-abi.json'
import RBEP20ABI from './raca-bep20-abi.json'

export const RacaAuctionsABI = AuctionsABI
export const RacaBEP20ABI = RBEP20ABI

export const RacaAuctionsContract = '0x7b4452dd6c38597fa9364ac8905c27ea44425832'
export const RacaBEP20Contract = '0x12BB890508c125661E03b09EC06E404bc9289040'

export const purchase = async (library: any, account: any, item: any) => {
  try {
    const info = await axios.get(`https://market-api.radiocaca.com/nft-sales/${item.id}`)
    const signer = library.getSigner()
    const raca = new ethers.Contract(RacaBEP20Contract, RacaBEP20ABI, signer)
    const decimals = await raca.decimals()
    const contract = new ethers.Contract(RacaAuctionsContract, RacaAuctionsABI, signer)
    const auction = ethers.BigNumber.from(info.data.data.id_in_contract)
    const price = ethers.BigNumber.from(Number(item.fixed_price))
    const weiprice = ethers.BigNumber.from(10).pow(decimals).mul(price)
    const allowance = await raca.allowance(account, RacaAuctionsContract)
    const balance = await raca.balanceOf(account)

    if (balance.lt(weiprice)) {
      message.error('You do not have enough balance')
      throw new Error('not enough balance')
    }

    if (weiprice.gt(allowance)) {
      await raca.approve(RacaAuctionsContract, weiprice)
    }

    const tx = await contract.executeAuction(auction, weiprice)

    await tx.wait()

    message.success('Purchased!')
  } catch (e) {
    console.error('purchase failed:', e)
  }
}
