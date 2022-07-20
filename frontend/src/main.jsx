import React from 'react';
import ReactDOM from 'react-dom';
import { ProofOfHumanityProvider } from 'poh-tron-react';
import { Global } from '@emotion/react';
import App from './App';
import globalStyles from './globalStyles';

ReactDOM.render(
  <React.StrictMode>
    <Global styles={globalStyles} />
    <ProofOfHumanityProvider>
      <App />
    </ProofOfHumanityProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
