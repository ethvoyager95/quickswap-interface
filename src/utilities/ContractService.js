import { useEffect } from 'react';
import { Multicall } from 'ethereum-multicall';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { getProvider as getBW3WProvider } from '@binance/w3w-ethereum-provider';

import * as constants from './constants';

// eslint-disable-next-line global-require
window.Buffer = window.Buffer || require('buffer').Buffer;

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
  ust: constants.CONTRACT_UST_TOKEN_ABI,
  dai: constants.CONTRACT_DAI_TOKEN_ABI,
  xcn: constants.CONTRACT_XCN_TOKEN_ABI,
  wsteth: constants.CONTRACT_WSTETH_TOKEN_ABI
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

const walletV2Provider = await EthereumProvider.init({
  projectId: process.env.REACT_APP_WEB3_WALLET_PROJECT_ID, // required
  chains: [1], // required
  showQrModal: true // requires @walletconnect/modal
});

const bw3wProvider = getBW3WProvider({
  chainId: 1,
  rpc: {
    1: process.env.REACT_APP_MAIN_RPC
  },
  showQrCodeModal: true
});

export const getProvider = walletType => {
  let provider = null;
  if (walletType === 'wcv2') {
    provider = walletV2Provider;
  } else if (walletType === 'bitkeep' && window.bitkeep) {
    provider = window.bitkeep.ethereum;
  } else if (walletType === 'bw3w') {
    provider = bw3wProvider;
  } else if (typeof window.ethereum !== 'undefined') {
    if (window.ethereum.providers?.length) {
      window.ethereum.providers.forEach(async p => {
        if ((!walletType || walletType === 'metamask') && p.isMetaMask)
          provider = p;
        else if (walletType === 'trustwallet' && p.isTrustWallet) provider = p;
        else if (walletType === 'coinbase' && p.isCoinbaseWallet) provider = p;
      });
    } else if (
      (!walletType || walletType === 'metamask') &&
      window.ethereum.isMetaMask
    ) {
      provider = window.ethereum;
    } else if (walletType === 'trustwallet' && window.trustwallet) {
      provider = window.trustwallet;
    } else if (walletType === 'coinbase' && window.ethereum.isCoinbaseWallet) {
      provider = window.ethereum;
    }
  }
  return provider;
};

export const getMulticall = instance => {
  return new Multicall({
    web3Instance: instance,
    tryAggregate: true
  });
};

export const getTokenContract = (instance, name) => {
  return new instance.eth.Contract(
    JSON.parse(TOKEN_ABI[name]),
    constants.CONTRACT_TOKEN_ADDRESS[name || 'usdc'].address
  );
};

export const getSbepContract = (instance, name) => {
  return new instance.eth.Contract(
    JSON.parse(
      name !== 'eth' ? constants.CONTRACT_SBEP_ABI : constants.CONTRACT_SETH_ABI
    ),
    constants.CONTRACT_SBEP_ADDRESS[name || 'usdc'].address
  );
};

export const getComptrollerContract = instance => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_COMPTROLLER_ABI),
    constants.CONTRACT_COMPTROLLER_ADDRESS
  );
};

export const getPriceOracleContract = (
  instance,
  address = constants.CONTRACT_PRICE_ORACLE_ADDRESS
) => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_PRICE_ORACLE_ABI),
    address
  );
};

export const getVoteContract = instance => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_VOTE_ABI),
    constants.CONTRACT_VOTE_ADDRESS
  );
};

export const getInterestModelContract = (instance, address) => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_INTEREST_MODEL_ABI),
    address
  );
};

export const getFarmingContract = instance => {
  return new instance.eth.Contract(
    JSON.parse(constants.FARMING_ABI),
    constants.CONTRACT_FARMING_ADDRESS
  );
};

export const getLPContract = instance => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_LP_TOKEN_ABI),
    constants.CONTRACT_LP_ADDRESS
  );
};
export const getNFTContract = instance => {
  return new instance.eth.Contract(
    JSON.parse(constants.NFT_ABI),
    constants.NFT_ADDRESS
  );
};

export const getVSTRKContract = instance => {
  return new instance.eth.Contract(
    JSON.parse(constants.VSTRK_ABI),
    constants.VSTRK_ADDRESS
  );
};
export const getSTRKClaimContract = instance => {
  return new instance.eth.Contract(
    JSON.parse(constants.STRK_CLAIM_ABI),
    constants.STRK_CLAIM_ADDRESS
  );
};
export const getSTRKContract = instance => {
  return new instance.eth.Contract(
    JSON.parse(constants.STRK_ABI),
    constants.STRK_ADDRESS
  );
};
export const getStakingContract = instance => {
  return new instance.eth.Contract(
    JSON.parse(constants.STAKING_ABI),
    constants.STAKING_ADDRESS
  );
};
export const methods = {
  call,
  send
};
