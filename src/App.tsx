import { Layout, Menu } from 'antd'
import { Content, Footer, Header } from 'antd/lib/layout/layout'
import { ReactNode } from 'react'
import { PathRouteProps, Route, Routes, useLocation } from 'react-router'
import { Link } from 'react-router-dom'

import ItemsIndex from './pages/items'
import Utils from './pages/utils'
import Wallet from './Wallet'

type RouteLink = {
  path: string,
  element: ReactNode,
  title?: string,
}

const App = () => {
  const { pathname } = useLocation()

  const routes : RouteLink[] = [
    {
      path: '/',
      element: <ItemsIndex />,
      title: 'Marketplace',
    },
    {
      path: '/utils',
      element: <Utils />,
      title: 'Utils',
    },
  ]

  const cleanRoute = (route: RouteLink) => {
    delete route.title

    return route
  }

  const activeKey = () => {
    for (const k in routes) {
      const route = routes[k]
      if (route.path === pathname) {
        return String(k)
      }
    }
    return '0'
  }

  return (
    <Layout className='layout'>
      <Header>
        <Wallet />
        <Menu theme='dark' mode='horizontal' defaultSelectedKeys={[activeKey()]}>
          {
            routes.map((route, k) => (
              <Menu.Item key={String(k)}>
                <Link to={route.path}>
                  {route.title}
                </Link>
              </Menu.Item>
            ))
          }
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Routes>
          {
            routes.map((route, k) => <Route key={k} {...cleanRoute(route) as PathRouteProps} />)
          }
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center' }}>elboletaire {'>'} RACA devs</Footer>
    </Layout>
  )
}

export default App
