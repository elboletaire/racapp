import { CaretDownOutlined, CaretUpOutlined, TableOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Col, Input, InputNumber, Pagination, Radio, Row } from "antd"
import { valueType } from 'antd/lib/statistic/utils'
import axios, { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import styled from 'styled-components'
import { useFilters } from '../hooks/filters'
import ItemsList from '../items/list'
import ItemsTable from '../items/table'

const Header : typeof Row = styled(Row)`
  margin: 20px 0;
`

const FlexEndWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const AnInput : typeof InputNumber = styled(InputNumber)`
  width: 100%;
`

const defaultPageSize = 96

const ItemsIndex = () => {
  const [ indexType, setIndexType ] = useState<string>('list')
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ loaded, setLoaded ] = useState<boolean>(false)
  const [ data, setData ] = useState<any[]>([])
  const [ page, setPage ] = useState<number>(1)
  const [ totalPages, setTotalPages ] = useState<number>(1)
  const [ sortBy, setSortBy ] = useState<string>('created_at')
  const [ order, setOrder ] = useState<string>('desc')
  const { search, setSearch, highlightBelowPrice, setHighlightBelowPrice } = useFilters()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      const params : any = {
        order,
        sortBy,
        pageNo: page,
        pageSize: defaultPageSize,
      }

      if (search) {
        params.name = search
      }

      let ret : AxiosResponse
      try {
        ret = await axios.get('https://market-api.radiocaca.com/nft-sales', {
          params,
        })

        if (!ret.data.list.length) {
          throw new Error('no data received')
        }

        setTotalPages(ret.data.total)
        setData(ret.data.list)
      } catch (e) {
        console.error('cannot fetch data:', e)
      }

      setLoading(false)
      setLoaded(true)
    }

    if (!loaded) {
      loadData()
    }
    const interval = setInterval(loadData, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [loading, loaded, search, page, order, sortBy])

  return (
    <>
      <Header>
        <Col xs={24} md={8}>
          <Input
            placeholder='Filter by name'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value)
            }}
            value={search}
          />
        </Col>
        <Col xs={24} md={8} style={{alignContent: 'flex-end'}}>
          <AnInput
            placeholder='Highlight items below price'
            onChange={(value: valueType) => {
              if (!value || value <= 0) {
                value = 0
              }

              setHighlightBelowPrice(Number(value.toString()))
            }}
            min={0}
            step={0.01}
            value={highlightBelowPrice}
          />
        </Col>
        <Col xs={9} md={3}>
          <FlexEndWrapper>
            <Button.Group>
              <Button onClick={() => setIndexType('list')}>
                <UnorderedListOutlined />
              </Button>
              <Button onClick={() => setIndexType('table')}>
                <TableOutlined />
              </Button>
            </Button.Group>
          </FlexEndWrapper>
        </Col>
        <Col xs={15} md={5}>
          <FlexEndWrapper>
            <Radio.Group
              defaultValue={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
              }}
            >
              <Radio.Button value='created_at' onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>
                Created
                <If condition={sortBy === 'created_at'}>
                  <Then>
                    <If condition={order === 'asc'}>
                      <Then>
                        <CaretUpOutlined />
                      </Then>
                      <Else>
                        <CaretDownOutlined />
                      </Else>
                    </If>
                  </Then>
                </If>
              </Radio.Button>
              <Radio.Button value='fixed_price' onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>
                Price
                <If condition={sortBy === 'fixed_price'}>
                  <Then>
                    <If condition={order === 'asc'}>
                      <Then>
                        <CaretUpOutlined />
                      </Then>
                      <Else>
                        <CaretDownOutlined />
                      </Else>
                    </If>
                  </Then>
                </If>
              </Radio.Button>
            </Radio.Group>
          </FlexEndWrapper>
        </Col>
      </Header>
      <If condition={loaded}>
        <Then>
          <If condition={indexType === 'list'}>
            <Then>
              <ItemsList data={data} />
            </Then>
            <Else>
              <ItemsTable data={data} />
            </Else>
          </If>
          <Pagination
            onChange={setPage}
            current={page}
            defaultCurrent={1}
            total={totalPages}
            showSizeChanger={false}
            hideOnSinglePage
            defaultPageSize={defaultPageSize}
            style={{marginBottom: 20}}
          />
        </Then>
      </If>
    </>
  )
}

export default ItemsIndex
