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
import dai from 'assets/img/coins/dai.png';
import xcn from 'assets/img/coins/xcn.png';
import wsteth from 'assets/img/coins/wsteth.png';
import reth from 'assets/img/coins/reth.png';

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
import sdai from 'assets/img/coins/sdai.png';
import sxcn from 'assets/img/coins/sxcn.png';
import swsteth from 'assets/img/coins/swsteth.png';
import sreth from 'assets/img/coins/sreth.png';

import iconSupplier from 'assets/img/methods/supplier.svg';
import iconWithdraw from 'assets/img/methods/withdraw.svg';
import iconBorrow from 'assets/img/methods/borrow.svg';
import iconRepayBorrow from 'assets/img/methods/repay-borrow.svg';
import iconLiquidateBorrow from 'assets/img/methods/liquidate-borrow.svg';
import iconBoost from 'assets/img/methods/boost.svg';
import iconDeposit from 'assets/img/methods/deposit.svg';
import iconUnBoost from 'assets/img/methods/un-boost.svg';
import iconClaimBase from 'assets/img/methods/claim-base-reward.svg';
import iconClaimBoost from 'assets/img/methods/claim-boost-reward.svg';
import iconRedeem from 'assets/img/methods/redeem.svg';

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

const MINUTES_TO_TIMESTAMP = 60;
const HOUR_TO_TIMESTAMP = 60 * 60;
const DAY_TO_TIMESTAMP = 24 * 60 * 60;

const SUPPLY = 'Supply';
const REDEEM = 'Redeem';
const BORROW = 'Borrow';
const REPAY_BORROW = 'Repay & Borrow';
const LIQUIDATE_BORROW = 'Liquidate Borrow';
const BOOST = 'Boost';
const DEPOSIT = 'Deposit';
const UN_BOOST = 'Unboost';
const WITHDRAW = 'Withdraw';
const CLAIM_BASE_REWARD = 'Claim Base Rewards';
const CLAIM_BOOST_REWARD = 'Claim Boost Rewards';

const format = commaNumber.bindWith(',', '.');

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
  if (symbol.toLowerCase() === 'dai') return dai;
  if (symbol.toLowerCase() === 'xcn') return xcn;
  if (symbol.toLowerCase() === 'wsteth') return wsteth;
  if (symbol.toLowerCase() === 'reth') return reth;
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
  if (symbol.toLowerCase() === 'sdai') return sdai;
  if (symbol.toLowerCase() === 'sxcn') return sxcn;
  if (symbol.toLowerCase() === 'swsteth') return swsteth;
  if (symbol.toLowerCase() === 'sreth') return sreth;
  return '';
};

const renderIconMethod = action => {
  if (action === null) return '';
  if (action === SUPPLY) return iconSupplier;
  if (action === REDEEM) return iconRedeem;
  if (action === BORROW) return iconBorrow;
  if (action === REPAY_BORROW) return iconRepayBorrow;
  if (action === LIQUIDATE_BORROW) return iconLiquidateBorrow;
  if (action === BOOST) return iconBoost;
  if (action === DEPOSIT) return iconDeposit;
  if (action === UN_BOOST) return iconUnBoost;
  if (action === WITHDRAW) return iconWithdraw;
  if (action === CLAIM_BASE_REWARD) return iconClaimBase;
  if (action === CLAIM_BOOST_REWARD) return iconClaimBoost;
  return '';
};

export const renderBgColor = action => {
  if (action === null) return '#E0EFFA';
  if (action === SUPPLY) return '#E0EFFA';
  if (action === REDEEM) return '#E9F7FA';
  if (action === BORROW) return '#FEE9EC';
  if (action === REPAY_BORROW) return '#FEF4E9';
  if (action === LIQUIDATE_BORROW) return '#F4E9FA';
  if (action === BOOST) return '#EEFAE9';
  if (action === DEPOSIT) return '#FAF7E9';
  if (action === UN_BOOST) return '#E9FAFA';
  if (action === WITHDRAW) return '#E1F7ED';
  if (action === CLAIM_BASE_REWARD) return '#FFE6F8';
  if (action === CLAIM_BOOST_REWARD) return '#E9EDFA';
  return '#E0EFFA';
};

export const renderColor = action => {
  if (action === null) return '#107DEF';
  if (action === SUPPLY) return '#107DEF';
  if (action === REDEEM) return '#00B2D9';
  if (action === BORROW) return '#F84960';
  if (action === REPAY_BORROW) return '#F8A749';
  if (action === LIQUIDATE_BORROW) return '#A64EDB';
  if (action === BOOST) return '#3DC903';
  if (action === DEPOSIT) return '#EFC500';
  if (action === UN_BOOST) return '#00D1D1';
  if (action === WITHDRAW) return '#06C270';
  if (action === CLAIM_BASE_REWARD) return '#DB4EB4';
  if (action === CLAIM_BOOST_REWARD) return '#2F55D1';
  return '#107DEF';
};

export const formatTxn = records =>
  records?.map(record => ({
    ...record,
    method: record.action.replace(/([A-Z])/g, ' $1').trim() || '-',
    age: formatAge(record.blockTimestamp),
    value: formatNumber(record.amount, record.decimal),
    img: renderImg(record?.symbol),
    iconMethod: renderIconMethod(record.action)
  }));
