import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import commaNumber from 'comma-number';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Row, Col, Icon, Progress } from 'antd';
import styled from 'styled-components';
import { connectAccount, accountActionCreators } from 'core';
import {
  getTokenContract,
  getComptrollerContract,
  getSbepContract,
  methods
} from 'utilities/ContractService';
import MainLayout from 'containers/Layout/MainLayout';
import VotingWallet from 'components/Vote/VotingWallet';
import * as constants from 'utilities/constants';
import coinImg from 'assets/img/strike_32.png';

const STRKLayout = styled.div`
  .main-content {
    align-items: center;
  }
`;
const STRKWrapper = styled.div`
  width: 100%;

  @media (max-width: 1300px) {
    flex-direction: column;
  }

  @media (max-width: 768px) {
    padding: 0 15px;
  }

  .column1 {
    flex: 2;
    margin-right: 10px;

    .user-distribution {
      display: none;
    }

    @media (max-width: 1300px) {
      margin-right: 0px;
      .user-distribution {
        display: block;
      }
    }
  }

  .column2 {
    flex: 1;
    margin-left: 10px;
    @media (max-width: 1300px) {
      display: none;
    }
  }
`;

const RewardsInfoWrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: 5px;
  background-color: #ffffff;
`;

const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-bg-primary);
  box-sizing: content-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  margin: 20px 0;

  @media (max-width: 768px) {
    width: 100%;
  }

  .header-title {
    padding: 20px 45px;
    font-weight: 600;
    font-size: 20px;
    color: #39496a;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .table_header {
    padding: 20px 45px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    cursor: pointer;
    > div {
      color: #c5cbd4;
      font-weight: bold;
      img {
        width: 16px;
        height: 16px;
        margin: 0 10px;
      }
    }
    @media (max-width: 992px) {
      .borrow-apy,
      .per-day,
      .supply-apy,
      .total-distributed {
        display: none;
      }
    }
  }
  .table_content {
    .table_item {
      padding: 20px 45px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      &:hover {
        background-color: var(--color-bg-active);
        border-left: 2px solid var(--color-blue);
      }
      div {
        color: #39496a;
        max-width: 100%;
      }
      .mobile-label {
        display: none;
        @media (max-width: 992px) {
          font-weight: bold;
          display: block;
        }
      }
      .market {
        .highlight {
          word-break: break-all;
          white-space: break-spaces;
        }
        .asset-img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
      }
    }
  }
`;

const UserDistributionWrapper = styled.div`
  width: 100%;
  height: calc(100% - 30px);
  border-radius: 5px;
  background-color: #ffffff;
  padding: 29px 32px;
  margin-top: 10px;

  .header-title {
    font-size: 17px;
    font-weight: 900;
    color: #39496a;
    margin-bottom: 42px;
  }

  .strk-info {
    padding-bottom: 41px;
    margin-bottom: 50px;
    border-bottom: 1px solid #eef1fa;

    img {
      width: 24px;
      height: 24px;
    }

    a {
      margin: 0 10px;
      color: #5e6b86;
      font-weight: bold;
      @media (max-width: 768px) {
        font-size: 11px;
        line-height: 11px;
      }
    }

    i {
      color: #5e6b86;
    }
  }

  .ant-progress {
    @media (max-width: 992px) {
      max-width: 320px;
    }
  }

  .distribution-wrapper {
    margin-top: 50px;

    .info-item {
      .title {
        color: #c5cbd4;
        font-size: 15px;
        font-weight: 900;
        margin-bottom: 17px;
      }
      .value {
        font-weight: bold;
        font-size: 23px;
        color: #39496a;
      }
      &:not(:last-child) {
        margin-bottom: 43px;
      }
    }
  }
`;

const format = commaNumber.bindWith(',', '.');

function STRK({ settings }) {
  const [balance, setBalance] = useState(0);
  const [dailyDistribution, setDailyDistribution] = useState('0');
  const [totalDistributed, setTotalDistributed] = useState('0');
  const [remainAmount, setRemainAmount] = useState('0');
  const [earnedBalance, setEarnedBalance] = useState('0.00000000');
  const [sortInfo, setSortInfo] = useState({ field: '', sort: 'desc' });

  const getPendingRewards = async () => {
    const myAddress = settings.selectedAddress;
    if (!myAddress) return;
    const appContract = getComptrollerContract();
    const [strikeInitialIndex, strikeAccrued] = await Promise.all([
      methods.call(appContract.methods.strikeInitialIndex, []),
      methods.call(appContract.methods.strikeAccrued, [myAddress])
    ]);
    let strikeEarned = new BigNumber(strikeAccrued);
    await Promise.all(
      Object.values(constants.CONTRACT_SBEP_ADDRESS).map(
        async (item, index) => {
          const sBepContract = getSbepContract(item.id);
          let [
            supplyState,
            supplierIndex,
            supplierTokens,
            borrowState,
            borrowerIndex,
            borrowBalanceStored,
            borrowIndex
          ] = await Promise.all([
            methods.call(appContract.methods.strikeSupplyState, [item.address]),
            methods.call(appContract.methods.strikeSupplierIndex, [
              item.address,
              myAddress
            ]),
            methods.call(sBepContract.methods.balanceOf, [myAddress]),
            methods.call(appContract.methods.strikeBorrowState, [item.address]),
            methods.call(appContract.methods.strikeBorrowerIndex, [
              item.address,
              myAddress
            ]),
            methods.call(sBepContract.methods.borrowBalanceStored, [myAddress]),
            methods.call(sBepContract.methods.borrowIndex, [])
          ]);
          const supplyIndex = supplyState.index;
          if (+supplierIndex === 0 && +supplyIndex > 0) {
            supplierIndex = strikeInitialIndex;
          }
          let deltaIndex = new BigNumber(supplyIndex).minus(supplierIndex);

          const supplierDelta = new BigNumber(supplierTokens)
            .multipliedBy(deltaIndex)
            .dividedBy(1e36);

          strikeEarned = strikeEarned.plus(supplierDelta);
          if (+borrowerIndex > 0) {
            deltaIndex = new BigNumber(borrowState.index).minus(borrowerIndex);
            const borrowerAmount = new BigNumber(borrowBalanceStored)
              .multipliedBy(1e18)
              .dividedBy(borrowIndex);
            const borrowerDelta = borrowerAmount
              .times(deltaIndex)
              .dividedBy(1e36);
            strikeEarned = strikeEarned.plus(borrowerDelta);
          }
        }
      )
    );

    strikeEarned = strikeEarned
      .dividedBy(1e18)
      .dp(8, 1)
      .toString(10);
    setEarnedBalance(
      strikeEarned && strikeEarned !== '0' ? `${strikeEarned}` : '0.00000000'
    );
  };

  const updateRemainAmount = async () => {
    const strkTokenContract = getTokenContract('strk');
    let temp = await methods.call(strkTokenContract.methods.balanceOf, [
      constants.CONTRACT_COMPTROLLER_ADDRESS
    ]);
    temp = new BigNumber(temp)
      .dividedBy(new BigNumber(10).pow(18))
      .dp(4, 1)
      .toString(10);
    setRemainAmount(temp);
  };

  useEffect(() => {
    getPendingRewards();
    if (settings.markets && settings.dailyStrike) {
      const sum = (settings.markets || []).reduce((accumulator, market) => {
        return new BigNumber(accumulator).plus(
          new BigNumber(market.totalDistributed)
        );
      }, 0);
      setDailyDistribution(
        new BigNumber(settings.dailyStrike)
          .div(new BigNumber(10).pow(18))
          .toString(10)
      );
      setTotalDistributed(sum.toString(10));
      updateRemainAmount();
    }
  }, [settings.markets]);

  const updateBalance = useCallback(async () => {
    if (settings.selectedAddress) {
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
  }, [settings.markets]);

  useEffect(() => {
    if (settings.selectedAddress) {
      updateBalance();
    }
  }, [settings.selectedAddress, updateBalance]);

  const handleSort = field => {
    setSortInfo({
      field,
      sort:
        sortInfo.field === field && sortInfo.sort === 'desc' ? 'asc' : 'desc'
    });
  };

  const UserDistribution = () => {
    return (
      <UserDistributionWrapper>
        <p className="header-title">User Distribution</p>
        <div className="flex align-center strk-info">
          <img src={coinImg} alt="strk" />
          <a
            className="highlight"
            href={`${process.env.REACT_APP_ETH_EXPLORER}/token/${
              process.env.REACT_APP_ENV === 'dev'
                ? process.env.REACT_APP_TEST_STRK_TOKEN_ADDRESS
                : process.env.REACT_APP_MAIN_STRK_TOKEN_ADDRESS
            }`}
            target="_blank"
            rel="noreferrer"
          >
            {process.env.REACT_APP_ENV === 'dev'
              ? process.env.REACT_APP_TEST_STRK_TOKEN_ADDRESS
              : process.env.REACT_APP_MAIN_STRK_TOKEN_ADDRESS}
          </a>
          <CopyToClipboard
            text={
              process.env.REACT_APP_ENV === 'dev'
                ? process.env.REACT_APP_TEST_STRK_TOKEN_ADDRESS
                : process.env.REACT_APP_MAIN_STRK_TOKEN_ADDRESS
            }
            onCopy={() => {}}
          >
            <Icon className="pointer copy-btn" type="copy" />
          </CopyToClipboard>
        </div>
        <Progress
          percent={new BigNumber(totalDistributed)
            .dividedBy(
              new BigNumber(totalDistributed).plus(new BigNumber(remainAmount))
            )
            .multipliedBy(100)}
          strokeColor="#277ee6"
          strokeWidth={7}
          showInfo={false}
        />
        <div className="flex flex-column distribution-wrapper">
          <div className="info-item">
            <p className="title">Daily Distribution</p>
            <p className="value">{format(dailyDistribution)}</p>
          </div>
          <div className="info-item">
            <p className="title">Total Distributed</p>
            <p className="value">{format(totalDistributed)}</p>
          </div>
          <div className="info-item">
            <p className="title">Remaining</p>
            <p className="value">{format(remainAmount)}</p>
          </div>
        </div>
      </UserDistributionWrapper>
    );
  };

  return (
    <STRKLayout>
      <MainLayout title="Rewards">
        <STRKWrapper className="flex">
          <div className="column1">
            <RewardsInfoWrapper>
              <VotingWallet
                balance={balance !== '0' ? `${balance}` : '0.00000000'}
                earnedBalance={earnedBalance}
                pageType="strk"
              />
            </RewardsInfoWrapper>
            <div className="user-distribution">
              <UserDistribution />
            </div>
            <TableWrapper>
              <p className="header-title">Market Distribution</p>
              <Row className="table_header">
                <Col xs={{ span: 24 }} lg={{ span: 4 }} className="market">
                  Market
                </Col>
                <Col
                  xs={{ span: 6 }}
                  lg={{ span: 5 }}
                  className="per-day right"
                >
                  <span onClick={() => handleSort('perDay')}>
                    <img src={coinImg} alt="strk" /> Per Day{' '}
                    {sortInfo.field === 'perDay' && (
                      <Icon
                        type={
                          sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'
                        }
                      />
                    )}
                  </span>
                </Col>
                <Col
                  xs={{ span: 6 }}
                  lg={{ span: 5 }}
                  className="supply-apy right"
                >
                  <span onClick={() => handleSort('supplyAPY')}>
                    Supply
                    <img src={coinImg} alt="strk" />
                    APY{' '}
                    {sortInfo.field === 'supplyAPY' && (
                      <Icon
                        type={
                          sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'
                        }
                      />
                    )}
                  </span>
                </Col>
                <Col
                  xs={{ span: 6 }}
                  lg={{ span: 5 }}
                  className="borrow-apy right"
                >
                  <span onClick={() => handleSort('borrowAPY')}>
                    Borrow
                    <img src={coinImg} alt="strk" />
                    APY{' '}
                    {sortInfo.field === 'borrowAPY' && (
                      <Icon
                        type={
                          sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'
                        }
                      />
                    )}
                  </span>
                </Col>
                <Col
                  xs={{ span: 6 }}
                  lg={{ span: 5 }}
                  className="total-distributed right"
                >
                  <span onClick={() => handleSort('total')}>
                    Total Distributed
                    {sortInfo.field === 'total' && (
                      <Icon
                        type={
                          sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'
                        }
                      />
                    )}
                  </span>
                </Col>
              </Row>
              <div className="table_content">
                {settings.markets &&
                  (settings.markets || [])
                    .filter(
                      m =>
                        m.underlyingSymbol !== 'ZRX' &&
                        m.underlyingSymbol !== 'BAT'
                    )
                    .map(market => {
                      return {
                        ...market,
                        perDay: new BigNumber(market.supplierDailyStrike)
                          .plus(new BigNumber(market.borrowerDailyStrike))
                          .div(new BigNumber(10).pow(18))
                          .dp(2, 1)
                          .toNumber(),
                        supplyAPY: new BigNumber(
                          market.supplyStrikeApy
                        ).isLessThan(0.01)
                          ? '0.01'
                          : new BigNumber(market.supplyStrikeApy)
                              .dp(2, 1)
                              .toNumber(),
                        borrowAPY: new BigNumber(
                          market.borrowStrikeApy
                        ).isLessThan(0.01)
                          ? '0.01'
                          : new BigNumber(market.borrowStrikeApy)
                              .dp(2, 1)
                              .toNumber()
                      };
                    })
                    .sort((a, b) => {
                      if (sortInfo.field) {
                        if (sortInfo.field === 'perDay') {
                          return sortInfo.sort === 'desc'
                            ? new BigNumber(b.perDay)
                                .minus(new BigNumber(a.perDay))
                                .toNumber()
                            : new BigNumber(a.perDay)
                                .minus(new BigNumber(b.perDay))
                                .toNumber();
                        }
                        if (sortInfo.field === 'supplyAPY') {
                          return sortInfo.sort === 'desc'
                            ? new BigNumber(b.supplyAPY)
                                .minus(new BigNumber(a.supplyAPY))
                                .toNumber()
                            : new BigNumber(a.supplyAPY)
                                .minus(new BigNumber(b.supplyAPY))
                                .toNumber();
                        }
                        if (sortInfo.field === 'borrowAPY') {
                          return sortInfo.sort === 'desc'
                            ? new BigNumber(b.borrowAPY)
                                .minus(new BigNumber(a.borrowAPY))
                                .toNumber()
                            : new BigNumber(a.borrowAPY)
                                .minus(new BigNumber(b.borrowAPY))
                                .toNumber();
                        }
                        if (sortInfo.field === 'total') {
                          return sortInfo.sort === 'desc'
                            ? new BigNumber(b.totalDistributed)
                                .minus(new BigNumber(a.totalDistributed))
                                .toNumber()
                            : new BigNumber(a.totalDistributed)
                                .minus(new BigNumber(b.totalDistributed))
                                .toNumber();
                        }
                      }
                      return +new BigNumber(b.perDay)
                        .minus(new BigNumber(a.perDay))
                        .toString(10);
                    })
                    .map((item, index) => (
                      <Row className="table_item pointer" key={index}>
                        <Col
                          xs={{ span: 24 }}
                          lg={{ span: 4 }}
                          className="flex align-center market"
                        >
                          <img
                            className="asset-img"
                            src={
                              constants.CONTRACT_TOKEN_ADDRESS[
                                item.underlyingSymbol.toLowerCase()
                              ].asset
                            }
                            alt="asset"
                          />
                          <p>{item.underlyingName}</p>
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          lg={{ span: 5 }}
                          className="per-day right"
                        >
                          <p className="mobile-label">Per day</p>
                          <p>{item.perDay}</p>
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          lg={{ span: 5 }}
                          className="supply-apy right"
                        >
                          <p className="mobile-label">Supply APY</p>
                          <p>{item.supplyAPY}%</p>
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          lg={{ span: 5 }}
                          className="borrow-apy right"
                        >
                          <p className="mobile-label">Borrow APY</p>
                          <p>{item.borrowAPY}%</p>
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          lg={{ span: 5 }}
                          className="total-distributed right"
                        >
                          <p className="mobile-label">Total Distributed</p>
                          <p>{format(item.totalDistributed.toString())}</p>
                        </Col>
                      </Row>
                    ))}
              </div>
            </TableWrapper>
          </div>
          <div className="column2">
            <UserDistribution />
          </div>
        </STRKWrapper>
      </MainLayout>
    </STRKLayout>
  );
}

STRK.propTypes = {
  settings: PropTypes.object
};

STRK.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { getVoterAccounts } = accountActionCreators;

  return bindActionCreators(
    {
      getVoterAccounts
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(STRK);
