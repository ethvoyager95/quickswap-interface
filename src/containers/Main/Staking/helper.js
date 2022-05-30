/* eslint-disable no-undef */
import BigNumber from 'bignumber.js';

export const TIME_UNSTAKE_LP = 2;
export const TIME_CLAIM_LP = 1;
export const TIME_CLAIM_NFT = 30;
export const MAX_STAKE_NFT = 10;
export const PERCENT_APR = 20;
export const SECOND24H = 180; // 86400
export const SECOND2DAY = 240; // 172800
export const SECOND30DAY = 300; // 2592000
export const FAKE_STRK = 30.07;
export const FAKE_ETH = 0.38;
export const FAKE_TOTAL_SUPPLY = 582099001354;
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
        infinite: true,
        dots: true
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
        slidesToShow: 8,
        slidesToScroll: 1,
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
        slidesToShow: 1,
        slidesToScroll: 1,
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
        slidesToShow: 1,
        slidesToScroll: 1,
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
    const ETHEREUM_PER_BLOCK = 6289;
    const DAY_OF_YEAR = 365;
    const STRK_REWARD_ONE_YEAR = new BigNumber(block)
      .times(new BigNumber(ETHEREUM_PER_BLOCK))
      .times(new BigNumber(DAY_OF_YEAR));
    const numerator = new BigNumber(STRK_REWARD_ONE_YEAR);
    const demerator = new BigNumber(liquidity);
    const BASE_APR = new BigNumber(numerator).div(new BigNumber(demerator));
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

export const shortValue = (value, decimal) => {
  // eslint-disable-next-line no-bitwise
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(value)) return '';
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
    return `${sliceDecimal(value / k, decimal, 'US', false)}K`;
  }
  if (!value || value === 0) {
    return 0;
  }
  if (value < 0.0001 && value > 0) {
    return '< 0.0001';
  }
  if (value > -0.01 && value < 0) {
    return '< -0.01';
  }
  if (value > -0.001 && value < 0) {
    return '< -0.001';
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
  const valueNumber = +value;
  if (!valueNumber || valueNumber === 0) {
    return '0.0';
  }
  return shortValue(parseFloat(value), 5);
};
export const getShortAddress = address => {
  if (address.length === 0) return '';
  return `${address?.slice(0, 4)}...${address?.slice(-4)}`;
};
