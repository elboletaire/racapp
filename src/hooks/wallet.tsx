import { useWeb3React } from '@web3-react/core'
import { message } from 'antd'
import axios from 'axios'
import { ethers } from 'ethers'
import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

import { injected } from '../connectors'
import { RacaAuctionsABI, RacaAuctionsContract, RacaBEP20ABI, RacaBEP20Contract } from '../constants'

export const useEagerConnect = () => {
  const { activate, active } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, (err) => {
          console.error(err.message)
        }, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, [activate])

  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

interface Contracts {
  bep20?: ethers.Contract,
  auctions?: ethers.Contract,
  executeAuction?: (item: any) => void,
}

const ContractsContext = createContext<Contracts>({})

export const ContractsProvider = ({children} : {children: ReactNode}) => {
  const [ bep20, setBep20 ] = useState<ethers.Contract>()
  const [ auctions, setAuctions ] = useState<ethers.Contract>()
  const [ init, setInit ] = useState<boolean>(false)
  const { library, account } = useWeb3React()

  const executeAuction = async (item: any) => {
    try {
      const info = await axios.get(`https://market-api.radiocaca.com/nft-sales/${item.id}`)
      const decimals = await bep20?.decimals()
      const auction = ethers.BigNumber.from(info.data.data.id_in_contract)
      const price = ethers.BigNumber.from(Number(item.fixed_price))
      const weiprice = ethers.BigNumber.from(10).pow(decimals).mul(price)
      const allowance = await bep20?.allowance(account, RacaAuctionsContract)
      const balance = await bep20?.balanceOf(account)

      if (balance.lt(weiprice)) {
        throw new Error('You rekt buddy 😰')
      }

      if (weiprice.gt(allowance)) {
        const ap = await bep20?.approve(RacaAuctionsContract, weiprice)
        await ap.wait()
      }

      const tx = await auctions?.executeAuction(auction, weiprice, {
        gasPrice: ethers.utils.parseUnits('6', 'gwei')
      })

      await tx.wait()

      message.success('Purchased!')
    } catch (e) {
      // @ts-ignore
      if (typeof e.message === 'string') {
        // @ts-ignore
        let msg = e.message
        // @ts-ignore
        if (typeof e.data === 'object' && typeof e.data.message === 'string') {
          // @ts-ignore
          msg = e.data.message
        }
        message.error(msg, 3)
      }
      console.error('purchase failed:', e)
    }
  }

  useEffect(() => {
    if (bep20 || auctions || init || !library) {
      return
    }

    const signer = library.getSigner()

    const bep = new ethers.Contract(RacaBEP20Contract, RacaBEP20ABI, signer)
    const rac = new ethers.Contract(RacaAuctionsContract, RacaAuctionsABI, signer)
    setBep20(bep)
    setAuctions(rac)

    setInit(true)
  }, [
    bep20, init, auctions, library
  ])

  return (
    <ContractsContext.Provider value={{bep20, auctions, executeAuction}}>
      {children}
    </ContractsContext.Provider>
  )
}

export const useContracts = () => {
  const cntxt = useContext(ContractsContext)
  if (!cntxt) {
    throw new Error('useContracts() must be used in a component children of <ContractsProvider />')
  }

  return cntxt
}
