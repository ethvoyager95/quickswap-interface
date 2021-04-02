import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import BigNumber from 'bignumber.js';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import OverviewChart from 'components/Basic/OverviewChart';
import CoinInfo from 'components/Dashboard/CoinInfo';
import BorrowLimit from 'components/Dashboard/BorrowLimit';
import WalletBalance from 'components/Dashboard/WalletBalance';
import { promisify } from 'utilities';
import * as constants from 'utilities/constants';
import commaNumber from 'comma-number';
import { getBigNumber, currencyFormatter } from 'utilities/common';
import { Card } from 'components/Basic/Card';

const CardWrapper = styled.div`
  width: 100%;
  border-radius: 5px;
  background-color: var(--color-bg-primary);
`;

const OverviewWrapper = styled.div`
  padding: 24px 45px;

  @media only screen and (max-width: 768px) {
    padding: 24px;
  }

  .asset-img {
    width: 28px;
    height: 28px;
    margin-right: 13px;
  }

  .label {
    font-size: 16px;
    font-weight: normal;
    color: var(--color-text-secondary);
  }

  .historic-label {
    font-size: 16px;
    font-weight: normal;
    color: var(--color-text-secondary);
    margin-top: 24px;
  }

  .value {
    font-size: 17px;
    font-weight: 900;
    color: var(--color-text-main);
  }

  .apy-section {
    display: flex;
    flex-direction: column;
    margin-top: 24px;

    .price {
      color: #277ee6;  font-size: 17px;
      font-weight: 900;
    }

    .apy-value {
      margin-top: 5px;
      font-size: 19px;
      font-weight: 900;
      color: #97cc60;
    }

    .apy-label {
      font-size: 16px;
      font-weight: normal;
      color: #c5cbd4;
    }
  }

  .description {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media only screen and (max-width: 768px) {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 10px;
    }
  }

  .asset-select-wrapper {
    width: 100%;
    @media only screen and (max-width: 1496px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

const AssetSelectWrapper = styled.div`
  position: relative;
  .ant-select {
    .ant-select-selection {
      background-color: transparent;
      border: none;
      color: var(--color-text-main);
      font-size: 17px;
      font-weight: 900;
      color: var(--color-text-main);
      margin-top: 4px;
      i {
        color: var(--color-text-main);
      }
    }
  }
`;

let timeStamp = 0;
const abortController = new AbortController();
const format = commaNumber.bindWith(',', '.');

function Overview({ currentMarket, settings, getMarketHistory }) {
  const [currentAsset, setCurrentAsset] = useState('usdc');
  const [data, setData] = useState([]);
  const [marketInfo, setMarketInfo] = useState({});
  const [currentAPY, setCurrentAPY] = useState(0);
  const getGraphData = useCallback(
    async (asset, type) => {
      const tempData = [];
      await promisify(getMarketHistory, { asset, type }).then(res => {
        res.data.result.forEach(m => {
          tempData.push({
            createdAt: m.createdAt,
            supplyApy: +new BigNumber(m.supplyApy || 0).dp(8, 1).toString(10),
            borrowApy: +new BigNumber(m.borrowApy || 0).dp(8, 1).toString(10)
          });
        });
        setData([...tempData.reverse()]);
      });
    },
    [getMarketHistory]
  );

  const getGovernanceData = useCallback(async () => {
    if (settings.markets && settings.markets.length > 0) {
      const info = settings.markets.find(
        item => item.underlyingSymbol.toLowerCase() === currentAsset
      );
      setMarketInfo(info || {});
    }
  }, [settings.markets, currentAsset]);

  useEffect(() => {
    getGovernanceData();
  }, [getGovernanceData]);

  useEffect(() => {
    setCurrentAsset(settings.selectedAsset && settings.selectedAsset.id ? settings.selectedAsset.id : 'usdc');
  }, [settings.selectedAsset]);

  useEffect(() => {
    if (timeStamp % 60 === 0 && currentAsset) {
      getGraphData(
        constants.CONTRACT_SBEP_ADDRESS[currentAsset].address,
        process.env.REACT_APP_GRAPH_TICKER || null
      );
    }
    timeStamp = Date.now();
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.selectedAddress, currentAsset, getGraphData]);

  useEffect(() => {
    if (settings.assetList && settings.assetList.length > 0) {
      const currentMarketInfo =
        settings.assetList.filter(s => s.id === currentAsset).length !== 0
          ? settings.assetList.filter(s => s.id === currentAsset)[0]
          : {};
      const supplyApy = getBigNumber(currentMarketInfo.supplyApy);
      const borrowApy = getBigNumber(currentMarketInfo.borrowApy);
      const supplyApyWithSTRK = settings.withSTRK
        ? supplyApy.plus(currentMarketInfo.strkSupplyApy)
        : supplyApy;
      const borrowApyWithSTRK = settings.withSTRK
        ? getBigNumber(currentMarketInfo.strkBorrowApy).minus(borrowApy)
        : borrowApy;
      setCurrentAPY(
        (currentMarket || 'supply') === 'supply'
          ? supplyApyWithSTRK.dp(2, 1).toString(10)
          : borrowApyWithSTRK.dp(2, 1).toString(10)
      );
    }
  }, [currentAsset, currentMarket, settings.assetList, settings.withSTRK]);

  useEffect(() => {
    getGraphData(
      constants.CONTRACT_SBEP_ADDRESS[currentAsset].address,
      process.env.REACT_APP_GRAPH_TICKER || null
    );
  }, [currentAsset]);

  if (!settings.decimals[currentAsset]) {
    return <></>;
  }

  return (
    <Card>
      <CardWrapper>
        <BorrowLimit />
        <CoinInfo />
        <WalletBalance />
        <OverviewWrapper>
          <div className="flex align-center just-between">
            <div className="flex align-center just-between asset-select-wrapper">
              <AssetSelectWrapper className="flex align-center just-end" id="asset">
                <img
                  className="asset-img"
                  src={constants.CONTRACT_TOKEN_ADDRESS[currentAsset].asset}
                  alt="asset"
                />{' '}
                <div className="value">{constants.CONTRACT_TOKEN_ADDRESS[currentAsset].symbol} Overview</div>
              </AssetSelectWrapper>
            </div>
          </div>
          <div className="flex just-between">
            <div className="apy-section">
              <p className="price">
                {`$${new BigNumber(marketInfo.underlyingPrice || 0)
                  .div(
                    new BigNumber(10).pow(
                      18 + 18 - parseInt(settings.decimals[currentAsset].token || 0)
                    )
                  )
                  .dp(2, 1)
                  .toString(10)}`} USD
              </p>
              <p className="apy-value">{currentAPY}%</p>
              <p className="apy-label">
                {(currentMarket || 'supply') === 'supply' ? 'Deposit APY' : 'Borrow APY'}
              </p>
            </div>
            <div className="historic-label">Historical rates</div>
          </div>
          <OverviewChart marketType={currentMarket || 'supply'} data={data} />
          <div className="description">
            <p className="label">Market Liquidity</p>
            <p className="value">{`${format(new BigNumber(marketInfo.cash || 0)
              .div(new BigNumber(10).pow(settings.decimals[currentAsset].token))
              .dp(4, 1)
              .toString(10))} ${marketInfo.underlyingSymbol || ''}`}
            </p>
          </div>
          <div className="description">
            <p className="label"># of Suppliers</p>
            <p className="value">{format(marketInfo.supplierCount)}</p>
          </div>
          <div className="description">
            <p className="label"># of Borrowers</p>
            <p className="value">{format(marketInfo.borrowerCount)}</p>
          </div>
          <div className="description">
            <p className="label">Reserves</p>
            <p className="value">{`${new BigNumber(marketInfo.totalReserves || 0).div(new BigNumber(10).pow(settings.decimals[currentAsset].token)).dp(8, 1).toString(10)} ${marketInfo.underlyingSymbol || ''}`}</p>
          </div>
          <div className="description">
            <p className="label">Reserve Factor</p>
            <p className="value">{`${new BigNumber(marketInfo.reserveFactor || 0).div(new BigNumber(10).pow(18)).multipliedBy(100).dp(8, 1).toString(10)}%`}</p>
          </div>
          <div className="description">
            <p className="label">Collateral Factor</p>
            <p className="value">{`${new BigNumber(marketInfo.collateralFactor || 0).div(new BigNumber(10).pow(18)).times(100).dp(2, 1).toString(10)}%`}</p>
          </div>
          <div className="description">
            <p className="label">Total Supply</p>
            <p className="value">
              {currencyFormatter(marketInfo.totalSupplyUsd || 0)}
            </p>
          </div>
          <div className="description">
            <p className="label">Total Borrow</p>
            <p className="value">
              {currencyFormatter(marketInfo.totalBorrowsUsd || 0)}
            </p>
          </div>
          <div className="description">
            <p className="label">Exchange Rate</p>
            <p className="value">
              {`1 ${marketInfo.underlyingSymbol || ''} = ${Number(new BigNumber(1).div(new BigNumber(marketInfo.exchangeRate)
                .div(
                  new BigNumber(10).pow(
                    18 +
                      +parseInt(settings.decimals[currentAsset || 'usdc'].token) -
                      +parseInt(settings.decimals[currentAsset || 'usdc'].stoken)
                  )
                ))
                .toString(10)).toFixed(6)} ${marketInfo.symbol || ''}`}
            </p>
          </div>
        </OverviewWrapper>
      </CardWrapper>
    </Card>
  );
}

Overview.propTypes = {
  currentMarket: PropTypes.string.isRequired,
  settings: PropTypes.object,
  getMarketHistory: PropTypes.func.isRequired
};

Overview.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { getMarketHistory } = accountActionCreators;

  return bindActionCreators(
    {
      getMarketHistory
    },
    dispatch
  );
};

export default compose(connectAccount(mapStateToProps, mapDispatchToProps))(
  Overview
);
