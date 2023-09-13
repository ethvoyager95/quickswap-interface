import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { NavLink, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { message, Dropdown, Menu, Icon } from 'antd';
import BigNumber from 'bignumber.js';
import Button from '@material-ui/core/Button';
import { FaBars, FaTimes } from 'react-icons/fa';
import {
  getComptrollerContract,
  getSbepContract,
  getTokenContract,
  methods
} from 'utilities/ContractService';

import { useInstance, useMulticall } from 'hooks/useContract';
import { promisify } from 'utilities';
import * as constants from 'utilities/constants';
import UserInfoModal from 'components/Basic/UserInfoModal';
import { Label } from 'components/Basic/Label';
import { connectAccount, accountActionCreators } from 'core';
import logoImg from 'assets/img/logo.png';
import { checkIsValidNetwork, getBigNumber } from 'utilities/common';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { ACCOUNT_MARKET_INFO } from 'apollo/queries';
import { client } from 'apollo/client';
import { ReactComponent as DashboardImg } from 'assets/img/menu-dashboard.svg';
import { ReactComponent as VoteImg } from 'assets/img/menu-vote.svg';
import { ReactComponent as RewardsImg } from 'assets/img/menu-reward.svg';
import { ReactComponent as MarketImg } from 'assets/img/menu-market.svg';
import { ReactComponent as HistoryImg } from 'assets/img/menu-history.svg';
import { ReactComponent as StakingImg } from 'assets/img/menu-staking.svg';
import { ReactComponent as LiquidatorImg } from 'assets/img/menu-liquidator.svg';
import { ReactComponent as VaultImg } from 'assets/img/menu-vault.svg';
import { ReactComponent as AnalyticsImg } from 'assets/img/menu-analytics.svg';
import { ReactComponent as ToolsImg } from 'assets/img/menu-tools.svg';
import ConnectButton from './ConnectButton';

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

      svg path {
        fill: #107def;
      }
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
      padding-left: 35%;
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

      svg path {
        fill: #107def;
      }
    }

    @media only screen and (max-width: 768px) {
      display: flex;
      align-items: center;
      justify-content: left;
      width: 100%;
      margin: 0;
      padding-left: 35%;
    }
  }
  .active {
    span {
      color: var(--color-white);
    }

    svg path {
      fill: #107def;
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

const UserInfoButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 40px;
  padding: 0;

  @media only screen and (max-width: 768px) {
    width: 100%;
    margin: 20px 0 0;
    display: block;
  }

  .user-info-btn {
    padding: 0 8px;
    height: 32px;
    margin-right: 40px;
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

let lockFlag = false;
const abortController = new AbortController();

const menu = (
  <Menu>
    <Menu.Item key="0">
      <NavLink
        className="flex flex-start align-center gap-menu"
        to="/history"
        activeClassName="active"
      >
        <HistoryImg />
        <Label>History</Label>
      </NavLink>
    </Menu.Item>
    <Menu.Item key="1">
      <NavLink
        className="flex flex-start align-center gap-menu"
        to="/liquidator"
        activeClassName="active"
      >
        <LiquidatorImg />
        <Label>Liquidator</Label>
      </NavLink>
    </Menu.Item>
    <Menu.Item key="2">
      <NavLink
        className="flex flex-start align-center gap-menu"
        to="/strk"
        activeClassName="active"
      >
        <RewardsImg />
        <Label>Rewards</Label>
      </NavLink>
    </Menu.Item>
    <Menu.Item key="3">
      <a
        className="flex flex-start align-center gap-menu"
        href="https://dune.com/strike_finance/ethereum-strike-protocol"
        target="_blank"
        rel="noreferrer"
      >
        <AnalyticsImg />
        <Label>Analytics</Label>
      </a>
    </Menu.Item>
  </Menu>
);

function Sidebar({ history, settings, setSetting, getGovernanceStrike }) {
  const instance = useInstance(settings.walletConnected);
  const multicall = useMulticall(instance);
  const [isOpenInfoModal, setIsOpenInfoModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [available, setAvailable] = useState('0');
  const [balance, setBalance] = useState('');
  const { width } = useWindowDimensions();

  const setDecimals = async () => {
    const decimals = {};
    Object.values(constants.CONTRACT_TOKEN_ADDRESS).forEach(async item => {
      decimals[`${item.id}`] = {};
      if (item.id !== 'eth' && item.id !== 'strk') {
        const validNetwork = await checkIsValidNetwork(instance);
        if (validNetwork) {
          const tokenContract = getTokenContract(instance, item.id);
          const tokenDecimals = await methods.call(
            tokenContract.methods.decimals,
            []
          );
          const sBepContract = getSbepContract(instance, item.id);
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
    if (settings.walletConnected) {
      setSetting({
        accountLoading: false
      });
    }
  }, [settings.walletConnected]);

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
      if (!settings.accountLoading /* && checkIsValidNetwork(instance) */) {
        initSettings();
      }
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.accountLoading]);

  useEffect(() => {
    getMarkets();
    const updateTimer = setInterval(async () => {
      const validNetwork = await checkIsValidNetwork(instance);
      if (validNetwork) {
        getMarkets();
      }
    }, 8000);

    return function cleanup() {
      abortController.abort();
      if (updateTimer) {
        clearInterval(updateTimer);
      }
    };
  }, [settings.selectedAddress, settings.accountLoading, instance]);

  const updateMarketInfo = async (
    accountAddress = settings.selectedAddress
  ) => {
    try {
      if (!settings.decimals || !settings.markets) {
        return;
      }
      lockFlag = true;
      const appContract = getComptrollerContract(instance);
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
              return {};
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
            const sBepContract = getSbepContract(instance, item.id);
            asset.collateral = assetsIn.includes(asset.stokenAddress);

            // const promises = [];
            const contractCallContext = [];

            // wallet balance
            if (item.id !== 'eth') {
              const tokenContract = getTokenContract(instance, item.id);
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
            // else if (instance) {
            //   promises.push(instance.eth.getBalance(accountAddress), null);
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
              walletBalance = await instance.eth.getBalance(accountAddress);
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
              return {};
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

  // useEffect(() => {
  //   if (!settings.walletConnected && location.pathname !== '/history') {
  //     setIsOpenModal(true);
  //   }
  // }, []);

  const updateBalance = async () => {
    if (
      window.ethereum &&
      checkIsValidNetwork(instance) &&
      settings.selectedAddress
    ) {
      const strkTokenContract = getTokenContract(instance, 'strk');
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
  }, [settings.selectedAddress, instance]);

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
          <ConnectButton />
        </div>
      </TopSidebarWrapper>
      <MainMenu isMenuOpen={isMenuOpen}>
        <NavLink
          className="flex flex-start align-center gap-menu"
          to="/dashboard"
          activeClassName="active"
        >
          <DashboardImg />
          <Label>Dashboard</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center gap-menu"
          to="/vote"
          activeClassName="active"
        >
          <VoteImg />
          <Label>Vote</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center gap-menu"
          to="/market"
          activeClassName="active"
        >
          <MarketImg />
          <Label>Market</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center gap-menu"
          to="/staking"
          activeClassName="active"
        >
          <StakingImg />
          <Label>Staking</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center gap-menu"
          to="/vault"
          activeClassName="active"
        >
          <VaultImg />
          <Label>DeFi Vault 3.0</Label>
        </NavLink>
        {!isMenuOpen && width < 1330 && (
          <Dropdown overlay={menu} trigger={['click']}>
            <span
              className="flex flex-start align-center gap-menu dropdown-link"
              onClick={e => e.preventDefault()}
            >
              <ToolsImg /> Tools <Icon type="down" />
            </span>
          </Dropdown>
        )}
        {(width >= 1330 || isMenuOpen) && (
          <>
            <NavLink
              className="flex flex-start align-center gap-menu"
              to="/history"
              activeClassName="active"
            >
              <HistoryImg />
              <Label>History</Label>
            </NavLink>

            <NavLink
              className="flex flex-start align-center gap-menu"
              to="/liquidator"
              activeClassName="active"
            >
              <LiquidatorImg />
              <Label>Liquidator</Label>
            </NavLink>
            <NavLink
              className="flex flex-start align-center gap-menu"
              to="/strk"
              activeClassName="active"
            >
              <RewardsImg />
              <Label>Rewards</Label>
            </NavLink>
            <a
              className="flex flex-start align-center gap-menu"
              href="https://dune.com/strike_finance/ethereum-strike-protocol"
              target="_blank"
              rel="noreferrer"
            >
              <AnalyticsImg />
              <Label>Analytics</Label>
            </a>
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
          <ConnectButton />
        </div>
      </MainMenu>
      <UserInfoModal
        visible={isOpenInfoModal}
        onCancel={() => setIsOpenInfoModal(false)}
        available={available}
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
