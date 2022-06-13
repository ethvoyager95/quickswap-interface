import commaNumber from 'comma-number';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';

import usdc from 'assets/img/coins/usdc.png';
import usdt from 'assets/img/coins/usdt.png';
import busd from 'assets/img/coins/busd.png';
import strk from 'assets/img/coins/strk.png';
import sxp from 'assets/img/coins/sxp.png';
import wbtc from 'assets/img/coins/wbtc.png';
import eth from 'assets/img/coins/eth.png';
import link from 'assets/img/coins/link.png';
import comp from 'assets/img/coins/comp.png';
import uni from 'assets/img/coins/uni.png';
import ape from 'assets/img/coins/ape.png';
import ust from 'assets/img/coins/ust.png';

import susdc from 'assets/img/coins/susdc.png';
import susdt from 'assets/img/coins/susdt.png';
import sbusd from 'assets/img/coins/sbusd.png';
import sstrk from 'assets/img/coins/sstrk.png';
import ssxp from 'assets/img/coins/ssxp.png';
import swbtc from 'assets/img/coins/swbtc.png';
import seth from 'assets/img/coins/seth.png';
import slink from 'assets/img/coins/slink.png';
import scomp from 'assets/img/coins/scomp.png';
import suni from 'assets/img/coins/suni.png';
import sape from 'assets/img/coins/sape.png';
import sust from 'assets/img/coins/sust.png';

export const LIMIT = 25;
const OFFSET = 0;
export const initPagination = {
  limit: LIMIT,
  offset: OFFSET
};
export const initFilter = {};
export const tabsTransaction = ['all', 'user'];
export const LIST_BLOCK_VALUE = [43, 44, 45, 46, 69, 101];
export const LIST_BLOCK_TEXT = ['E', 'e', '-', '+', '.'];
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

const formatNumber = (amount, decimal) => {
  const valueEther = new BigNumber(amount).div(new BigNumber(10).pow(decimal));
  if (valueEther.eq(0)) return '0.0';
  if (valueEther.lt(0.00001)) return '<0.00001';
  if (valueEther.isNaN()) return '-';
  return format(new BigNumber(valueEther || 0).dp(5, 1).toString(10));
};

const formatAge = timestamp => {
  const ageTimestamp = +dayjs(Date.now()).unix() - +timestamp;
  if (ageTimestamp < MINUTES_TO_TIMESTAMP) {
    return `${ageTimestamp} sec${ageTimestamp <= 1 ? '' : 's'} ago`;
  }
  if (ageTimestamp < HOUR_TO_TIMESTAMP) {
    return `${parseInt(ageTimestamp / MINUTES_TO_TIMESTAMP, 10)} min${
      parseInt(ageTimestamp / MINUTES_TO_TIMESTAMP, 10) <= 1 ? '' : 's'
    } ago`;
  }
  if (ageTimestamp < DAY_TO_TIMESTAMP) {
    return `${parseInt(ageTimestamp / HOUR_TO_TIMESTAMP, 10)} hr${
      parseInt(ageTimestamp / HOUR_TO_TIMESTAMP, 10) <= 1 ? '' : 's'
    } ${parseInt(
      (ageTimestamp % HOUR_TO_TIMESTAMP) / MINUTES_TO_TIMESTAMP,
      10
    )} min${
      parseInt((ageTimestamp % HOUR_TO_TIMESTAMP) / MINUTES_TO_TIMESTAMP, 10) <=
      1
        ? ''
        : 's'
    } ago`;
  }
  return `${parseInt(ageTimestamp / DAY_TO_TIMESTAMP, 10)} day${
    parseInt(ageTimestamp / DAY_TO_TIMESTAMP, 10) <= 1 ? '' : 's'
  } ${parseInt((ageTimestamp % DAY_TO_TIMESTAMP) / HOUR_TO_TIMESTAMP, 10)} hr${
    parseInt((ageTimestamp % DAY_TO_TIMESTAMP) / HOUR_TO_TIMESTAMP, 10) <= 1
      ? ''
      : 's'
  } ago`;
};
const renderImg = symbol => {
  if (symbol === null) return '';
  if (symbol.toLowerCase() === 'usdc') return usdc;
  if (symbol.toLowerCase() === 'usdt') return usdt;
  if (symbol.toLowerCase() === 'busd') return busd;
  if (symbol.toLowerCase() === 'strk') return strk;
  if (symbol.toLowerCase() === 'sxp') return sxp;
  if (symbol.toLowerCase() === 'wbtc') return wbtc;
  if (symbol.toLowerCase() === 'eth') return eth;
  if (symbol.toLowerCase() === 'link') return link;
  if (symbol.toLowerCase() === 'comp') return comp;
  if (symbol.toLowerCase() === 'uni') return uni;
  if (symbol.toLowerCase() === 'uni-v2') return uni;
  if (symbol.toLowerCase() === 'ape') return ape;
  if (symbol.toLowerCase() === 'ust') return ust;
  if (symbol.toLowerCase() === 'susdc') return susdc;
  if (symbol.toLowerCase() === 'susdt') return susdt;
  if (symbol.toLowerCase() === 'sbusd') return sbusd;
  if (symbol.toLowerCase() === 'sstrk') return sstrk;
  if (symbol.toLowerCase() === 'ssxp') return ssxp;
  if (symbol.toLowerCase() === 'swbtc') return swbtc;
  if (symbol.toLowerCase() === 'seth') return seth;
  if (symbol.toLowerCase() === 'slink') return slink;
  if (symbol.toLowerCase() === 'scomp') return scomp;
  if (symbol.toLowerCase() === 'suni') return suni;
  if (symbol.toLowerCase() === 'sape') return sape;
  if (symbol.toLowerCase() === 'sust') return sust;
  return '';
};
export const formatTxn = records =>
  records?.map(record => ({
    ...record,
    method: record.action.replace(/([A-Z])/g, ' $1').trim(),
    age: formatAge(record.blockTimestamp),
    value: formatNumber(record.amount, record.decimal),
    img: renderImg(record?.symbol)
  }));
