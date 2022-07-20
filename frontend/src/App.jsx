import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Card from './components/Card';
import Header from './components/Header';
import Address from './components/Address';
import ConnectWallet from './components/ConnectWallet';
import Spinner from './components/Spinner';
import Error from './components/Error';
import Counter from './components/Counter';

const TIMEOUT = 1 * 1000; // 1 second

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const App = () => {
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);

  const waitForWallet = async (startTimestamp) => {
    if (!window.tronLink) {
      setTimeout(() => waitForWallet(startTimestamp), 10);
      if (performance.now() - startTimestamp >= TIMEOUT) {
        setLoading(false);
      }
      return;
    }
    setLoading(false);
    if (window.tronLink?.ready) {
      setWalletConnected(true);
    }
  };

  useEffect(() => {
    waitForWallet(performance.now());
  }, []);

  let main = null;

  if (loading) {
    main = (
      <Wrapper>
        <Spinner />
      </Wrapper>
    );
  } else if (!window.tronLink) {
    main = (
      <Error>
        <p>TronLink is not found.</p>
        <p>
          This app requires{' '}
          <a href="https://www.tronlink.org/" target="_blank">
            TronLink
          </a>{' '}
          extension.
        </p>
      </Error>
    );
  } else if (!window.tronLink?.ready) {
    main = <ConnectWallet onConnect={() => setWalletConnected(true)} />;
  } else if (walletConnected) {
    main = <Counter />;
  } else {
    main = <div>fuck</div>;
  }

  return (
    <React.Fragment>
      <Card>
        <Header>Counter</Header>
        {main}
      </Card>
      <Address isConnected={walletConnected} />
    </React.Fragment>
  );
};

export default App;
