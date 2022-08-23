/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import * as constants from 'utilities/constants';
import { liquidateBorrow } from 'utilities/EthContract';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import MainLayout from 'containers/Layout/MainLayout';
import { connectAccount, accountActionCreators } from 'core';
import { Input, Button, Dropdown } from 'antd';
import iconSearch from 'assets/img/liquidator-search.svg';
// import iconFilter from 'assets/img/liquidator-filter.svg';
import noData from 'assets/img/no_data.svg';
import iconDropdown from 'assets/img/icon-dropdown.svg';
import {
  getSbepContract,
  getTokenContract,
  methods
} from 'utilities/ContractService';
import ModalLiquidations from './ModalLiquidations';
import ModalLoading from './ModalLoading';
import {
  STable,
  THeadWrapper,
  Health,
  Address,
  TdWithImg,
  SearchBar,
  WalletInfo,
  BlockLabel,
  DropdownAsset,
  SButton,
  STableWrapper,
  SeizedAndRepay,
  NoData
} from './style';
import {
  formatUsersRecord,
  formatUserInfo,
  renderLogo,
  formatNumber,
  calculateSeizeAmount
} from './helper';

BigNumber.config({ DECIMAL_PLACES: 100 });

function Liquidator({ settings, setSetting }) {
  const abortController = new AbortController();
  const [userAddressInput, setUserAddressInput] = useState('');
  const [selectedUserAddress, setSelectedUserAddress] = useState('');
  const [mess, setMess] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [visibleDropdownRepay, setVisibleDropdownRepay] = useState(false);
  const [visibleDropdownSeize, setVisibleDropdownSeize] = useState(false);
  const [listRepay, setListRepay] = useState([]);
  const [listSeize, setListSeize] = useState([]);
  const [selectedAssetRepay, setSelectedAssetRepay] = useState('');
  const [selectedAssetSeize, setSelectedAssetSeize] = useState('');
  const [repayValue, setRepayValue] = useState('');
  const [balanceSelectedRepay, setBalanceSelectedRepay] = useState('');
  const [repayAmount, setRepayAmount] = useState({
    toEth: '',
    toUsd: ''
  });
  const [seizeAmount, setSeizeAmount] = useState('');
  const [errMess, setErrMess] = useState('');
  const [dataUsersTable, setDataUsersTable] = useState([]);
  const [isOpenModalLoading, setIsOpenModalLoading] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [blockNumber, setBlockNumber] = useState();
  const [isApprove, setIsApprove] = useState(false);
  const [action, setAction] = useState('');
  const [typeModal, setTypeModal] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  const handleInputAddressChange = value => {
    const nonSpaceDigitsRegex = /^\S*$/;
    if (!nonSpaceDigitsRegex.test(value)) {
      return;
    }
    if (value) {
      setUserAddressInput(value);
    } else {
      setUserAddressInput('');
    }
  };

  const handleSearchUserAddress = () => {
    setSelectedUserAddress(userAddressInput);
  };

  const handleInputAmountChange = value => {
    const numberDigitsRegex = /^\d*(\.\d{0,18})?$/g;
    if (!numberDigitsRegex.test(value)) {
      return;
    }
    if (value && userInfo) {
      setRepayValue(value);
    }
    if (!value) {
      setRepayValue('');
    }
  };

  const handleClickMaxBtn = () => {
    const balanceBigNumber = new BigNumber(balanceSelectedRepay);
    const maxRepayBigNumber = new BigNumber(userInfo.maxRepayAmountEther);

    if (balanceBigNumber.gt(maxRepayBigNumber)) {
      setRepayValue(maxRepayBigNumber.toString(10));
      const repayInfo = {
        toEth: formatNumber(userInfo.maxRepayAmountEther),
        toUsd: formatNumber(
          userInfo.maxRepayAmountEther * userInfo.borrowTokenPrice
        )
      };
      setRepayAmount(repayInfo);
      setSeizeAmount(
        formatNumber(
          calculateSeizeAmount(
            userInfo.maxRepayAmountEther,
            userInfo.decimalBorrowToken,
            userInfo.decimalSeizeToken,
            userInfo.underlyingPriceBorrowToken,
            userInfo.underlyingPriceSeizeToken,
            userInfo.exchangeRateSeizeToken
          )
        )
      );
    } else {
      setRepayValue(formatNumber(balanceSelectedRepay));
      const repayInfo = {
        toEth: formatNumber(balanceSelectedRepay),
        toUsd: formatNumber(balanceSelectedRepay * userInfo.borrowTokenPrice)
      };
      setRepayAmount(repayInfo);
      setSeizeAmount(
        formatNumber(
          calculateSeizeAmount(
            balanceSelectedRepay,
            userInfo.decimalBorrowToken,
            userInfo.decimalSeizeToken,
            userInfo.underlyingPriceBorrowToken,
            userInfo.underlyingPriceSeizeToken,
            userInfo.exchangeRateSeizeToken
          )
        )
      );
    }
  };

  const getDataUsers = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_ENV === 'dev'
        ? `${process.env.REACT_APP_DEVELOPMENT_API}`
        : `${process.env.REACT_APP_PRODUCTION_API}`
      }/get_liquidators`,
      {
        params: {}
      }
    );
    const { data } = res.data;
    return data;
  };

  const getDataUsersAssets = async (userAddress) => {
    const res = await axios.get(
      `${process.env.REACT_APP_ENV === 'dev'
        ? `${process.env.REACT_APP_DEVELOPMENT_API}`
        : `${process.env.REACT_APP_PRODUCTION_API}`
      }/get_liquidator`,
      {
        params: {
          account: userAddress
        }
      }
    );
    const { data } = res.data;
    return data;
  };

  const getDataUsersDetail = async (userAddress, borrowToken, seizeToken) => {
    const res = await axios.get(
      `${process.env.REACT_APP_ENV === 'dev'
        ? `${process.env.REACT_APP_DEVELOPMENT_API}`
        : `${process.env.REACT_APP_PRODUCTION_API}`
      }/get_liquidator_detail`,
      {
        params: {
          account: userAddress || undefined,
          repayAsset: borrowToken || undefined,
          seizeAsset: seizeToken || undefined
        }
      }
    );
    const { data } = res.data;
    return data;
  };

  const getCurrentBlock = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_ENV === 'dev'
        ? `${process.env.REACT_APP_DEVELOPMENT_API}`
        : `${process.env.REACT_APP_PRODUCTION_API}`
      }/liquidator/block_number`
    );
    setBlockNumber(res.data.blockNumber);
  };

  const getDataTableUsers = async () => {
    const dataUsers = await getDataUsers();
    setDataUsersTable(formatUsersRecord(dataUsers.result));
  };

  const getUserInfo = async (address, borrowToken, seizeToken) => {
    if (Web3.utils.isAddress(selectedUserAddress)) {
      const dataUser = await getDataUsersDetail(address, borrowToken, seizeToken);
      if (dataUser) {
        setUserInfo(formatUserInfo(dataUser));
      } else {
        setUserInfo({});
      }
    } else {
      setUserInfo({});
    }
  };

  const getBalance = () => {
    if (settings.selectedAddress) {
      const selectedMarket = settings.assetList.filter(el => {
        return el.id === selectedAssetRepay.toLowerCase();
      });
      const balance = selectedMarket[0].walletBalance;
      if (balance) {
        setBalanceSelectedRepay(balance.toString(10));
      } else {
        setBalanceSelectedRepay('0');
      }
    } else {
      setBalanceSelectedRepay('0');
    }
  };

  const checkApprove = async () => {
    if (selectedAssetRepay.toLowerCase() !== 'eth') {
      if (settings.selectedAddress) {
        const tokenContract = getTokenContract(
          selectedAssetRepay.toLowerCase()
        );
        const approved = await methods.call(tokenContract.methods.allowance, [
          settings.selectedAddress,
          constants.CONTRACT_SBEP_ADDRESS[selectedAssetRepay.toLowerCase()]
            .address
        ]);
        if (+approved === 0) {
          setIsApprove(false);
        } else {
          setIsApprove(true);
        }
      } else {
        setIsApprove(false);
      }
    } else {
      setIsApprove(true);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoadingInfo(true);
      await getUserInfo(
        selectedUserAddress,
        selectedAssetRepay,
        selectedAssetSeize
      );
      getBalance();
      await checkApprove();
      setIsLoadingInfo(false);
    } catch (err) {
      setIsLoadingInfo(false);
    }
  };

  const handleCancel = () => {
    setIsOpenModal(false);
  };

  const handleCancelModalLoading = () => {
    setIsOpenModalLoading(false);
  };

  const handleVisibleDropdownRepayChange = flag => {
    setVisibleDropdownRepay(flag);
  };

  const handleVisibleDropdownSeizeChange = flag => {
    setVisibleDropdownSeize(flag);
  };

  const handleApprove = async () => {
    try {
      setTypeModal('loading');
      setIsOpenModalLoading(true);
      setAction('Approve');
      const tokenContract = getTokenContract(selectedAssetRepay.toLowerCase());
      await methods.send(
        tokenContract.methods.approve,
        [
          constants.CONTRACT_SBEP_ADDRESS[selectedAssetRepay.toLowerCase()]
            .address,
          new BigNumber(2)
            .pow(256)
            .minus(1)
            .toString(10)
        ],
        settings.selectedAddress
      );
      setIsOpenModalLoading(false);
      setIsApprove(true);
    } catch (err) {
      console.error(err);
      setIsOpenModalLoading(false);
    }
  };

  const handleLiquidate = async () => {
    try {
      setTypeModal('loading');
      const tokenContract = selectedAssetRepay === 'ETH' ? null : getTokenContract(selectedAssetRepay.toLowerCase());
      const sbepContract = getSbepContract(selectedAssetRepay.toLowerCase());
      setIsOpenModalLoading(true);
      setAction('Liquidating');
      const decimals = selectedAssetRepay === 'ETH' ? 18 : await methods.call(tokenContract.methods.decimals, []);
      const resLiquidate = selectedAssetRepay === 'ETH' ? await liquidateBorrow(settings.selectedAddress,
        selectedUserAddress,
        constants.CONTRACT_SBEP_ADDRESS[selectedAssetSeize.toLowerCase()].address,
        new BigNumber(+repayValue)
          .times(new BigNumber(10).pow(decimals))
          .integerValue()
          .toString(10)) : await methods.send(
            sbepContract.methods.liquidateBorrow,
            [
              selectedUserAddress,
              new BigNumber(+repayValue)
                .times(new BigNumber(10).pow(decimals))
                .integerValue()
                .toString(10),
              constants.CONTRACT_SBEP_ADDRESS[selectedAssetSeize.toLowerCase()].address
            ],
            settings.selectedAddress
          );

      if (resLiquidate.status) {
        setTypeModal('transaction success');
        setRepayValue('');

        const res = await axios.get(
          `${process.env.REACT_APP_ENV === 'dev'
            ? `${process.env.REACT_APP_DEVELOPMENT_API}`
            : `${process.env.REACT_APP_PRODUCTION_API}`
          }/liquidated`,
          {
            params: {
              account: selectedUserAddress
            }
          }
        );
        getDataTableUsers();
        getCurrentBlock();
      } else {
        setTypeModal('transaction fail');
      }
      setTransactionHash(resLiquidate.transactionHash);
    } catch (err) {
      console.error(err);
      if (err.code === 4001) {
        setTypeModal('reject');
      } else {
        setTypeModal('other error');
      }
    }
  };

  const disableBtnLiquidate = useMemo(() => {
    if (settings.selectedAddress && userInfo.account) {
      const checkAddress =
        settings.selectedAddress.toLowerCase() ===
        userInfo.account.toLowerCase();
      return checkAddress;
    }
    return false;
  }, [settings.selectedAddress, userInfo.account, window.ethereum]);

  useEffect(() => {
    if (!settings.selectedAddress) {
      return;
    }
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', acc => {
        setSetting({
          selectedAddress: acc[0],
          accountLoading: true
        });
      });
    }
  }, [window.ethereum, settings.selectedAddress]);

  useEffect(() => {
    getDataTableUsers();
    getCurrentBlock();
    const updateTimer = setInterval(() => {
      getDataTableUsers();
      getCurrentBlock();
    }, 10000);

    return function cleanup() {
      abortController.abort();
      if (updateTimer) {
        clearInterval(updateTimer);
      }
    };
  }, []);

  useEffect(() => {
    const balanceBigNumber = new BigNumber(balanceSelectedRepay);
    const repayValueBigNumber = new BigNumber(repayValue);
    const maxRepayBigNumber = new BigNumber(userInfo.maxRepayAmountEther);

    if (repayValueBigNumber.gt(balanceBigNumber)) {
      setErrMess(
        'You have input the number higher than your balance. Try again'
      );
    } else if (repayValueBigNumber.gt(maxRepayBigNumber)) {
      setErrMess(
        'You have input the number higher than max repay amount. Try again'
      );
    } else {
      setErrMess('');
    }
  }, [
    settings.selectedAddress,
    repayValue,
    repayAmount,
    seizeAmount,
    balanceSelectedRepay,
    userInfo
  ]);

  useEffect(() => {
    const repayInfo = {
      toEth: formatNumber(repayValue),
      toUsd: formatNumber(repayValue * userInfo.borrowTokenPrice)
    };
    setRepayAmount(repayInfo);
    setSeizeAmount(
      formatNumber(
        calculateSeizeAmount(
          repayValue,
          userInfo.decimalBorrowToken,
          userInfo.decimalSeizeToken,
          userInfo.underlyingPriceBorrowToken,
          userInfo.underlyingPriceSeizeToken,
          userInfo.exchangeRateSeizeToken
        )
      )
    );
  }, [repayValue, userInfo]);

  useEffect(() => {
    let updateTimer;
    if (selectedUserAddress) {
      getUserInfo(selectedUserAddress, selectedAssetRepay, selectedAssetSeize);
      updateTimer = setInterval(() => {
        getUserInfo(
          selectedUserAddress,
          selectedAssetRepay,
          selectedAssetSeize
        );
      }, 5000);
    } else {
      setUserInfo({});
    }

    return function cleanup() {
      abortController.abort();
      if (updateTimer) {
        clearInterval(updateTimer);
      }
    };
  }, [selectedUserAddress, selectedAssetRepay, selectedAssetSeize]);

  useEffect(() => {
    if (Web3.utils.isAddress(selectedUserAddress)) {
      if (!userInfo.account) {
        setMess('');
      }
      if (+userInfo.accHealth > 1) {
        setMess('This account is healthy and can not be liquidated');
      }
      if (+userInfo.accHealth <= 1) {
        setMess('This account can be liquidated');
      }
    } else {
      setMess('Please input a valid address');
    }
  }, [selectedUserAddress, userInfo]);

  useEffect(() => {
    async function getAsset() {
      const dataAsset = await getDataUsersAssets(selectedUserAddress);
      setListRepay(dataAsset.repayAssets);
      setListSeize(dataAsset.seizeAssets);
      setSelectedAssetRepay(dataAsset.repayAssets[0]);
      setSelectedAssetSeize(dataAsset.seizeAssets[0]);
    }
    if (selectedUserAddress) {
      getAsset();
    }
  }, [selectedUserAddress]);

  useEffect(() => {
    if (selectedUserAddress && selectedAssetRepay) {
      getBalance();
      checkApprove();
    }
  }, [
    selectedAssetRepay,
    settings.selectedAddress,
    settings.accountLoading,
    settings.markets
  ]);

  const dropdownAssetRepay = (
    <DropdownAsset>
      {listRepay?.map(token => (
        <div
          key={token}
          onClick={() => {
            setSelectedAssetRepay(token);
            setVisibleDropdownRepay(false);
          }}
        >
          <img src={renderLogo(token)} alt="" />
          <span>{token}</span>
        </div>
      ))}
    </DropdownAsset>
  );

  const dropdownAssetSeize = (
    <DropdownAsset>
      {listSeize?.map(token => (
        <div
          key={token}
          onClick={() => {
            setSelectedAssetSeize(token);
            setVisibleDropdownSeize(false);
          }}
        >
          <img src={renderLogo(token)} alt="" />
          <span>{token}</span>
        </div>
      ))}
    </DropdownAsset>
  );

  const columns = [
    {
      title: () => <THeadWrapper>Health</THeadWrapper>,
      dataIndex: 'accHealth',
      key: 'accHealth',
      render(_, asset) {
        return {
          children: (
            <Health health={asset.accHealth}>{asset.accHealth || '-'}</Health>
          )
        };
      }
    },
    {
      title: () => <THeadWrapper>Account</THeadWrapper>,
      dataIndex: 'account',
      key: 'account',
      render(_, asset) {
        return {
          children: (
            <a href={`${process.env.REACT_APP_ETH_EXPLORER}/address/${asset.account}`} target='_blank'>
              <Address>
                {asset.account
                  ? `${asset.account.substr(
                    0,
                    4
                  )}...${asset.account.substr(
                    asset.account.length - 4,
                    4
                  )}`
                  : '-'}
              </Address>
            </a>
          )
        };
      }
    },
    {
      title: () => <THeadWrapper>Asset To Repay</THeadWrapper>,
      dataIndex: 'repay',
      key: 'repay',
      render(_, asset) {
        return {
          children: (
            <TdWithImg>
              <img src={asset.logoRepay} alt="" />
              <div>{asset.assetToRepay}</div>
            </TdWithImg>
          )
        };
      }
    },
    {
      title: () => (
        <THeadWrapper>
          <div>Max Repay Amount</div>
        </THeadWrapper>
      ),
      dataIndex: 'maxRepay',
      key: 'maxRepay',
      render(_, asset) {
        return {
          children: (
            <SeizedAndRepay>
              {asset.logoRepay && <img src={asset.logoRepay} alt="" />}
              <div>
                <span className="black">
                  {formatNumber(asset.maxRepayAmountEther)}{' '}
                  {asset.assetToRepay}
                </span>
                <span className="gray">${asset.maxRepayAmountUsd}</span>
              </div>
            </SeizedAndRepay>
          )
        };
      }
    },
    {
      title: () => <THeadWrapper>Asset To Seize</THeadWrapper>,
      dataIndex: 'seize',
      key: 'seize',
      render(_, asset) {
        return {
          children: (
            <TdWithImg>
              <img src={asset.logoSeize} alt="" />
              <div>{asset.assetToSeize}</div>
            </TdWithImg>
          )
        };
      }
    },
    {
      title: () => <THeadWrapper>Max Seize Amount</THeadWrapper>,
      dataIndex: 'maxSeize',
      key: 'maxSeize',
      render(_, asset) {
        return {
          children: (
            <SeizedAndRepay>
              {asset.logoSeize && <img src={asset.logoSeize} alt="" />}
              <div>
                <span className="black">
                  {formatNumber(asset.maxSeizeAmountEther)}{' '}
                  {asset.assetToSeize}
                </span>
              </div>
            </SeizedAndRepay>
          )
        };
      }
    }
  ];

  const locale = {
    emptyText: (
      <NoData>
        <>
          <img src={noData} alt="No data" />
          <div>No record was found </div>
        </>
      </NoData>
    )
  };

  return (
    <MainLayout>
      <SearchBar>
        <div className="label">Search address to liquidate</div>
        <div className="address">
          <div className="text-input">
            <Input
              placeholder="E.g 0xbfr2zs203..."
              value={userAddressInput}
              onChange={e => handleInputAddressChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearchUserAddress()}
            />
            <Button className="search-btn" onClick={handleSearchUserAddress}>
              <img src={iconSearch} alt="" />
            </Button>
          </div>
          <Button
            className="recent-btn"
            onClick={e => {
              e.currentTarget.blur();
              setIsOpenModal(true);
            }}
          >
            Recent Liquidations
          </Button>
        </div>
        <div className="address">
          <div
            className={`${mess === 'This account can be liquidated' ? 'text-green' : ''
              } message`}
          >
            {mess && selectedUserAddress ? mess : null}
          </div>
          {selectedUserAddress && Web3.utils.isAddress(selectedUserAddress) && (
            <div className="refresh" onClick={handleRefresh}>
              Refresh
            </div>
          )}
        </div>
        <Button
          className="recent-btn-mob"
          onClick={e => {
            e.currentTarget.blur();
            setIsOpenModal(true);
          }}
        >
          Recent Liquidations
        </Button>
      </SearchBar>
      <WalletInfo>
        <div className="details">
          <div className="item">
            <div>Account Health</div>
            <div
              className={`${!userInfo.accHealth ? 'gray-value' : ''} ${userInfo.accHealth < 1 ? 'red-value' : ''
                } ${userInfo.accHealth >= 1 ? 'green-value' : ''}`}
            >
              {isLoadingInfo ? '-' : userInfo.accHealth || '-'}
            </div>
          </div>
          <div className="item">
            <div>Asset to Repay</div>
            {isLoadingInfo ? (
              <div>-</div>
            ) : userInfo.repayAsset ? (
              <Dropdown
                overlay={dropdownAssetRepay}
                trigger={['click']}
                onVisibleChange={handleVisibleDropdownRepayChange}
                visible={visibleDropdownRepay}
                getPopupContainer={() => document.getElementById('repay')}
                placement="bottomRight"
              >
                <SButton
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  <div className="black-value flex-gap6" id="repay">
                    <img
                      src={
                        renderLogo(selectedAssetRepay) ||
                        renderLogo(userInfo.repayAsset)
                      }
                      alt=""
                    />
                    <div>
                      {selectedAssetRepay || userInfo.repayAsset}
                    </div>
                    <img src={iconDropdown} alt="" className="dropdown" />
                  </div>
                </SButton>
              </Dropdown>
            ) : (
              <div>-</div>
            )}
          </div>
          <div className="item">
            <div>Asset to Seize</div>
            {isLoadingInfo ? (
              <div>-</div>
            ) : userInfo.seizeAsset ? (
              <Dropdown
                overlay={dropdownAssetSeize}
                trigger={['click']}
                onVisibleChange={handleVisibleDropdownSeizeChange}
                visible={visibleDropdownSeize}
                getPopupContainer={() => document.getElementById('seize')}
                placement="bottomRight"
              >
                <SButton
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  <div className="black-value flex-gap6" id="seize">
                    <img
                      src={
                        renderLogo(selectedAssetSeize) ||
                        renderLogo(userInfo.seizeAsset)
                      }
                      alt=""
                    />
                    <div>{selectedAssetSeize || userInfo.seizeAsset}</div>
                    <img src={iconDropdown} alt="" className="dropdown" />
                  </div>
                </SButton>
              </Dropdown>
            ) : (
              <div>-</div>
            )}
          </div>
          <div className="item">
            <div>Max Repay Amount</div>
            <div className="flex-value">
              {isLoadingInfo ? (
                '-'
              ) : userInfo.maxRepayAmountEther ? (
                <>
                  <div className="blue-value">
                    {formatNumber(userInfo.maxRepayAmountEther)}{' '}
                    {userInfo.repayAsset}
                  </div>
                  <div>${userInfo.maxRepayAmountUsd}</div>
                </>
              ) : (
                '-'
              )}
            </div>
          </div>
          <div className="item">
            <div>Max Seize Amount</div>
            <div className="flex-value">
              {isLoadingInfo ? (
                '-'
              ) : userInfo.maxSeizeAmountEther ? (
                <div className="blue-value">
                  {formatNumber(userInfo.maxSeizeAmountEther)}{' '}
                  {userInfo.seizeAsset}
                </div>
              ) : (
                '-'
              )}
            </div>
          </div>
        </div>
        <div className="liquidate-wrapper">
          {!settings.selectedAddress || !settings.isConnected ? (
            <div className="mess-liquidator">
              You need to connect your wallet
            </div>
          ) : selectedUserAddress && userInfo.healthFactor ? (
            <div className="liquidate">
              <div className="title">
                Amount you want to repay in{' '}
                <img
                  src={
                    renderLogo(selectedAssetRepay) ||
                    renderLogo(userInfo.symbolBorrowToken)
                  }
                  alt=""
                />{' '}
                {selectedAssetRepay || userInfo.symbolBorrowToken}
              </div>
              <div className="text-input">
                <Input
                  tabIndex={-1}
                  placeholder="0"
                  onChange={e => handleInputAmountChange(e.target.value)}
                  value={repayValue}
                />
                <div className="max-btn" onClick={handleClickMaxBtn}>
                  Max
                </div>
              </div>
              <div className="balance">
                Wallet balance{' '}
                <span>
                  {isLoadingInfo
                    ? '-'
                    : formatNumber(balanceSelectedRepay) || '-'}{' '}
                  {selectedAssetRepay}
                </span>
              </div>
              <div className="liquidate-btn-wrapper">
                <div>
                  {repayValue && +repayValue !== 0 && !errMess && (
                    <>
                      You will repay{' '}
                      <span className="text-blue">
                        {repayAmount.toEth} {selectedAssetRepay}
                      </span>{' '}
                      <span className="text-gray">${repayAmount.toUsd}</span>{' '}
                      and seize{' '}
                      <span className="text-blue">
                        {seizeAmount} {selectedAssetSeize}
                      </span>
                    </>
                  )}
                  {errMess && <div className="err">{errMess}</div>}
                </div>
                {isApprove ? (
                  <Button
                    disabled={
                      errMess ||
                      !repayValue ||
                      +repayValue === 0 ||
                      userInfo.accHealth >= 1 ||
                      disableBtnLiquidate
                    }
                    onClick={handleLiquidate}
                  >
                    Liquidate
                  </Button>
                ) : (
                  <Button onClick={handleApprove}>Approve</Button>
                )}
              </div>
              <div className="gas-price">
                <div>Account health is updated every 2 seconds</div>
                {/* <img src={iconFilter} alt="" /> */}
              </div>
            </div>
          ) : (
            <div className="mess-liquidator">
              Search an account you want to liquidate
            </div>
          )}
        </div>
      </WalletInfo>
      <BlockLabel>block# {blockNumber}</BlockLabel>
      <STableWrapper>
        <STable
          locale={locale}
          columns={columns}
          dataSource={dataUsersTable}
          pagination={false}
          rowKey={record => record.account}
          onRow={record => {
            return {
              onClick: () => {
                setSelectedUserAddress(record.account);
                setUserAddressInput(record.account);
              } // click row
            };
          }}
        />
      </STableWrapper>
      {isOpenModal && (
        <ModalLiquidations isOpenModal={isOpenModal} onCancel={handleCancel} />
      )}
      {isOpenModalLoading && (
        <ModalLoading
          isOpenModal={isOpenModalLoading}
          action={action}
          type={typeModal}
          txh={transactionHash}
          onCancel={handleCancelModalLoading}
        />
      )}
    </MainLayout>
  );
}

Liquidator.propTypes = {
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired
};

Liquidator.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { setSetting } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Liquidator);
