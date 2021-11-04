import { Layout } from 'antd'
import React from 'react'
import styled from 'styled-components'

import Wallet from './Wallet'

import 'antd/dist/antd.css'
import ItemsIndex from './items'

const { Header, Footer } = Layout

const Content : typeof Layout.Content = styled(Layout.Content)`
  background-color: #dbdbdb;
`

function App() {
  return (
    <Layout className="layout">
      <Header>
        <Wallet />
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <ItemsIndex />
      </Content>
      <Footer style={{ textAlign: 'center' }}>elboletaire {'>'} RACA devs</Footer>
    </Layout>
  )
}

export default App


