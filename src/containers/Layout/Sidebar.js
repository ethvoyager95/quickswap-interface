import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { NavLink, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Dropdown, Menu, Icon } from 'antd';
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
import { ReactComponent as DashboardImg } from 'assets/img/menu-dashboard.svg';
import { ReactComponent as VoteImg } from 'assets/img/menu-vote.svg';
import { ReactComponent as RewardsImg } from 'assets/img/menu-reward.svg';
import { ReactComponent as MarketImg } from 'assets/img/menu-market.svg';
import { ReactComponent as HistoryImg } from 'assets/img/menu-history.svg';
import { ReactComponent as StakingImg } from 'assets/img/menu-staking.svg';
import { ReactComponent as LiquidatorImg } from 'assets/img/menu-liquidator.svg';
import { ReactComponent as VaultImg } from 'assets/img/menu-vault.svg';
import { ReactComponent as AnalyticsImg } from 'assets/img/menu-analytics.svg';
import { ReactComponent as StatusImg } from 'assets/img/menu-status.svg';
import { ReactComponent as DiscussionImg } from 'assets/img/menu-discussion.svg';
import { ReactComponent as SnapshotImg } from 'assets/img/menu-snapshot.svg';
import { ReactComponent as ManageImg } from 'assets/img/menu-manage.svg';
import { ReactComponent as MoreImg } from 'assets/img/menu-more.svg';
import { ReactComponent as TelegramImg } from 'assets/img/menu-telegram.svg';
import { ReactComponent as TwitterImg } from 'assets/img/menu-twitter.svg';
import { ReactComponent as MediumImg } from 'assets/img/menu-medium.svg';
import { ReactComponent as DocsImg } from 'assets/img/menu-docs.svg';
import EnImg from 'assets/img/lang/en.png';
import EsImg from 'assets/img/lang/es.png';
import ChImg from 'assets/img/lang/ch.png';
import TrImg from 'assets/img/lang/tr.png';

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

const dao = (
  <Menu>
    <Menu.Item key="0">
      <NavLink
        className="flex flex-start align-center gap-menu"
        to="/vote"
        activeClassName="active"
      >
        <VoteImg />
        <Label>
          <FormattedMessage id="Governance" />
        </Label>
      </NavLink>
    </Menu.Item>
    <Menu.Item key="1">
      <a
        className="flex flex-start align-center gap-menu"
        href="https://community.strike.org/"
        target="_blank"
        rel="noreferrer"
      >
        <DiscussionImg />
        <Label>
          <FormattedMessage id="Discussion" />
        </Label>
      </a>
    </Menu.Item>
    <Menu.Item key="2">
      <a
        className="flex flex-start align-center gap-menu"
        href="https://dao.strike.org"
        target="_blank"
        rel="noreferrer"
      >
        <SnapshotImg style={{ width: '16px', height: '16px' }} />
        <Label>
          <FormattedMessage id="Snapshot" />
        </Label>
      </a>
    </Menu.Item>
  </Menu>
);

const manage = (
  <Menu>
    <Menu.Item key="0">
      <NavLink
        className="flex flex-start align-center gap-menu"
        to="/liquidator"
        activeClassName="active"
      >
        <LiquidatorImg />
        <Label>
          <FormattedMessage id="Liquidator" />
        </Label>
      </NavLink>
    </Menu.Item>
    <Menu.Item key="1">
      <NavLink
        className="flex flex-start align-center gap-menu"
        to="/strk"
        activeClassName="active"
      >
        <RewardsImg />
        <Label>
          <FormattedMessage id="Rewards" />
        </Label>
      </NavLink>
    </Menu.Item>
    {/* <Menu.Item key="2">
      <NavLink
        className="flex flex-start align-center gap-menu"
        to="/marketdeprecated"
        activeClassName="active"
      >
        <MarketDeprecatedImg />
        <Label>Deprecated Market</Label>
      </NavLink>
    </Menu.Item> */}
  </Menu>
);

const more = (
  <Menu>
    {/* <Menu.Item key="0">
      <NavLink
        className="flex flex-start align-center gap-menu"
        to="/history"
        activeClassName="active"
      >
        <HistoryImg />
        <Label>History</Label>
      </NavLink>
    </Menu.Item> */}

    {/* <Menu.Item key="2">
      <NavLink
        className="flex flex-start align-center gap-menu"
        to="/strk"
        activeClassName="active"
      >
        <RewardsImg />
        <Label>Rewards</Label>
      </NavLink>
    </Menu.Item> */}
    <Menu.Item key="1">
      <a
        className="flex flex-start align-center gap-menu"
        href="https://dune.com/strike_finance/ethereum-strike-protocol"
        target="_blank"
        rel="noreferrer"
      >
        <AnalyticsImg />
        <Label>
          <FormattedMessage id="Analytics" />
        </Label>
      </a>
    </Menu.Item>
    <Menu.Item key="2">
      <a
        className="flex flex-start align-center gap-menu"
        href="https://status.strike.org"
        target="_blank"
        rel="noreferrer"
      >
        <StatusImg />
        <Label>
          <FormattedMessage id="Status" />
        </Label>
      </a>
    </Menu.Item>
    <Menu.Item key="3">
      <a
        className="flex flex-start align-center gap-menu"
        href="https://docs.strike.org"
        target="_blank"
        rel="noreferrer"
      >
        <DocsImg />
        <Label>
          <FormattedMessage id="Docs" />
        </Label>
      </a>
    </Menu.Item>
    <Menu.Item key="4">
      <a
        className="flex flex-start align-center gap-menu"
        href="https://twitter.com/StrikeFinance"
        target="_blank"
        rel="noreferrer"
      >
        <TwitterImg />
        <Label>
          <FormattedMessage id="Twitter" />
        </Label>
      </a>
    </Menu.Item>
    <Menu.Item key="5">
      <a
        className="flex flex-start align-center gap-menu"
        href="https://t.me/StrikeFinance"
        target="_blank"
        rel="noreferrer"
      >
        <TelegramImg />
        <Label>
          <FormattedMessage id="Telegram" />
        </Label>
      </a>
    </Menu.Item>
    <Menu.Item key="6">
      <a
        className="flex flex-start align-center gap-menu"
        href="https://strike-finance.medium.com"
        target="_blank"
        rel="noreferrer"
      >
        <MediumImg />
        <Label>
          <FormattedMessage id="Medium" />
        </Label>
      </a>
    </Menu.Item>
  </Menu>
);

const languages = [
  { id: 'en', label: <FormattedMessage id="English" />, icon: EnImg },
  { id: 'es', label: <FormattedMessage id="Spanish" />, icon: EsImg },
  { id: 'zh', label: <FormattedMessage id="Chinese" />, icon: ChImg },
  { id: 'tr', label: <FormattedMessage id="Turkish" />, icon: TrImg }
];

function Sidebar({ history, settings, setSetting, getGovernanceStrike }) {
  const lang = localStorage.getItem('language') || 'en';
  const instance = useInstance(settings.walletConnected);
  const multicall = useMulticall(instance);
  const [isOpenInfoModal, setIsOpenInfoModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpenDaoMenu, setIsOpenDaoMenu] = useState(false);
  const [isOpenManageMenu, setIsOpenManageMenu] = useState(false);
  const [isOpenMoreMenu, setIsOpenMoreMenu] = useState(false);
  const [isOpenLangMenu, setIsOpenLangMenu] = useState(false);

  const dropdownRef = useRef(null);

  const [available, setAvailable] = useState('0');
  const [balance, setBalance] = useState('');
  const { width } = useWindowDimensions();

  const selectedLan = useMemo(() => {
    return languages.find(e => e.id === lang) || languages[0];
  }, [lang, languages]);

  const languageItems = useMemo(() => {
    return (
      <Menu>
        {languages.map((item, index) => (
          <Menu.Item key={index}>
            <div
              className="flex flex-start align-center gap-menu"
              style={item.id === lang ? { cursor: 'not-allowed' } : {}}
              onClick={() => {
                if (item.id !== lang) {
                  localStorage.setItem('language', item.id);
                  // eslint-disable-next-line valid-typeof
                  if (typeof window !== undefined) {
                    setTimeout(() => {
                      window.location.reload();
                    }, 500);
                  }
                }
              }}
            >
              <img src={item.icon} alt="lang" />
              <Label>{item.label}</Label>
            </div>
          </Menu.Item>
        ))}
      </Menu>
    );
  }, [languages]);

  const setDecimals = async () => {
    const decimals = {};
    const validNetwork = await checkIsValidNetwork(instance);
    Object.values(constants.CONTRACT_TOKEN_ADDRESS).forEach(async item => {
      decimals[`${item.id}`] = {};
      if (item.id !== 'eth' && item.id !== 'strk') {
        if (validNetwork) {
          // const tokenContract = getTokenContract(instance, item.id);
          // const tokenDecimals = await methods.call(
          //   tokenContract.methods.decimals,
          //   []
          // );
          const tokenDecimals = item.decimals;
          // const sBepContract = getSbepContract(instance, item.id);
          // const stokenDecimals = await methods.call(
          //   sBepContract.methods.decimals,
          //   []
          // );
          const stokenDecimals = 8;
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
    decimals.mantissa = 18;
    decimals.comptroller = 18;
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

  const getMarkets = async () => {
    const res = await promisify(getGovernanceStrike, {});
    if (!res.status) {
      return;
    }
    setSetting({
      markets: [...res.data.markets],
      marketVolumeLog: res.data.marketVolumeLog,
      dailyStrike: res.data.dailyStrike,
      reserves: res.data.reserves
    });
  };

  useEffect(() => {
    initSettings();

    return function cleanup() {
      abortController.abort();
    };
  }, [settings.selectedAddress]);

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
  }, [settings.selectedAddress, instance]);

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

      const assetsIn =
        (accountAddress &&
          (await methods.call(appContract.methods.getAssetsIn, [
            accountAddress
          ]))) ||
        [];
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
              allowBalance: new BigNumber(0),
              collateral: false,
              percentOfLimit: '0',
              borrowPaused: true,
              deprecated: market.deprecated
            };
            if (accountAddress) {
              const tokenDecimal = settings.decimals[item.id].token || 18;
              const sBepContract = getSbepContract(instance, item.id);

              asset.collateral = assetsIn.includes(asset.stokenAddress);

              // const promises = [];
              const contractCallContext = [];

              // wallet balance
              if (item.id !== 'eth') {
                const tokenContract = getTokenContract(instance, item.id);
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

              // hypotheticalLiquidity
              const totalBalance = await methods.call(
                sBepContract.methods.balanceOf,
                [accountAddress]
              );

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
                asset.allowBalance = new BigNumber(allowBalance).div(
                  new BigNumber(10).pow(tokenDecimal)
                );
              } else if (window.ethereum) {
                walletBalance = await instance.eth.getBalance(accountAddress);
                asset.walletBalance = new BigNumber(walletBalance).div(
                  new BigNumber(10).pow(tokenDecimal)
                );
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
            }

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
              allowBalance: new BigNumber(0),
              collateral: false,
              percentOfLimit: '0'
            };

            return asset;
          }
        )
      );

      setSetting({
        assetList,
        totalLiquidity: '-',
        totalSupplyBalance: '0',
        totalBorrowBalance: '0',
        totalBorrowLimit: '0'
      });
      lockFlag = false;
    }
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
    updateMarketInfo();
  }, [settings.selectedAddress]);

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

  useEffect(() => {
    const wheelHandler = event => {
      if (
        isOpenDaoMenu ||
        isOpenManageMenu ||
        isOpenMoreMenu ||
        isOpenLangMenu
      ) {
        event.preventDefault();
      }
    };
    const handleOutsideClick = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenDaoMenu(false);
        setIsOpenManageMenu(false);
        setIsOpenMoreMenu(false);
        setIsOpenLangMenu(false);
      }
    };
    document.addEventListener('wheel', wheelHandler, { passive: false });
    document.addEventListener('click', handleOutsideClick);

    // Cleanup function
    return () => {
      document.removeEventListener('wheel', wheelHandler);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpenDaoMenu, isOpenManageMenu, isOpenMoreMenu, isOpenLangMenu]);

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
      <MainMenu isMenuOpen={isMenuOpen} ref={dropdownRef}>
        <NavLink
          className="flex flex-start align-center gap-menu"
          to="/dashboard"
          activeClassName="active"
        >
          <DashboardImg />
          <Label>
            <FormattedMessage id="Dashboard" />
          </Label>
        </NavLink>
        {!isMenuOpen && width >= 768 && (
          <Dropdown overlay={dao} trigger={['click']}>
            <span
              className="flex flex-start align-center gap-menu dropdown-link"
              onClick={e => {
                e.preventDefault();
                setIsOpenDaoMenu(!isOpenDaoMenu);
              }}
            >
              <VoteImg /> <FormattedMessage id="DAO" /> <Icon type="down" />{' '}
              &nbsp;
            </span>
          </Dropdown>
        )}
        {(width < 768 || isMenuOpen) && (
          <>
            <NavLink
              className="flex flex-start align-center gap-menu"
              to="/vote"
              activeClassName="active"
            >
              <VoteImg />
              <Label>
                <FormattedMessage id="Governance" />
              </Label>
            </NavLink>
            <a
              className="flex flex-start align-center gap-menu"
              href="https://community.strike.org/"
              target="_blank"
              rel="noreferrer"
            >
              <DiscussionImg />
              <Label>
                <FormattedMessage id="Discussion" />
              </Label>
            </a>
            <a
              className="flex flex-start align-center gap-menu"
              href="https://dao.strike.org"
              target="_blank"
              rel="noreferrer"
            >
              <SnapshotImg style={{ width: '16px', height: '16px' }} />
              <Label>
                <FormattedMessage id="Snapshot" />
              </Label>
            </a>
          </>
        )}
        <NavLink
          className="flex flex-start align-center gap-menu"
          to="/market"
          activeClassName="active"
        >
          <MarketImg />
          <Label>
            <FormattedMessage id="Market" />
          </Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center gap-menu"
          to="/staking"
          activeClassName="active"
        >
          <StakingImg />
          <Label>
            <FormattedMessage id="Staking" />
          </Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center gap-menu"
          to="/vault"
          activeClassName="active"
        >
          <VaultImg />
          <Label>
            <FormattedMessage id="DeFi_Vault_3" />
          </Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center gap-menu"
          to="/history"
          activeClassName="active"
        >
          <HistoryImg />
          <Label>
            <FormattedMessage id="History" />
          </Label>
        </NavLink>

        {!isMenuOpen && width >= 768 && (
          <Dropdown overlay={manage} trigger={['click']}>
            <span
              className="flex flex-start align-center gap-menu dropdown-link"
              onClick={e => {
                e.preventDefault();
                setIsOpenManageMenu(!isOpenManageMenu);
              }}
            >
              <ManageImg /> <FormattedMessage id="Manage" />{' '}
              <Icon type="down" /> &nbsp;
            </span>
          </Dropdown>
        )}
        {(width < 768 || isMenuOpen) && (
          <>
            <NavLink
              className="flex flex-start align-center gap-menu"
              to="/liquidator"
              activeClassName="active"
            >
              <LiquidatorImg />
              <Label>
                <FormattedMessage id="Liquidator" />
              </Label>
            </NavLink>
            <NavLink
              className="flex flex-start align-center gap-menu"
              to="/strk"
              activeClassName="active"
            >
              <RewardsImg />
              <Label>
                <FormattedMessage id="Rewards" />
              </Label>
            </NavLink>
            {/* <NavLink
              className="flex flex-start align-center gap-menu"
              to="/marketdeprecated"
              activeClassName="active"
            >
              <MarketDeprecatedImg />
              <Label>Deprecated Market</Label>
            </NavLink> */}
          </>
        )}

        {!isMenuOpen && width >= 768 && (
          <Dropdown overlay={more} trigger={['click']}>
            <span
              className="flex flex-start align-center gap-menu dropdown-link"
              onClick={e => {
                e.preventDefault();
                setIsOpenMoreMenu(!isOpenMoreMenu);
              }}
            >
              <MoreImg /> <FormattedMessage id="More" /> <Icon type="down" />{' '}
              &nbsp;
            </span>
          </Dropdown>
        )}
        {(width < 768 || isMenuOpen) && (
          <>
            <a
              className="flex flex-start align-center gap-menu"
              href="https://dune.com/strike_finance/ethereum-strike-protocol"
              target="_blank"
              rel="noreferrer"
            >
              <AnalyticsImg />
              <Label>
                <FormattedMessage id="Analytics" />
              </Label>
            </a>

            <a
              className="flex flex-start align-center gap-menu"
              href="https://status.strike.org"
              target="_blank"
              rel="noreferrer"
            >
              <StatusImg />
              <Label>
                <FormattedMessage id="Status" />
              </Label>
            </a>
            <a
              className="flex flex-start align-center gap-menu"
              href="https://docs.strike.org"
              target="_blank"
              rel="noreferrer"
            >
              <DocsImg />
              <Label>
                <FormattedMessage id="Docs" />
              </Label>
            </a>
            <a
              className="flex flex-start align-center gap-menu"
              href="https://twitter.com/StrikeFinance"
              target="_blank"
              rel="noreferrer"
            >
              <TwitterImg />
              <Label>
                <FormattedMessage id="Twitter" />
              </Label>
            </a>
            <a
              className="flex flex-start align-center gap-menu"
              href="https://t.me/StrikeFinance"
              target="_blank"
              rel="noreferrer"
            >
              <TelegramImg />
              <Label>
                <FormattedMessage id="Telegram" />
              </Label>
            </a>
            <a
              className="flex flex-start align-center gap-menu"
              href="https://strike-finance.medium.com"
              target="_blank"
              rel="noreferrer"
            >
              <MediumImg />
              <Label>
                <FormattedMessage id="Medium" />
              </Label>
            </a>
          </>
        )}
        {!isMenuOpen && width >= 768 && (
          <Dropdown overlay={languageItems} trigger={['click']}>
            <span
              className="flex flex-start align-center gap-menu dropdown-link"
              onClick={e => {
                e.preventDefault();
                setIsOpenLangMenu(!isOpenLangMenu);
              }}
            >
              <img src={selectedLan.icon} alt="lang" /> {selectedLan.label}{' '}
              <Icon type="down" />
            </span>
          </Dropdown>
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
      {isOpenInfoModal && (
        <UserInfoModal
          visible={isOpenInfoModal}
          onCancel={() => setIsOpenInfoModal(false)}
          available={available}
        />
      )}
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
