import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import { Input, Button } from 'antd';
import iconSearch from 'assets/img/liquidator-search.svg';
import usdt from 'assets/img/coins/usdt.png';
import iconSort from 'assets/img/icon-sort.svg';
import {
  STable,
  THeadWrapper,
  Timestamp,
  SeizedAndRepay,
  BorrowerAndLiquidator,
  CustomModal,
  ModalContent
} from './style';
import './overide.scss';

function ModalLiquidations({ isOpenModal, onCancel }) {
  const dataRecentTable = [
    {
      timestamp: '20/06/2022 19:31',
      iconSeized: usdt,
      valueSeized: '100',
      symbolSeized: 'USDT',
      valueSeizedToDollar: '10',
      iconRepay: usdt,
      valueRepay: '100',
      symbolRepay: 'USDT',
      valueRepayToDollar: '10',
      borrower: '0x5edA1...EA02F',
      liquidator: '0x5edA1...EA02F'
    },
    {
      timestamp: '20/06/2022 19:31',
      iconSeized: usdt,
      valueSeized: '100',
      symbolSeized: 'USDT',
      valueSeizedToDollar: '10',
      iconRepay: usdt,
      valueRepay: '100',
      symbolRepay: 'USDT',
      valueRepayToDollar: '10',
      borrower: '0x5edA1...EA02F',
      liquidator: '0x5edA1...EA02F'
    },
    {
      timestamp: '20/06/2022 19:31',
      iconSeized: usdt,
      valueSeized: '100',
      symbolSeized: 'USDT',
      valueSeizedToDollar: '10',
      iconRepay: usdt,
      valueRepay: '100',
      symbolRepay: 'USDT',
      valueRepayToDollar: '10',
      borrower: '0x5edA1...EA02F',
      liquidator: '0x5edA1...EA02F'
    },
    {
      timestamp: '20/06/2022 19:31',
      iconSeized: usdt,
      valueSeized: '100',
      symbolSeized: 'USDT',
      valueSeizedToDollar: '10',
      iconRepay: usdt,
      valueRepay: '100',
      symbolRepay: 'USDT',
      valueRepayToDollar: '10',
      borrower: '0x5edA1...EA02F',
      liquidator: '0x5edA1...EA02F'
    },
    {
      timestamp: '20/06/2022 19:31',
      iconSeized: usdt,
      valueSeized: '100',
      symbolSeized: 'USDT',
      valueSeizedToDollar: '10',
      iconRepay: usdt,
      valueRepay: '100',
      symbolRepay: 'USDT',
      valueRepayToDollar: '10',
      borrower: '0x5edA1...EA02F',
      liquidator: '0x5edA1...EA02F'
    },
    {
      timestamp: '20/06/2022 19:31',
      iconSeized: usdt,
      valueSeized: '100',
      symbolSeized: 'USDT',
      valueSeizedToDollar: '10',
      iconRepay: usdt,
      valueRepay: '100',
      symbolRepay: 'USDT',
      valueRepayToDollar: '10',
      borrower: '0x5edA1...EA02F',
      liquidator: '0x5edA1...EA02F'
    },
    {
      timestamp: '20/06/2022 19:31',
      iconSeized: usdt,
      valueSeized: '100',
      symbolSeized: 'USDT',
      valueSeizedToDollar: '10',
      iconRepay: usdt,
      valueRepay: '100',
      symbolRepay: 'USDT',
      valueRepayToDollar: '10',
      borrower: '0x5edA1...EA02F',
      liquidator: '0x5edA1...EA02F'
    },
    {
      timestamp: '20/06/2022 19:31',
      iconSeized: usdt,
      valueSeized: '100',
      symbolSeized: 'USDT',
      valueSeizedToDollar: '10',
      iconRepay: usdt,
      valueRepay: '100',
      symbolRepay: 'USDT',
      valueRepayToDollar: '10',
      borrower: '0x5edA1...EA02F',
      liquidator: '0x5edA1...EA02F'
    }
  ];

  const columns = [
    {
      title: () => (
        <THeadWrapper>
          <div>Timestamp</div>
          <img src={iconSort} alt="" />
        </THeadWrapper>
      ),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render(_, asset) {
        return {
          children: <Timestamp>{asset.timestamp || '-'}</Timestamp>
        };
      }
    },
    {
      title: () => (
        <THeadWrapper>
          <div>Seized Tokens</div>
          <img src={iconSort} alt="" />
        </THeadWrapper>
      ),
      dataIndex: 'valueSeized',
      key: 'valueSeized',
      render(_, asset) {
        return {
          children: (
            <SeizedAndRepay>
              {asset.iconSeized && <img src={asset.iconSeized} alt="" />}
              <div>
                <span>
                  {asset.valueSeized} {asset.symbolSeized}
                </span>
                <span>${asset.valueSeizedToDollar}</span>
              </div>
            </SeizedAndRepay>
          )
        };
      }
    },
    {
      title: () => (
        <THeadWrapper>
          <div>Repay Amount</div>
          <img src={iconSort} alt="" />
        </THeadWrapper>
      ),
      dataIndex: 'valueSeized',
      key: 'valueSeized',
      render(_, asset) {
        return {
          children: (
            <SeizedAndRepay>
              {asset.iconSeized && <img src={asset.iconSeized} alt="" />}
              <div>
                <span>
                  {asset.valueSeized} {asset.symbolSeized}
                </span>
                <span>${asset.valueSeizedToDollar}</span>
              </div>
            </SeizedAndRepay>
          )
        };
      }
    },
    {
      title: () => <THeadWrapper>Borrower</THeadWrapper>,
      dataIndex: 'borrower',
      key: 'borrower',
      render(_, asset) {
        return {
          children: (
            <BorrowerAndLiquidator>
              {asset.borrower || '-'}
            </BorrowerAndLiquidator>
          )
        };
      }
    },
    {
      title: () => <THeadWrapper>Liquidator</THeadWrapper>,
      dataIndex: 'borrower',
      key: 'borrower',
      render(_, asset) {
        return {
          children: (
            <BorrowerAndLiquidator>
              {asset.borrower || '-'}
            </BorrowerAndLiquidator>
          )
        };
      }
    }
  ];

  return (
    <CustomModal
      centered
      width="1200px"
      visible={isOpenModal}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
    >
      <ModalContent>
        <div className="title">Recent Liquidations</div>
        <div className="search-label">Search by borrower address</div>
        <div className="search-input">
          <Input placeholder="Search by borrower's address" />
          <Button className="search-btn">
            <img src={iconSearch} alt="" />
          </Button>
        </div>
        <STable
          liquidatorTable
          columns={columns}
          dataSource={dataRecentTable}
          pagination={false}
          // rowKey={record => record.id}
        />
      </ModalContent>
    </CustomModal>
  );
}

ModalLiquidations.propTypes = {
  isOpenModal: PropTypes.bool,
  onCancel: PropTypes.func
};

ModalLiquidations.defaultProps = {
  isOpenModal: false,
  onCancel: {}
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

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(ModalLiquidations);
