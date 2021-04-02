import React, { useEffect, useState } from 'react';
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
import MainLayout from 'containers/Layout/MainLayout';
import * as constants from 'utilities/constants';
import coinImg from 'assets/img/strike_32.png';

const RewardsLayout = styled.div`
  .main-content {
    align-items: center;
  }
`;
const RewardsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RewardsInfoWrapper = styled.div`
  width: 100%;
  padding: 20px 20px 20px 0px;

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: flex-start !important;
  }

  @media (max-width: 768px) {
    padding: 0 20px;
  }

  .rewards-info {
    img {
      width: 24px;
      height: 24px;
    }

    a {
      margin: 0 10px;
      color: var(--color-text-main);
      @media (max-width: 768px) {
        font-size: 11px;
        line-height: 11px;
      }
    }

    i {
      color: var(--color-text-main);
    }
  }

  .distribution-wrapper {
    @media (max-width: 992px) {
      width: 100%;
      align-items: flex-end;
      margin-top: 20px;
    }
    @media (max-width: 768px) {
      align-items: center;
    }
    .info-wrapper {
      @media (max-width: 992px) {
        max-width: 320px;
      }
      .info-item {
        .title {
          color: var(--color-text-secondary);
          font-size: 12px;
        }
        .value {
          color: var(--color-text-main);
          font-weight: bold;
          font-size: 20px;
        }
        &:not(:last-child) {
          margin-right: 30px;
        }
      }
    }
    .ant-progress {
      @media (max-width: 992px) {
        max-width: 320px;
      }
    }
  }
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
    width: 90%;
  }

  .header-title {
    padding: 20px;
    font-weight: 600;
    font-size: 20px;
    color: var(--color-text-main);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .table_header {
    padding: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    > div {
      color: var(--color-text-main);
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
      padding: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      &:hover {
        background-color: var(--color-bg-active);
        border-left: 2px solid var(--color-blue);
      }
      div {
        color: var(--color-text-main);
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

const format = commaNumber.bindWith(',', '.');

function Rewards({ settings }) {
  const [dailyDistribution, setDailyDistribution] = useState('0');
  const [totalDistributed, setTotalDistributed] = useState('0');
  const [remainAmount, setRemainAmount] = useState('0');

  const mintedAmount = '23700000';

  useEffect(() => {
    if (settings.markets && settings.dailyStrike) {
      const sum = (settings.markets || []).reduce((accumulator, market) => {
        return new BigNumber(accumulator).plus(new BigNumber(market.totalDistributed));
      }, 0);
      setDailyDistribution(new BigNumber(settings.dailyStrike).div(new BigNumber(10).pow(18)).toString(10));
      setTotalDistributed(sum.toString(10));
      setRemainAmount(new BigNumber(mintedAmount).minus(sum).toString(10));
    }
  }, [settings.markets]);

  return (
    <RewardsLayout>
      <MainLayout title="Rewards">
        <RewardsWrapper>
          <RewardsInfoWrapper className="flex align-center just-between">
            <div className="flex align-center rewards-info">
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
            <div className="flex flex-column distribution-wrapper">
              <div className="flex align-center just-around info-wrapper">
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
              <Progress
                percent={new BigNumber(totalDistributed).dividedBy(new BigNumber(mintedAmount)).multipliedBy(100)}
                strokeColor="#f8b94b"
                strokeWidth={7}
                showInfo={false}
              />
            </div>
          </RewardsInfoWrapper>
          <TableWrapper>
            <p className="header-title">Market Distribution</p>
            <Row className="table_header">
              <Col xs={{ span: 24 }} lg={{ span: 8 }} className="market">
                Market
              </Col>
              <Col xs={{ span: 6 }} lg={{ span: 4 }} className="per-day right">
                <img src={coinImg} alt="strk" /> Per Day
              </Col>
              <Col xs={{ span: 6 }} lg={{ span: 4 }} className="supply-apy right">
                Supply<img src={coinImg} alt="strk" />APY
              </Col>
              <Col xs={{ span: 6 }} lg={{ span: 4 }} className="borrow-apy right">
                Borrow<img src={coinImg} alt="strk" />APY
              </Col>
              <Col xs={{ span: 6 }} lg={{ span: 4 }} className="total-distributed right">
                Total Distributed
              </Col>
            </Row>
            <div className="table_content">
              {settings.markets &&
                (settings.markets || [])
                .filter(m => m.underlyingSymbol !== 'ZRX' && m.underlyingSymbol !== 'BAT')
                .map((item, index) => (
                  <Row className="table_item pointer" key={index}>
                    <Col xs={{ span: 24 }} lg={{ span: 8 }} className="flex align-center market">
                      <img
                        className="asset-img"
                        src={constants.CONTRACT_TOKEN_ADDRESS[item.underlyingSymbol.toLowerCase()].asset}
                        alt="asset"
                      />
                      <p>{item.underlyingName}</p>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 4 }} className="per-day right">
                      <p className="mobile-label">Per day</p>
                      <p>
                        {new BigNumber(item.supplierDailyStrike).plus(new BigNumber(item.borrowerDailyStrike)).div(new BigNumber(10).pow(18)).dp(2, 1).toString(10)}
                      </p>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 4 }} className="supply-apy right">
                      <p className="mobile-label">Supply APY</p>
                      <p>
                        {new BigNumber(item.supplyStrikeApy).isLessThan(0.01) ? '0.01' : new BigNumber(item.supplyStrikeApy).dp(2, 1).toString(10)}%
                      </p>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 4 }} className="borrow-apy right">
                      <p className="mobile-label">Borrow APY</p>
                      <p>
                        {new BigNumber(item.borrowStrikeApy).isLessThan(0.01) ? '0.01' : new BigNumber(item.borrowStrikeApy).dp(2, 1).toString(10)}%
                      </p>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 4 }} className="total-distributed right">
                      <p className="mobile-label">Total Distributed</p>
                      <p>{format(item.totalDistributed.toString())}</p>
                    </Col>
                  </Row>
                ))}
            </div>
          </TableWrapper>
        </RewardsWrapper>
      </MainLayout>
    </RewardsLayout>
  );
}

Rewards.propTypes = {
  settings: PropTypes.object
};

Rewards.defaultProps = {
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
)(Rewards);
