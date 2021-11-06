import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { FiltersProvider } from './hooks/filters'
import { ContractsProvider } from './hooks/wallet'
import App from './App'

import reportWebVitals from './reportWebVitals'

function getLibrary(provider: any) {
  return new Web3Provider(provider, 'any')
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ContractsProvider>
          <FiltersProvider>
            <App />
          </FiltersProvider>
        </ContractsProvider>
      </Web3ReactProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
