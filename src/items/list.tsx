import { Col } from 'antd'
import React from 'react'

import { StretchRow } from '../components/StyledRow'
import { ItemsListColSizes } from '../constants'
import { useContracts } from '../hooks/wallet'
import ItemCard from './card'


const ItemsList = ({data}: {data: any[]}) => {
  const { executeAuction } = useContracts()

  return (
    <StretchRow gutter={20}>
      {
        data.map((item: any) => (
          <Col {...ItemsListColSizes} key={item.id}>
            <ItemCard
              item={item}
              onClick={executeAuction.bind(item)}
            />
          </Col>
        ))
      }
    </StretchRow>
  )
}

export default ItemsList
