import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App';
// import * as serviceWorker from 'serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { RefreshContextProvider } from 'context/RefreshContext';

import 'antd/dist/antd.css';
import 'assets/styles/index.scss';

ReactDOM.render(
  <BrowserRouter>
    <RefreshContextProvider>
      <App />
    </RefreshContextProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// serviceWorker.register();
