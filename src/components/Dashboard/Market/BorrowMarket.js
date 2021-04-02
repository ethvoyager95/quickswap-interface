import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Icon } from 'antd';
import { compose } from 'recompose';
import { connectAccount } from 'core';
import commaNumber from 'comma-number';
import { Label } from 'components/Basic/Label';
import MarketTable from 'components/Basic/Table';
import PendingTransaction from 'components/Basic/PendingTransaction';
import { getBigNumber, currencyFormatter } from 'utilities/common';
import BigNumber from 'bignumber.js';

const BorrowMarketWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 6px;
`;

const format = commaNumber.bindWith(',', '.');

function BorrowMarket({
  settings,
  borrowedAssets,
  remainAssets,
  setSelectedAsset
}) {
  const remainColumns = [
    {
      title: 'Asset',
      dataIndex: 'img',
      key: 'img',
      render(img, asset) {
        return {
          children: (
            <div className="flex align-center">
              <img src={asset.img} alt="ethereum" />
              <div className="flex flex-column align-start">
                <Label size="14" primary>
                  {asset.name}
                </Label>
                <Label size="14">
                  {asset.borrowApy.dp(2, 1).toString(10)}%
                </Label>
              </div>
            </div>
          )
        };
      }
    },
    {
      title: 'APY',
      dataIndex: 'borrowApy',
      key: 'borrowApy',
      render(borrowApy, asset) {
        const apy = settings.withSTRK
          ? getBigNumber(asset.strkBorrowApy).minus(borrowApy)
          : borrowApy;
        return {
          children: (
            <div className="apy-content">
              {settings.withSTRK ? (
                getBigNumber(asset.strkBorrowApy).minus(borrowApy).isNegative() ? <span className="red" /> : <span />
              ) : (
                <span className="red" />
              )}
              <div
                className={
                  settings.withSTRK ? (getBigNumber(asset.strkBorrowApy).minus(borrowApy).isNegative() ? 'apy-red-label' : 'apy-green-label') : 'apy-red-label'
                }
              >
                {apy.absoluteValue().dp(2, 1).toString(10)}%
              </div>
            </div>
          )
        };
      }
    },
    {
      title: 'Wallet',
      dataIndex: 'walletBalance',
      key: 'walletBalance',
      render(walletBalance, asset) {
        return {
          children: (
            <Label size="14" primary>
              {format(walletBalance.dp(2, 1).toString(10))} {asset.symbol}
            </Label>
          )
        };
      }
    },
    {
      title: 'Liquidity',
      dataIndex: 'liquidity',
      key: 'liquidity',
      render(liquidity) {
        return {
          children: (
            <Label size="14" primary>
              {currencyFormatter(liquidity)}
            </Label>
          )
        };
      }
    }
  ];

  const borrowColumns = [
    {
      title: 'Asset',
      dataIndex: 'img',
      key: 'img',
      render(img, asset) {
        return {
          children: (
            <div className="flex align-center">
              <img src={asset.img} alt="ethereum" />
              <div className="flex flex-column align-start">
                <Label size="14" primary>
                  {asset.name}
                </Label>
                <Label size="14">
                  {asset.borrowApy.dp(2, 1).toString(10)}%
                </Label>
              </div>
            </div>
          )
        };
      }
    },
    {
      title: 'APY / Accrued',
      dataIndex: 'borrowApy',
      key: 'borrowApy',
      render(borrowApy, asset) {
        const apy = settings.withSTRK
          ? getBigNumber(asset.strkBorrowApy).minus(borrowApy).isNegative() ? new BigNumber(0) : getBigNumber(asset.strkBorrowApy).minus(borrowApy)
          : borrowApy;
        return {
          children: (
            <div className="apy-content">
              {settings.withSTRK ? <span /> : <span className="red" />}
              <div
                className={
                  settings.withSTRK ? 'apy-green-label' : 'apy-red-label'
                }
              >
                {apy.dp(2, 1).toString(10)}%
              </div>
            </div>
          )
        };
      }
    },
    {
      title: 'Balance',
      dataIndex: 'borrowBalance',
      key: 'borrowBalance',
      render(borrowBalance, asset) {
        return {
          children: (
            <div className="wallet-label flex flex-column">
              <Label size="14" primary>
                {currencyFormatter(borrowBalance.times(asset.tokenPrice))}
              </Label>
              <Label size="14">
                {format(borrowBalance.dp(4, 1).toString(10))} {asset.symbol}
              </Label>
            </div>
          )
        };
      }
    },
    {
      title: '% Of Limit',
      dataIndex: 'percentOfLimit',
      key: 'percentOfLimit',
      render(percentOfLimit) {
        return {
          children: <Label size="14" primary>{percentOfLimit}%</Label>
        };
      }
    }
  ];

  return (
    <BorrowMarketWrapper>
      {borrowedAssets.length === 0 && remainAssets.length === 0 && (
        <LoadingSpinner />
      )}
      {borrowedAssets.length > 0 && (
        <MarketTable
          columns={borrowColumns}
          data={borrowedAssets}
          title="Borrowing"
          handleClickRow={row => setSelectedAsset(row)}
        />
      )}
      {settings.pendingInfo &&
        settings.pendingInfo.status &&
        ['Borrow', 'Repay Borrow'].includes(settings.pendingInfo.type) && (
          <PendingTransaction />
        )}
      {remainAssets.length > 0 && (
        <MarketTable
          columns={remainColumns}
          data={remainAssets}
          title="All Markets"
          handleClickRow={row => setSelectedAsset(row)}
        />
      )}
    </BorrowMarketWrapper>
  );
}

BorrowMarket.propTypes = {
  borrowedAssets: PropTypes.array,
  remainAssets: PropTypes.array,
  settings: PropTypes.object.isRequired,
  setSelectedAsset: PropTypes.func.isRequired
};

BorrowMarket.defaultProps = {
  borrowedAssets: [],
  remainAssets: []
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(
  BorrowMarket
);
