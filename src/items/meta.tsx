import { Col, Row } from 'antd'
import Meta from 'antd/lib/card/Meta'
import styled from 'styled-components'
import { SmallTag } from '../components/CountTag'

const UnitsColumn : typeof Col = styled(Col)`
  text-align: right;
`

const ItemMeta = ({item} : {item: any}) => {
  return (
    <Meta
      title={<span>{item.name}<SmallTag color='blue'>x{item.count}</SmallTag></span>}
      description={(
        <Row>
          <Col span={24}>
            <Row>
              <Col span={12}>
                Unit price
              </Col>
              <UnitsColumn span={12}>
                {(Number(item.fixed_price) / Number(item.count)).toLocaleString('en-US')}
              </UnitsColumn>
            </Row>
            <Row>
              <Col span={12}>
                Total price
              </Col>
              <UnitsColumn span={12}>
                {Number(item.fixed_price).toLocaleString('en-US')}
              </UnitsColumn>
            </Row>
          </Col>
        </Row>
      )}
    />
  )
}

export default ItemMeta
