/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
import BigNumber from 'bignumber.js';

export const TIME_UNSTAKE_LP = 2;
export const TIME_CLAIM_LP = 1;
export const TIME_CLAIM_NFT = 30;
export const MAX_STAKE_NFT = 20; // maximumboost count
export const PERCENT_APR = 10;
export const SECOND24H = process.env.REACT_APP_ENV === 'prod' ? 86400 : 180; // 86400
export const SECOND2DAY = process.env.REACT_APP_ENV === 'prod' ? 172800 : 240; // 172800
export const SECOND30DAY = process.env.REACT_APP_ENV === 'prod' ? 2592000 : 300; // 2592000
export const FAKE_STRK = 27.15;
export const FAKE_ETH = 0.425;
export const FAKE_TOTAL_SUPPLY = 582099001354;
export const UNSTAKE = 'UNSTAKE';
export const CLAIMBASE = 'CLAIMBASE';
export const CLAIMBOOST = 'CLAIMBOOST';
export const UNSTAKENFT = 'UNSTAKENFT';
export const STRK = 'strk';
export const ETH = 'eth';
// chacracter -+e.0 block
export const LIST_BLOCK_VALUE = [43, 44, 45, 46, 101];
const REQUIRED_DECIMAL = 5;
const DASHBOARD_DECIMALS = 2;
export const DECIMALS_INPUT = 10;
export const DECIMALS_LP = 18;
export const MIXIMUM_IPUT = 1e-5;
export const MINIMUM_VALUE = 0.0000000001;
export const MINIMUM_VALUE_FORMAT = 0.00001;
export const TIME_UPDATE_MORALIS_API = 15000;
export const MAX_APPROVE = new BigNumber(2)
  .pow(256)
  .minus(1)
  .toString(10);
export const SETTING_SLIDER = {
  dots: false,
  infinite: false,
  loop: false,
  autoplay: false,
  speed: 2000,
  autoplaySpeed: 2000,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: false,
        dots: false
      }
    },
    {
      breakpoint: 820,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        dots: false,
        infinite: false,
        loop: false,
        autoplay: false
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 0,
        dots: false,
        infinite: false,
        loop: false,
        autoplay: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 0,
        dots: false,
        infinite: false,
        loop: false,
        autoplay: false
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 0,
        dots: false,
        infinite: false,
        loop: false,
        autoplay: false
      }
    }
  ]
};
export const divDecimals = (value, decimal) => {
  if (value) {
    return new BigNumber(value).div(new BigNumber(10).pow(decimal));
  }
  return new BigNumber(0);
};
export const getBaseApr = (liquidity, block) => {
  if (liquidity && block) {
    const ETHEREUM_PER_BLOCK = 86400 / 15;
    const DAY_OF_YEAR = 365;
    const STRK_REWARD_ONE_YEAR = new BigNumber(block)
      .times(new BigNumber(ETHEREUM_PER_BLOCK))
      .times(new BigNumber(DAY_OF_YEAR));
    const numerator = new BigNumber(STRK_REWARD_ONE_YEAR);
    const demerator = new BigNumber(liquidity);
    const BASE_APR = new BigNumber(numerator)
      .times(100)
      .div(new BigNumber(demerator));
    return BASE_APR;
  }
  return new BigNumber(0);
};
export const getLiquidity = (strk, rateSrk, eth, rateEth, totalSupply) => {
  if ((strk, eth, rateEth, rateSrk, totalSupply)) {
    const strk_val = new BigNumber(strk);
    const eth_val = new BigNumber(eth);
    const rateSrk_val = new BigNumber(rateSrk);
    const rateEth_val = new BigNumber(rateEth);
    const n0 = new BigNumber(strk_val).times(rateSrk_val);
    const n1 = new BigNumber(eth_val).times(rateEth_val);
    const d = new BigNumber(totalSupply);
    const n = n0.plus(n1);
    const result = n.div(d);
    return result;
  }
  return new BigNumber(0);
};
const sliceDecimal = (number, decimal, locale, trailDoubleZero) => {
  function join(wholeNumber, decimals) {
    if (!decimals) return wholeNumber;
    return [wholeNumber, decimals].join('.');
  }

  // avoid exponential notation, 18 is max decimal that user can type to input
  // if trailDoubleZero is provided, that mean number < 10000, have no exponential notation
  // parseFloat in case 99.980000 --> 99.98
  // eslint-disable-next-line prefer-const
  let [wholeNumber, decimals] = parseFloat(number.toFixed(18))
    .toString()
    .split('.');

  if (locale === 'US') {
    wholeNumber = Intl.NumberFormat('en-US').format(Number(wholeNumber));
  }

  // eslint-disable-next-line radix
  if (decimals && parseInt(decimals) !== 0) {
    if (decimals.length > decimal) {
      decimals = decimals.substr(0, decimal);
    }
    return join(wholeNumber, decimals);
  }

  if (trailDoubleZero) return join(wholeNumber, '00');

  return wholeNumber;
};
export const validationMaxDecimalsNoRound = number => {
  if (number && parseFloat(number) < 0.000001) {
    return '< 0.000001';
  }
  function join(wholeNumber, decimals) {
    if (!decimals) return wholeNumber;
    return [wholeNumber, decimals].join('.');
  }
  const bigNum = new BigNumber(number);

  const algoFormat = Intl.NumberFormat('en-US');
  let [wholeNumber, decimals] = bigNum.toFixed().split('.');

  wholeNumber = algoFormat.format(parseFloat(wholeNumber));

  if (decimals) {
    if (decimals.length > REQUIRED_DECIMAL) {
      decimals = decimals.substr(0, REQUIRED_DECIMAL);
    }
    return join(wholeNumber, decimals);
  }
  return wholeNumber;
};
export const validationMaxDecimalsNoRoundDashboard = number => {
  if (number && parseFloat(number) < 0.000001) {
    return '< 0.000001';
  }
  function join(wholeNumber, decimals) {
    if (!decimals) return wholeNumber;
    return [wholeNumber, decimals].join('.');
  }
  const bigNum = new BigNumber(number);

  const algoFormat = Intl.NumberFormat('en-US');
  let [wholeNumber, decimals] = bigNum.toFixed().split('.');

  wholeNumber = algoFormat.format(parseFloat(wholeNumber));

  if (decimals) {
    if (decimals.length > DASHBOARD_DECIMALS) {
      decimals = decimals.substr(0, DASHBOARD_DECIMALS);
    }
    return join(wholeNumber, decimals);
  }
  return wholeNumber;
};
export const validationMaxDecimalsNoRoundInput = number => {
  if (number && parseFloat(number) < 0.000001) {
    return '< 0.000001';
  }
  function join(wholeNumber, decimals) {
    if (!decimals) return wholeNumber;
    return [wholeNumber, decimals].join('.');
  }
  const bigNum = new BigNumber(number);

  const algoFormat = Intl.NumberFormat('en-US');
  let [wholeNumber, decimals] = bigNum.toFixed().split('.');

  wholeNumber = algoFormat.format(parseFloat(wholeNumber));

  if (decimals) {
    if (decimals.length > DECIMALS_INPUT) {
      decimals = decimals.substr(0, DECIMALS_INPUT);
    }
    return join(wholeNumber, decimals);
  }
  return wholeNumber;
};
export const shortValue = (value, decimal) => {
  // eslint-disable-next-line no-bitwise
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(value)) return '';
  const thound = 1000;
  const grand = 10000;
  const milion = 1000000;
  const bilion = 1000000000;
  if (value >= bilion) {
    return `${sliceDecimal(value / bilion, decimal, 'US', false)}B`;
  }
  if (value >= milion) {
    return `${sliceDecimal(value / milion, decimal, 'US', false)}M`;
  }
  if (value >= grand) {
    // return `${sliceDecimal(value / grand, decimal, 'US', false)}K`;
    return validationMaxDecimalsNoRound(value, decimal);
  }
  if (value >= thound) {
    return validationMaxDecimalsNoRound(value, decimal);
  }
  if (!value || value === 0) {
    return '0.0';
  }

  if (value < 0.00001) {
    return '<0.00001';
  }
  const lstValueFormat = value?.toString().split('.');
  if (lstValueFormat.length > 1) {
    const result = `${lstValueFormat[0]}.${lstValueFormat[1]?.slice(
      0,
      decimal
    )}`;
    return result;
  }
  return value;
};
export const shortValueInput = (value, decimal) => {
  // eslint-disable-next-line no-bitwise
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(value)) return '';
  const thound = 1000;
  const grand = 10000;
  const milion = 1000000;
  const bilion = 1000000000;
  if (value >= bilion) {
    return `${sliceDecimal(value / bilion, decimal, 'US', false)}B`;
  }
  if (value >= milion) {
    return `${sliceDecimal(value / milion, decimal, 'US', false)}M`;
  }
  if (value >= grand) {
    // return `${sliceDecimal(value / grand, decimal, 'US', false)}K`;
    return validationMaxDecimalsNoRoundInput(value, decimal);
  }
  if (value >= thound) {
    return validationMaxDecimalsNoRoundInput(value, decimal);
  }
  if (!value || value === 0) {
    return '0.0';
  }

  if (value < 0.00001) {
    return '<0.00001';
  }
  const lstValueFormat = value?.toString().split('.');
  if (lstValueFormat.length > 1) {
    const result = `${lstValueFormat[0]}.${lstValueFormat[1]?.slice(
      0,
      decimal
    )}`;
    return result;
  }
  return value;
};
export const shortValueDashboard = (value, decimal) => {
  // eslint-disable-next-line no-bitwise
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(value)) return '';
  const thound = 1000;
  const grand = 10000;
  const milion = 1000000;
  const bilion = 1000000000;
  if (value >= bilion) {
    return `${sliceDecimal(value / bilion, decimal, 'US', false)}B`;
  }
  if (value >= milion) {
    return `${sliceDecimal(value / milion, decimal, 'US', false)}M`;
  }
  if (value >= grand) {
    // return `${sliceDecimal(value / grand, decimal, 'US', false)}K`;
    return validationMaxDecimalsNoRoundDashboard(value, decimal);
  }
  if (value >= thound) {
    return validationMaxDecimalsNoRoundDashboard(value, decimal);
  }
  if (!value || value === 0) {
    return '0.0';
  }
  if (value < 0.00001) {
    return '<0.00001';
  }

  const lstValueFormat = value?.toString().split('.');
  if (lstValueFormat.length > 1) {
    const result = `${lstValueFormat[0]}.${lstValueFormat[1]?.slice(
      0,
      decimal
    )}`;
    return result;
  }
  return value;
};
export const renderValueFixed = value => {
  const valueNumber = parseFloat(value);
  if (!valueNumber || valueNumber === 0) {
    return '0.0';
  }
  return shortValue(value, REQUIRED_DECIMAL);
};
export const renderValueFixedDashboard = value => {
  const valueNumber = parseFloat(value);
  if (!valueNumber || valueNumber === 0) {
    return '0.0';
  }
  return shortValueDashboard(value, DASHBOARD_DECIMALS);
};
export const renderValueFixedInput = value => {
  const valueNumber = +value;
  if (!valueNumber || valueNumber === 0) {
    return '0.0';
  }
  return shortValueInput(value, DECIMALS_INPUT);
};
export const getShortAddress = address => {
  if (address.length === 0) return '';
  return `${address?.slice(0, 4)}...${address?.slice(-4)}`;
};
export const divDecimalsBigNumber = (number, decimals) => {
  if (number) {
    const number_str = number.toString().replaceAll(',', '');
    return new BigNumber(number_str).div(new BigNumber(10).pow(decimals));
  }
};
// eslint-disable-next-line consistent-return
export const renderValueDecimal = (value, decimal) => {
  if (value) {
    const lstValueFormat = value?.toString().split('.');
    if (lstValueFormat.length > 1) {
      const result = `${lstValueFormat[0]}.${lstValueFormat[1]?.slice(
        0,
        decimal
      )}`;
      return result;
    }
    return value;
  }
};
export const showAllNumber = number => {
  if (Math.abs(number) < 1.0) {
    // eslint-disable-next-line radix
    const e = parseInt(number.toString().split('e-')[1]);
    if (e) {
      // eslint-disable-next-line no-param-reassign
      // eslint-disable-next-line no-restricted-properties
      number *= Math.pow(10, e - 1);
      // eslint-disable-next-line no-param-reassign
      number = `0.${new Array(e).join('0')}${number.toString().substring(2)}`;
    }
  } else {
    // eslint-disable-next-line radix
    const e = parseInt(number.toString().split('+')[1]);

    if (e > 20) {
      // eslint-disable-next-line no-const-assign
      e -= 20;
      // eslint-disable-next-line no-restricted-properties
      number /= Math.pow(10, e);
      number += new Array(e + 1).join('0');
    }
  }
  return Number(number).toFixed(DECIMALS_INPUT);
};
