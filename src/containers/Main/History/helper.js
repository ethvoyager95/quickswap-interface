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
  { label: 'Block', key: 'blockNumber' },
  { label: 'Age', key: 'age' },
  { label: 'From', key: 'from' },
  { label: 'To', key: 'to' },
  { label: 'Value', key: 'value' }
];
const format = commaNumber.bindWith(',', '.');

const MINUTES_TO_TIMESTAMP = 60;
const HOUR_TO_TIMESTAMP = 60 * 60;
const DAY_TO_TIMESTAMP = 24 * 60 * 60;
const MONTH_TO_TIMESTAMP = 30 * 24 * 60 * 60;
const YEAR_TO_TIMESTAMP = 12 * 30 * 24 * 60 * 60;

const formatNumber = (amount, decimal) => {
  const valueEther = new BigNumber(amount).div(new BigNumber(10).pow(decimal));
  if (valueEther.eq(0)) return '0';
  if (valueEther.lt(0.00001)) return '<0.00001';
  return format(new BigNumber(valueEther || 0).dp(5, 1).toString(10));
};

const formatAge = timestamp => {
  const ageTimestamp = +dayjs(Date.now()).unix() - +timestamp;
  if (ageTimestamp < MINUTES_TO_TIMESTAMP) {
    return `${ageTimestamp} seconds ago`;
  }
  if (ageTimestamp < HOUR_TO_TIMESTAMP) {
    return `${parseInt(ageTimestamp / MINUTES_TO_TIMESTAMP, 10)} minutes ago`;
  }
  if (ageTimestamp < DAY_TO_TIMESTAMP) {
    return `${parseInt(ageTimestamp / HOUR_TO_TIMESTAMP, 10)} hours ${parseInt(
      (ageTimestamp % HOUR_TO_TIMESTAMP) / MINUTES_TO_TIMESTAMP,
      10
    )} minutes ago`;
  }
  if (ageTimestamp < MONTH_TO_TIMESTAMP) {
    return `${parseInt(ageTimestamp / DAY_TO_TIMESTAMP, 10)} days ${parseInt(
      (ageTimestamp % DAY_TO_TIMESTAMP) / HOUR_TO_TIMESTAMP,
      10
    )} hours ago`;
  }
  if (ageTimestamp < YEAR_TO_TIMESTAMP) {
    return `${parseInt(
      ageTimestamp / MONTH_TO_TIMESTAMP,
      10
    )} months ${parseInt(
      (ageTimestamp % MONTH_TO_TIMESTAMP) / DAY_TO_TIMESTAMP,
      10
    )} days ago`;
  }
  if (ageTimestamp >= YEAR_TO_TIMESTAMP) {
    return `${parseInt(ageTimestamp / YEAR_TO_TIMESTAMP, 10)} years ${parseInt(
      (ageTimestamp % YEAR_TO_TIMESTAMP) / MONTH_TO_TIMESTAMP,
      10
    )} months ago`;
  }
  return `${parseInt(ageTimestamp, 10)} seconds ago`;
};

export const formatTxn = records =>
  records?.map(record => ({
    ...record,
    method: record.action.replace(/([A-Z])/g, ' $1').trim(),
    age: formatAge(record.blockTimestamp),
    value: formatNumber(record.amount, record.decimal)
  }));
