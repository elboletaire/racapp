import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'
import { Else, If, Then } from 'react-if'
import styled from 'styled-components'
import { injected } from './connectors'
import { useEagerConnect } from './hooks/wallet'

const Connected = styled.p`
  color: white;
`

const Ellipsis = styled.span`
  display: inline-block;
  width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: pre;
`

const addressCut = (address: string, places: number = 5) =>
  address?.substr(0, places) + '...' + address?.substr(address.length - places, address.length)

const Wallet = () => {
  const { account, active, activate } = useWeb3React()

  useEagerConnect()

  return (
    <If condition={!Boolean(active)}>
      <Then>
        <Button onClick={() => {
          activate(injected)
        }}>Connect wallet</Button>
      </Then>
      <Else>
        <Connected>
          <Ellipsis title={account || ''}>
            Connected {addressCut(account || '')}
          </Ellipsis>
        </Connected>
      </Else>
    </If>
  )
}

export default Wallet
