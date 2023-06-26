import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { NavLink, withRouter, useLocation } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { message, Dropdown, Menu, Icon } from 'antd';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import {
  getTokenContract,
  getSbepContract,
  getComptrollerContract,
  methods,
  multicall
} from 'utilities/ContractService';
import { promisify } from 'utilities';
import * as constants from 'utilities/constants';
import ConnectModal from 'components/Basic/ConnectModal';
import UserInfoModal from 'components/Basic/UserInfoModal';
import AccountModal from 'components/Basic/AccountModal';
import { Label } from 'components/Basic/Label';
import Button from '@material-ui/core/Button';
import { connectAccount, accountActionCreators } from 'core';
import MetaMaskClass from 'utilities/MetaMask';
import logoImg from 'assets/img/logo.png';
import commaNumber from 'comma-number';
import { checkIsValidNetwork, getBigNumber } from 'utilities/common';
import useWindowDimensions from 'hooks/useWindowDimensions';

import { check } from 'prettier';
import { FaBars, FaTimes } from 'react-icons/fa';

import { ACCOUNT_MARKET_INFO } from 'apollo/queries';
import { client } from 'apollo/client';

const SidebarWrapper = styled.div`
  width: 100%;
  padding: 32px 105px;
  background-color: var(--color-bg-main);

  @media only screen and (max-width: 768px) {
    height: 60px;
    margin-right: 0px;
    padding: 0;
  }
`;

const TopSidebarWrapper = styled.div`
  width: 100%;
  background-color: var(--color-bg-main);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .right-area {
    display: flex;
  }

  @media only screen and (max-width: 768px) {
    height: 60px;
    margin-right: 0px;
    padding: 0;

    .right-area {
      display: none;
    }
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
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 15px;

  .right-area {
    display: none;
  }

  .dropdown-link {
    font-size: 16px;
    font-weight: 900;
    color: var(--color-text-secondary);
    cursor: pointer;
    user-select: none;

    &:hover {
      color: var(--color-white);
    }
  }

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
    background-color: var(--color-bg-primary);
    padding-top: 20px;
    padding-bottom: 20px;
    z-index: 10;
    overflow-y: auto;
    flex-wrap: nowrap;
    margin-top: 0px;
    justify-content: unset;

    .right-area {
      display: block;
      margin: 0 auto;
    }
  }

  a {
    padding: 7px;
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      span {
        color: var(--color-white);
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
      color: var(--color-white);
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
    background: linear-gradient(
      242deg,
      #246cf9 0%,
      #1e68f6 0.01%,
      #0047d0 100%,
      #0047d0 100%
    );

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

const UserInfoButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 40px;
  padding: 0;

  @media only screen and (max-width: 768px) {
    width: 100%;
    margin: 20px 0 0;
  }

  .user-info-btn {
    padding: 0 8px;
    height: 32px;
    background: linear-gradient(
      242deg,
      #246cf9 0%,
      #1e68f6 0.01%,
      #0047d0 100%,
      #0047d0 100%
    );
    display: flex;
    align-items: center;
    @media only screen and (max-width: 768px) {
      padding: 0 8px;
    }

    .MuiButton-label {
      font-size: 13.5px;
      line-height: 1;
      font-weight: 500;
      color: var(--color-white);
      text-transform: capitalize;
      display: flex;
      align-items: center;
    }

    img {
      width: 16px;
      height: 16px;
      margin-left: 4px;
    }
  }
`;

let metamask = null;
let accounts = [];
let metamaskWatcher = null;
let lockFlag = false;
const abortController = new AbortController();

const menu = (
  <Menu>
    <Menu.Item key="0">
      <NavLink
        className="flex flex-start align-center"
        to="/staking"
        activeClassName="active"
      >
        <Label>Staking</Label>
      </NavLink>
    </Menu.Item>
    <Menu.Item key="0">
      <NavLink
        className="flex flex-start align-center"
        to="/vault"
        activeClassName="active"
      >
        <Label>DeFi Vault 3.0</Label>
      </NavLink>
    </Menu.Item>
    <Menu.Item key="0">
      <NavLink
        className="flex flex-start align-center"
        to="/liquidator"
        activeClassName="active"
      >
        <Label>Liquidator</Label>
      </NavLink>
    </Menu.Item>
  </Menu>
);

function Sidebar({ history, settings, setSetting, getGovernanceStrike }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenInfoModal, setIsOpenInfoModal] = useState(false);
  const [isOpenAccountModal, setIsOpenAccountModal] = useState(false);
  const [error, setError] = useState('');
  const [web3, setWeb3] = useState(null);
  const [awaiting, setAwaiting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [available, setAvailable] = useState('0');
  const [balance, setBalance] = useState('');
  const location = useLocation();
  const { width } = useWindowDimensions();

  const checkNetwork = () => {
    const netId = window.ethereum.networkVersion
      ? +window.ethereum.networkVersion
      : +window.ethereum.chainId;
    setSetting({
      accountLoading: true
    });
    if (netId) {
      if (netId === 1 || netId === 5) {
        if (netId === 5 && process.env.REACT_APP_ENV === 'prod') {
          message.error(
            'You are currently visiting the Goerli Test Network for Strike Finance. Please change your metamask to access the Ethereum Mainnet.'
          );
        } else if (netId === 1 && process.env.REACT_APP_ENV === 'dev') {
          message.error(
            'You are currently visiting the Main Network for Strike Finance. Please change your metamask to access the Goerli Test Network.'
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
      const ethersProvider = new ethers.providers.Web3Provider(
        tempWeb3.currentProvider
      );
      tempENSName = await ethersProvider.lookupAddress(tempAccounts[0]);
      tempENSAvatar = tempENSName
        ? await ethersProvider.getAvatar(tempENSName)
        : null;
      latestBlockNumber = await metamask.getLatestBlockNumber();
      if (latestBlockNumber) {
        await setSetting({ latestBlockNumber });
      }
      tempError = null;
    } catch (err) {
      const chainId = process.env.REACT_APP_ENV === 'prod' ? '0x1' : '0x5';
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }]
      });
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
  }, [error, web3]);

  const handleMetaMask = () => {
    localStorage.setItem('walletConnected', JSON.stringify(true));
    setSetting({
      isConnected: true
    });
    setError(MetaMaskClass.hasWeb3() ? '' : new Error(constants.NOT_INSTALLED));
    handleWatch();
  };

  const setDecimals = async () => {
    const decimals = {};
    Object.values(constants.CONTRACT_TOKEN_ADDRESS).forEach(async item => {
      decimals[`${item.id}`] = {};
      if (item.id !== 'eth' && item.id !== 'strk') {
        if (checkIsValidNetwork()) {
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
          decimals[`${item.id}`].token = item.decimals;
          decimals[`${item.id}`].stoken = 8;
          decimals[`${item.id}`].price = 18 + 18 - item.decimals;
        }
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
    if (settings.isConnected) {
      handleWatch();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [history]);

  useEffect(() => {
    if (settings.isConnected) {
      setSetting({
        accountLoading: false
      });
    }
  }, [settings.isConnected]);

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
      dailyStrike: res.data.dailyStrike,
      reserves: res.data.reserves
    });
  };

  useEffect(() => {
    if (window.ethereum) {
      if (!settings.accountLoading /* && checkIsValidNetwork()*/) {
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
    const updateTimer = setInterval(() => {
      if (checkIsValidNetwork()) {
        getMarkets();
      }
    }, 8000);

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
    try {
      if (!settings.decimals || !settings.markets) {
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
              supplyCaps: new BigNumber(market.supplyCaps || 0),
              borrowCaps: new BigNumber(market.borrowCaps || 0),
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
              percentOfLimit: '0',
              borrowPaused: true
            };

            const tokenDecimal = settings.decimals[item.id].token || 18;
            const sBepContract = getSbepContract(item.id);
            asset.collateral = assetsIn.includes(asset.stokenAddress);

            // const promises = [];
            const contractCallContext = [];

            // wallet balance
            if (item.id !== 'eth') {
              const tokenContract = getTokenContract(item.id);
              // promises.push(
              //   methods.call(tokenContract.methods.balanceOf, [accountAddress]),
              //   // allowance
              //   methods.call(tokenContract.methods.allowance, [
              //     accountAddress,
              //     asset.stokenAddress
              //   ])
              // );

              contractCallContext.push(
                {
                  reference: 'walletBalance',
                  contractAddress: tokenContract.options.address,
                  abi: tokenContract.options.jsonInterface,
                  calls: [
                    {
                      methodName: 'balanceOf',
                      methodParameters: [accountAddress]
                    }
                  ]
                },
                {
                  reference: 'allowBalance',
                  contractAddress: tokenContract.options.address,
                  abi: tokenContract.options.jsonInterface,
                  calls: [
                    {
                      methodName: 'allowance',
                      methodParameters: [accountAddress, asset.stokenAddress]
                    }
                  ]
                }
              );
            }
            // else if (window.ethereum) {
            //   promises.push(window.web3.eth.getBalance(accountAddress), null);
            // }

            // supply balance
            // promises.push(
            //   methods.call(sBepContract.methods.balanceOfUnderlying, [
            //     accountAddress
            //   ])
            // );

            // borrow balance
            // promises.push(
            //   methods.call(sBepContract.methods.borrowBalanceCurrent, [
            //     accountAddress
            //   ])
            // );

            // hypotheticalLiquidity
            const totalBalance = await methods.call(
              sBepContract.methods.balanceOf,
              [accountAddress]
            );

            // promises.push(
            //   methods.call(
            //     appContract.methods.getHypotheticalAccountLiquidity,
            //     [accountAddress, asset.stokenAddress, totalBalance, 0]
            //   )
            // );

            // borrowGuardianPaused
            // promises.push(
            //   methods.call(
            //     appContract.methods.borrowGuardianPaused,
            //     [asset.stokenAddress]
            //   )
            // );

            // const [
            //   walletBalance,
            //   allowBalance,
            //   supplyBalance,
            //   borrowBalance,
            //   hypotheticalLiquidity,
            //   borrowGuardianPaused
            // ] = await Promise.all(promises);
            // asset.walletBalance = new BigNumber(walletBalance).div(
            //   new BigNumber(10).pow(tokenDecimal)
            // );

            contractCallContext.push(
              {
                reference: 'supplyBalance',
                contractAddress: sBepContract.options.address,
                abi: sBepContract.options.jsonInterface,
                calls: [
                  {
                    methodName: 'balanceOfUnderlying',
                    methodParameters: [accountAddress]
                  }
                ]
              },
              {
                reference: 'borrowBalance',
                contractAddress: sBepContract.options.address,
                abi: sBepContract.options.jsonInterface,
                calls: [
                  {
                    methodName: 'borrowBalanceCurrent',
                    methodParameters: [accountAddress]
                  }
                ]
              },
              {
                reference: 'hypotheticalLiquidity',
                contractAddress: appContract.options.address,
                abi: appContract.options.jsonInterface,
                calls: [
                  {
                    methodName: 'getHypotheticalAccountLiquidity',
                    methodParameters: [
                      accountAddress,
                      asset.stokenAddress,
                      totalBalance,
                      0
                    ]
                  }
                ]
              },
              {
                reference: 'borrowGuardianPaused',
                contractAddress: appContract.options.address,
                abi: appContract.options.jsonInterface,
                calls: [
                  {
                    methodName: 'borrowGuardianPaused',
                    methodParameters: [asset.stokenAddress]
                  }
                ]
              }
            );

            const results = await multicall.call(contractCallContext);
            // console.log(`${item.id} =`, results);

            let walletBalance = new BigNumber(0);
            let allowBalance = new BigNumber(0);
            const supplyBalance =
              results.results.supplyBalance.callsReturnContext[0]
                .returnValues[0].hex;
            const borrowBalance =
              results.results.borrowBalance.callsReturnContext[0]
                .returnValues[0].hex;
            const hypotheticalLiquidity =
              results.results.hypotheticalLiquidity.callsReturnContext[0]
                .returnValues;
            const borrowGuardianPaused =
              results.results.borrowGuardianPaused.callsReturnContext[0]
                .returnValues[0];

            if (item.id !== 'eth') {
              walletBalance =
                results.results.walletBalance.callsReturnContext[0]
                  .returnValues[0].hex;
              allowBalance =
                results.results.allowBalance.callsReturnContext[0]
                  .returnValues[0].hex;

              asset.walletBalance = new BigNumber(walletBalance).div(
                new BigNumber(10).pow(tokenDecimal)
              );
              asset.isEnabled =
                asset.walletBalance.isGreaterThan(new BigNumber(0)) &&
                new BigNumber(allowBalance)
                  .div(new BigNumber(10).pow(tokenDecimal))
                  .isGreaterThanOrEqualTo(asset.walletBalance);
            } else if (window.ethereum) {
              walletBalance = await window.web3.eth.getBalance(accountAddress);
              asset.walletBalance = new BigNumber(walletBalance).div(
                new BigNumber(10).pow(tokenDecimal)
              );
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

            asset.borrowPaused = borrowGuardianPaused;

            const supplyBalanceUSD = asset.supplyBalance.times(
              asset.tokenPrice
            );
            const borrowBalanceUSD = asset.borrowBalance.times(
              asset.tokenPrice
            );

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

      if (settings.selectedAsset && settings.selectedAsset.id) {
        const info = assetList.find(
          item => item.symbol.toLowerCase() === settings.selectedAsset.id
        );
        setSetting({
          assetList,
          totalLiquidity: totalLiquidity.toString(10),
          totalSupplyBalance: totalSupplyBalance.toString(10),
          totalBorrowBalance: totalBorrowBalance.toString(10),
          totalBorrowLimit: totalBorrowLimit.toString(10),
          selectedAsset: { ...info }
        });
      } else {
        setSetting({
          assetList,
          totalLiquidity: totalLiquidity.toString(10),
          totalSupplyBalance: totalSupplyBalance.toString(10),
          totalBorrowBalance: totalBorrowBalance.toString(10),
          totalBorrowLimit: totalBorrowLimit.toString(10)
        });
      }
      lockFlag = false;
    } catch {
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

            return asset;
          }
        )
      );

      setSetting({
        assetList
      });
      lockFlag = false;
    }
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
    if (!lockFlag && !settings.pendingInfo?.status) {
      updateMarketInfo();
    }
  }, [settings.pendingInfo.status]);

  useEffect(() => {
    if (settings.accountLoading) {
      handleAccountChange();
    }
  }, [settings.accountLoading]);

  useEffect(() => {
    if (settings.selectedAddress) {
      const totalBorrowLimit = getBigNumber(settings.totalBorrowLimit);
      const total = BigNumber.maximum(totalBorrowLimit, 0);
      setAvailable(total.dp(2, 1).toString(10));
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.totalBorrowLimit, settings.selectedAddress]);

  const handleDisconnect = () => {
    localStorage.clear();
    setSetting({
      selectedAddress: null,
      isConnected: false
    });
  };

  useEffect(() => {
    if (!settings.isConnected && location.pathname !== '/history') {
      setIsOpenModal(true);
    }
  }, []);

  const updateBalance = async () => {
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
    }
  };

  useEffect(() => {
    updateBalance();
  }, [settings.selectedAddress]);

  return (
    <SidebarWrapper>
      <TopSidebarWrapper>
        <Logo>
          <NavLink to="/" activeClassName="active">
            <img src={logoImg} alt="logo" className="logo-text" />
          </NavLink>
        </Logo>
        <MobileIcon onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes color="white" /> : <FaBars color="white" />}
        </MobileIcon>
        <div className="right-area">
          {settings.selectedAddress && (
            <UserInfoButton>
              <Button
                className="user-info-btn"
                onClick={() => setIsOpenInfoModal(true)}
              >
                <div>{balance || '0'}</div>
                <img src={`${process.env.PUBLIC_URL}/icon16.png`} alt="" />
              </Button>
            </UserInfoButton>
          )}
          <ConnectButton>
            {settings.selectedAddress ? (
              <Button
                className="connect-btn"
                onClick={() => {
                  setIsOpenAccountModal(true);
                }}
              >
                {`${settings.selectedAddress.substr(
                  0,
                  4
                )}...${settings.selectedAddress.substr(
                  settings.selectedAddress.length - 4,
                  4
                )}`}
              </Button>
            ) : (
              <Button
                className="connect-btn"
                onClick={() => {
                  setIsOpenModal(true);
                }}
              >
                Connect
              </Button>
            )}
          </ConnectButton>
        </div>
      </TopSidebarWrapper>
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
        <NavLink
          className="flex flex-start align-center"
          to="/history"
          activeClassName="active"
        >
          <Label>History</Label>
        </NavLink>
        {!isMenuOpen && width < 1200 && (
          <Dropdown overlay={menu} trigger={['click']}>
            <span className="dropdown-link" onClick={e => e.preventDefault()}>
              Earning <Icon type="down" />
            </span>
          </Dropdown>
        )}
        {(width >= 1200 || isMenuOpen) && (
          <>
            <NavLink
              className="flex flex-start align-center"
              to="/staking"
              activeClassName="active"
            >
              <Label>Staking</Label>
            </NavLink>
            <NavLink
              className="flex flex-start align-center"
              to="/liquidator"
              activeClassName="active"
            >
              <Label>Liquidator</Label>
            </NavLink>
            <NavLink
              className="flex flex-start align-center"
              to="/vault"
              activeClassName="active"
            >
              <Label>DeFi Vault 3.0</Label>
            </NavLink>
          </>
        )}
        {/* {process.env.REACT_APP_ENV === 'dev' && (
          <NavLink
            className="flex flex-start align-center"
            to="/faucet"
            activeClassName="active"
          >
            <Label>Faucet</Label>
          </NavLink>
        )} */}
        <div className="right-area">
          {settings.selectedAddress && (
            <UserInfoButton>
              <Button
                className="user-info-btn"
                onClick={() => setIsOpenInfoModal(true)}
              >
                <div>{balance || '0'}</div>
                <img src={`${process.env.PUBLIC_URL}/icon16.png`} alt="" />
              </Button>
            </UserInfoButton>
          )}
          <ConnectButton>
            {settings.selectedAddress ? (
              <Button
                className="connect-btn"
                onClick={() => {
                  setIsOpenAccountModal(true);
                }}
              >
                {`${settings.selectedAddress.substr(
                  0,
                  4
                )}...${settings.selectedAddress.substr(
                  settings.selectedAddress.length - 4,
                  4
                )}`}
              </Button>
            ) : (
              <Button
                className="connect-btn"
                onClick={() => {
                  setIsOpenModal(true);
                }}
              >
                Connect
              </Button>
            )}
          </ConnectButton>
        </div>
      </MainMenu>
      {isOpenModal && (
        <ConnectModal
          visible={isOpenModal}
          web3={web3}
          error={error}
          awaiting={awaiting}
          onCancel={() => setIsOpenModal(false)}
          onConnectMetaMask={handleMetaMask}
          checkNetwork={checkNetwork}
        />
      )}
      <UserInfoModal
        visible={isOpenInfoModal}
        onCancel={() => setIsOpenInfoModal(false)}
        available={available}
      />
      <AccountModal
        visible={isOpenAccountModal}
        onCancel={() => setIsOpenAccountModal(false)}
        onDisconnect={() => handleDisconnect()}
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
