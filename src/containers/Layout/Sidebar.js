import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { NavLink, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { message } from 'antd';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import {
  getTokenContract,
  getSbepContract,
  getComptrollerContract,
  methods
} from 'utilities/ContractService';
import { promisify } from 'utilities';
import * as constants from 'utilities/constants';
import ConnectModal from 'components/Basic/ConnectModal';
import { Label } from 'components/Basic/Label';
import Button from '@material-ui/core/Button';
import { connectAccount, accountActionCreators } from 'core';
import MetaMaskClass from 'utilities/MetaMask';
import logoImg from 'assets/img/logo.png';
import commaNumber from 'comma-number';
import { checkIsValidNetwork } from 'utilities/common';
import { check } from 'prettier';
import { FaBars, FaTimes } from 'react-icons/fa';

import { ACCOUNT_MARKET_INFO } from 'apollo/queries';
import { client } from 'apollo/client';

const SidebarWrapper = styled.div`
  width: 100%;
  padding: 32px 105px;
  background-color: var(--color-bg-main);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media only screen and (max-width: 768px) {
    height: 60px;
    margin-right: 0px;
    padding: 0;
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    font-size: 18px;
  }

  @media only screen and (max-width: 768px) {
    padding: 0 20px;
    img {
      width: 60px;
    }
  }

  @media only screen and (max-width: 1280px) {
    i {
      font-size: 12px !important;
    }
    img {
      width: 80px !important;
    }
  }
`;

const MainMenu = styled.div`
  display: flex;
  align-items: center;

  @media only screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: calc(100% - 60px);
    position: absolute;
    top: 60px;
    left: ${({ isMenuOpen }) => (isMenuOpen ? 0 : '-100%')};
    opacity: 1;
    transition: all 0.5s ease;
    background-color: #090d27;
    padding-top: 20px;
    z-index: 1;
  }

  a {
    padding: 7px;
    margin-right: 40px;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      span {
        color: var(--color-blue);
      }
    }

    @media only screen and (max-width: 768px) {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      width: 100%;
      margin: 0;
    }
  }
  .active {
    span {
      color: var(--color-blue);
    }
  }
`;

const MobileIcon = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    font-size: 1.4rem;
    align-items: center;
    cursor: pointer;
    margin-right: 20px;
  }
`;

const ConnectButton = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 40px;

  @media only screen and (max-width: 768px) {
    width: 100%;
    margin: 20px 0 0;
  }

  .connect-btn {
    width: 150px;
    height: 32px;
    box-shadow: 0px 4px 13px 0 rgba(39, 126, 230, 0.64);
    background-color: #277ee6;

    @media only screen and (max-width: 768px) {
      width: 100px;
    }

    .MuiButton-label {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--color-white);
      text-transform: capitalize;
    }
  }
`;

let metamask = null;
let accounts = [];
let metamaskWatcher = null;
let lockFlag = false;
const abortController = new AbortController();

function Sidebar({ history, settings, setSetting, getGovernanceStrike }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [error, setError] = useState('');
  const [web3, setWeb3] = useState(null);
  const [awaiting, setAwaiting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const checkNetwork = () => {
    const netId = window.ethereum.networkVersion
      ? +window.ethereum.networkVersion
      : +window.ethereum.chainId;
    setSetting({
      accountLoading: true
    });
    if (netId) {
      if (netId === 1 || netId === 3 || netId === 4) {
        if (netId === 3 && process.env.REACT_APP_ENV === 'prod') {
          message.error(
            'You are currently visiting the Ropsten Test Network for Strike Finance. Please change your metamask to access the Ethereum Mainnet.'
          );
        } else if (netId === 1 && process.env.REACT_APP_ENV === 'dev') {
          message.error(
            'You are currently visiting the Main Network for Strike Finance. Please change your metamask to access the Ropsten Test Network.'
          );
        } else if (netId === 4 && process.env.REACT_APP_ENV === 'dev') {
          message.error(
            'You are currently visiting the Main Network for Strike Finance. Please change your metamask to access the Ropsten Test Network.'
          );
        } else {
          setSetting({
            accountLoading: false
          });
        }
      } else {
        message.error(
          'You are currently connected to another network. Please connect to Ethereum Network'
        );
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.addEventListener('load', event => {
        checkNetwork();
      });
    }
  }, [window.ethereum]);

  const withTimeoutRejection = async (promise, timeout) => {
    const sleep = new Promise((resolve, reject) =>
      setTimeout(() => reject(new Error(constants.TIMEOUT)), timeout)
    );
    return Promise.race([promise, sleep]);
  };

  const handleWatch = useCallback(async () => {
    if (window.ethereum) {
      const accs = await window.ethereum.request({ method: 'eth_accounts' });
      if (!accs[0]) {
        accounts = [];
        lockFlag = false;
        clearTimeout(metamaskWatcher);
        setSetting({ selectedAddress: null });
      }
    }
    if (metamaskWatcher) {
      clearTimeout(metamaskWatcher);
    }

    if (!web3 || !accounts.length) {
      setAwaiting(true);
    }

    let tempWeb3 = null;
    let tempAccounts = [];
    let tempENSName = null;
    let tempENSAvatar = null;
    let tempError = error;
    let latestBlockNumber = 0;
    try {
      const isLocked = error && error.message === constants.LOCKED;
      if (!metamask || isLocked) {
        metamask = await withTimeoutRejection(
          MetaMaskClass.initialize(undefined), // if option is existed, add it
          20 * 1000 // timeout
        );
      }
      tempWeb3 = await metamask.getWeb3();
      tempAccounts = await metamask.getAccounts();
      // Lookup ENS name and avatar when possible
      const ethersProvider = new ethers.providers.Web3Provider(tempWeb3.currentProvider);
      tempENSName = await ethersProvider.lookupAddress(tempAccounts[0]);
      tempENSAvatar = tempENSName ? await ethersProvider.getAvatar(tempENSName) : null;
      latestBlockNumber = await metamask.getLatestBlockNumber();
      if (latestBlockNumber) {
        await setSetting({ latestBlockNumber });
      }
      tempError = null;
    } catch (err) {
      tempError = err;
      accounts = [];
      await setSetting({ selectedAddress: null });
    }
    await setSetting({
      selectedAddress: tempAccounts[0],
      selectedENSName: tempENSName,
      selectedENSAvatar: tempENSAvatar
    });
    accounts = tempAccounts;
    setWeb3(tempWeb3);
    setError(tempError);
    setAwaiting(false);
    if (!tempError) {
      metamaskWatcher = setTimeout(() => {
        clearTimeout(metamaskWatcher);
        handleWatch();
      }, 3000);
    }
  }, [error, web3]);

  const handleMetaMask = () => {
    setError(MetaMaskClass.hasWeb3() ? '' : new Error(constants.NOT_INSTALLED));
    handleWatch();
  };

  const setDecimals = async () => {
    const decimals = {};
    Object.values(constants.CONTRACT_TOKEN_ADDRESS).forEach(async item => {
      decimals[`${item.id}`] = {};
      if (item.id !== 'eth' && item.id !== 'strk') {
        const tokenContract = getTokenContract(item.id);
        const tokenDecimals = await methods.call(
          tokenContract.methods.decimals,
          []
        );
        const sBepContract = getSbepContract(item.id);
        const stokenDecimals = await methods.call(
          sBepContract.methods.decimals,
          []
        );
        decimals[`${item.id}`].token = Number(tokenDecimals);
        decimals[`${item.id}`].stoken = Number(stokenDecimals);
        decimals[`${item.id}`].price = 18 + 18 - Number(tokenDecimals);
      } else {
        decimals[`${item.id}`].token = 18;
        decimals[`${item.id}`].stoken = 8;
        decimals[`${item.id}`].price = 18;
      }
    });
    decimals.mantissa = +process.env.REACT_APP_MANTISSA_DECIMALS;
    decimals.comptroller = +process.env.REACT_APP_COMPTROLLER_DECIMALS;
    await setSetting({ decimals });
  };

  const initSettings = async () => {
    await setDecimals();
    setSetting({
      pendingInfo: {
        type: '',
        status: false,
        amount: 0,
        symbol: ''
      }
    });
  };

  useEffect(() => {
    if (accounts.length !== 0) {
      setIsOpenModal(false);
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [handleWatch, settings.accounts]);

  useEffect(() => {
    handleWatch();
    return function cleanup() {
      abortController.abort();
    };
  }, [history]);

  const getMarkets = async () => {
    const res = await promisify(getGovernanceStrike, {});
    if (!res.status) {
      return;
    }
    setSetting({
      markets: [
        ...res.data.markets.filter(
          m => m.underlyingSymbol !== 'ZRX' && m.underlyingSymbol !== 'BAT'
        )
      ],
      marketVolumeLog: res.data.marketVolumeLog,
      dailyStrike: res.data.dailyStrike
    });
  };

  useEffect(() => {
    if (window.ethereum) {
      if (!settings.accountLoading && checkIsValidNetwork()) {
        initSettings();
      }
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.accountLoading]);

  useEffect(() => {
    if (!settings.selectedAddress) {
      return;
    }
    if (window.ethereum && checkIsValidNetwork()) {
      window.ethereum.on('accountsChanged', accs => {
        setSetting({
          selectedAddress: accs[0],
          accountLoading: true
        });
      });
    }
  }, [window.ethereum, settings.selectedAddress]);

  useEffect(() => {
    let updateTimer;
    if (settings.selectedAddress) {
      updateTimer = setInterval(() => {
        if (checkIsValidNetwork()) {
          getMarkets();
        }
      }, 3000);
    }
    return function cleanup() {
      abortController.abort();
      if (updateTimer) {
        clearInterval(updateTimer);
      }
    };
  }, [settings.selectedAddress, settings.accountLoading]);

  const updateMarketInfo = async (
    accountAddress = settings.selectedAddress
  ) => {
    if (!accountAddress || !settings.decimals || !settings.markets) {
      return;
    }
    lockFlag = true;
    const appContract = getComptrollerContract();
    let totalSupplyBalance = new BigNumber(0);
    let totalBorrowBalance = new BigNumber(0);
    let totalBorrowLimit = new BigNumber(0);
    let totalLiquidity = new BigNumber(0);

    const assetsIn = await methods.call(appContract.methods.getAssetsIn, [
      accountAddress
    ]);
    const assetList = await Promise.all(
      Object.values(constants.CONTRACT_TOKEN_ADDRESS).map(
        async (item, index) => {
          if (!settings.decimals[item.id]) {
            return;
          }

          let market = settings.markets.find(
            ele =>
              ele.address ===
              constants.CONTRACT_SBEP_ADDRESS[item.id].address
                .toString()
                .toLowerCase()
          );
          if (!market) market = {};
          const asset = {
            key: index,
            id: item.id,
            img: item.asset,
            vimg: item.sasset,
            name: item.symbol,
            symbol: item.symbol,
            tokenAddress: item.address,
            vsymbol: market.symbol,
            stokenAddress: constants.CONTRACT_SBEP_ADDRESS[item.id].address,
            supplyApy: new BigNumber(market.supplyApy || 0),
            borrowApy: new BigNumber(market.borrowApy || 0),
            strkSupplyApy: new BigNumber(market.supplyStrikeApy || 0),
            strkBorrowApy: new BigNumber(market.borrowStrikeApy || 0),
            collateralFactor: new BigNumber(market.collateralFactor || 0).div(
              1e18
            ),
            tokenPrice: new BigNumber(market.tokenPrice || 0),
            liquidity: new BigNumber(market.liquidity || 0),
            walletBalance: new BigNumber(0),
            supplyBalance: new BigNumber(0),
            borrowBalance: new BigNumber(0),
            isEnabled: false,
            collateral: false,
            percentOfLimit: '0'
          };

          const tokenDecimal = settings.decimals[item.id].token || 18;
          const sBepContract = getSbepContract(item.id);
          asset.collateral = assetsIn.includes(asset.stokenAddress);

          const promises = [];

          // wallet balance
          if (item.id !== 'eth') {
            const tokenContract = getTokenContract(item.id);
            promises.push(
              methods.call(tokenContract.methods.balanceOf, [accountAddress]),
              // allowance
              methods.call(tokenContract.methods.allowance, [
                accountAddress,
                asset.stokenAddress
              ])
            );
          } else if (window.ethereum) {
            promises.push(window.web3.eth.getBalance(accountAddress), null);
          }

          // supply balance
          promises.push(
            methods.call(sBepContract.methods.balanceOfUnderlying, [
              accountAddress
            ])
          );

          // borrow balance
          promises.push(
            methods.call(sBepContract.methods.borrowBalanceCurrent, [
              accountAddress
            ])
          );

          // hypotheticalLiquidity
          const totalBalance = await methods.call(
            sBepContract.methods.balanceOf,
            [accountAddress]
          );
          promises.push(
            methods.call(appContract.methods.getHypotheticalAccountLiquidity, [
              accountAddress,
              asset.stokenAddress,
              totalBalance,
              0
            ])
          );

          const [
            walletBalance,
            allowBalance,
            supplyBalance,
            borrowBalance,
            hypotheticalLiquidity
          ] = await Promise.all(promises);
          asset.walletBalance = new BigNumber(walletBalance).div(
            new BigNumber(10).pow(tokenDecimal)
          );
          if (item.id !== 'eth') {
            asset.isEnabled = new BigNumber(allowBalance)
              .div(new BigNumber(10).pow(tokenDecimal))
              .isGreaterThan(asset.walletBalance);
          } else if (window.ethereum) {
            asset.isEnabled = true;
          }
          asset.supplyBalance = new BigNumber(supplyBalance).div(
            new BigNumber(10).pow(tokenDecimal)
          );
          asset.borrowBalance = new BigNumber(borrowBalance).div(
            new BigNumber(10).pow(tokenDecimal)
          );

          // percent of limit
          asset.percentOfLimit = new BigNumber(
            settings.totalBorrowLimit
          ).isZero()
            ? '0'
            : asset.borrowBalance
                .times(asset.tokenPrice)
                .div(settings.totalBorrowLimit)
                .times(100)
                .dp(0, 1)
                .toString(10);

          asset.hypotheticalLiquidity = hypotheticalLiquidity;

          const supplyBalanceUSD = asset.supplyBalance.times(asset.tokenPrice);
          const borrowBalanceUSD = asset.borrowBalance.times(asset.tokenPrice);

          totalSupplyBalance = totalSupplyBalance.plus(supplyBalanceUSD);
          totalBorrowBalance = totalBorrowBalance.plus(borrowBalanceUSD);

          if (asset.collateral) {
            totalBorrowLimit = totalBorrowLimit.plus(
              supplyBalanceUSD.times(asset.collateralFactor)
            );
          }

          totalLiquidity = totalLiquidity.plus(
            new BigNumber(market.totalSupplyUsd || 0)
          );

          return asset;
        }
      )
    );

    setSetting({
      assetList,
      totalLiquidity: totalLiquidity.toString(10),
      totalSupplyBalance: totalSupplyBalance.toString(10),
      totalBorrowBalance: totalBorrowBalance.toString(10),
      totalBorrowLimit: totalBorrowLimit.toString(10)
    });
    lockFlag = false;
  };

  const handleAccountChange = async () => {
    await updateMarketInfo();
    setSetting({
      accountLoading: false
    });
  };

  useEffect(() => {
    if (!lockFlag) {
      updateMarketInfo();
    }
  }, [settings.markets]);

  useEffect(() => {
    if (settings.accountLoading) {
      handleAccountChange();
    }
  }, [settings.accountLoading]);

  return (
    <SidebarWrapper>
      <Logo>
        <NavLink to="/" activeClassName="active">
          <img src={logoImg} alt="logo" className="logo-text" />
        </NavLink>
      </Logo>
      <MobileIcon onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </MobileIcon>
      <MainMenu isMenuOpen={isMenuOpen}>
        <NavLink
          className="flex flex-start align-center"
          to="/dashboard"
          activeClassName="active"
        >
          <Label>Dashboard</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center"
          to="/vote"
          activeClassName="active"
        >
          <Label>Vote</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center"
          to="/strk"
          activeClassName="active"
        >
          <Label>Rewards</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center"
          to="/market"
          activeClassName="active"
        >
          <Label>Market</Label>
        </NavLink>
        {process.env.REACT_APP_ENV === 'dev' && (
          <NavLink
            className="flex flex-start align-center"
            to="/faucet"
            activeClassName="active"
          >
            <Label>Faucet</Label>
          </NavLink>
        )}
        {!settings.selectedAddress && (
          <ConnectButton>
            <Button
              className="connect-btn"
              onClick={() => setIsOpenModal(true)}
            >
              Connect
            </Button>
          </ConnectButton>
        )}
      </MainMenu>
      {/* {settings.selectedAddress && (
        <TotalValue>
          <div className="flex flex-column align-center just-center">
            <Label primary>
              $
              {format(
                new BigNumber(settings.totalLiquidity).dp(2, 1).toString(10)
              )}
            </Label>
            <Label className="center">Total Value Locked</Label>
          </div>
        </TotalValue>
      )} */}
      <ConnectModal
        visible={isOpenModal}
        web3={web3}
        error={error}
        awaiting={awaiting}
        onCancel={() => setIsOpenModal(false)}
        onConnectMetaMask={handleMetaMask}
        checkNetwork={checkNetwork}
      />
    </SidebarWrapper>
  );
}

Sidebar.propTypes = {
  history: PropTypes.object,
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired,
  getGovernanceStrike: PropTypes.func.isRequired
};

Sidebar.defaultProps = {
  settings: {},
  history: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { setSetting, getGovernanceStrike } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting,
      getGovernanceStrike
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Sidebar);
