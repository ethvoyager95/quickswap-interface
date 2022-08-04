import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';

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

const format = commaNumber.bindWith(',', '.');

export const renderLogo = symbol => {
  if (symbol === null) return '';
  if (!symbol) return '';
  if (symbol.toLowerCase() === 'usdc') return usdc;
  if (symbol.toLowerCase() === 'usdt') return usdt;
  if (symbol.toLowerCase() === 'busd') return busd;
  if (symbol.toLowerCase() === 'strk') return strk;
  if (symbol.toLowerCase() === 'sxp') return sxp;
  if (symbol.toLowerCase() === 'wbtc') return wbtc;
  if (symbol.toLowerCase() === 'eth') return eth;
  if (symbol.toLowerCase() === 'weth') return eth;
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

export const formatNumber = (value, isAccHealth) => {
  const valueEther = new BigNumber(value);
  if (valueEther.eq(0) && isAccHealth) return '0';
  if (valueEther.eq(0)) return '0.0';
  if (valueEther.lt(0.00001)) return '<0.00001';
  if (valueEther.isNaN()) return '-';
  return format(new BigNumber(valueEther || 0).dp(5, 1).toString(10));
};

const calculateMaxRepayAmount = (
  borrowIndex,
  borrowAmount,
  closeFactorMantissa,
  borrowUserIndex,
  decimals
) => {
  const decimalsBigNumber = new BigNumber(10).pow(decimals);
  const borrowIndexDivDecimalsBigNumber = new BigNumber(borrowIndex).div(
    decimalsBigNumber
  );
  const borrowAmountDivDecimalsBigNumber = new BigNumber(borrowAmount).div(
    decimalsBigNumber
  );
  const closeFactorMantissaDivDecimalsBigNumber = new BigNumber(
    closeFactorMantissa
  ).div(decimalsBigNumber);
  const borrowUserIndexDivDecimalsBigNumber = new BigNumber(
    borrowUserIndex
  ).div(decimalsBigNumber);
  return borrowIndexDivDecimalsBigNumber
    .times(borrowAmountDivDecimalsBigNumber)
    .times(closeFactorMantissaDivDecimalsBigNumber)
    .div(borrowUserIndexDivDecimalsBigNumber)
    .dp(18, 1)
    .toString(10);
};

export const calculateSeizeAmount = (
  repayAmount,
  decimalsRepay,
  decimalsSeize,
  underlyingRepayPrice,
  underlyingSeizePrice,
  exchangeRate
) => {
  const repayAmountTimesDecimals = new BigNumber(repayAmount).times(
    new BigNumber(10).pow(decimalsRepay)
  );
  const decimalsBigNumber = new BigNumber(10).pow(18);
  const repayPriceDivDecimals = new BigNumber(underlyingRepayPrice).div(
    decimalsBigNumber
  );
  const seizePriceDivDecimals = new BigNumber(underlyingSeizePrice).div(
    decimalsBigNumber
  );
  const exchangeRateDivDecimals = new BigNumber(exchangeRate).div(
    decimalsBigNumber
  );
  const numerator = repayAmountTimesDecimals
    .times(1.1)
    .times(0.95)
    .times(repayPriceDivDecimals)
    .div(new BigNumber(10).pow(decimalsSeize));
  const denominator = seizePriceDivDecimals.times(exchangeRateDivDecimals);
  return numerator
    .div(denominator)
    .dp(18, 1)
    .toString(10);
};

export const formatRecentRecord = records =>
  records?.map(record => ({
    ...record,
    timestamp: dayjs.unix(record.blockTimestamp).format('DD/MM/YYYY HH:mm'),
    logoSeize: renderLogo(record.symbolSeizeToken),
    seizeAmountEther: formatNumber(record.seizeAmountCalculate),
    seizeAmountUsd: formatNumber(record.totalPriceSeize),
    logoRepay: renderLogo(record.symbolRepayToken),
    repayAmountEther: formatNumber(record.repayAmountCalculate),
    repayAmountUsd: formatNumber(record.totalPriceRepay)
  }));

export const formatUsersRecord = records =>
  records?.map(record => ({
    ...record,
    accHealth: formatNumber(record.health, true),
    logoSeize: renderLogo(record.symbolSeizeToken),
    maxSeizeAmountEther: calculateSeizeAmount(
      calculateMaxRepayAmount(
        record.borrowIndex,
        record.borrowAmount,
        record.closeFactorMantissa,
        record.borrowUserIndex,
        record.decimalBorrowToken
      ),
      record.decimalBorrowToken,
      record.decimalSeizeToken,
      record.underlyingPriceBorrowToken,
      record.underlyingPriceSeizeToken,
      record.exchangeRateSeizeToken
    ),
    maxSeizeAmountUsd: formatNumber(
      record.maxSeizeAmount * record.seizeTokenPrice
    ),
    logoRepay: renderLogo(record.symbolBorrowToken),
    maxRepayAmountEther: calculateMaxRepayAmount(
      record.borrowIndex,
      record.borrowAmount,
      record.closeFactorMantissa,
      record.borrowUserIndex,
      record.decimalBorrowToken
    ),
    maxRepayAmountUsd: formatNumber(
      +calculateMaxRepayAmount(
        record.borrowIndex,
        record.borrowAmount,
        record.closeFactorMantissa,
        record.borrowUserIndex,
        record.decimalBorrowToken
      ) * +record.borrowTokenPrice
    )
  }));

export const formatUserInfo = record => {
  return {
    ...record,
    accHealth: formatNumber(record.health, true),
    maxSeizeAmountEther: calculateSeizeAmount(
      calculateMaxRepayAmount(
        record.borrowIndex,
        record.borrowAmount,
        record.closeFactorMantissa,
        record.borrowUserIndex,
        record.decimalBorrowToken
      ),
      record.decimalBorrowToken,
      record.decimalSeizeToken,
      record.underlyingPriceBorrowToken,
      record.underlyingPriceSeizeToken,
      record.exchangeRateSeizeToken
    ),
    maxSeizeAmountUsd: formatNumber(
      record.maxSeizeAmount * record.seizeTokenPrice
    ),
    maxRepayAmountEther: calculateMaxRepayAmount(
      record.borrowIndex,
      record.borrowAmount,
      record.closeFactorMantissa,
      record.borrowUserIndex,
      record.decimalBorrowToken
    ),
    maxRepayAmountUsd: formatNumber(
      +calculateMaxRepayAmount(
        record.borrowIndex,
        record.borrowAmount,
        record.closeFactorMantissa,
        record.borrowUserIndex,
        record.decimalBorrowToken
      ) * +record.borrowTokenPrice
    )
  };
};

export const getShortAddress = address => {
  if (address.length === 0) return '';
  return `${address?.slice(0, 4)}...${address?.slice(-4)}`;
};
