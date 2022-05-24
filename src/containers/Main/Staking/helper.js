import BigNumber from 'bignumber.js';

export const TIME_UNSTAKE_LP = 2;
export const TIME_CLAIM_LP = 1;
export const TIME_CLAIM_NFT = 30;

export const MAX_STAKE_NFT = 10;
export const SECOND24H = 3600; // 86400
export const SECOND2DAY = 7200; // 172800
export const SECOND30DAY = 10800; // 2592000
export const MAX_APPROVE = new BigNumber(2)
  .pow(256)
  .minus(1)
  .toString(10);
export const divDecimals = (value, decimal) => {
  if (value) {
    return new BigNumber(value).div(new BigNumber(10).pow(decimal));
  }
  return new BigNumber(0);
};
export const getBaseApr = liquidity => {
  const STRK_PERBLOCK = 10000;
  const ETHEREUM_PER_BLOCK = 6289;
  const DAY_OF_YEAR = 365;
  const VAL = 31536000;
  const STRK_REWARD_ONE_YEAR = new BigNumber(STRK_PERBLOCK)
    .times(new BigNumber(ETHEREUM_PER_BLOCK))
    .times(new BigNumber(DAY_OF_YEAR));
  const numerator = new BigNumber(STRK_REWARD_ONE_YEAR).times(
    new BigNumber(VAL)
  );
  const demerator = new BigNumber(liquidity);
  const BASE_APR = new BigNumber(numerator).div(new BigNumber(demerator));
  console.log(BASE_APR, 'BASE_APR');
  return BASE_APR;
};
export const renderValueFixed = value => {
  const valueNumber = +value;
  if (!valueNumber || valueNumber === 0) {
    return '0.0';
  }
  return parseFloat(value);
};
