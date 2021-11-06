import { TableOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Col, Input, InputNumber, Pagination, Row } from "antd"
import { valueType } from 'antd/lib/statistic/utils'
import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import styled from 'styled-components'
import ItemsList from '../items/list'
import ItemsTable from '../items/table'

const Header : typeof Row = styled(Row)`
  margin: 20px 0;
`

const IndexTypeSelector = styled.div`
  display: flex;
  justify-content: flex-end;
`

const AnInput : typeof InputNumber = styled(InputNumber)`
  width: 100%;
`

const defaultPageSize = 96

const ItemsIndex = () => {
  const [indexType, setIndexType] = useState<string>('list')
  const [loading, setLoading] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [data, setData] = useState<any[]>([])
  const [search, setSearch] = useState<string>()
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [maxPrice, setMaxPrice] = useState<number>(0)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      const params : any = {
        pageNo: page,
        pageSize: defaultPageSize,
        sortBy: 'created_at',
        order: 'desc',
        saleType: 'fixed_price',
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
  }, [loading, loaded, search, page])

  return (
    <>
      <Header>
        <Col span={14}>
          <Input
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              // @ts-ignore
              setSearch(e.target.value)
            }}
          />
        </Col>
        <Col span={7} style={{alignContent: 'flex-end'}}>
          <AnInput
            onChange={(value: valueType) => {
              if (!value || value <= 0) {
                value = 0
              }

              setMaxPrice(Number(value.toString()))
            }}
            min={0}
            step={0.01}
          />
        </Col>
        <Col span={3}>
          <IndexTypeSelector>
            <Button.Group>
              <Button onClick={() => setIndexType('table')}>
                <TableOutlined />
              </Button>
              <Button onClick={() => setIndexType('list')}>
                <UnorderedListOutlined />
              </Button>
            </Button.Group>
          </IndexTypeSelector>
        </Col>
      </Header>
      <If condition={loaded}>
        <Then>
          <If condition={indexType === 'list'}>
            <Then>
              <ItemsList data={data} maxPrice={maxPrice} />
            </Then>
            <Else>
              <ItemsTable data={data} maxPrice={maxPrice} />
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
