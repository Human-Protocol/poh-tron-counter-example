import React from 'react';
import Button from './Button';

const ConnectWallet = ({ onConnect }) => {
  const connect = async () => {
    try {
      await tronLink.request({ method: 'tron_requestAccounts' });
      onConnect();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <p>Welcome!</p>
      <Button onClick={connect}>Connect wallet</Button>
    </React.Fragment>
  );
};

export default ConnectWallet;
