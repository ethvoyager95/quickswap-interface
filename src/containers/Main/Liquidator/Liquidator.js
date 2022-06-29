import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import MainLayout from 'containers/Layout/MainLayout';
import { connectAccount, accountActionCreators } from 'core';
import { Input, Button } from 'antd';
import styled from 'styled-components';
import iconSearch from 'assets/img/liquidator-search.svg';
import iconFilter from 'assets/img/liquidator-filter.svg';
import ModalLiquidations from './ModalLiquidations';

const SearchBar = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 30px;
  margin-bottom: 28px;

  .label {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #0b0f23;
    margin-bottom: 12px;
  }

  .address {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    margin-bottom: 16px;

    .message {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #06c270;
    }

    .refresh {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      text-decoration-line: underline;
      color: #6d6f7b;
      align-self: flex-end;
    }

    .text-input {
      display: flex;
      align-items: center;
      height: 50px;
      width: 100%;

      input {
        padding-left: 20px;
        height: 50px;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.03);
        border-radius: 8px 0 0 8px;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #6d6f7b;
        border-right: 0;
      }

      .search-btn {
        width: 50px;
        height: 50px;
        background: #107def;
        border-radius: 0px 8px 8px 0px;
        border-left: 0;
      }
    }
    .recent-btn {
      width: 228px;
      height: 50px;
      background: #3b54b5;
      border-radius: 8px;
      font-style: normal;
      font-weight: 900;
      font-size: 18px;
      line-height: 25px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const WalletInfo = styled.div`
  display: grid;
  column-gap: 28px;
  grid-template-columns: 2fr 3fr;
  margin-bottom: 30px;

  .details {
    background: #ffffff;
    border-radius: 5px;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    color: #6d6f7b;
    padding: 24px 40px;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;

      .black-value {
        color: #0b0f23;
      }

      .blue-value {
        color: #107def;
      }

      .flex-value {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
    }

    .item:last-child {
      margin-bottom: 0;
    }

    .item:nth-child(4),
    .item:nth-child(5) {
      align-items: flex-start;
    }
  }

  .liquidate-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .liquidate {
      background: #ffffff;
      border-radius: 5px;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 28px;
      color: #6d6f7b;
      padding: 24px 40px;
      width: 100%;
      height: 100%;

      .title {
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #0b0f23;
        margin-bottom: 12px;
      }

      .balance {
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 40px;

        span {
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          color: #107def;
        }
      }

      .liquidate-btn-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 60px;

        div {
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          color: #0b0f23;
        }

        button {
          width: 140px;
          height: 50px;
          background: #107def;
          box-shadow: 0px 3px 20px rgba(18, 114, 236, 0.4);
          border-radius: 8px;
          font-style: normal;
          font-weight: 900;
          font-size: 18px;
          color: #ffffff;
        }
      }

      .gas-price {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #9d9fa7;
      }
    }
  }
`;

const BlockLabel = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #6d6f7b;
  margin-bottom: 14px;
`;

function Liquidator() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleCancel = () => {
    setIsOpenModal(false);
  };

  return (
    <MainLayout>
      <SearchBar>
        <div className="label">Search address to liquidate</div>
        <div className="address">
          <div className="text-input">
            <Input placeholder="0xbfr2zs203..." />
            <Button className="search-btn">
              <img src={iconSearch} alt="" />
            </Button>
          </div>
          <Button className="recent-btn" onClick={() => setIsOpenModal(true)}>
            Recent Liquidations
          </Button>
        </div>
        <div className="address">
          <div className="message">This account can be liquidated</div>
          <div className="refresh">Refresh</div>
        </div>
      </SearchBar>
      <WalletInfo>
        <div className="details">
          <div className="item">
            <div>Account Health</div>
            <div className="black-value">0</div>
          </div>
          <div className="item">
            <div>Asset to Repay</div>
            <div className="black-value">BUSD</div>
          </div>
          <div className="item">
            <div>Asset to Seize</div>
            <div className="black-value">USDT</div>
          </div>
          <div className="item">
            <div>Max Repay Amount</div>
            <div className="flex-value">
              <div className="blue-value">0.06 BUSD</div>
              <div>$0.06</div>
            </div>
          </div>
          <div className="item">
            <div>Max Seize Amount</div>
            <div className="flex-value">
              <div className="blue-value">0.06 BUSD</div>
              <div>$0.06</div>
            </div>
          </div>
        </div>
        <div className="liquidate-wrapper">
          <div className="liquidate">
            <div className="title">Search address to liquidate</div>
            <div className="text-input">
              <Input placeholder="0" />
              <Button className="search-btn">
                <img src={iconSearch} alt="" />
              </Button>
            </div>
            <div className="balance">
              Wallet balance <span>0 LTC</span>
            </div>
            <div className="liquidate-btn-wrapper">
              <div>
                You will repay 0.06 BUSD $0.06 and reize 0.06 USDT $0.06
              </div>
              <Button>Liquidate</Button>
            </div>
            <div className="gas-price">
              <div>Account health is updated every 2 seconds</div>
              <img src={iconFilter} alt="" />
            </div>
          </div>
        </div>
      </WalletInfo>
      <BlockLabel>block# 18964980</BlockLabel>
      <ModalLiquidations isOpenModal={isOpenModal} onCancel={handleCancel} />
    </MainLayout>
  );
}

Liquidator.propTypes = {};

Liquidator.defaultProps = {};

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

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Liquidator);
