import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useProofOfHumanity } from 'poh-tron-react';
import HCaptchaValidator from 'poh-validator-hcaptcha-react';
import Button from './Button';
import Spinner from './Spinner';
import Error from './Error';
import { contractAddress, validatorApiUrl, hcaptchaSitekey } from '../config';
import abi from '../abi/Counter.json';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Value = styled.div`
  font-size: 6rem;
  text-align: center;
  color: #241a66;
`;

function Counter() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const initContract = async () => {
    if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
      setTimeout(initContract, 10);
      return;
    }

    const tronWeb = window.tronWeb;

    const counterContract = await tronWeb.contract(abi, contractAddress);
    const value = await counterContract.counter().call();
    setCount(Number(value));
    setInitialized(true);

    counterContract.Increment().watch((error, event) => {
      if (error) {
        return console.error('Error with "Message" event:', error);
      }

      const { contract, name, result } = event;

      if (contract === contractAddress && name === 'Increment') {
        setCount(Number(result.currentCounter));
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    initContract();
  }, []);

  const validator = (
    <HCaptchaValidator
      validatorApiUrl={validatorApiUrl}
      sitekey={hcaptchaSitekey}
    />
  );
  const { getProofOfHumanity } = useProofOfHumanity(validator);

  if (!initialized) {
    return (
      <Wrapper>
        <Spinner />
      </Wrapper>
    );
  }

  const handleErrorDismiss = () => {
    setErrorMessage(null);
  };

  if (errorMessage) {
    return (
      <Error onDismiss={handleErrorDismiss}>
        <p>{errorMessage}</p>
      </Error>
    );
  }

  const setError = (message) => {
    setErrorMessage(String(message).slice(0, 80));
  };

  const handleIncrement = async () => {
    setLoading(true);
    try {
      const { error, errorMessage, proof } = await getProofOfHumanity();
      if (error) {
        setError(errorMessage);
        setLoading(false);
        return;
      }

      const counterContract = await tronWeb.contract(abi, contractAddress);
      await counterContract.increment(proof).send({
        feeLimit: 100_000_000,
        callValue: 0,
      });

      await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
    } catch (error) {
      const message = error.message || JSON.stringify(error);
      console.error(message);
      setError(message);
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <Value>{count}</Value>
      <Button onClick={handleIncrement} loading={loading}>
        Increment
      </Button>
    </React.Fragment>
  );
}

export default Counter;
