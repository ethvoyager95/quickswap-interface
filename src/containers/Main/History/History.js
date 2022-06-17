/* eslint-disable no-nested-ternary */
/* eslint-disable no-useless-escape */
import React, { useEffect, useMemo, useState } from 'react';
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
import iconClose from 'assets/img/close-tag-filter.svg';
import { connectAccount, accountActionCreators } from 'core';
import { Tooltip, Dropdown, Input, Button, Pagination, DatePicker } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import __ from 'lodash';
import {
  formatTxn,
  initFilter,
  initPagination,
  LIMIT,
  LIST_BLOCK_VALUE,
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
  NoData,
  SBoxFlex,
  SImg,
  DivFlexBetween,
  TagFilterWrapper
} from './style';

import './overide.scss';

function History({ settings, setSetting }) {
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
  const [showPaging, setShowPaging] = useState(true);
  const [fromBlockValue, setFromBlockValue] = useState('');
  const [toBlockValue, setToBlockValue] = useState('');
  const [fromAgeValue, setFromAgeValue] = useState('');
  const [toAgeValue, setToAgeValue] = useState('');
  const [fromAgeDisplay, setFromAgeDisplay] = useState('');
  const [toAgeDisplay, setToAgeDisplay] = useState('');
  const [fromAddressValue, setFromAddressValue] = useState('');
  const [toAddressValue, setToAddressValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
    try {
      setIsLoading(true);
      const res = await getDataTransactions(filter, paginationQuery);
      setDataTransaction(formatTxn(res.rows));
      setTotalTransactions(res.count);
      if (res.count > LIMIT) {
        setShowPaging(true);
      } else {
        setShowPaging(false);
      }
      setIsLoading(false);
    } catch (e) {
      setDataTransaction([]);
      setShowPaging(false);
      setIsLoading(false);
    }
  };

  const handleVisibleBlockChange = flag => {
    setVisibleBlock(flag);
    setFromBlockValue(filterCondition.from_block || fromBlockValue || '');
    setToBlockValue(filterCondition.to_block || toBlockValue || '');
  };

  const handleVisibleAgeChange = flag => {
    setFromAgeDisplay(
      filterCondition.from_date
        ? moment.unix(filterCondition.from_date)
        : fromAgeDisplay || ''
    );
    setToAgeDisplay(
      filterCondition.to_date
        ? moment.unix(filterCondition.to_date)
        : toAgeDisplay || ''
    );
    setFromAgeValue(filterCondition.from_date || '');
    setToAgeValue(filterCondition.to_date || '');
    setVisibleAge(flag);
  };

  const handleVisibleFromChange = flag => {
    setFromAddressValue(filterCondition.from_address || fromAddressValue || '');
    setVisibleFrom(flag);
  };

  const handleVisibleToChange = flag => {
    setToAddressValue(filterCondition.to_address || toAddressValue || '');
    setVisibleTo(flag);
  };

  const handleInputBlockChange = (value, type) => {
    if (type === 'from') {
      setFromBlockValue(value);
    }
    if (type === 'to') {
      setToBlockValue(value);
    }
  };

  const handleInputAddressChange = (value, type) => {
    if (type === 'from') {
      setFromAddressValue(value);
    }
    if (type === 'to') {
      setToAddressValue(value);
    }
  };

  const handleFilter = type => {
    setCurrentPage(1);
    if (type === 'block') {
      filterCondition.from_block = fromBlockValue;
      filterCondition.to_block = toBlockValue;
      setFromAgeDisplay('');
      setToAgeDisplay('');
      setFromAgeValue('');
      setToAgeValue('');
      setFromAddressValue('');
      setToAddressValue('');
    }
    if (type === 'age') {
      filterCondition.from_date = fromAgeValue;
      filterCondition.to_date = toAgeValue;
      setFromBlockValue('');
      setToBlockValue('');
      setFromAddressValue('');
      setToAddressValue('');
    }
    if (type === 'from') {
      filterCondition.from_address = fromAddressValue;
      setFromBlockValue('');
      setToBlockValue('');
      setFromAgeDisplay('');
      setToAgeDisplay('');
      setFromAgeValue('');
      setToAgeValue('');
      setToAddressValue('');
    }
    if (type === 'to') {
      filterCondition.to_address = toAddressValue;
      setFromBlockValue('');
      setToBlockValue('');
      setFromAgeDisplay('');
      setToAgeDisplay('');
      setFromAgeValue('');
      setToAgeValue('');
      setFromAddressValue('');
    }
    setFilterCondition(filterCondition);
    pagination.limit = LIMIT;
    pagination.offset = 0;
    setPagination(pagination);
    setVisibleAge(false);
    setVisibleBlock(false);
    setVisibleFrom(false);
    setVisibleTo(false);
    if (
      (currentTab === 'user' && !settings.isConnected) ||
      (currentTab === 'user' && !settings.selectedAddress)
    ) {
      setDataTransaction([]);
    } else {
      getDataTable(filterCondition);
    }
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    pagination.limit = LIMIT;
    pagination.offset = (+page - 1) * LIMIT;
    setPagination(pagination);
    getDataTable(filterCondition, pagination);
  };

  const handleAgeStartChange = (date, dateString) => {
    if (date && dateString) {
      setFromAgeDisplay(date);
      setFromAgeValue(
        dayjs(dateString)
          .startOf('day')
          .unix()
      );
    } else {
      setFromAgeValue('');
      setFromAgeDisplay('');
    }
  };

  const handleAgeEndChange = (date, dateString) => {
    if (date && dateString) {
      setToAgeDisplay(date);
      setToAgeValue(
        dayjs(dateString)
          .endOf('day')
          .unix()
      );
    } else {
      setToAgeValue('');
      setToAgeDisplay('');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    pagination.limit = LIMIT;
    pagination.offset = 0;
    setPagination(pagination);
    Object.keys(filterCondition).forEach(key => delete filterCondition[key]);
    setFilterCondition(filterCondition);
    setFromBlockValue('');
    setFromAgeDisplay('');
    setFromAgeValue('');
    setFromAddressValue('');
    setToBlockValue('');
    setToAgeDisplay('');
    setToAgeValue('');
    setToAddressValue('');
    if (settings.isConnected) {
      if (currentTab === 'user') {
        if (settings.selectedAddress) {
          filterCondition.user_address = settings.selectedAddress;
          setFilterCondition(filterCondition);
          handleExportCSV(filterCondition);
          getDataTable(filterCondition);
        } else {
          setDataTransaction([]);
          setShowPaging(false);
        }
      } else if (currentTab === 'all') {
        delete filterCondition.user_address;
        setFilterCondition(filterCondition);
        handleExportCSV(filterCondition);
        getDataTable(filterCondition);
      }
    }
    if (!settings.isConnected) {
      if (currentTab === 'user') {
        setDataTransaction([]);
        setShowPaging(false);
      } else if (currentTab === 'all') {
        delete filterCondition.user_address;
        setFilterCondition(filterCondition);
        handleExportCSV(filterCondition);
        getDataTable(filterCondition);
      }
    }
  }, [currentTab, settings.selectedAddress, settings.isConnected]);

  useEffect(() => {
    if (!settings.selectedAddress) {
      return;
    }
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', acc => {
        setSetting({
          selectedAddress: acc[0],
          accountLoading: true
        });
      });
    }
  }, [window.ethereum, settings.selectedAddress]);
  // disabled block
  const disabledFilterBlock = useMemo(() => {
    if (!toBlockValue && !fromBlockValue) {
      return true;
    }
    return false;
  }, [fromBlockValue, toBlockValue, settings.selectedAddress]);

  const blockFilter = (
    <DropdownBlock>
      <div className="item">
        <div>From</div>
        <input
          type="number"
          inputMode="decimal"
          pattern="^[0-9]*[]?[0-9]*$"
          value={fromBlockValue}
          min={0}
          minLength={1}
          maxLength={79}
          placeholder="Block Number"
          onChange={e => handleInputBlockChange(e.target.value, 'from')}
          // block special character keypress
          onKeyPress={event => {
            if (__.includes(LIST_BLOCK_VALUE, event.which)) {
              event.preventDefault();
            }
          }}
          // block special character onpaste
          onPaste={event =>
            window.setTimeout(() => {
              const characters = event.target.value;
              window.setTimeout(() => {
                if (!/^\d+$/.test(characters)) {
                  // eslint-disable-next-line no-param-reassign
                  event.target.value = event.target.value.replace(/\D/g, '');
                }
              });
            })
          }
        />
      </div>
      <div className="item">
        <div>To</div>
        <input
          type="number"
          inputMode="decimal"
          pattern="^[0-9]*[]?[0-9]*$"
          value={toBlockValue}
          min={0}
          minLength={1}
          maxLength={79}
          placeholder="Block Number"
          onChange={e => handleInputBlockChange(e.target.value, 'to')}
          // block special character keypress
          onKeyPress={event => {
            if (__.includes(LIST_BLOCK_VALUE, event.which)) {
              event.preventDefault();
            }
          }}
          // block special character onpaste
          onPaste={event =>
            window.setTimeout(() => {
              const characters = event.target.value;
              window.setTimeout(() => {
                if (!/^\d+$/.test(characters)) {
                  // eslint-disable-next-line no-param-reassign
                  event.target.value = event.target.value.replace(/\D/g, '');
                }
              });
            })
          }
        />
      </div>
      <DivFlexBetween>
        <Button
          className="button-filter"
          disabled={disabledFilterBlock}
          onClick={() => handleFilter('block')}
        >
          Filter
        </Button>
        <Button
          className="button-clear"
          danger
          ghost
          disabled={disabledFilterBlock}
          onClick={() => {
            setFromBlockValue('');
            setToBlockValue('');
          }}
        >
          Clear
        </Button>
      </DivFlexBetween>
    </DropdownBlock>
  );

  // disabled btn filter age
  const disabledBtnFilterAge = useMemo(() => {
    if (!toAgeDisplay && !fromAgeDisplay) {
      return true;
    }
    return false;
  }, [fromAgeDisplay, toAgeDisplay, settings.selectedAddress]);

  const timestampFilter = (
    <DropdownBlock>
      <div className="item">
        <div>From</div>
        <DatePicker
          defaultPickerValue={moment(fromAgeDisplay, 'MM/DD/YYYY')}
          value={fromAgeDisplay !== '' ? moment(fromAgeDisplay) : null}
          format="MM/DD/YYYY"
          placeholder="mm/dd/yyyy"
          onChange={handleAgeStartChange}
        />
      </div>
      <div className="item">
        <div>To</div>
        <DatePicker
          defaultPickerValue={moment(toAgeDisplay, 'MM/DD/YYYY')}
          value={toAgeDisplay !== '' ? moment(toAgeDisplay) : null}
          format="MM/DD/YYYY"
          placeholder="mm/dd/yyyy"
          onChange={handleAgeEndChange}
        />
      </div>
      <DivFlexBetween>
        <Button
          className="button-filter"
          disabled={disabledBtnFilterAge}
          onClick={() => handleFilter('age')}
        >
          Filter
        </Button>
        <Button
          className="button-clear"
          danger
          ghost
          disabled={disabledBtnFilterAge}
          onClick={() => {
            setFromAgeValue('');
            setToAgeValue('');
            setFromAgeDisplay('');
            setToAgeDisplay('');
          }}
        >
          Clear
        </Button>
      </DivFlexBetween>
    </DropdownBlock>
  );

  const disabledFilterFromAddress = useMemo(() => {
    if (!fromAddressValue) {
      return true;
    }
    return false;
  }, [fromAddressValue, settings.selectedAddress]);

  const addressFromFilter = (
    <DropdownAddress>
      <div>
        <Input
          className="input-address"
          value={fromAddressValue}
          placeholder="Search by address e.g 0x..."
          onChange={e => handleInputAddressChange(e.target.value, 'from')}
        />
      </div>
      <DivFlexBetween>
        <Button
          className="button-filter"
          disabled={disabledFilterFromAddress}
          onClick={() => handleFilter('from')}
        >
          Filter
        </Button>
        <Button
          className="button-clear"
          danger
          ghost
          disabled={disabledFilterFromAddress}
          onClick={() => {
            setFromAddressValue('');
          }}
        >
          Clear
        </Button>
      </DivFlexBetween>
    </DropdownAddress>
  );

  const disabledFilterToAddress = useMemo(() => {
    if (!toAddressValue) {
      return true;
    }
    return false;
  }, [toAddressValue, settings.selectedAddress]);

  const addressToFilter = (
    <DropdownAddress>
      <div>
        <Input
          className="input-address"
          value={toAddressValue}
          placeholder="Search by address e.g 0x..."
          onChange={e => handleInputAddressChange(e.target.value, 'to')}
        />
      </div>
      <DivFlexBetween>
        <Button
          className="button-filter"
          disabled={disabledFilterToAddress}
          onClick={() => handleFilter('to')}
        >
          Filter
        </Button>
        <Button
          className="button-clear"
          danger
          ghost
          disabled={disabledFilterToAddress}
          onClick={() => {
            setToAddressValue('');
          }}
        >
          Clear
        </Button>
      </DivFlexBetween>
    </DropdownAddress>
  );

  const renderTagFilterByBlock = (
    <TagFilterWrapper>
      <div>
        Block:{' '}
        {filterCondition.from_block
          ? `From ${filterCondition.from_block} `
          : ''}
        {filterCondition.to_block ? `To ${filterCondition.to_block}` : ''}
      </div>
      <img
        src={iconClose}
        alt=""
        onClick={() => {
          setFromBlockValue('');
          setToBlockValue('');
          filterCondition.from_block = '';
          filterCondition.to_block = '';
          setFilterCondition(filterCondition);
          pagination.limit = LIMIT;
          pagination.offset = 0;
          setPagination(pagination);
          setCurrentPage(1);
          if (
            (currentTab === 'user' && !settings.isConnected) ||
            (currentTab === 'user' && !settings.selectedAddress)
          ) {
            setDataTransaction([]);
          } else {
            getDataTable(filterCondition);
          }
        }}
      />
    </TagFilterWrapper>
  );

  const renderTagFilterByAge = (
    <TagFilterWrapper>
      <div>
        Age:{' '}
        {filterCondition.from_date
          ? `From ${dayjs
              .unix(filterCondition.from_date)
              .format('MM/DD/YYYY')} `
          : ''}
        {filterCondition.to_date
          ? `To ${dayjs.unix(filterCondition.to_date).format('MM/DD/YYYY')}`
          : ''}
      </div>
      <img
        src={iconClose}
        alt=""
        onClick={() => {
          setFromAgeValue('');
          setToAgeValue('');
          setFromAgeDisplay('');
          setToAgeDisplay('');
          filterCondition.from_date = '';
          filterCondition.to_date = '';
          setFilterCondition(filterCondition);
          pagination.limit = LIMIT;
          pagination.offset = 0;
          setPagination(pagination);
          setCurrentPage(1);
          if (
            (currentTab === 'user' && !settings.isConnected) ||
            (currentTab === 'user' && !settings.selectedAddress)
          ) {
            setDataTransaction([]);
          } else {
            getDataTable(filterCondition);
          }
        }}
      />
    </TagFilterWrapper>
  );

  const renderTagFilterByFromAddress = (
    <TagFilterWrapper>
      <div>
        From{' '}
        {filterCondition.from_address
          ? `${
              filterCondition.from_address.length > 8
                ? `${filterCondition.from_address.substr(
                    0,
                    4
                  )}...${filterCondition.from_address.substr(
                    filterCondition.from_address.length - 4,
                    4
                  )}`
                : filterCondition.from_address
            } `
          : ''}
      </div>

      <img
        src={iconClose}
        alt=""
        onClick={() => {
          setFromAddressValue('');
          filterCondition.from_address = '';
          setFilterCondition(filterCondition);
          pagination.limit = LIMIT;
          pagination.offset = 0;
          setPagination(pagination);
          setCurrentPage(1);
          if (
            (currentTab === 'user' && !settings.isConnected) ||
            (currentTab === 'user' && !settings.selectedAddress)
          ) {
            setDataTransaction([]);
          } else {
            getDataTable(filterCondition);
          }
        }}
      />
    </TagFilterWrapper>
  );

  const renderTagFilterByToAddress = (
    <TagFilterWrapper>
      <div>
        To{' '}
        {filterCondition.to_address
          ? `${
              filterCondition.to_address.length > 8
                ? `${filterCondition.to_address.substr(
                    0,
                    4
                  )}...${filterCondition.to_address.substr(
                    filterCondition.to_address.length - 4,
                    4
                  )}`
                : filterCondition.to_address
            } `
          : ''}
      </div>
      <img
        src={iconClose}
        alt=""
        onClick={() => {
          setToAddressValue('');
          filterCondition.to_address = '';
          setFilterCondition(filterCondition);
          pagination.limit = LIMIT;
          pagination.offset = 0;
          setPagination(pagination);
          setCurrentPage(1);
          if (
            (currentTab === 'user' && !settings.isConnected) ||
            (currentTab === 'user' && !settings.selectedAddress)
          ) {
            setDataTransaction([]);
          } else {
            getDataTable(filterCondition);
          }
        }}
      />
    </TagFilterWrapper>
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
              {asset.txHash ? `${asset.txHash.substr(0, 6)}...` : '-'}
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
              <div>{asset.method ? asset.method : '-'}</div>
            </Method>
          )
        };
      }
    },
    {
      title: () => (
        <THeadWrapper id="th-block">
          Block{' '}
          <Dropdown
            overlay={blockFilter}
            trigger={['click']}
            onVisibleChange={handleVisibleBlockChange}
            visible={visibleBlock}
            getPopupContainer={() => document.getElementById('th-block')}
          >
            <SButton
              onClick={e => {
                e.preventDefault();
                setFromBlockValue(
                  filterCondition.from_block || fromBlockValue || ''
                );
                setToBlockValue(filterCondition.to_block || toBlockValue || '');
              }}
            >
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
              {asset.blockNumber || '-'}
            </Hash>
          )
        };
      }
    },
    {
      title: () => (
        <THeadWrapper id="th-age">
          Age{' '}
          <Dropdown
            overlay={timestampFilter}
            trigger={['click']}
            onVisibleChange={handleVisibleAgeChange}
            visible={visibleAge}
            getPopupContainer={() => document.getElementById('th-age')}
          >
            <SButton
              onClick={e => {
                e.preventDefault();
                setFromAgeDisplay(
                  filterCondition.from_date
                    ? moment.unix(filterCondition.from_date)
                    : fromAgeDisplay || ''
                );
                setToAgeDisplay(
                  filterCondition.to_date
                    ? moment.unix(filterCondition.to_date)
                    : toAgeDisplay || ''
                );
                setFromAgeValue(filterCondition.from_date || '');
                setToAgeValue(filterCondition.to_date || '');
              }}
            >
              <img src={iconFilter} alt="" />
            </SButton>
          </Dropdown>
        </THeadWrapper>
      ),
      dataIndex: 'age',
      key: 'age',
      render(_, asset) {
        return {
          children: <Value>{asset.age || '-'}</Value>
        };
      }
    },
    {
      title: () => (
        <THeadWrapper id="th-from">
          From{' '}
          <Dropdown
            overlay={addressFromFilter}
            trigger={['click']}
            onVisibleChange={handleVisibleFromChange}
            visible={visibleFrom}
            getPopupContainer={() => document.getElementById('th-from')}
          >
            <SButton
              onClick={e => {
                e.preventDefault();
                setFromAddressValue(
                  filterCondition.from_address || fromAddressValue || ''
                );
              }}
            >
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
              href={`${process.env.REACT_APP_ETH_EXPLORER}/address/${asset.from}`}
              target="_blank"
            >
              {asset.from
                ? `${asset.from.substr(0, 4)}...${asset.from.substr(
                    asset.from.length - 4,
                    4
                  )}`
                : '-'}
            </Hash>
          )
        };
      }
    },
    {
      title: () => (
        <THeadWrapper id="th-to">
          To{' '}
          <Dropdown
            overlay={addressToFilter}
            trigger={['click']}
            onVisibleChange={handleVisibleToChange}
            visible={visibleTo}
            getPopupContainer={() => document.getElementById('th-to')}
          >
            <SButton
              onClick={e => {
                e.preventDefault();
                setToAddressValue(
                  filterCondition.to_address || toAddressValue || ''
                );
              }}
            >
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
              {asset.to
                ? `${asset.to.substr(0, 4)}...${asset.to.substr(
                    asset.to.length - 4,
                    4
                  )}`
                : '-'}
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
          children: (
            <>
              <SBoxFlex>
                {asset.img && <SImg src={asset.img} />}
                <Value uppercase>
                  {asset.value} {asset.symbol}
                </Value>
              </SBoxFlex>
            </>
          )
        };
      }
    }
  ];

  const locale = {
    emptyText: (
      <NoData>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <img src={noData} alt="No data" />
            <div>
              {settings.isConnected && settings.selectedAddress
                ? 'No record was found'
                : currentTab === 'all'
                ? 'No record was found'
                : 'Connect your wallet to see your transaction history'}
            </div>
          </>
        )}
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
              pagination.limit = LIMIT;
              pagination.offset = 0;
              setPagination(pagination);
              setCurrentPage(1);
              setFromBlockValue('');
              setFromAgeDisplay('');
              setFromAgeValue('');
              setFromAddressValue('');
              setToBlockValue('');
              setToAgeDisplay('');
              setToAgeValue('');
              setToAddressValue('');
            }}
            className={currentTab === tab ? 'active' : ''}
          >
            {tab === 'all' ? 'All Transactions' : 'User Transactions'}
          </div>
        ))}
      </TabsWrapper>
      <SDivFlex>
        {filterCondition.from_block ||
        filterCondition.to_block ||
        filterCondition.from_date ||
        filterCondition.to_date ||
        filterCondition.from_address ||
        filterCondition.to_address ? (
          <>
            <div className="title">Filtered by: </div>
            {filterCondition.from_block || filterCondition.to_block
              ? renderTagFilterByBlock
              : null}
            {filterCondition.from_date || filterCondition.to_date
              ? renderTagFilterByAge
              : null}
            {filterCondition.from_address ? renderTagFilterByFromAddress : null}
            {filterCondition.to_address ? renderTagFilterByToAddress : null}
          </>
        ) : (
          <></>
        )}
      </SDivFlex>

      <STable
        dropdownOpen={
          dataTransactions.length <= 4
            ? visibleBlock || visibleAge || visibleFrom || visibleTo
            : false
        }
        locale={locale}
        columns={columns}
        dataSource={dataTransactions}
        pagination={false}
        rowKey={record => record.id}
      />
      <PaginationWrapper>
        {/* <div className="export-csv">
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
        </div> */}
        <div />
        {showPaging && (
          <Pagination
            defaultPageSize={LIMIT}
            defaultCurrent={1}
            current={currentPage}
            onChange={e => handlePageChange(e)}
            total={totalTransactions}
          />
        )}
      </PaginationWrapper>
    </MainLayout>
  );
}

History.propTypes = {
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired
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
