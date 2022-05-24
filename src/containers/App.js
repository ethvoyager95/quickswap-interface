import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import enMessages from 'lang/en';
import { store } from 'core';
import Dashboard from 'containers/Main/Dashboard';
import Faucet from 'containers/Main/Faucet';
import Vote from 'containers/Main/Vote';
import STRK from 'containers/Main/STRK';
import Market from 'containers/Main/Market';
import MarketDetail from 'containers/Main/MarketDetail';
import VoteOverview from 'containers/Main/VoteOverview';
import ProposerDetail from 'containers/Main/ProposerDetail';
import VoterLeaderboard from 'containers/Main/VoterLeaderboard';
import Forbidden from 'containers/Main/Forbidden';
import { MoralisProvider } from 'react-moralis';
import { ApolloProvider } from 'react-apollo';
import * as constants from 'utilities/constants';
import Theme from './Theme';
import { client } from '../apollo/client';

import 'assets/styles/App.scss';
import Staking from './Main/Staking/Staking';

addLocaleData([...en]);
const initialLang = 'en';

const messages = {
  en: enMessages
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: initialLang
    };
  }

  render() {
    const { lang } = this.state;
    const message = messages[lang];
    return (
      <Theme>
        <ApolloProvider client={client}>
          <IntlProvider locale={lang} messages={message}>
            <MoralisProvider
              serverUrl={constants.MORALIS_URL}
              appId={constants.MORALIS_ID}
            >
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
                    <Route
                      exact
                      path="/market/:asset"
                      component={MarketDetail}
                    />
                    <Route exact path="/forbidden" component={Forbidden} />
                    <Route exact path="/staking" component={Staking} />
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
              </Provider>
            </MoralisProvider>
          </IntlProvider>
        </ApolloProvider>
      </Theme>
    );
  }
}

export default hot(App);
