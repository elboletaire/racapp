import { ReloadOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Button, Col, InputNumber, message, Modal, Row, Slider } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import axios from 'axios'
import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { StretchRow } from '../components/StyledRow'
import { getErrorMessage, ItemsListColSizes, WalletItemsListColSizes } from '../constants'
import { useContracts } from '../hooks/wallet'
import ItemCard, { ItemWalletCard } from '../items/card'

const H2 = styled.h2`
  width: 100%;
  color: white;
  font-size: 1.5em;
  line-height: 2em;
`

const RefreshButton : typeof Button = styled(Button)`
  margin-left: 20px;
`

const MyStuff = () => {
  const [ walletLoaded, setWalletLoaded ] = useState<boolean>(false)
  const [ marketLoaded, setMarketLoaded ] = useState<boolean>(false)
  const [ marketLoading, setMarketLoading ] = useState<boolean>(false)
  const [ walletLoading, setWalletLoading ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState<boolean>(false)
  const { account } = useWeb3React()
  const { bep20, nfts, auctions } = useContracts()
  const [ walletItems, setWalletListed ] = useState<any[]>([])
  const [ , setWalletTotalResults ] = useState<number>(0)
  const [ marketItems, setMarketListed ] = useState<any[]>([])
  const [ , setMarketTotalResults ] = useState<number>(0)
  const [ selected, setSelected ] = useState<any>(null)
  const [ amount, setAmount ] = useState<number>(1)
  const [ price, setPrice ] = useState<number>(1)

  const loadWalletData = useCallback(() => {
    ;(async () => {
      if (!account || !nfts?.length) return

      setWalletLoading(true)

      const params = {
        pageNo: 1,
        pageSize: 20,
        address: account,
        status: 'not_on_sale',
      }

      try {
        const { data } = await axios.get('https://market-api.radiocaca.com/artworks', {
          params,
        })

        data.list.forEach(async (item: any, key: number) => {
          const found = nfts.find((nft) =>
            nft.contract.address.toLowerCase() === item.nft_address.toLowerCase()
          )

          if (!found) return

          const balance = await found.contract.balanceOf(account, 0)
          data.list[key].count = balance.toNumber()
        })

        setWalletListed(data.list)
        setWalletTotalResults(data.total)
      } catch (e) {
        console.error('error grabbing artworks data:', e)
      }

      setWalletLoading(false)
      setWalletLoaded(true)
    })()
  }, [account, nfts])

  const loadMarketData = useCallback(() => {
    ;(async () => {
      if (!account) return

      setMarketLoading(true)

      const params = {
        pageNo: 1,
        pageSize: 96,
        address: account,
        status: 'on_sale',
      }

      const { data } = await axios.get('https://market-api.radiocaca.com/artworks', {
        params,
      })

      setMarketListed(data.list)
      setMarketTotalResults(data.total)
      setMarketLoading(false)
      setMarketLoaded(true)
    })()
  }, [account])

  useEffect(() => {
    ;(async () => {
      if (walletLoaded) return
      await loadWalletData()
    })()
  }, [loadWalletData, walletLoaded])

  useEffect(() => {
    ;(async () => {
      if (marketLoaded) return
      await loadMarketData()
    })()
  }, [loadMarketData, marketLoaded])

  useEffect(() => {
    ;(async () => {
      const minterval = setInterval(loadMarketData, 10000)
      const winterval = setInterval(loadWalletData, 10000)

      return () => {
        clearInterval(minterval)
        clearInterval(winterval)
      }
    })()
  }, [loadMarketData, loadWalletData])

  return (
    <Content>
      <StretchRow gutter={20}>
        <Col span={24}>
          <H2>
            Stuff in your wallet
            <RefreshButton
              size='small'
              onClick={loadWalletData}
              loading={walletLoading}
              icon={<ReloadOutlined />}
            >Refresh</RefreshButton>
          </H2>
        </Col>
        {
          walletItems.map((item, key) => (
            <Col {...WalletItemsListColSizes} key={key}>
              <ItemWalletCard
                item={item}
                onClick={(item) => {
                  if (item.token_standard === 'BEP1155') {
                    setSelected(item)
                    return
                  }
                  message.warn('EIP721 cannot be sold from here yet')
                }}
              />
            </Col>
          ))
        }
      </StretchRow>
      <StretchRow gutter={20}>
        <Col span={24}>
          <H2>
            Stuff in market
            <RefreshButton
              size='small'
              onClick={loadMarketData}
              loading={marketLoading}
              icon={<ReloadOutlined />}
            >
              Refresh
            </RefreshButton>
          </H2>
        </Col>
        {
          marketItems.sort((a, b) => a.fixed_price - b.fixed_price).map((item, key) => (
            <Col {...ItemsListColSizes} key={key}>
              <ItemCard
                item={item}
                onClick={async (item) => {
                  if (!auctions) {
                    message.error('auctions contract not properly loaded')
                    return
                  }

                  const cancel = await auctions.cancelAuction(item.id_in_contract)
                  await cancel.wait()
                }}
              />
            </Col>
          ))
        }
      </StretchRow>
      <Modal
        title={`Sell ${selected?.name}`}
        okText='Put to auction'
        onCancel={() => {
          if (loading) return

          setSelected(null)
          setLoading(false)
        }}
        cancelButtonProps={{
          loading,
        }}
        okButtonProps={{
          loading,
        }}
        onOk={async () => {
          if (!auctions || !bep20 || !selected.nft_address) {
            console.error('missing required data')
            return
          }

          setLoading(true)

          try {
            const decimals = await bep20.decimals()
            const weiprice = ethers.BigNumber.from(10).pow(decimals).mul(price)

            const tx = await auctions.sell(selected.nft_address, 0, amount, bep20?.address, weiprice, 0, 0)
            await tx.wait()

            await loadWalletData()

            setSelected(null)
          } catch (e) {
            const msg = getErrorMessage(e)
            if (msg) {
              message.error(msg)
            }
          }
          setLoading(false)
        }}
        visible={selected !== null}
      >
        <Row>
          <Col span={24}>
            Fixed price (per unit)
          </Col>
          <Col span={24}>
            <InputNumber
              min={1}
              step='1'
              value={price}
              onChange={(value: number) => setPrice(value)}
              style={{
                maxWidth: '100%',
                width: '200px',
              }}
            />
          </Col>
          <Col span={24}>
            Amount
          </Col>
          <Col span={16}>
            <Slider
              min={1}
              max={Number(selected?.count)}
              value={amount}
              style={{maxWidth: '90%'}}
              onChange={(value: number) => setAmount(value)}
            />
          </Col>
          <Col span={8}>
            <InputNumber
              min={1}
              max={Number(selected?.count)}
              style={{ float: 'left' }}
              value={amount}
              onChange={(value: number) => setAmount(value)}
            />
            <Button onClick={() => setAmount(selected.count)}>Max</Button>
          </Col>
          <Col span={24}>
            <p style={{margin: '10px 0', fontWeight: 'bold'}}>
              Total price (x{amount} units): {price && amount ? (price * amount).toLocaleString('en-US') : 0}
            </p>
          </Col>
        </Row>
      </Modal>
    </Content>
  )
}

export default MyStuff
