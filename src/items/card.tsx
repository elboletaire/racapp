import { Col, Row, Tag } from 'antd'
import Meta from 'antd/lib/card/Meta'
import styled from 'styled-components'

const StyledTag : typeof Tag = styled(Tag)`
  font-size: .7em;
  line-height: 1.5em;
  padding: 0 5px;
  margin-left: 10px;
`

const UnitsColumn : typeof Col = styled(Col)`
  text-align: right;
`


const ItemCard = ({item} : {item: any}) => {
  return (
    <Meta
      title={<span>{item.name}<StyledTag color='blue'>x{item.count}</StyledTag></span>}
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
          <Col span={24}>

          </Col>
        </Row>
      )}
    />
  )
}

export default ItemCard
