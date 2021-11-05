import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import { Button, Card, Input, message } from 'antd'
import axios from 'axios'
import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { If, Then } from 'react-if'
import styled from 'styled-components'
import { getErrorMessage, RacaAuctionsContract } from '../constants'
import { useContracts } from '../hooks/wallet'
import ItemCard from '../items/card'

const Content = styled.div`
  margin: 20px 0;
`

const InputGroup : typeof Input.Group = styled(Input.Group)`
  max-width: 400px;
  display: flex !important;
`

const Utils = () => {
  const [ allowance, setAllowance ] = useState<BigNumber>(BigNumber.from(0))
  const [ mallowance, setMallowance ] = useState<string>('')
  const [ decimals, setDecimals ] = useState<number>(0)
  const [ balance, setBalance ] = useState<BigNumber>(BigNumber.from(0))
  const { account } = useWeb3React()
  const { bep20, executeAuction } = useContracts()
  const [ loadingAllowance, setLoadingAllowance ] = useState<boolean>(false)
  const [ importId, setImportId ] = useState<string>()
  const [ nft, setNft ] = useState<any>({})
  const [ loading, setLoading ] = useState<boolean>(false)

  const load = useCallback(() => {
    ;(async () => {
      const al = await bep20?.allowance(account, RacaAuctionsContract)
      const dec = await bep20?.decimals()
      const bal = await bep20?.balanceOf(account)

      setAllowance(al)
      setDecimals(dec)
      setMallowance((al as BigNumber).div(ethers.BigNumber.from(10).pow(dec)).toString())
      setBalance(bal)
    })()
  }, [account, bep20])

  useEffect(() => {
    ;(async () => {
      if (!bep20 || !account) {
        return
      }

      await load()
    })()
  }, [account, bep20, load])

  const decd = BigNumber.from(10).pow(decimals)

  const allow = async (amount: BigNumber) => {
    setLoadingAllowance(true)

    try {
      await bep20?.approve(RacaAuctionsContract, amount)
    } catch (e) {
      const msg = getErrorMessage(e)
      if (msg) {
        message.error(msg)
      }
      console.error(e)
    }

    setLoadingAllowance(false)
  }

  console.log('nft:', nft)

  return (
    <Content>
      <Card title='Wallet'>
        <p>
          Balance: {Number(balance.div(decd).toString()).toLocaleString('en-US')} RACA
        </p>
        <p>
          Allowance: {Number(allowance.div(decd).toString()).toLocaleString('en-US')} RACA
          <InputGroup compact>
            <Input
              value={mallowance}
              onChange={(e) => {
                setMallowance(e.target.value)
              }}
            />
            <Button
              type='primary'
              loading={loadingAllowance}
              onClick={() => {
                allow(ethers.BigNumber.from(mallowance).mul(decd))
              }}
            >
              Set
            </Button>
            <Button
              danger
              loading={loadingAllowance}
              onClick={() => {
                allow(ethers.constants.MaxUint256)
              }}
            >
              Unlimited
            </Button>
          </InputGroup>
        </p>
      </Card>
      <Card title='Manual purchase'>
        <Input value={importId} onChange={(e) => setImportId(e.target.value)} />
        <Button onClick={async () => {
          const nft = await axios.get(`https://market-api.radiocaca.com/nft-sales/${importId}`)

          setNft(nft.data.data)
        }}>Preview</Button>

        <If condition={Boolean(Object.keys(nft).length)}>
          <Then>
            <Card
              hoverable
              cover={<img alt='icon' src={nft.image_url} />}
              onClick={async () => {
                setLoading(true)

                await executeAuction?.(nft)

                setLoading(false)
              }}
            >
              <ItemCard
                item={nft}
              />
            </Card>
          </Then>
        </If>
      </Card>
    </Content>
  )
}

export default Utils
