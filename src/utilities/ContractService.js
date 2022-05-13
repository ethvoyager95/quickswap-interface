import Web3 from 'web3';
import * as constants from './constants';

const instance = new Web3(window.ethereum);
// const instance = new Web3('http://3.10.133.254:8575');

const TOKEN_ABI = {
  usdc: constants.CONTRACT_USDC_TOKEN_ABI,
  usdt: constants.CONTRACT_USDT_TOKEN_ABI,
  busd: constants.CONTRACT_BUSD_TOKEN_ABI,
  strk: constants.CONTRACT_STRK_TOKEN_ABI,
  sxp: constants.CONTRACT_SXP_TOKEN_ABI,
  wbtc: constants.CONTRACT_WBTC_TOKEN_ABI,
  link: constants.CONTRACT_LINK_TOKEN_ABI,
  comp: constants.CONTRACT_COMP_TOKEN_ABI,
  uni: constants.CONTRACT_UNI_TOKEN_ABI,
  ape: constants.CONTRACT_APE_TOKEN_ABI,
  ust: constants.CONTRACT_UST_TOKEN_ABI
};

const call = (method, params) => {
  return new Promise((resolve, reject) => {
    method(...params)
      .call()
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const send = (method, params, from) => {
  return new Promise((resolve, reject) => {
    method(...params)
      .send({ from })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getTokenContract = name => {
  return new instance.eth.Contract(
    JSON.parse(TOKEN_ABI[name]),
    constants.CONTRACT_TOKEN_ADDRESS[name || 'usdc'].address
  );
};

export const getSbepContract = name => {
  return new instance.eth.Contract(
    JSON.parse(
      name !== 'eth' ? constants.CONTRACT_SBEP_ABI : constants.CONTRACT_SETH_ABI
    ),
    constants.CONTRACT_SBEP_ADDRESS[name || 'usdc'].address
  );
};

export const getComptrollerContract = () => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_COMPTROLLER_ABI),
    constants.CONTRACT_COMPTROLLER_ADDRESS
  );
};

export const getPriceOracleContract = (
  address = constants.CONTRACT_PRICE_ORACLE_ADDRESS
) => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_PRICE_ORACLE_ABI),
    address
  );
};

export const getVoteContract = () => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_VOTE_ABI),
    constants.CONTRACT_VOTE_ADDRESS
  );
};

export const getInterestModelContract = address => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_INTEREST_MODEL_ABI),
    address
  );
};
export const getFarmingContract = () => {
  return new instance.eth.Contract(
    JSON.parse(constants.FARMING_ABI),
    constants.CONTRACT_FARMING_ADDRESS
  );
};
export const methods = {
  call,
  send
};
