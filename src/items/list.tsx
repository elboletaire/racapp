import { Card, Col, Row } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'

import { useContracts } from '../hooks/wallet'
import ItemCard from './card'

import 'antd/dist/antd.css'
// import { StarOutlined } from '@ant-design/icons'

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

// const Star : typeof StarOutlined = styled(StarOutlined)`
//   font-size: 20px;
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   color: orange;
// `

const ItemsList = ({data, maxPrice}: {data: any[], maxPrice: number}) => {
  const { executeAuction } = useContracts()
  const [ loading, setLoading ] = useState<boolean[]>([])
  const responsive = {
    xl: {span: 3},
    lg: {span: 6},
    md: {span: 8},
    xs: {span: 12},
  }

  return (
    <StyledRow gutter={20}>
      {
        data.map((item: any) => (
          <Col {...responsive} key={item.id}>
            <StyledCard
              hoverable
              loading={loading[item.id]}
              cover={<img alt='icon' src={item.image_url} />}
              className={maxPrice >= Number(item.fixed_price)/Number(item.count) ? 'purchasable' : ''}
              onClick={async () => {
                setLoading({...loading, [item.id]: true})

                await executeAuction?.(item)

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
