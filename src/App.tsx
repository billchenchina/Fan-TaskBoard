import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { UseWalletProvider } from 'use-wallet'
import DisclaimerModal from './components/DisclaimerModal'
import MobileMenu from './components/MobileMenu'
import TopBar from './components/TopBar'
import FarmsProvider from './contexts/Farms'
import ModalsProvider from './contexts/Modals'
import TransactionProvider from './contexts/Transactions'
import SushiProvider from './contexts/SushiProvider'
import useModal from './hooks/useModal'
import theme from './theme'
import Farms from './views/Farms'
import Home from './views/Home'
import Oauth from './views/Oauth'
import Login from './views/Login'
import Stake from './views/Stake'
import Publish from './views/Publish'
import PublishType from './views/PublishType'
import PublishDone from './views/PublishDone'
import Detail from './views/Detail'
import Header from './components/Header/index'
import { initUser } from './store/userSlice';
import { useMount } from "ahooks";
import { useSelector, useDispatch } from "react-redux";
// import { Alert } from 'antd'

const App: React.FC = () => {
  const [mobileMenu, setMobileMenu] = useState(false)
  const dispatch = useDispatch()

  const handleDismissMobileMenu = useCallback(() => {
    setMobileMenu(false)
  }, [setMobileMenu])

  const handlePresentMobileMenu = useCallback(() => {
    setMobileMenu(true)
  }, [setMobileMenu])

  useMount(() => {
    dispatch(initUser())
  })

  return (
    <Providers>
      <Router>
        <Header></Header>
        <div style={{ height: 60 }}></div>
        {/* <TopBar onPresentMobileMenu={handlePresentMobileMenu} /> */}
        {/* <MobileMenu onDismiss={handleDismissMobileMenu} visible={mobileMenu} /> */}
        <Switch>
          <Route path="/" exact>
            {/* <Alert
              message="可能因为调用Twitter API 次数过多无法查询关注状态！可以稍后再来重试！"
              banner
              closable
            /> */}
            <Home />
          </Route>
          <Route path="/oauth" exact>
            <Oauth />
          </Route>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/publish" exact>
            <Publish />
          </Route>
          <Route path="/:id" exact>
            <Detail />
          </Route>
          <Route path="/publish/done" exact>
            <PublishDone />
          </Route>
          <Route path="/publish/:type" exact>
            <PublishType />
          </Route>
          <Route path="/publish/:type/:id" exact>
            <PublishType />
          </Route>
        </Switch>
      </Router>
      <Disclaimer />
    </Providers>
  )
}

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <UseWalletProvider
        chainId={1}
        connectors={{
          walletconnect: { rpcUrl: 'https://mainnet.eth.aragon.network/' },
        }}
      >
        <SushiProvider>
          <TransactionProvider>
            <FarmsProvider>
              <ModalsProvider>{children}</ModalsProvider>
            </FarmsProvider>
          </TransactionProvider>
        </SushiProvider>
      </UseWalletProvider>
    </ThemeProvider>
  )
}

const Disclaimer: React.FC = () => {
  const markSeen = useCallback(() => {
    localStorage.setItem('disclaimer', 'seen')
  }, [])

  const [onPresentDisclaimerModal] = useModal(
    <DisclaimerModal onConfirm={markSeen} />,
  )

  useEffect(() => {
    const seenDisclaimer = true // localStorage.getItem('disclaimer')
    if (!seenDisclaimer) {
      onPresentDisclaimerModal()
    }
  }, [onPresentDisclaimerModal])

  return <div />
}

export default App
