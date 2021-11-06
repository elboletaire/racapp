import { Card, message } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { useState } from 'react'
import { Else, If, Then } from 'react-if'
import styled from 'styled-components'
import { SmallTag } from '../components/CountTag'
import { getErrorMessage } from '../constants'

import { useFilters } from '../hooks/filters'
import ItemMeta from './meta'

const StyledCard : typeof Card = styled(Card)`
margin-bottom: 20px;
&.purchasable {
  background-color: green;
  border-color: darkgreen;

  .ant-card-meta-title {
    color: white;
  }
  .ant-card-meta-description {
    color: lightgreen;
  }
}
`

const Wrapper = styled.div<{src: string}>`
  height: 75px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  @media (min-width: 768px) {
    height: 130px;
  }
  @media (min-width: 992px) {
    height: 150px;
  }
  img {
    display: none;
  }
`


const SameSizeImage = ({src, alt}: {src: string, alt: string}) => {
  return (
    <Wrapper src={src}>
      <img alt={alt} src={src} />
    </Wrapper>
  )
}

type ItemCardProps = {
  item: any
  onClick: (item: any) => void
}

const ItemCard = ({item, onClick} : ItemCardProps) => {
  const { highlightBelowPrice } = useFilters()
  const [ loading, setLoading ] = useState<boolean>(false)

  return (
    <StyledCard
      hoverable
      loading={loading}
      cover={<SameSizeImage alt='icon' src={item.image_url} />}
      className={highlightBelowPrice >= Number(item.fixed_price)/Number(item.count) ? 'purchasable' : ''}
      onClick={async () => {
        setLoading(true)
        try {
          await onClick(item)
        } catch (e) {
          const msg = getErrorMessage(e)
          if (msg) {
            message.error(msg)
          }
        }
        setLoading(false)
      }}
    >
      <ItemMeta
        item={item}
      />
    </StyledCard>
  )
}

export const ItemWalletCard = ({item, onClick} : ItemCardProps) => {
  const [ loading, setLoading ] = useState<boolean>(false)

  return (
    <StyledCard
      hoverable
      loading={loading}
      cover={<SameSizeImage alt='icon' src={item.image_url} />}
      onClick={async () => {
        setLoading(true)
        await onClick(item)
        setLoading(false)
      }}
    >
      <Meta
        title={(
          <span>
            {item.name}
            <If condition={Boolean(item.token_id)}>
              <Then>
                <SmallTag color='orange'>#{item.token_id}</SmallTag>
              </Then>
              <Else>
                <SmallTag color='blue'>x{item.count}</SmallTag>
              </Else>
            </If>
          </span>
        )}
        description={''}
      />
    </StyledCard>
  )
}

export default ItemCard
