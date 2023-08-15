import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { compose } from 'recompose';
import { connectAccount } from 'core';
import metaMaskImg from 'assets/img/metamask.png';
import { addToken, getBigNumber } from 'utilities/common';
import { Modal } from 'antd';
import closeImg from 'assets/img/close.png';
import BorrowSection from './BorrowSection';
import RepaySection from './RepaySection';

const ModalContent = styled.div`
  border-radius: 6px;
  padding: 27px 32px 23px 32px;
  color: white;
  gap: 25px;
  user-select: none;

  .close-btn {
    position: absolute;
    top: 30px;
    right: 32px;
    z-index: 2;
  }

  .header {
    width: 100%;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;

    &:hover {
      transition: all 0.3s;
      color: rgba(39, 126, 230, 0.7);

      svg path {
        transition: all 0.3s;
        fill: rgba(39, 126, 230, 0.7);
      }
    }
  }

  .fiat-option {
    width: 100%;
    height: 212px;
    border-radius: 6px;
    border: 1px solid var(--color-text-secondary);
  }

  .disconnect-button {
    width: 100%;
    font-weight: 500;
    font-size: 18px;
    padding: 10px 0px;
    border-radius: 6px;
    border: 1px solid var(--color-text-secondary);
    text-align: center;
    cursor: pointer;
  }
`;

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background-color: var(--color-bg-primary);

  .header {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 40px;
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
    justify-content: flex-start;
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

function BorrowModal({ visible, onCancel, settings }) {
  const [currentTab, setCurrentTab] = useState('borrow');
  const [currentAsset, setCurrentAsset] = useState({});

  useEffect(() => {
    if (currentAsset.id === 'ust' || currentAsset.borrowPaused)
      setCurrentTab('repay');
    else setCurrentTab('borrow');
  }, [currentAsset]);

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

  return (
    <Modal
      id="info-modal"
      className="info-modal"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      maskClosable
      centered
    >
      <ModalContent className="flex flex-column align-center just-center">
        <img
          className="close-btn pointer"
          src={closeImg}
          alt="close"
          onClick={onCancel}
        />

        <CardWrapper>
          <div className="header">
            <img src={currentAsset.img} alt="asset" />
            <div className="title">{currentAsset.name}</div>
          </div>
          {window.ethereum &&
            window.ethereum.networkVersion &&
            currentAsset.id && (
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
          <>
            <Tabs>
              {currentAsset.id !== 'ust' && !currentAsset.borrowPaused && (
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
        </CardWrapper>
      </ModalContent>
    </Modal>
  );
}

BorrowModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  settings: PropTypes.object
};

BorrowModal.defaultProps = {
  visible: false,
  onCancel: () => {},
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, null))(BorrowModal);
