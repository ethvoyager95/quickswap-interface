/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import MainLayout from 'containers/Layout/MainLayout';
import iconLink from 'assets/img/link.svg';
import iconInfo from 'assets/img/info.svg';
import iconFilter from 'assets/img/filter.svg';
import { connectAccount, accountActionCreators } from 'core';
import { Table, Tooltip, Dropdown, Input, Button, Pagination } from 'antd';
import commaNumber from 'comma-number';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';

const TabsWrapper = styled.div`
  display: flex;
  gap: 45px;
  align-items: center;
  font-style: normal;
  font-weight: 900;
  font-size: 25px;
  line-height: 27px;
  color: #0b0f23;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0 16px 20px;

  div {
    opacity: 0.5;
    padding-bottom: 8px;
    cursor: pointer;
  }

  .active {
    opacity: 1;
    border-bottom: 3px solid #107def;
  }
`;

const SDivFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: rgba(11, 15, 35, 0.5);
  margin: 0 16px 28px;

  .highlight {
    color: #000000;
  }

  img {
    margin-left: 12px;
  }
`;

const THeadWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #9d9fa7;
`;

const STable = styled(Table)`
  background: #ffffff;
  border-radius: 5px;
  padding-left: 40px;
  padding-right: 40px;
  margin: 0 16px 20px;
  overflow-x: auto;

  .ant-table-thead {
    tr {
      th {
        color: var(--color-text-secondary);
        font-size: 16px;
        line-height: 24px;
        font-weight: normal;
        background: var(--color-bg-primary);
        text-align: right;

        &:nth-child(1) {
          text-align: left;
        }
      }
    }
  }

  .ant-table-tbody {
    tr {
      td {
        font-weight: normal;
        text-align: right;

        &:nth-child(1) {
          text-align: left;
        }
      }
    }
    tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
      background: #ffffff;
    }
  }
`;

const Hash = styled.a`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  color: #107def;
  cursor: pointer;
`;

const Method = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  div {
    background: #e0effa;
    border-radius: 5px;
    padding: 4px 14px;
    text-align: center;
    font-style: normal;
    font-weight: 900;
    font-size: 12px;
    line-height: 19px;
    color: #107def;
  }
`;

const Value = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  color: #000000;
`;

const SButton = styled.button`
  background-color: transparent;
  padding: 0;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: transparent !important;
  }
`;

const DropdownBlock = styled.div`
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 20px;

  .item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;

    div {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #141414;
    }
  }

  button {
    background: #107def;
    border-radius: 8px;
    width: 99px;
    height: 40px;
    color: #ffffff;
  }
`;

const DropdownAddress = styled.div`
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 30px;

  button {
    background: #107def;
    border-radius: 8px;
    width: 140px;
    height: 40px;
    color: #ffffff;
  }
`;

const PaginationWrapper = styled.div`
  text-align: right;
  margin: 0 16px 50px;
`;

const LIMIT = 10;
const OFFSET = 0;

function History({ settings }) {
  const [currentTab, setCurrentTab] = useState('all');
  const [dataTransactions, setDataTransaction] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState();
  const [visibleBlock, setVisibleBlock] = useState(false);
  const [visibleAge, setVisibleAge] = useState(false);
  const [visibleFrom, setVisibleFrom] = useState(false);
  const [visibleTo, setVisibleTo] = useState(false);
  const [filterCondition, setFilterCondition] = useState({});
  const [pagination, setPagination] = useState({
    limit: LIMIT,
    offset: OFFSET
  });

  const [currentPage, setCurrentPage] = useState(1);

  const format = commaNumber.bindWith(',', '.');

  const formatNumber = valueWei => {
    const valueEther = Web3.utils.fromWei(valueWei, 'ether');
    if (valueEther < 0.00001) return '<0.00001';
    return format(new BigNumber(valueEther || 0).dp(4, 1).toString(10));
  };

  const formatAge = timestamp => {
    const ageTimestamp = +dayjs(Date.now()).unix() - +timestamp;
    if (ageTimestamp < 60) {
      return `${ageTimestamp} seconds ago`;
    }
    if (ageTimestamp < 60 * 60) {
      return `${parseInt(ageTimestamp / 60, 10)} minutes ago`;
    }
    if (ageTimestamp < 60 * 60 * 24) {
      return `${parseInt(ageTimestamp / (60 * 24), 10)} hours ago`;
    }
    if (ageTimestamp < 60 * 60 * 24 * 30) {
      return `${parseInt(ageTimestamp / (60 * 24 * 30), 10)} days ago`;
    }
    if (ageTimestamp < 60 * 60 * 24 * 30 * 12) {
      return `${parseInt(ageTimestamp / (60 * 24 * 30 * 12), 10)} months ago`;
    }
    return `${parseInt(ageTimestamp, 10)} seconds ago`;
  };

  const tabsTransaction = ['all', 'user'];

  const tooltipContent =
    'Function executed based on decoded input data. For unidentified functions, method ID is displayed instead.';

  const getDataTransactions = async () => {
    const res = await axios.get(
      `${
        process.env.REACT_APP_ENV === 'dev'
          ? `${process.env.REACT_APP_DEVELOPMENT_API}`
          : `${process.env.REACT_APP_PRODUCTION_API}`
      }/user/history`,
      {
        params: {
          ...filterCondition,
          ...pagination
        }
      }
    );
    const { data } = res.data;
    setDataTransaction(data.rows);
    setTotalTransactions(data.count);
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
      filterCondition.from_block = value;
      setFilterCondition(filterCondition);
    } else {
      filterCondition.to_block = value;
      setFilterCondition(filterCondition);
    }
  };

  const handleInputAddressChange = (value, type) => {
    if (type === 'from') {
      filterCondition.from_address = value;
      setFilterCondition(filterCondition);
    } else {
      filterCondition.to_address = value;
      setFilterCondition(filterCondition);
    }
  };

  const handleFilter = () => {
    getDataTransactions();
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    pagination.offset = (+page - 1) * LIMIT;
    setPagination(pagination);
  };

  useEffect(() => {
    if (currentTab === 'user') {
      filterCondition.from_address = settings.selectedAddress;
    }
    getDataTransactions();
  }, [currentTab, filterCondition, pagination]);

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
        <Input placeholder="Block Number" />
      </div>
      <div className="item">
        <div>To</div>
        <Input placeholder="Block Number" />
      </div>
      <Button onClick={() => handleFilter()}>Filter</Button>
    </DropdownBlock>
  );

  const addressFromFilter = (
    <DropdownAddress>
      <div>
        <Input
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
              <div>{asset.action}</div>
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
      dataIndex: 'blockTimestamp',
      key: 'blockTimestamp',
      render(_, asset) {
        return {
          children: <Value>{formatAge(asset.blockTimestamp)}</Value>
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
      dataIndex: 'userAddress',
      key: 'userAddress',
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
      dataIndex: 'amount',
      key: 'amount',
      render(_, asset) {
        return {
          children: <Value>{formatNumber(asset.amount)}</Value>
        };
      }
    }
  ];

  return (
    <MainLayout>
      <TabsWrapper>
        {tabsTransaction.map(tab => (
          <div
            key={tab}
            onClick={() => {
              setCurrentTab(tab);
              pagination.offset = OFFSET;
              setPagination(pagination);
            }}
            className={currentTab === tab ? 'active' : ''}
          >
            {tab === 'all' ? 'All Transactions' : 'User Transactions'}
          </div>
        ))}
      </TabsWrapper>
      <SDivFlex>
        <div>
          Latest <span className="highlight">{dataTransactions.length}</span>{' '}
          from a total of <span className="highlight">{totalTransactions}</span>{' '}
          transactions
        </div>
        <div>
          Download{' '}
          <span className="highlight">
            CSV Export
            <img src={iconLink} alt="" />
          </span>
        </div>
      </SDivFlex>
      <STable
        columns={columns}
        dataSource={dataTransactions}
        pagination={false}
      />
      <PaginationWrapper>
        <Pagination
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
