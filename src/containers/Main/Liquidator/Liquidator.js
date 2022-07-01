import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import MainLayout from 'containers/Layout/MainLayout';
import { connectAccount, accountActionCreators } from 'core';
import { Input, Button } from 'antd';
import iconSearch from 'assets/img/liquidator-search.svg';
import iconFilter from 'assets/img/liquidator-filter.svg';
import usdt from 'assets/img/coins/usdt.png';
import iconDropdown from 'assets/img/icon-dropdown.svg';
import ModalLiquidations from './ModalLiquidations';
import {
  STable,
  THeadWrapper,
  Health,
  Address,
  TdWithImg,
  SearchBar,
  WalletInfo,
  BlockLabel
} from './style';

function Liquidator() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleCancel = () => {
    setIsOpenModal(false);
  };

  const dataAddressTable = [
    {
      health: '0',
      account: '0xb5...3382',
      fakeLogo: usdt,
      repay: 500,
      maxRepay: 500,
      seize: 500,
      maxSeize: 500
    },
    {
      health: '0',
      account: '0xb5...3382',
      fakeLogo: usdt,
      repay: 500,
      maxRepay: 500,
      seize: 500,
      maxSeize: 500
    },
    {
      health: '0',
      account: '0xb5...3382',
      fakeLogo: usdt,
      repay: 500,
      maxRepay: 500,
      seize: 500,
      maxSeize: 500
    },
    {
      health: '0',
      account: '0xb5...3382',
      fakeLogo: usdt,
      repay: 500,
      maxRepay: 500,
      seize: 500,
      maxSeize: 500
    },
    {
      health: '0',
      account: '0xb5...3382',
      fakeLogo: usdt,
      repay: 500,
      maxRepay: 500,
      seize: 500,
      maxSeize: 500
    },
    {
      health: '0',
      account: '0xb5...3382',
      fakeLogo: usdt,
      repay: 500,
      maxRepay: 500,
      seize: 500,
      maxSeize: 500
    },
    {
      health: '0',
      account: '0xb5...3382',
      fakeLogo: usdt,
      repay: 500,
      maxRepay: 500,
      seize: 500,
      maxSeize: 500
    },
    {
      health: '0',
      account: '0xb5...3382',
      fakeLogo: usdt,
      repay: 500,
      maxRepay: 500,
      seize: 500,
      maxSeize: 500
    }
  ];

  const columns = [
    {
      title: () => <THeadWrapper>Health</THeadWrapper>,
      dataIndex: 'health',
      key: 'health',
      render(_, asset) {
        return {
          children: <Health>{asset.health || '-'}</Health>
        };
      }
    },
    {
      title: () => <THeadWrapper>Account</THeadWrapper>,
      dataIndex: 'account',
      key: 'account',
      render(_, asset) {
        return {
          children: <Address>{asset.account}</Address>
        };
      }
    },
    {
      title: () => <THeadWrapper>Asset To Repay</THeadWrapper>,
      dataIndex: 'repay',
      key: 'repay',
      render(_, asset) {
        return {
          children: (
            <TdWithImg>
              <img src={asset.fakeLogo} alt="" />
              <div>{asset.repay} USDT</div>
            </TdWithImg>
          )
        };
      }
    },
    {
      title: () => (
        <THeadWrapper>
          <div>Max Repay Amount</div>
        </THeadWrapper>
      ),
      dataIndex: 'maxRepay',
      key: 'maxRepay',
      render(_, asset) {
        return {
          children: (
            <TdWithImg>
              <img src={asset.fakeLogo} alt="" />
              <div>{asset.maxRepay} USDT</div>
            </TdWithImg>
          )
        };
      }
    },
    {
      title: () => <THeadWrapper>Asset To Seize</THeadWrapper>,
      dataIndex: 'seize',
      key: 'seize',
      render(_, asset) {
        return {
          children: (
            <TdWithImg>
              <img src={asset.fakeLogo} alt="" />
              <div>{asset.seize} USDT</div>
            </TdWithImg>
          )
        };
      }
    },
    {
      title: () => <THeadWrapper>Max Seize Amount</THeadWrapper>,
      dataIndex: 'maxSeize',
      key: 'maxSeize',
      render(_, asset) {
        return {
          children: (
            <TdWithImg>
              <img src={asset.fakeLogo} alt="" />
              <div>{asset.maxSeize} USDT</div>
            </TdWithImg>
          )
        };
      }
    }
  ];

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
            <div className="black-value flex-gap6">
              <img src={usdt} alt="" />
              <div>USDT</div>
              <img src={iconDropdown} alt="" />
            </div>
          </div>
          <div className="item">
            <div>Asset to Seize</div>
            <div className="black-value flex-gap6">
              <img src={usdt} alt="" />
              <div>USDT</div>
              <img src={iconDropdown} alt="" />
            </div>
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
            <div className="title">
              Amount you want to repay in <img src={usdt} alt="" /> USDT
            </div>
            <div className="text-input">
              <Input placeholder="0" />
              <div className="max-btn">Max</div>
            </div>
            <div className="balance">
              Wallet balance <span>0 LTC</span>
            </div>
            <div className="liquidate-btn-wrapper">
              <div>
                You will repay <span className="text-blue">0.06 BUSD</span>{' '}
                <span className="text-gray">$0.06</span> and reize{' '}
                <span className="text-blue">0.06 USDT</span>{' '}
                <span className="text-gray">$0.06</span>
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
      <STable
        columns={columns}
        dataSource={dataAddressTable}
        pagination={false}
        // rowKey={record => record.id}
      />
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
