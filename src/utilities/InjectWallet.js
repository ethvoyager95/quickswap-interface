import Web3 from 'web3'; // eslint-disable-line import/no-unresolved

import * as constants from './constants';
import { getProvider } from './ContractService';

export default class InjectWallet {
  static async initialize(
    { maxListeners, walletType } = { maxListeners: 300, walletType: 'metamask' }
  ) {
    const instance = await InjectWallet.getWeb3(walletType);
    const provider = instance.currentProvider;
    if (walletType === 'metamask') {
      provider.setMaxListeners(maxListeners);
    }
    return new InjectWallet(provider);
  }

  static hasWeb3() {
    return typeof window !== 'undefined' && Boolean(window.ethereum);
  }

  static async getWeb3(walletType) {
    const provider = getProvider(walletType);
    if (provider) {
      provider.on('chainChanged', chainId => {
        if (chainId > 0 && walletType !== 'coinbase') window.location.reload();
      });
      provider.on('accountsChanged', accounts => {
        if (accounts && accounts.length > 0) window.location.reload();
      });
      // await provider.enable();
      await provider.request({ method: 'eth_requestAccounts' });
      return new Web3(provider);
    }

    throw new Error(constants.NOT_INSTALLED);
  }

  constructor(provider) {
    if (!provider) {
      throw new Error(constants.MISSING_PROVIDER);
    }
    this.web3 = new Web3(provider);
  }

  async getWeb3() {
    return this.web3;
  }

  async getAccounts() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((err, accounts) => {
        if (err !== null) {
          reject(err);
        } else if (accounts.length === 0) {
          reject(new Error(constants.LOCKED));
        } else {
          resolve(accounts);
        }
      });
    });
  }

  async getLatestBlockNumber() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getBlockNumber((err, blockNumber) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(blockNumber);
        }
      });
    });
  }

  async getChainId() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getChainId((err, chainId) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(chainId);
        }
      });
    });
  }
}
