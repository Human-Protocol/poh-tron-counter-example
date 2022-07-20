import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';

const Address = ({ isConnected }) => {
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    setAddress(tronWeb.defaultAddress.base58);
  }, [isConnected]);

  if (!isConnected) {
    return null;
  }

  const croppedAccount = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div
      css={css`
        color: #918bac;
        font-size: 1rem;
      `}
    >
      Connected: {croppedAccount}
    </div>
  );
};

export default Address;
