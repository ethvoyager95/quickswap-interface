import { hot } from 'react-hot-loader/root';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import zh from 'react-intl/locale-data/zh';
import tr from 'react-intl/locale-data/tr';
import { ApolloProvider } from 'react-apollo';
import { ToastContainer } from 'react-toastify';
import enMessages from 'lang/en';
import zhMessages from 'lang/zh';
import esMessages from 'lang/es';
import trMessages from 'lang/tr';
import { store } from 'core';
import Dashboard from 'containers/Main/Dashboard';
import Faucet from 'containers/Main/Faucet';
import Vote from 'containers/Main/Vote';
import STRK from 'containers/Main/STRK';
import Market from 'containers/Main/Market';
import MarketDetail from 'containers/Main/MarketDetail';
import MarketDeprecated from 'containers/Main/MarketDeprecated';
import MarketDetailDeprecated from 'containers/Main/MarketDetailDeprecated';
import VoteOverview from 'containers/Main/VoteOverview';
import ProposerDetail from 'containers/Main/ProposerDetail';
import VoterLeaderboard from 'containers/Main/VoterLeaderboard';
import Forbidden from 'containers/Main/Forbidden';
import Staking from 'containers/Main/Staking';
import Liquidator from 'containers/Main/Liquidator/Liquidator';
import Vault from 'containers/Main/Vault';
import { client } from '../apollo/client';
import Theme from './Theme';
import 'assets/styles/App.scss';
import History from './Main/History/History';
import 'react-toastify/dist/ReactToastify.css';

addLocaleData([...en, ...zh, ...es, ...tr]);
const messages = {
  en: enMessages,
  zh: zhMessages,
  es: esMessages,
  tr: trMessages
};

// eslint-disable-next-line global-require
window.Buffer = window.Buffer || require('buffer').Buffer;

function App() {
  const lang = localStorage.getItem('language') || 'en';
  const message = messages[localStorage.getItem('language') || 'en'];

  return (
    <Theme>
      <ApolloProvider client={client}>
        <IntlProvider locale={lang} messages={message}>
          <Provider store={store}>
            <BrowserRouter>
              <Switch
                atEnter={{ opacity: 0 }}
                atLeave={{ opacity: 0.5 }}
                atActive={{ opacity: 1 }}
                className="switch-wrapper"
              >
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/vote" component={Vote} />
                <Route exact path="/strk" component={STRK} />
                <Route exact path="/market" component={Market} />
                <Route exact path="/market/:asset" component={MarketDetail} />
                <Route
                  exact
                  path="/marketdeprecated"
                  component={MarketDeprecated}
                />
                <Route
                  exact
                  path="/marketdeprecated/:asset"
                  component={MarketDetailDeprecated}
                />
                <Route exact path="/forbidden" component={Forbidden} />
                <Route exact path="/history" component={History} />
                <Route exact path="/staking" component={Staking} />
                <Route exact path="/liquidator" component={Liquidator} />
                <Route exact path="/vault" component={Vault} />
                <Route
                  exact
                  path="/vote/leaderboard"
                  component={VoterLeaderboard}
                />
                <Route
                  exact
                  path="/vote/proposal/:id"
                  component={VoteOverview}
                />
                <Route
                  exact
                  path="/vote/address/:address"
                  component={ProposerDetail}
                />
                {process.env.REACT_APP_ENV === 'dev' && (
                  <Route exact path="/faucet" component={Faucet} />
                )}
                <Redirect from="/" to="/dashboard" />
              </Switch>
            </BrowserRouter>
            <ToastContainer />
          </Provider>
        </IntlProvider>
      </ApolloProvider>
    </Theme>
  );
}

export default App;
