import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Web3 from 'web3';
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
import { getSbepContract, methods } from 'utilities/ContractService';
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

function Liquidator({ settings }) {
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
  const [seizeAmount, setSeizeAmount] = useState({
    toEth: '',
    toUsd: ''
  });
  const [errMess, setErrMess] = useState('');
  const [dataUsersTable, setDataUsersTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [blockNumber, setBlockNumber] = useState();

  const handleInputAddressChange = value => {
    if (value) {
      setUserAddressInput(value);
    } else {
      setUserAddressInput('');
    }
  };

  const handleSearchUserAddress = () => {
    const validateAddress = Web3.utils.isAddress(userAddressInput);
    if (!validateAddress) {
      setMess('Please input a valid address');
      setSelectedUserAddress(userAddressInput);
    } else {
      setSelectedUserAddress(userAddressInput);
    }
  };

  const handleInputAmountChange = value => {
    if (+value > +balanceSelectedRepay) {
      setErrMess(
        'You have input the number higher than your balance. Try again'
      );
    } else if (+value > +userInfo.maxRepayAmount) {
      setErrMess(
        'You have input the number higher than max repay amount. Try again'
      );
    } else {
      setErrMess('');
    }

    if (value && userInfo) {
      setRepayValue(value);
      const repayInfo = {
        toEth: formatNumber(value),
        toUsd: formatNumber(value * userInfo.currentBorrowPrice)
      };
      setRepayAmount(repayInfo);
      const seizeInfo = {
        toEth: formatNumber(
          calculateSeizeAmount(
            value,
            userInfo.currentBorrowPrice,
            userInfo.seizeTokenPrice
          ).toEther
        ),
        toUsd: formatNumber(
          calculateSeizeAmount(
            value,
            userInfo.currentBorrowPrice,
            userInfo.seizeTokenPrice
          ).toUsd
        )
      };
      setSeizeAmount(seizeInfo);
    }
    if (!value) {
      setRepayValue('');
    }
  };

  const handleClickMaxBtn = () => {
    if (+balanceSelectedRepay > +userInfo.maxRepayAmount) {
      setRepayValue(userInfo.maxRepayAmount);
      const repayInfo = {
        toEth: formatNumber(userInfo.maxRepayAmount),
        toUsd: formatNumber(
          userInfo.maxRepayAmount * userInfo.currentBorrowPrice
        )
      };
      setRepayAmount(repayInfo);
      const seizeInfo = {
        toEth: formatNumber(
          calculateSeizeAmount(
            userInfo.maxRepayAmount,
            userInfo.currentBorrowPrice,
            userInfo.seizeTokenPrice
          ).toEther
        ),
        toUsd: formatNumber(
          calculateSeizeAmount(
            userInfo.maxRepayAmount,
            userInfo.currentBorrowPrice,
            userInfo.seizeTokenPrice
          ).toUsd
        )
      };
      setSeizeAmount(seizeInfo);
    } else {
      setRepayValue(balanceSelectedRepay);
      const repayInfo = {
        toEth: formatNumber(balanceSelectedRepay),
        toUsd: formatNumber(balanceSelectedRepay * userInfo.currentBorrowPrice)
      };
      setRepayAmount(repayInfo);
      const seizeInfo = {
        toEth: formatNumber(
          calculateSeizeAmount(
            balanceSelectedRepay,
            userInfo.currentBorrowPrice,
            userInfo.seizeTokenPrice
          ).toEther
        ),
        toUsd: formatNumber(
          calculateSeizeAmount(
            balanceSelectedRepay,
            userInfo.currentBorrowPrice,
            userInfo.seizeTokenPrice
          ).toUsd
        )
      };
      setSeizeAmount(seizeInfo);
    }
  };

  const getDataUsers = async (userAddress, borrowToken, seizeToken) => {
    const res = await axios.get(
      `${
        process.env.REACT_APP_ENV === 'dev'
          ? `${process.env.REACT_APP_DEVELOPMENT_API}`
          : `${process.env.REACT_APP_PRODUCTION_API}`
      }/user/user_info`,
      {
        params: {
          address: userAddress || undefined,
          borrow_token: borrowToken || userInfo.symbolBorrowToken || undefined,
          seize_token: seizeToken || userInfo.symbolSeizeToken || undefined
        }
      }
    );
    const { data } = res.data;
    return data;
  };

  const getCurrentBlock = async () => {
    const res = await axios.get(
      `${
        process.env.REACT_APP_ENV === 'dev'
          ? `${process.env.REACT_APP_DEVELOPMENT_API}`
          : `${process.env.REACT_APP_PRODUCTION_API}`
      }/liquidator/block_number`
    );
    setBlockNumber(res.data.blockNumber);
  };

  const getDataTableUsers = async () => {
    const dataUsers = await getDataUsers();
    setDataUsersTable(formatUsersRecord(dataUsers.rows));
  };

  const getUserInfo = async (address, borrowToken, seizeToken) => {
    const dataUser = await getDataUsers(address, borrowToken, seizeToken);
    if (dataUser.rows.length === 0) {
      setUserInfo({});
    } else {
      setUserInfo(formatUserInfo(dataUser.rows[0]));
    }
    setListRepay(dataUser.listTokenBorrow);
    setListSeize(dataUser.listTokenSeize);
  };

  const handleRefresh = () => {
    getUserInfo(selectedUserAddress, selectedAssetRepay, selectedAssetSeize);
  };

  const getBalance = () => {
    const selectedMarket = settings.assetList.filter(el => {
      return el.id === selectedAssetRepay.toLowerCase();
    });
    setBalanceSelectedRepay(selectedMarket[0].walletBalance || '0');
  };

  const handleCancel = () => {
    setIsOpenModal(false);
  };

  const handleCancelModalLoading = () => {
    setIsLoading(false);
  };

  const handleVisibleDropdownRepayChange = flag => {
    setVisibleDropdownRepay(flag);
  };

  const handleVisibleDropdownSeizeChange = flag => {
    setVisibleDropdownSeize(flag);
  };

  const handleLiquidate = async () => {
    try {
      const appContract = getSbepContract(selectedAssetRepay.toLowerCase());
      setIsLoading(true);
      await methods.send(
        appContract.methods.liquidateBorrow,
        [selectedUserAddress, repayValue, userInfo.seizeTokenAddress],
        settings.selectedAddress
      );
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDataTableUsers();
    getCurrentBlock();
  }, []);
  console.log('dataaaa', userInfo);
  useEffect(() => {
    if (selectedUserAddress) {
      getUserInfo(selectedUserAddress, selectedAssetRepay, selectedAssetSeize);
      if (Web3.utils.isAddress(selectedUserAddress)) {
        if (userInfo.health > 0) {
          setMess('This account is healthy and can not be liquidated');
        } else if (userInfo.health <= 0) {
          setMess('This account can be liquidated');
        }
      }
    }
  }, [selectedUserAddress, selectedAssetRepay, selectedAssetSeize]);

  useEffect(() => {
    async function getAsset() {
      const dataAsset = await getDataUsers(selectedUserAddress);
      setSelectedAssetRepay(dataAsset.listTokenBorrow[0]);
      setSelectedAssetSeize(dataAsset.listTokenSeize[0]);
    }
    if (selectedUserAddress) {
      getAsset();
    }
  }, [selectedUserAddress]);

  useEffect(() => {
    if (selectedUserAddress && selectedAssetRepay) {
      getBalance();
    }
  }, [selectedUserAddress, selectedAssetRepay]);

  const dropdownAssetRepay = (
    <DropdownAsset>
      {listRepay?.map(token => (
        <div
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
          children: <Health>{asset.accHealth || '-'}</Health>
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
            <Address>
              {asset.userAddress
                ? `${asset.userAddress.substr(
                    0,
                    4
                  )}...${asset.userAddress.substr(
                    asset.userAddress.length - 4,
                    4
                  )}`
                : '-'}
            </Address>
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
              <div>{asset.symbolBorrowToken}</div>
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
                <span>
                  {asset.maxRepayAmountEther} {asset.symbolBorrowToken}
                </span>
                <span>${asset.maxRepayAmountUsd}</span>
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
              <div>{asset.symbolSeizeToken}</div>
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
                <span>
                  {asset.maxSeizeAmountEther} {asset.symbolSeizeToken}
                </span>
                <span>${asset.maxSeizeAmountUsd}</span>
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
            className={`${
              mess === 'This account can be liquidated' ? 'text-green' : ''
            } message`}
          >
            {mess && userAddressInput ? mess : null}
          </div>
          {selectedUserAddress && (
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
              className={`${!userInfo.health ? 'gray-value' : ''} ${
                userInfo.health === 0 ? 'red-value' : ''
              } ${userInfo.health > 0 ? 'green-value' : ''}`}
            >
              {userInfo.accHealth || '-'}
            </div>
          </div>
          <div className="item">
            <div>Asset to Repay</div>
            {userInfo.symbolBorrowToken ? (
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
                        renderLogo(userInfo.symbolBorrowToken)
                      }
                      alt=""
                    />
                    <div>
                      {selectedAssetRepay || userInfo.symbolBorrowToken}
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
            {userInfo.symbolSeizeToken ? (
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
                        renderLogo(userInfo.symbolSeizeToken)
                      }
                      alt=""
                    />
                    <div>{selectedAssetSeize || userInfo.symbolSeizeToken}</div>
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
              {userInfo.maxRepayAmountEther ? (
                <>
                  <div className="blue-value">
                    {userInfo.maxRepayAmountEther} {userInfo.symbolBorrowToken}
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
              {userInfo.maxSeizeAmountEther ? (
                <>
                  <div className="blue-value">
                    {userInfo.maxSeizeAmountEther} {userInfo.symbolSeizeToken}
                  </div>
                  <div>${userInfo.maxSeizeAmountUsd}</div>
                </>
              ) : (
                '-'
              )}
            </div>
          </div>
        </div>
        <div className="liquidate-wrapper">
          {selectedUserAddress && userInfo.userAddress ? (
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
                  {balanceSelectedRepay}{' '}
                  {selectedAssetRepay || userInfo.symbolBorrowToken}
                </span>
              </div>
              <div className="liquidate-btn-wrapper">
                <div>
                  {repayValue && +repayValue !== 0 && !errMess && (
                    <>
                      You will repay{' '}
                      <span className="text-blue">
                        {repayAmount.toEth}{' '}
                        {selectedAssetRepay || userInfo.symbolBorrowToken}
                      </span>{' '}
                      <span className="text-gray">${repayAmount.toUsd}</span>{' '}
                      and seize{' '}
                      <span className="text-blue">
                        {seizeAmount.toEth}{' '}
                        {selectedAssetSeize || userInfo.symbolSeizeToken}
                      </span>{' '}
                      <span className="text-gray">${seizeAmount.toUsd}</span>
                    </>
                  )}
                  {errMess && <div className="err">{errMess}</div>}
                </div>
                <Button
                  disabled={errMess || !repayValue}
                  onClick={handleLiquidate}
                >
                  Liquidate
                </Button>
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
          rowKey={record => record.userAddress}
          onRow={record => {
            return {
              onClick: () => {
                setSelectedUserAddress(record.userAddress);
                setUserAddressInput(record.userAddress);
              } // click row
            };
          }}
        />
      </STableWrapper>
      {isOpenModal && (
        <ModalLiquidations isOpenModal={isOpenModal} onCancel={handleCancel} />
      )}
      {isLoading && (
        <ModalLoading
          isOpenModal={isLoading}
          onCancel={handleCancelModalLoading}
        />
      )}
    </MainLayout>
  );
}

Liquidator.propTypes = {
  settings: PropTypes.object
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
