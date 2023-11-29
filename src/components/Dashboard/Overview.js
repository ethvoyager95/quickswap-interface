import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import BigNumber from 'bignumber.js';
import { bindActionCreators } from 'redux';
import commaNumber from 'comma-number';
import { connectAccount, accountActionCreators } from 'core';
import OverviewChart from 'components/Basic/OverviewChart';
import CoinInfo from 'components/Dashboard/CoinInfo';
import BorrowLimit from 'components/Dashboard/BorrowLimit';
import WalletBalance from 'components/Dashboard/WalletBalance';
import { promisify } from 'utilities';
import * as constants from 'utilities/constants';
import {
  getBigNumber,
  currencyFormatter,
  shortenNumberFormatter
} from 'utilities/common';
import { Card } from 'components/Basic/Card';

const CardWrapper = styled.div`
  width: 100%;
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  display: grid;
  grid-template-columns: 2fr 1px 1fr;
  column-gap: 20px;
  padding: 25px 30px;

  .divider {
    border-left: 1px solid #34384c;
  }

  @media only screen and (max-width: 1024px) {
    padding: 16px 16px;
    grid-template-columns: 1fr;

    .divider {
      width: 100%;
      border-bottom: 1px solid #34384c;
    }
  }
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
      color: #277ee6;
      font-size: 17px;
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
    setCurrentAsset(
      settings.selectedAsset && settings.selectedAsset.id
        ? settings.selectedAsset.id
        : 'usdc'
    );
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
        settings.assetList.filter(s => s?.id === currentAsset).length !== 0
          ? settings.assetList.filter(s => s?.id === currentAsset)[0]
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
        <WalletBalance />
        <div className="divider" />
        <BorrowLimit />
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
