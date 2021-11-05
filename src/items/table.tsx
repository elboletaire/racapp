import { Button, Table } from 'antd'
import { useState } from 'react'

import { useContracts } from '../hooks/wallet'

const ItemsTable = ({data, maxPrice}: {data: any[], maxPrice: number}) => {
  const { executeAuction } = useContracts()
  const [ loading, setLoading ] = useState<boolean[]>([])

  return (
    <Table
      dataSource={data.map((val) => ({...val, key: val.id}))}
      pagination={false}
      size='small'
      columns={[
        {
          title: 'Image',
          dataIndex: 'image_url',
          key: 'image',
          render: (src) => <img alt='icon' src={src} style={{maxHeight: '60px'}} />
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Units',
          dataIndex: 'count',
          key: 'count',
        },
        {
          title: 'Unit price',
          dataIndex: 'fixed_price',
          key: 'unitprice',
          render: (fp, item) => (Number(fp) / item.count).toLocaleString('en-US')
        },
        {
          title: 'Total price',
          dataIndex: 'fixed_price',
          key: 'totalprice',
          render: (fp) => Number(fp).toLocaleString('en-US')
        },
        {
          title: 'Actions',
          key: 'actions',
          render: (_, item) => (
            <Button
              loading={loading[item.id]}
              onClick={async () => {
                setLoading({...loading, [item.id]: true})
                await executeAuction?.(item)
                setLoading({...loading, [item.id]: false})
              }}
            >
              Buy
            </Button>
          )
        }
      ]}
    />
  )
}

export default ItemsTable
