/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import MainLayout from 'containers/Layout/MainLayout';
import iconLink from 'assets/img/link.svg';
import iconInfo from 'assets/img/info.svg';
import iconFilter from 'assets/img/filter.svg';
import noData from 'assets/img/no_data.svg';
import { connectAccount, accountActionCreators } from 'core';
import { Tooltip, Dropdown, Input, Button, Pagination, DatePicker } from 'antd';
import dayjs from 'dayjs';
import {
  formatTxn,
  initFilter,
  initPagination,
  LIMIT,
  tooltipContent,
  tabsTransaction,
  headers as headersCSV
} from './helper';
import {
  TabsWrapper,
  SDivFlex,
  THeadWrapper,
  STable,
  Hash,
  Method,
  Value,
  SButton,
  DropdownBlock,
  DropdownAddress,
  PaginationWrapper,
  NoData
} from './style';

function History({ settings }) {
  const [currentTab, setCurrentTab] = useState('all');
  const [dataTransactions, setDataTransaction] = useState([]);
  const [dataExportCSV, setDataExportCSV] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState();
  const [visibleBlock, setVisibleBlock] = useState(false);
  const [visibleAge, setVisibleAge] = useState(false);
  const [visibleFrom, setVisibleFrom] = useState(false);
  const [visibleTo, setVisibleTo] = useState(false);
  const [filterCondition, setFilterCondition] = useState(initFilter);
  const [pagination, setPagination] = useState(initPagination);
  const [currentPage, setCurrentPage] = useState(1);

  const getDataTransactions = async (filter, paginationQuery) => {
    const res = await axios.get(
      `${
        process.env.REACT_APP_ENV === 'dev'
          ? `${process.env.REACT_APP_DEVELOPMENT_API}`
          : `${process.env.REACT_APP_PRODUCTION_API}`
      }/user/history`,
      {
        params: {
          ...filter,
          ...paginationQuery
        }
      }
    );
    const { data } = res.data;
    return data;
  };

  const handleExportCSV = async filter => {
    const res = await getDataTransactions(filter);
    setDataExportCSV(formatTxn(res.rows));
  };

  const getDataTable = async (filter, paginationQuery = initPagination) => {
    const res = await getDataTransactions(filter, paginationQuery);
    setDataTransaction(formatTxn(res.rows));
    setTotalTransactions(res.count);
  };

  const handleVisibleBlockChange = flag => {
    setVisibleBlock(flag);
  };

  const handleVisibleAgeChange = flag => {
    setVisibleAge(flag);
  };

  const handleVisibleFromChange = flag => {
    setVisibleFrom(flag);
  };

  const handleVisibleToChange = flag => {
    setVisibleTo(flag);
  };

  const handleInputBlockChange = (value, type) => {
    if (type === 'from') {
      filterCondition.from_block = String(value);
      setFilterCondition(filterCondition);
    }
    if (type === 'to') {
      filterCondition.to_block = String(value);
      setFilterCondition(filterCondition);
    }
  };

  const handleInputAddressChange = (value, type) => {
    if (type === 'from') {
      filterCondition.from_address = value;
      setFilterCondition(filterCondition);
    }
    if (type === 'to') {
      filterCondition.to_address = value;
      setFilterCondition(filterCondition);
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    setPagination(initFilter);
    getDataTable(filterCondition);
    setVisibleAge(false);
    setVisibleBlock(false);
    setVisibleFrom(false);
    setVisibleTo(false);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    pagination.offset = (+page - 1) * LIMIT;
    setPagination(pagination);
    getDataTable(filterCondition, pagination);
  };

  const handleAgeStartChange = (_, dateString) => {
    if (dateString !== 'NaN') {
      filterCondition.from_date = dayjs(dateString).unix();
      setFilterCondition(filterCondition);
    } else {
      delete filterCondition.from_date;
      setFilterCondition(filterCondition);
    }
  };

  const handleAgeEndChange = (_, dateString) => {
    if (dateString !== 'NaN') {
      filterCondition.to_date = dayjs(dateString).unix();
      setFilterCondition(filterCondition);
    } else {
      delete filterCondition.to_date;
      setFilterCondition(filterCondition);
    }
  };

  useEffect(() => {
    if (currentTab === 'user') {
      filterCondition.from_address = settings.selectedAddress;
      setFilterCondition(filterCondition);
    } else if (currentTab === 'all') {
      delete filterCondition.from_address;
      setFilterCondition(filterCondition);
    }
    handleExportCSV(filterCondition);
    getDataTable(filterCondition);
  }, [currentTab]);

  const blockFilter = (
    <DropdownBlock>
      <div className="item">
        <div>From</div>
        <Input
          placeholder="Block Number"
          onChange={e => handleInputBlockChange(e.target.value, 'from')}
        />
      </div>
      <div className="item">
        <div>To</div>
        <Input
          placeholder="Block Number"
          onChange={e => handleInputBlockChange(e.target.value, 'to')}
        />
      </div>
      <Button onClick={() => handleFilter()}>Filter</Button>
    </DropdownBlock>
  );

  const timestampFilter = (
    <DropdownBlock>
      <div className="item">
        <div>From</div>
        <DatePicker placeholder="mm/dd/yyyy" onChange={handleAgeStartChange} />
      </div>
      <div className="item">
        <div>To</div>
        <DatePicker placeholder="mm/dd/yyyy" onChange={handleAgeEndChange} />
      </div>
      <Button onClick={() => handleFilter()}>Filter</Button>
    </DropdownBlock>
  );

  const addressFromFilter = (
    <DropdownAddress>
      <div>
        <Input
          className="input-address"
          placeholder="Search by address e.g 0x..."
          onChange={e => handleInputAddressChange(e.target.value, 'from')}
        />
      </div>
      <Button onClick={() => handleFilter()}>Filter</Button>
    </DropdownAddress>
  );

  const addressToFilter = (
    <DropdownAddress>
      <div>
        <Input
          className="input-address"
          placeholder="Search by address e.g 0x..."
          onChange={e => handleInputAddressChange(e.target.value, 'to')}
        />
      </div>
      <Button onClick={() => handleFilter()}>Filter</Button>
    </DropdownAddress>
  );

  const columns = [
    {
      title: () => <THeadWrapper>Txn Hash</THeadWrapper>,
      dataIndex: 'txHash',
      key: 'txHash',
      render(_, asset) {
        return {
          children: (
            <Hash
              href={`${process.env.REACT_APP_ETH_EXPLORER}/tx/${asset.txHash}`}
              target="_blank"
            >
              {`${asset.txHash.substr(0, 6)}...`}
            </Hash>
          )
        };
      }
    },
    {
      title: () => (
        <THeadWrapper>
          <div>Method</div>
          <Tooltip placement="top" title={tooltipContent}>
            <SButton>
              <img src={iconInfo} alt="" />
            </SButton>
          </Tooltip>
        </THeadWrapper>
      ),
      dataIndex: 'method',
      key: 'method',
      render(_, asset) {
        return {
          children: (
            <Method>
              <div>{asset.method}</div>
            </Method>
          )
        };
      }
    },
    {
      title: () => (
        <THeadWrapper>
          Block{' '}
          <Dropdown
            overlay={blockFilter}
            trigger={['click']}
            onVisibleChange={handleVisibleBlockChange}
            visible={visibleBlock}
          >
            <SButton onClick={e => e.preventDefault()}>
              <img src={iconFilter} alt="" />
            </SButton>
          </Dropdown>
        </THeadWrapper>
      ),
      dataIndex: 'blockNumber',
      key: 'blockNumber',
      render(_, asset) {
        return {
          children: (
            <Hash
              href={`${process.env.REACT_APP_ETH_EXPLORER}/block/${asset.blockNumber}`}
              target="_blank"
            >
              {asset.blockNumber}
            </Hash>
          )
        };
      }
    },
    {
      title: () => (
        <THeadWrapper>
          Age{' '}
          <Dropdown
            overlay={timestampFilter}
            trigger={['click']}
            onVisibleChange={handleVisibleAgeChange}
            visible={visibleAge}
          >
            <SButton onClick={e => e.preventDefault()}>
              <img src={iconFilter} alt="" />
            </SButton>
          </Dropdown>
        </THeadWrapper>
      ),
      dataIndex: 'age',
      key: 'age',
      render(_, asset) {
        return {
          children: <Value>{asset.age}</Value>
        };
      }
    },
    {
      title: () => (
        <THeadWrapper>
          From{' '}
          <Dropdown
            overlay={addressFromFilter}
            trigger={['click']}
            onVisibleChange={handleVisibleFromChange}
            visible={visibleFrom}
          >
            <SButton onClick={e => e.preventDefault()}>
              <img src={iconFilter} alt="" />
            </SButton>
          </Dropdown>
        </THeadWrapper>
      ),
      dataIndex: 'from',
      key: 'from',
      render(_, asset) {
        return {
          children: (
            <Hash
              href={`${process.env.REACT_APP_ETH_EXPLORER}/address/${asset.userAddress}`}
              target="_blank"
            >
              {asset.userAddress.substr(0, 4)}...
              {asset.userAddress.substr(asset.to.length - 4, 4)}
            </Hash>
          )
        };
      }
    },
    {
      title: () => (
        <THeadWrapper>
          To{' '}
          <Dropdown
            overlay={addressToFilter}
            trigger={['click']}
            onVisibleChange={handleVisibleToChange}
            visible={visibleTo}
          >
            <SButton onClick={e => e.preventDefault()}>
              <img src={iconFilter} alt="" />
            </SButton>
          </Dropdown>
        </THeadWrapper>
      ),
      dataIndex: 'to',
      key: 'to',
      render(_, asset) {
        return {
          children: (
            <Hash
              href={`${process.env.REACT_APP_ETH_EXPLORER}/address/${asset.to}`}
              target="_blank"
            >
              {asset.to.substr(0, 4)}...
              {asset.to.substr(asset.to.length - 4, 4)}
            </Hash>
          )
        };
      }
    },
    {
      title: () => <THeadWrapper>Value</THeadWrapper>,
      dataIndex: 'value',
      key: 'value',
      render(_, asset) {
        return {
          children: <Value>{asset.value}</Value>
        };
      }
    }
  ];

  const locale = {
    emptyText: (
      <NoData>
        <img src={noData} alt="No data" />
        <div>No record was found</div>
      </NoData>
    )
  };

  return (
    <MainLayout>
      <TabsWrapper>
        {tabsTransaction.map(tab => (
          <div
            key={tab}
            onClick={() => {
              setCurrentTab(tab);
              setPagination(initPagination);
            }}
            className={currentTab === tab ? 'active' : ''}
          >
            {tab === 'all' ? 'All Transactions' : 'User Transactions'}
          </div>
        ))}
      </TabsWrapper>
      <SDivFlex>
        <div>
          Download{' '}
          {dataExportCSV && (
            <CSVLink
              data={dataExportCSV}
              headers={headersCSV}
              filename="TOTAL_TRANSACTION.xls"
              target="_blank"
            >
              <SButton>
                <span className="text-blue">
                  CSV Export
                  <img src={iconLink} alt="" />
                </span>
              </SButton>
            </CSVLink>
          )}
        </div>
      </SDivFlex>
      <STable
        locale={locale}
        columns={columns}
        dataSource={dataTransactions}
        pagination={false}
        rowKey={record => record.id}
      />
      <PaginationWrapper>
        <Pagination
          defaultPageSize={LIMIT}
          defaultCurrent={1}
          current={currentPage}
          onChange={e => handlePageChange(e)}
          total={totalTransactions}
        />
      </PaginationWrapper>
    </MainLayout>
  );
}

History.propTypes = {
  settings: PropTypes.object
};

History.defaultProps = {
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

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(History);
