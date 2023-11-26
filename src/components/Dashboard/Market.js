import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import SupplyMarket from 'components/Dashboard/Market/SupplyMarket';
import BorrowMarket from 'components/Dashboard/Market/BorrowMarket';
import { Card } from 'components/Basic/Card';
import { getBigNumber } from 'utilities/common';
import SupplyModal from 'components/Basic/Supply/SupplyModal';
import BorrowModal from 'components/Basic/Borrow/BorrowModal';

const MarketWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  margin-top: 20px;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const MarketWrapperMobile = styled.div`
  display: none;

  @media only screen and (max-width: 768px) {
    display: block;
    width: 100%;
  }
`;

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  padding: 15px 14px;
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;

  .apy-toggle {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .toggel-label {
      margin: 5px 10px;
    }
  }
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
  .tab-item {
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 48%;
    height: 41px;
    color: var(--color-text-secondary);
    border-bottom: 1px solid var(--color-text-secondary);
    margin: 1% 0px;
    font-size: 17px;
    font-weight: 600;
  }
  .tab-active {
    color: var(--color-white);
    border-bottom: 1px solid var(--color-white);
  }
`;

const TabContent = styled.div`
  width: 100%;
  height: calc(100% - 75px);
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;

const Market = ({ currentMarket, setCurrentMarket, settings, setSetting }) => {
  const [suppliedAssets, setSuppliedAssets] = useState([]);
  const [nonSuppliedAssets, setNonSuppliedAssets] = useState([]);
  const [borrowedAssets, setBorrowedAssets] = useState([]);
  const [nonBorrowedAssets, setNonBorrowedAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState({});
  const [isOpenSupplyModal, setIsOpenSupplyModal] = useState(false);
  const [isOpenBorrowModal, setIsOpenBorrowModal] = useState(false);

  const updateMarketTable = async () => {
    const tempArr = [];
    settings.assetList
      .filter(asset => asset.deprecated === false)
      .forEach(item => {
        if (item) {
          const temp = {
            ...item,
            supplyApy: getBigNumber(item.supplyApy),
            borrowApy: getBigNumber(item.borrowApy),
            walletBalance: getBigNumber(item.walletBalance),
            supplyBalance: getBigNumber(item.supplyBalance),
            sTokenBalance: getBigNumber(item.sTokenBalance),
            borrowBalance: getBigNumber(item.borrowBalance),
            collateralFactor: getBigNumber(item.collateralFactor),
            tokenPrice: getBigNumber(item.tokenPrice),
            liquidity: getBigNumber(item.liquidity)
          };
          tempArr.push(temp);
        }
      });

    const tempSuppliedData = [];
    const tempNonSuppliableData = [];
    const tempBorrowedData = [];
    const tempNonBorrowedData = [];
    tempArr.forEach(element => {
      if (element.supplyBalance.isZero()) {
        tempNonSuppliableData.push(element);
      } else {
        tempSuppliedData.push(element);
      }

      if (element.borrowBalance.isZero()) {
        tempNonBorrowedData.push(element);
      } else {
        tempBorrowedData.push(element);
      }
    });
    setSuppliedAssets([...tempSuppliedData]);
    setNonSuppliedAssets([...tempNonSuppliableData]);
    setBorrowedAssets([...tempBorrowedData]);
    setNonBorrowedAssets([...tempNonBorrowedData]);
  };

  useEffect(() => {
    if (settings.assetList && settings.assetList.length > 0) {
      updateMarketTable();
    }
  }, [settings.assetList]);

  useEffect(() => {
    if (
      settings.selectedAsset &&
      Object.keys(settings.selectedAsset).length > 0
    ) {
      return;
    }
    if (currentMarket === 'supply') {
      if (suppliedAssets.length > 0) {
        setSelectedAsset(suppliedAssets[0]);
      } else {
        setSelectedAsset(nonSuppliedAssets[0]);
      }
      return;
    }

    if (borrowedAssets.length > 0) {
      setSelectedAsset(borrowedAssets[0]);
    } else {
      setSelectedAsset(nonSuppliedAssets[0]);
    }
  }, [
    currentMarket,
    suppliedAssets,
    nonSuppliedAssets,
    borrowedAssets,
    nonBorrowedAssets,
    setSetting
  ]);

  useEffect(() => {
    if (selectedAsset && selectedAsset.id) {
      setSetting({ selectedAsset });
    }
  }, [selectedAsset]);

  return (
    <Card>
      <MarketWrapper>
        <CardWrapper>
          <SupplyMarket
            suppliedAssets={suppliedAssets}
            remainAssets={nonSuppliedAssets}
            setSelectedAsset={asset => {
              setSelectedAsset(asset);
              setIsOpenSupplyModal(true);
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <BorrowMarket
            borrowedAssets={borrowedAssets}
            remainAssets={nonBorrowedAssets}
            setSelectedAsset={asset => {
              setSelectedAsset(asset);
              setIsOpenBorrowModal(true);
            }}
          />
        </CardWrapper>
      </MarketWrapper>
      <MarketWrapperMobile>
        <CardWrapper>
          <TabContainer>
            <Tabs>
              <div
                className={`tab-item center ${
                  currentMarket === 'supply' ? 'tab-active' : ''
                }`}
                onClick={() => {
                  setCurrentMarket('supply');
                }}
              >
                Supply Market
              </div>
              <div
                className={`tab-item center ${
                  currentMarket === 'borrow' ? 'tab-active' : ''
                }`}
                onClick={() => {
                  setCurrentMarket('borrow');
                }}
              >
                Borrow Market
              </div>
            </Tabs>
          </TabContainer>
          <TabContent>
            {currentMarket === 'supply' && (
              <SupplyMarket
                suppliedAssets={suppliedAssets}
                remainAssets={nonSuppliedAssets}
                setSelectedAsset={asset => {
                  setSelectedAsset(asset);
                  setIsOpenSupplyModal(true);
                }}
              />
            )}
            {currentMarket === 'borrow' && (
              <BorrowMarket
                borrowedAssets={borrowedAssets}
                remainAssets={nonBorrowedAssets}
                setSelectedAsset={asset => {
                  setSelectedAsset(asset);
                  setIsOpenBorrowModal(true);
                }}
              />
            )}
          </TabContent>
        </CardWrapper>
      </MarketWrapperMobile>
      <SupplyModal
        visible={isOpenSupplyModal}
        onCancel={() => setIsOpenSupplyModal(false)}
      />
      <BorrowModal
        visible={isOpenBorrowModal}
        onCancel={() => setIsOpenBorrowModal(false)}
      />
    </Card>
  );
};

Market.propTypes = {
  currentMarket: PropTypes.string.isRequired,
  setCurrentMarket: PropTypes.func.isRequired,
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired
};

Market.defaultProps = {
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

export default compose(connectAccount(mapStateToProps, mapDispatchToProps))(
  Market
);
