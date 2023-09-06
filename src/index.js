import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { w3aSDK } from '@web3acquire/w3a';
import App from 'containers/App';
// import * as serviceWorker from 'serviceWorker';
import { RefreshContextProvider } from 'context/RefreshContext';

import 'antd/dist/antd.css';
import 'assets/styles/index.scss';

if (Number(process.env.REACT_APP_W3A_FLAG) === 1) {
  w3aSDK.configure(process.env.REACT_APP_W3A_KEY);
  w3aSDK.enableAutoPageView();
}

ReactDOM.render(
  <BrowserRouter>
    <RefreshContextProvider>
      <App />
    </RefreshContextProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// serviceWorker.register();
