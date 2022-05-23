import BigNumber from 'bignumber.js';

export const TIME_UNSTAKE_LP = 2;
export const TIME_CLAIM_LP = 1;
export const TIME_CLAIM_NFT = 30;
export const divDecimals = (value, decimal) => {
  if (value) {
    return new BigNumber(value).div(new BigNumber(10).pow(decimal));
  }
  return new BigNumber(0);
};
