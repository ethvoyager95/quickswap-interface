import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import commaNumber from 'comma-number';
import { Row, Col, Icon } from 'antd';
import styled from 'styled-components';
import { connectAccount } from 'core';
import MainLayout from 'containers/Layout/MainLayout';
import * as constants from 'utilities/constants';
import LineProgressBar from 'components/Basic/LineProgressBar';
import { currencyFormatter, shortenNumberFormatter } from 'utilities/common';

const MarketWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .all-section {
    width: 100%;
    padding: 15px;

    .total-section {
      position: relative;
      width: 100%;
      background: var(--color-bg-primary);
      border: 1px solid var(--color-bg-primary);
      box-sizing: content-box;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.03);
      border-radius: 6px;
      margin: 20px 0;

      .title {
        padding: 20px 30px;
        font-size: 17px;
        font-weight: 900;
        color: var(--color-text-main);
        // border-bottom: 1px solid #141518;
      }

      .content {
        padding: 25px 30px;
        .header {
          display: flex;
          align-items: center;
          .total-value {
            width: 100%;
            font-size: 23px;
            font-weight: 900;
            color: var(--color-blue);
            text-align: right;
          }

          .percent {
            color: var(--color-green);
          }
        }

        .markets {
          margin-top: 20px;

          .caption {
            color: var(--color-text-secondary);
            font-size: 15px;
            font-weight: 900;
          }

          .progress {
            margin-top: 20px;
          }
        }

        .footer {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;

          .volume {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }

          .suppliers {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }

          .value {
            font-size: 23px;
            font-weight: 900;
            color: var(--color-blue);
          }
          .label {
            font-size: 15px;
            color: var(--color-text-secondary);
          }
        }
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
  border-radius: 6px;

  @media (max-width: 991px) {
    margin: 0;
  }

  .table-title {
    font-size: 17px;
    font-weight: 900;
    padding: 20px 30px;
    color: var(--color-text-main);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .table_header {
    padding: 20px 30px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    cursor: pointer;
    > div {
      color: var(--color-text-secondary);
      font-weight: bold;
      img {
        width: 16px;
        height: 16px;
        margin: 0 10px;
      }
    }
    @media (max-width: 992px) {
      .total-supply,
      .supply-apy,
      .total-borrow,
      .borrow-apy,
      .price {
        display: none;
      }
    }
  }
  .table_content {
    padding: 0;
    .table_item {
      padding: 15px 20px;
      &:hover {
        background-color: var(--color-bg-active);
        border-left: 2px solid var(--color-blue);
      }
      div {
        color: white;
        max-width: 100%;
      }
      .mobile-label {
        display: none;
        @media (max-width: 992px) {
          font-weight: bold;
          display: block;
        }
      }
      .item-title {
        font-weight: 600;
        font-size: 16px;
        color: white;
      }
      .item-value {
        font-weight: 600;
        font-size: 14px;
        color: var(--color-green);
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

function MarketDeprecated({ history, settings }) {
  const [sortInfo, setSortInfo] = useState({ field: '', sort: 'desc' });

  const handleSort = field => {
    setSortInfo({
      field,
      sort:
        sortInfo.field === field && sortInfo.sort === 'desc' ? 'asc' : 'desc'
    });
  };

  return (
    <MainLayout title="Deprecated Market">
      <MarketWrapper>
        <Row className="all-section">
          <Col xs={{ span: 24 }}>
            <TableWrapper>
              <div className="table-title">
                A deprecated market means a market with zero collateral.
              </div>
              <Row className="table_header">
                <Col xs={{ span: 24 }} lg={{ span: 4 }} className="market">
                  Market
                </Col>
                <Col
                  xs={{ span: 4 }}
                  lg={{ span: 4 }}
                  className="borrow-apy right"
                >
                  <span onClick={() => handleSort('price')}>
                    Price{' '}
                    {sortInfo.field === 'price' && (
                      <Icon
                        type={
                          sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'
                        }
                      />
                    )}
                  </span>
                </Col>
                <Col
                  xs={{ span: 5 }}
                  lg={{ span: 4 }}
                  className="total-supply right"
                >
                  <span onClick={() => handleSort('total_supply')}>
                    Total Supply{' '}
                    {sortInfo.field === 'total_supply' && (
                      <Icon
                        type={
                          sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'
                        }
                      />
                    )}
                  </span>
                </Col>
                <Col
                  xs={{ span: 5 }}
                  lg={{ span: 4 }}
                  className="supply-apy right"
                >
                  <span onClick={() => handleSort('supply_apy')}>
                    Supply APY{' '}
                    {sortInfo.field === 'supply_apy' && (
                      <Icon
                        type={
                          sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'
                        }
                      />
                    )}
                  </span>
                </Col>
                <Col
                  xs={{ span: 5 }}
                  lg={{ span: 4 }}
                  className="total-borrow right"
                >
                  <span onClick={() => handleSort('total_borrow')}>
                    Total Borrow{' '}
                    {sortInfo.field === 'total_borrow' && (
                      <Icon
                        type={
                          sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'
                        }
                      />
                    )}
                  </span>
                </Col>
                <Col
                  xs={{ span: 5 }}
                  lg={{ span: 4 }}
                  className="borrow-apy right"
                >
                  <span onClick={() => handleSort('borrow_apy')}>
                    Borrow APY{' '}
                    {sortInfo.field === 'borrow_apy' && (
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
                    .filter(m => m.deprecated === true)
                    .map(market => {
                      return {
                        ...market,
                        sAPY: new BigNumber(market.supplyApy)
                          .plus(new BigNumber(market.supplyStrikeApy))
                          .dp(2, 1)
                          .toNumber(),
                        bAPY: new BigNumber(market.borrowStrikeApy)
                          .minus(new BigNumber(market.borrowApy))
                          .dp(2, 1)
                          .toNumber()
                      };
                    })
                    .sort((a, b) => {
                      if (!sortInfo.field) {
                        return new BigNumber(b.totalSupplyUsd)
                          .minus(new BigNumber(a.totalSupplyUsd))
                          .toNumber();
                      }
                      if (sortInfo.field === 'total_supply') {
                        return sortInfo.sort === 'desc'
                          ? new BigNumber(b.totalSupplyUsd)
                              .minus(new BigNumber(a.totalSupplyUsd))
                              .toNumber()
                          : new BigNumber(a.totalSupplyUsd)
                              .minus(new BigNumber(b.totalSupplyUsd))
                              .toNumber();
                      }
                      if (sortInfo.field === 'supply_apy') {
                        return sortInfo.sort === 'desc'
                          ? new BigNumber(b.sAPY)
                              .minus(new BigNumber(a.sAPY))
                              .toNumber()
                          : new BigNumber(a.sAPY)
                              .minus(new BigNumber(b.sAPY))
                              .toNumber();
                      }
                      if (sortInfo.field === 'total_borrow') {
                        return sortInfo.sort === 'desc'
                          ? new BigNumber(b.totalBorrowsUsd)
                              .minus(new BigNumber(a.totalBorrowsUsd))
                              .toNumber()
                          : new BigNumber(a.totalBorrowsUsd)
                              .minus(new BigNumber(b.totalBorrowsUsd))
                              .toNumber();
                      }
                      if (sortInfo.field === 'borrow_apy') {
                        return sortInfo.sort === 'desc'
                          ? new BigNumber(b.bAPY)
                              .minus(new BigNumber(a.bAPY))
                              .toNumber()
                          : new BigNumber(a.bAPY)
                              .minus(new BigNumber(b.bAPY))
                              .toNumber();
                      }
                      if (sortInfo.field === 'liquidity') {
                        return sortInfo.sort === 'desc'
                          ? new BigNumber(b.liquidity)
                              .minus(new BigNumber(a.liquidity))
                              .toNumber()
                          : new BigNumber(a.liquidity)
                              .minus(new BigNumber(b.liquidity))
                              .toNumber();
                      }
                      if (sortInfo.field === 'price') {
                        return sortInfo.sort === 'desc'
                          ? new BigNumber(b.tokenPrice)
                              .minus(new BigNumber(a.tokenPrice))
                              .toNumber()
                          : new BigNumber(a.tokenPrice)
                              .minus(new BigNumber(b.tokenPrice))
                              .toNumber();
                      }
                      return 0;
                    })
                    .map((item, index) => (
                      <Row
                        className="table_item pointer"
                        key={index}
                        onClick={() =>
                          history.push(`/market/${item.underlyingSymbol}`)
                        }
                      >
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
                              ]
                                ? constants.CONTRACT_TOKEN_ADDRESS[
                                    item.underlyingSymbol.toLowerCase()
                                  ].asset
                                : null
                            }
                            alt="asset"
                          />
                          <p className="item-title">{item.underlyingSymbol}</p>
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          lg={{ span: 4 }}
                          className="total-supply right"
                        >
                          <p className="mobile-label">Price</p>
                          <p className="item-title">
                            $
                            {format(new BigNumber(item.tokenPrice).toFormat(2))}
                          </p>
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          lg={{ span: 4 }}
                          className="total-supply right"
                        >
                          <p className="mobile-label">Total Supply</p>
                          <p className="item-title">
                            {currencyFormatter(item.totalSupplyUsd)}
                          </p>
                          <p className="item-value">
                            {format(
                              new BigNumber(item.totalSupplyUsd)
                                .div(new BigNumber(item.tokenPrice))
                                .dp(0, 1)
                                .toString(10)
                            )}{' '}
                            {item.underlyingSymbol}
                          </p>
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          lg={{ span: 4 }}
                          className="supply-apy right"
                        >
                          <p className="mobile-label">Supply APY</p>
                          <p className="item-title">
                            {shortenNumberFormatter(item.sAPY)}%
                          </p>
                          <p className="item-value">
                            {shortenNumberFormatter(
                              new BigNumber(item.supplyStrikeApy)
                                .dp(2, 1)
                                .toString(10)
                            )}
                            %
                          </p>
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          lg={{ span: 4 }}
                          className="total-borrow right"
                        >
                          <p className="mobile-label">Total Borrow</p>
                          <p className="item-title">
                            {currencyFormatter(item.totalBorrowsUsd)}
                          </p>
                          <p className="item-value">
                            {format(
                              new BigNumber(item.totalBorrowsUsd)
                                .div(new BigNumber(item.tokenPrice))
                                .dp(0, 1)
                                .toString(10)
                            )}{' '}
                            {item.underlyingSymbol}
                          </p>
                        </Col>
                        <Col
                          xs={{ span: 24 }}
                          lg={{ span: 4 }}
                          className="borrow-apy right"
                        >
                          <p className="mobile-label">Borrow APY</p>
                          <p className="item-title">
                            {shortenNumberFormatter(item.bAPY)}%
                          </p>
                          <p className="item-value">
                            {shortenNumberFormatter(
                              new BigNumber(item.borrowStrikeApy)
                                .dp(2, 1)
                                .toString(10)
                            )}
                            %
                          </p>
                        </Col>
                      </Row>
                    ))}
              </div>
            </TableWrapper>
          </Col>
        </Row>
      </MarketWrapper>
    </MainLayout>
  );
}

MarketDeprecated.propTypes = {
  history: PropTypes.object,
  settings: PropTypes.object
};

MarketDeprecated.defaultProps = {
  history: {},
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(
  withRouter,
  connectAccount(mapStateToProps, undefined)
)(MarketDeprecated);
