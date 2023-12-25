import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from 'containers/App';
// import * as serviceWorker from 'serviceWorker';
import { RefreshContextProvider } from 'context/RefreshContext';

import 'antd/dist/antd.css';
import 'assets/styles/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <RefreshContextProvider>
      <App />
    </RefreshContextProvider>
  </BrowserRouter>
);

// serviceWorker.register();
