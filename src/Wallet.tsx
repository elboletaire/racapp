import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'
import { Else, If, Then } from 'react-if'
import styled from 'styled-components'
import { injected } from './connectors'
import { useEagerConnect } from './hooks/wallet'

const Connected = styled.p`
  color: white;
`

const Wallet = () => {
  const { account: loggedAccount, active, activate } = useWeb3React()

  useEagerConnect()

  return (
    <If condition={!Boolean(active)}>
      <Then>
        <Button onClick={() => {
          activate(injected)
        }}>Connect wallet</Button>
      </Then>
      <Else>
        <Connected>Connected {loggedAccount}</Connected>
      </Else>
    </If>
  )
}

export default Wallet
