import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'
import { Else, If, Then } from 'react-if'
import styled from 'styled-components'
import { injected } from './connectors'
import { useEagerConnect } from './hooks/wallet'

const WalletWrapper = styled.div`
  color: white;
  float: left;
  margin-right: 20px;
`

const addressCut = (address: string, places: number = 5) =>
  address?.substr(0, places) + '...' + address?.substr(address.length - places, address.length)

const Wallet = () => {
  const { account, active, activate } = useWeb3React()

  useEagerConnect()

  return (
    <WalletWrapper>
      <If condition={!Boolean(active)}>
        <Then>
          <Button onClick={() => {
            activate(injected)
          }}>Connect wallet</Button>
        </Then>
        <Else>
          <span title={account || ''}>
            Connected {addressCut(account || '')}
          </span>
        </Else>
      </If>
    </WalletWrapper>
  )
}

export default Wallet
