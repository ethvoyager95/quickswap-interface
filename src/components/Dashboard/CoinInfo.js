import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'antd';
import { compose } from 'recompose';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import { connectAccount } from 'core';
import { getTokenContract, methods } from 'utilities/ContractService';
import * as constants from 'utilities/constants';
import { checkIsValidNetwork } from 'utilities/common';
import coinImg from 'assets/img/strike_32.png';

const CardWrapper = styled.div`
  width: 100%;
  padding: 24px 45px;
  border-bottom: 1px solid #141518;

  @media only screen and (max-width: 768px) {
    padding: 24px;
  }

  .add-strk-token {
    font-size: 18px;
    color: var(--color-yellow);
    margin-left: 10px;
    margin-bottom: 3px;
  }

  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 16px;
  }

  p {
    font-size: 17.5px;
    font-weight: 900;
    line-height: 1;
    color: var(--color-text-main);
  }

  .copy-btn {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--color-bg-active);
    margin-left: 26px;

    i {
      color: var(--color-blue);
      svg {
        transform: rotate(-45deg);
      }
    }
  }
`;

const format = commaNumber.bindWith(',', '.');
const abortController = new AbortController();

function CoinInfo({ settings }) {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [ensName, setENSName] = useState('');
  const [ensAvatar, setENSAvatar] = useState('');

  const updateBalance = useCallback(async () => {
    if (window.ethereum && checkIsValidNetwork() && settings.selectedAddress) {
      const strkTokenContract = getTokenContract('strk');
      let temp = await methods.call(strkTokenContract.methods.balanceOf, [
        settings.selectedAddress
      ]);
      temp = new BigNumber(temp)
        .dividedBy(new BigNumber(10).pow(18))
        .dp(4, 1)
        .toString(10);
      setBalance(temp);
      setAddress(settings.selectedAddress);
      setENSName(settings.selectedENSName);
      setENSAvatar(settings.selectedENSAvatar);
    }
  }, [window.ethereum, settings.markets]);

  const handleLink = () => {
    window.open(
      `${process.env.REACT_APP_ETH_EXPLORER}/token/${constants.CONTRACT_TOKEN_ADDRESS.strk.address}?a=${address}`,
      '_blank'
    );
  };

  useEffect(() => {
    updateBalance();
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.selectedAddress, updateBalance]);

  return (
    <CardWrapper className="flex align-center just-between">
      <div className="flex align-center">
        <img src={coinImg} alt="coin" />
        <p>{format(balance)}</p>
        {/* {window.ethereum && (
          <Icon
            className="add-strk-token"
            type="plus-circle"
            theme="filled"
            onClick={() => addToken('strk', 18, 'token')}
          />
        )} */}
      </div>
      <div
        className="flex align-center just-center pointer"
        onClick={() => handleLink()}
      >
        {ensAvatar && <img src={ensAvatar} alt="avatar" />}
        <p className="highlight">
          {ensName ||
            `${address.substr(0, 4)}...${address.substr(
              address.length - 4,
              4
            )}`}
        </p>
        <div className="flex align-center just-center copy-btn">
          <Icon type="arrow-right" />
        </div>
      </div>
    </CardWrapper>
  );
}

CoinInfo.propTypes = {
  settings: PropTypes.object
};

CoinInfo.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(CoinInfo);
