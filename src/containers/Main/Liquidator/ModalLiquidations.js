import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import { Input, Button, DatePicker } from 'antd';
import iconSort from 'assets/img/icon-sort.svg';
import iconSortActive from 'assets/img/sort-highlight.svg';
import noData from 'assets/img/no_data.svg';
import moment from 'moment';

import {
  STable,
  THeadWrapper,
  Timestamp,
  SeizedAndRepay,
  BorrowerAndLiquidator,
  CustomModal,
  ModalContent,
  NoData
} from './style';
import './overide.scss';
import { formatRecentRecord } from './helper';

function ModalLiquidations({ isOpenModal, onCancel }) {
  const [dataRecentTable, setDataRecentTable] = useState([]);
  const [borrower, setBorrower] = useState('');
  const [errorMess, setErrorMess] = useState('');
  const [fromDateValue, setFromDateValue] = useState('');
  const [fromDateDisplay, setFromDateDisplay] = useState('');
  const [toDateValue, setToDateValue] = useState('');
  const [toDateDisplay, setToDateDisplay] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [currentSortTimestamp, setCurrentSortTimestamp] = useState('');
  const [currentSortSeize, setCurrentSortSeize] = useState('');
  const [currentSortRepay, setCurrentSortRepay] = useState('');

  const getDataRecent = async () => {
    const res = await axios.get(
      `${
        process.env.REACT_APP_ENV === 'dev'
          ? `${process.env.REACT_APP_DEVELOPMENT_API}`
          : `${process.env.REACT_APP_PRODUCTION_API}`
      }/liquidator`,
      {
        params: {
          borrower_address: borrower || undefined,
          from_date: fromDateValue || undefined,
          to_date: toDateValue || undefined,
          order_by: orderBy || undefined,
          order_direction:
            currentSortTimestamp ||
            currentSortSeize ||
            currentSortRepay ||
            undefined
        }
      }
    );
    const { data } = res.data;

    setDataRecentTable(formatRecentRecord(data));
  };

  useEffect(() => {
    getDataRecent();
  }, [orderBy, currentSortTimestamp, currentSortSeize, currentSortRepay]);

  const handleInputChange = value => {
    const validateAddress = Web3.utils.isAddress(value);
    if (!String(value)) {
      setErrorMess('');
      setBorrower('');
      return;
    }
    if (validateAddress) {
      setErrorMess('');
      setBorrower(value);
    } else {
      setErrorMess('Please enter a valid address');
      setBorrower(value);
    }
  };

  const handleSearchByBorrower = () => {
    setOrderBy('');
    setCurrentSortTimestamp('');
    setCurrentSortSeize('');
    setCurrentSortRepay('');
    getDataRecent();
  };

  const handleFromDateChange = (date, dateString) => {
    if (date && dateString) {
      setFromDateDisplay(date);
      setFromDateValue(
        moment(date)
          .startOf('day')
          .unix()
      );
    } else {
      setFromDateDisplay('');
      setFromDateValue('');
    }
  };

  const handleToDateChange = (date, dateString) => {
    if (date && dateString) {
      setToDateDisplay(date);
      setToDateValue(
        moment(date)
          .endOf('day')
          .unix()
      );
    } else {
      setToDateDisplay('');
      setToDateValue('');
    }
  };

  const handleSortByTimestamp = () => {
    setOrderBy('blockTimestamp');
    if (currentSortTimestamp === 'DESC') {
      setCurrentSortTimestamp('ASC');
      setCurrentSortSeize('');
      setCurrentSortRepay('');
    } else {
      setCurrentSortTimestamp('DESC');
      setCurrentSortSeize('');
      setCurrentSortRepay('');
    }
  };

  const handleSortBySeize = () => {
    setOrderBy('totalPriceSeize');
    if (currentSortSeize === 'DESC') {
      setCurrentSortSeize('ASC');
      setCurrentSortTimestamp('');
      setCurrentSortRepay('');
    } else {
      setCurrentSortSeize('DESC');
      setCurrentSortTimestamp('');
      setCurrentSortRepay('');
    }
  };

  const handleSortByRepay = () => {
    setOrderBy('totalPriceRepay');
    if (currentSortRepay === 'DESC') {
      setCurrentSortRepay('ASC');
      setCurrentSortSeize('');
      setCurrentSortTimestamp('');
    } else {
      setCurrentSortRepay('DESC');
      setCurrentSortSeize('');
      setCurrentSortTimestamp('');
    }
  };

  const handleLink = txHash => {
    window.open(`${process.env.REACT_APP_ETH_EXPLORER}/tx/${txHash}`, '_blank');
  };

  const columns = [
    {
      title: () => (
        <THeadWrapper sorted onClick={handleSortByTimestamp}>
          <div>Timestamp</div>
          {!currentSortTimestamp && <img src={iconSort} alt="" />}
          {currentSortTimestamp === 'DESC' && (
            <img src={iconSortActive} alt="" />
          )}
          {currentSortTimestamp === 'ASC' && (
            <img src={iconSortActive} alt="" className="asc" />
          )}
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
        <THeadWrapper sorted onClick={handleSortBySeize}>
          <div>Seized Tokens</div>
          {!currentSortSeize && <img src={iconSort} alt="" />}
          {currentSortSeize === 'DESC' && <img src={iconSortActive} alt="" />}
          {currentSortSeize === 'ASC' && (
            <img src={iconSortActive} alt="" className="asc" />
          )}
        </THeadWrapper>
      ),
      dataIndex: 'seizeAmountEther',
      key: 'seizeAmountEther',
      render(_, asset) {
        return {
          children: (
            <SeizedAndRepay>
              {asset.logoSeize && <img src={asset.logoSeize} alt="" />}
              <div>
                <span className="black">
                  {asset.seizeAmountEther} {asset.symbolSeizeToken}
                </span>
              </div>
            </SeizedAndRepay>
          )
        };
      }
    },
    {
      title: () => (
        <THeadWrapper sorted onClick={handleSortByRepay}>
          <div>Repay Amount</div>
          {!currentSortRepay && <img src={iconSort} alt="" />}
          {currentSortRepay === 'DESC' && <img src={iconSortActive} alt="" />}
          {currentSortRepay === 'ASC' && (
            <img src={iconSortActive} alt="" className="asc" />
          )}
        </THeadWrapper>
      ),
      dataIndex: 'repayAmountEther',
      key: 'repayAmountEther',
      render(_, asset) {
        return {
          children: (
            <SeizedAndRepay>
              {asset.logoRepay && <img src={asset.logoRepay} alt="" />}
              <div>
                <span className="black">
                  {asset.repayAmountEther} {asset.symbolRepayToken}
                </span>
                <span className="gray">${asset.repayAmountUsd}</span>
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
            <BorrowerAndLiquidator title={asset.borrower}>
              {asset.borrower
                ? `${asset.borrower.substr(0, 4)}...${asset.borrower.substr(
                    asset.borrower.length - 4,
                    4
                  )}`
                : '-'}
            </BorrowerAndLiquidator>
          )
        };
      }
    },
    {
      title: () => <THeadWrapper>Liquidator</THeadWrapper>,
      dataIndex: 'liquidator',
      key: 'liquidator',
      render(_, asset) {
        return {
          children: (
            <BorrowerAndLiquidator title={asset.liquidator}>
              {asset.liquidator
                ? `${asset.liquidator.substr(0, 4)}...${asset.liquidator.substr(
                    asset.liquidator.length - 4,
                    4
                  )}`
                : '-'}
            </BorrowerAndLiquidator>
          )
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
            <SeizedAndRepay>
              {asset.logoRepay && <img src={asset.logoRepay} alt="" />}
              <div>{asset.symbolRepayToken}</div>
            </SeizedAndRepay>
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
            <SeizedAndRepay>
              {asset.logoSeize && <img src={asset.logoSeize} alt="" />}
              <div>{asset.symbolSeizeToken}</div>
            </SeizedAndRepay>
          )
        };
      }
    }
  ];

  const locale = {
    emptyText: (
      <NoData>
        <>
          <img src={noData} alt="No data" />
          <div>No record was found </div>
        </>
      </NoData>
    )
  };

  return (
    <CustomModal
      centered
      width="1350px"
      visible={isOpenModal}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
    >
      <ModalContent>
        <div className="title">Recent Liquidations</div>
        <div className="search-label">Search by borrower address</div>
        <div className="input-wrapper">
          <div className="search-input">
            <Input
              placeholder="Search by address"
              onChange={e => handleInputChange(e.target.value)}
            />
            {errorMess && <div className="error-mess-mobile">{errorMess}</div>}
          </div>
          <div className="date-picker-wrapper">
            <div className="date-picker">
              <span className="date-picker-label">From</span>
              <DatePicker
                defaultPickerValue={moment(fromDateDisplay, 'DD/MM/YYYY')}
                value={fromDateDisplay !== '' ? moment(fromDateDisplay) : null}
                format="DD/MM/YYYY"
                placeholder="dd/mm/yyyy"
                onChange={handleFromDateChange}
              />
            </div>
            <div className="date-picker">
              <span className="date-picker-label">To</span>
              <DatePicker
                defaultPickerValue={moment(toDateDisplay, 'DD/MM/YYYY')}
                value={toDateDisplay !== '' ? moment(toDateDisplay) : null}
                format="DD/MM/YYYY"
                placeholder="dd/mm/yyyy"
                onChange={handleToDateChange}
              />
            </div>
          </div>
          <Button className="search-btn" onClick={handleSearchByBorrower}>
            Search
          </Button>
        </div>
        {errorMess && <div className="error-mess">{errorMess}</div>}
        <STable
          liquidatorTable
          locale={locale}
          columns={columns}
          dataSource={dataRecentTable}
          pagination={false}
          rowKey={record => record.id}
          onRow={record => {
            return {
              onClick: () => handleLink(record.txHash) // click row
            };
          }}
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
