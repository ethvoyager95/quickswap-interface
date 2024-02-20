import React, { useState } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { compose } from 'recompose';
import commaNumber from 'comma-number';
import { connectAccount } from 'core';
import { getComptrollerContract, methods } from 'utilities/ContractService';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Label } from 'components/Basic/Label';
import CollateralConfirmModal from 'components/Basic/CollateralConfirmModal';
import Toggle from 'components/Basic/Toggle';
import MarketTable from 'components/Basic/Table';
import PendingTransaction from 'components/Basic/PendingTransaction';
import { currencyFormatter, shortenNumberFormatter } from 'utilities/common';
import { useInstance } from 'hooks/useContract';

const SupplyMarketWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 6px;
`;

const format = commaNumber.bindWith(',', '.');

function SupplyMarket({
  settings,
  suppliedAssets,
  remainAssets,
  setSelectedAsset,
  intl
}) {
  const instance = useInstance(settings.walletConnected);
  const [isOpenCollateralConfirm, setIsCollateralConfirm] = useState(false);
  const [isCollateralEnalbe, setIsCollateralEnable] = useState(true);

  const handleToggleCollateral = r => {
    if (!settings.selectedAddress) {
      message.error(
        intl.formatMessage({
          id: 'Please_connect_your_wallet'
        })
      );
      return;
    }
    const appContract = getComptrollerContract(instance);
    if (r && settings.selectedAddress && r.borrowBalance.isZero()) {
      if (!r.collateral) {
        setIsCollateralEnable(false);
        setIsCollateralConfirm(true);
        methods
          .send(
            instance,
            appContract.methods.enterMarkets,
            [[r.stokenAddress]],
            settings.selectedAddress
          )
          .then(res => {
            setIsCollateralConfirm(false);
          })
          .catch(() => {
            setIsCollateralConfirm(false);
          });
      } else if (
        +r.hypotheticalLiquidity['1'] > 0 ||
        +r.hypotheticalLiquidity['2'] === 0
      ) {
        setIsCollateralEnable(true);
        setIsCollateralConfirm(true);
        methods
          .send(
            instance,
            appContract.methods.exitMarket,
            [r.stokenAddress],
            settings.selectedAddress
          )
          .then(res => {
            setIsCollateralConfirm(false);
          })
          .catch(() => {
            setIsCollateralConfirm(false);
          });
      } else {
        message.error(
          intl.formatMessage({
            id: 'You_need_to_set_collateral'
          })
        );
      }
    } else {
      message.error(
        intl.formatMessage({
          id: 'You_need_to_set_collateral'
        })
      );
    }
  };

  const supplyColumns = [
    {
      title: <FormattedMessage id="Asset" />,
      dataIndex: 'asset',
      key: 'asset',
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
                  {asset.supplyApy.dp(2, 1).toString(10)}%
                </Label>
              </div>
            </div>
          )
        };
      }
    },
    {
      title: <FormattedMessage id="APY" />,
      dataIndex: 'supplyApy',
      key: 'supplyApy',
      render(supplyApy, asset) {
        const apy = settings.withSTRK
          ? supplyApy.plus(asset.strkSupplyApy)
          : supplyApy;
        return {
          children: (
            <div className="apy-content">
              <span />
              <div className="apy-green-label">
                {shortenNumberFormatter(apy.dp(2, 1).toString(10))}%
              </div>
            </div>
          )
        };
      }
    },
    {
      title: <FormattedMessage id="Wallet" />,
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
      title: <FormattedMessage id="Collateral" />,
      dataIndex: 'collateral',
      key: 'collateral',
      render(collateral, asset) {
        return {
          children: +asset.collateralFactor.toString() ? (
            <Toggle
              checked={collateral}
              onChecked={() => handleToggleCollateral(asset)}
            />
          ) : null
        };
      }
    }
  ];

  const suppliedColumns = [
    {
      title: <FormattedMessage id="Asset" />,
      dataIndex: 'asset',
      key: 'asset',
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
                  {asset.supplyApy.dp(2, 1).toString(10)}%
                </Label>
              </div>
            </div>
          )
        };
      }
    },
    {
      title: <FormattedMessage id="APY_Earned" />,
      dataIndex: 'supplyApy',
      key: 'supplyApy',
      render(supplyApy, asset) {
        const apy = settings.withSTRK
          ? supplyApy.plus(asset.strkSupplyApy)
          : supplyApy;
        return {
          children: (
            <div className="apy-content">
              <span />
              <div className="apy-green-label">
                {shortenNumberFormatter(apy.dp(2, 1).toString(10))}%
              </div>
            </div>
          )
        };
      }
    },
    {
      title: <FormattedMessage id="Balance" />,
      dataIndex: 'supplyBalance',
      key: 'supplyBalance',
      render(supplyBalance, asset) {
        return {
          children: (
            <div className="wallet-label flex flex-column">
              <Label size="14" primary>
                {currencyFormatter(supplyBalance.times(asset.tokenPrice))}
              </Label>
              <Label size="14">
                {format(supplyBalance.dp(4, 1).toString(10))} {asset.symbol}
              </Label>
            </div>
          )
        };
      }
    },
    {
      title: <FormattedMessage id="Collateral" />,
      dataIndex: 'collateral',
      key: 'collateral',
      render(collateral, asset) {
        return {
          children: +asset.collateralFactor ? (
            <Toggle
              checked={collateral}
              onChecked={() => handleToggleCollateral(asset)}
            />
          ) : null
        };
      }
    }
  ];
  return (
    <SupplyMarketWrapper>
      {suppliedAssets.length === 0 && remainAssets.length === 0 && (
        <LoadingSpinner />
      )}
      {suppliedAssets.length > 0 && (
        <MarketTable
          columns={suppliedColumns}
          data={suppliedAssets}
          title="Supplied"
          handleClickRow={row => setSelectedAsset(row)}
        />
      )}
      {settings.pendingInfo &&
        settings.pendingInfo.status &&
        ['Supply', 'Withdraw'].includes(settings.pendingInfo.type) && (
          <PendingTransaction />
        )}
      {remainAssets.length > 0 && (
        <MarketTable
          columns={supplyColumns}
          data={remainAssets}
          title="Supply"
          handleClickRow={row => setSelectedAsset(row)}
        />
      )}
      {isOpenCollateralConfirm && (
        <CollateralConfirmModal
          visible={isOpenCollateralConfirm}
          isCollateralEnalbe={isCollateralEnalbe}
          onCancel={() => setIsCollateralConfirm(false)}
        />
      )}
    </SupplyMarketWrapper>
  );
}

SupplyMarket.propTypes = {
  suppliedAssets: PropTypes.array,
  remainAssets: PropTypes.array,
  settings: PropTypes.object,
  setSelectedAsset: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

SupplyMarket.defaultProps = {
  suppliedAssets: [],
  remainAssets: [],
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default injectIntl(
  compose(connectAccount(mapStateToProps, undefined))(SupplyMarket)
);
