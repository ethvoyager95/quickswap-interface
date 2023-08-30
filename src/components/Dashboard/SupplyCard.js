import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { Card } from 'components/Basic/Card';
import SupplySection from 'components/Basic/Supply/SupplySection';
import WithdrawSection from 'components/Basic/Supply/WithdrawSection';
import BorrowSection from 'components/Basic/Borrow/BorrowSection';
import RepaySection from 'components/Basic/Borrow/RepaySection';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { connectAccount } from 'core';
import metaMaskImg from 'assets/img/metamask.png';
import { addToken, getBigNumber } from 'utilities/common';
import { useProvider } from 'hooks/useContract';

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  padding: 20px;

  .header {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    gap: 10px;

    img {
      width: 40px;
      height: 40px;
    }

    .title {
      font-size: 20px;
      font-weight: 700;
      color: white;
    }
  }

  .loading-section {
    padding: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .add-token-wrapper {
    justify-content: flex-end;
    color: var(--color-text-main);

    @media only screen and (max-width: 1496px) {
      width: 100%;
      margin-left: 0px;
    }

    .add-token {
      font-size: 18px;
      color: var(--color-green);
      margin-left: 10px;
    }

    .underlying-asset,
    .stoken-asset {
      margin-right: 20px;
    }
    img {
      width: 20px;
    }
  }
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 0;

  .tab-item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 50%;
    height: 41px;
    color: var(--color-text-secondary);
    border-bottom: 1px solid var(--color-text-secondary);
    margin: 0px;
    font-size: 17px;
    font-weight: 600;
  }
  .tab-active {
    color: var(--color-white);
    border-bottom: 1px solid var(--color-white);
  }
`;

function SupplyCard({ currentMarket, settings }) {
  const provider = useProvider(settings.walletConnected);
  const [currentTab, setCurrentTab] = useState('supply');
  const [currentAsset, setCurrentAsset] = useState({});

  useEffect(() => {
    if (currentMarket) {
      setCurrentTab(currentMarket);
    }
  }, [currentMarket]);

  useEffect(() => {
    const asset = settings.selectedAsset;
    if (asset) {
      setCurrentAsset({
        ...asset,
        supplyApy: getBigNumber(asset.supplyApy),
        borrowApy: getBigNumber(asset.borrowApy),
        walletBalance: getBigNumber(asset.walletBalance),
        supplyBalance: getBigNumber(asset.supplyBalance),
        sTokenBalance: getBigNumber(asset.sTokenBalance),
        borrowBalance: getBigNumber(asset.borrowBalance),
        collateralFactor: getBigNumber(asset.collateralFactor),
        tokenPrice: getBigNumber(asset.tokenPrice),
        liquidity: getBigNumber(asset.liquidity)
      });
    }
  }, [settings.selectedAsset]);

  useEffect(() => {
    if (currentAsset.id === 'ust' && currentMarket === 'supply') {
      setCurrentTab('withdraw');
    } else if (currentAsset.borrowPaused && currentMarket === 'borrow') {
      setCurrentTab('repay');
    } else {
      setCurrentTab(currentMarket);
    }
  }, [currentAsset.id, currentMarket]);

  return (
    <Card>
      <CardWrapper>
        <div className="header">
          <img src={currentAsset.img} alt="asset" />
          <div className="title">{currentAsset.name}</div>
        </div>
        {provider && currentAsset.id && (
          <div className="flex align-center add-token-wrapper">
            {currentAsset.id !== 'eth' && (
              <div className="flex align-center underlying-asset">
                {currentAsset.id.toUpperCase()}
                <img
                  className="add-token pointer"
                  src={metaMaskImg}
                  onClick={() =>
                    addToken(
                      currentAsset.id,
                      settings.decimals[currentAsset.id].token,
                      'token'
                    )
                  }
                  alt=""
                />
              </div>
            )}
            <div className="flex align-center stoken-asset">
              {`s${
                currentAsset.id === 'wbtc'
                  ? 'BTC'
                  : currentAsset.id.toUpperCase()
              }`}
              <img
                className="add-token pointer"
                src={metaMaskImg}
                onClick={() =>
                  addToken(
                    currentAsset.id,
                    settings.decimals[currentAsset.id].stoken,
                    'stoken'
                  )
                }
                alt=""
              />
            </div>
          </div>
        )}
        {currentMarket === 'supply' ? (
          <>
            <Tabs>
              {currentAsset.id !== 'ust' && (
                <div
                  className={`tab-item center ${
                    currentTab === 'supply' ? 'tab-active' : ''
                  }`}
                  onClick={() => {
                    setCurrentTab('supply');
                  }}
                >
                  Supply
                </div>
              )}
              <div
                className={`tab-item center ${
                  currentTab === 'withdraw' ? 'tab-active' : ''
                }`}
                onClick={() => {
                  setCurrentTab('withdraw');
                }}
              >
                Withdraw
              </div>
            </Tabs>
            {!currentAsset || Object.keys(currentAsset).length === 0 ? (
              <div className="loading-section">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {currentTab === 'supply' && (
                  <SupplySection asset={currentAsset} />
                )}
                {currentTab === 'withdraw' && (
                  <WithdrawSection asset={currentAsset} />
                )}
              </>
            )}
          </>
        ) : (
          <>
            <Tabs>
              {!currentAsset.borrowPaused && (
                <div
                  className={`tab-item center ${
                    currentTab === 'borrow' ? 'tab-active' : ''
                  }`}
                  onClick={() => {
                    setCurrentTab('borrow');
                  }}
                >
                  Borrow
                </div>
              )}
              <div
                className={`tab-item center ${
                  currentTab === 'repay' ? 'tab-active' : ''
                }`}
                onClick={() => {
                  setCurrentTab('repay');
                }}
              >
                Repay Borrow
              </div>
            </Tabs>
            {!currentAsset || Object.keys(currentAsset).length === 0 ? (
              <div className="loading-section">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {currentTab === 'borrow' && (
                  <BorrowSection asset={currentAsset} />
                )}
                {currentTab === 'repay' && (
                  <RepaySection asset={currentAsset} />
                )}
              </>
            )}
          </>
        )}
      </CardWrapper>
    </Card>
  );
}

SupplyCard.propTypes = {
  currentMarket: PropTypes.string.isRequired,
  settings: PropTypes.object
};

SupplyCard.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, null))(SupplyCard);
