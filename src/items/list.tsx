import { useWeb3React } from '@web3-react/core'
import { Card, Col, message, Row } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'

import ItemCard from './card'

import 'antd/dist/antd.css'
import { RacaAuctionsABI, RacaAuctionsContract, RacaBEP20ABI, RacaBEP20Contract } from '../constants'
import { ethers } from 'ethers'
import axios from 'axios'

const StyledCard : typeof Card = styled(Card)`
  margin-bottom: 20px;
  &.purchasable {
    background-color: green;

    .ant-card-meta-title {
      color: white;
    }
    .ant-card-meta-description {
      color: lightgreen;
    }
  }
`

const StyledRow : typeof Row = styled(Row)`
  margin-top: 20px;
  align-items: stretch;
`

const ItemsList = ({data, maxPrice}: {data: any, maxPrice: number}) => {
  const { account, library } = useWeb3React()
  const [ loading, setLoading ] = useState<boolean[]>([])

  return (
    <StyledRow gutter={20}>
      {
        data.map((item: any) => (
          <Col xl={{span: 3}} lg={{span: 6}} md={{span: 8}} xs={{span: 12}}>
            <StyledCard
              hoverable
              loading={loading[item.id]}
              cover={<img alt='icon' src={item.image_url} />}
              className={maxPrice >= Number(item.fixed_price)/Number(item.count) ? 'purchasable' : ''}
              onClick={async () => {
                setLoading({...loading, [item.id]: true})

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

                setLoading({...loading, [item.id]: false})
              }}
            >
              <ItemCard
                item={item}
              />
            </StyledCard>
          </Col>
        ))
      }
    </StyledRow>
  )
}

export default ItemsList
