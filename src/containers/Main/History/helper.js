import Web3 from 'web3';
import commaNumber from 'comma-number';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';

export const LIMIT = 25;
const OFFSET = 0;
export const initPagination = {
  limit: LIMIT,
  offset: OFFSET
};
export const initFilter = {};
export const tabsTransaction = ['all', 'user'];
export const tooltipContent =
  'Function executed based on decoded input data. For unidentified functions, method ID is displayed instead.';
export const headers = [
  { label: 'Txn Hash', key: 'txHash' },
  { label: 'Method', key: 'method' },
  { label: 'Block', key: 'block' },
  { label: 'Age', key: 'age' },
  { label: 'From', key: 'from' },
  { label: 'To', key: 'to' },
  { label: 'Value', key: 'value' }
];
const format = commaNumber.bindWith(',', '.');

const formatNumber = valueWei => {
  const valueEther = new BigNumber(Web3.utils.fromWei(valueWei, 'ether'));
  if (valueEther.eq(0)) return '0';
  if (valueEther.lt(0.00001)) return '<0.00001';
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

export const formatTxn = records =>
  records?.map(record => ({
    ...record,
    method: record.action.replace(/([A-Z])/g, ' $1').trim(),
    age: formatAge(record.blockTimestamp),
    from: record.userAddress,
    value: formatNumber(record.amount)
  }));
