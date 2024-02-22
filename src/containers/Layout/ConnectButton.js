import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { message } from 'antd';
import Button from '@material-ui/core/Button';
import * as constants from 'utilities/constants';
import ConnectModal from 'components/Basic/ConnectModal';
import AccountModal from 'components/Basic/AccountModal';
import { connectAccount, accountActionCreators } from 'core';
import InjectWalletClass from 'utilities/InjectWallet';
import { getProvider } from 'utilities/ContractService';
import { useProvider } from 'hooks/useContract';
import DisclaimerModal from 'components/Basic/DisclaimerModal';

const StyledConnectButton = styled.div`
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 768px) {
    width: 100%;
    margin: 20px 0 0;
    display: block;
  }

  .connect-btn {
    width: 150px;
    height: 32px;
    background: linear-gradient(
      242deg,
      #246cf9 0%,
      #1e68f6 0.01%,
      #0047d0 100%,
      #0047d0 100%
    );

    @media only screen and (max-width: 768px) {
      width: 100px;
    }

    .MuiButton-label {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--color-white);
      text-transform: capitalize;
    }
  }
`;

let metamask = null;
let bitkeep = null;
let trustwallet = null;
let coinbase = null;
let accounts = [];
const metamaskWatcher = null;
const bitkeepWatcher = null;
const trustwalletWatcher = null;
const coinbaseWatcher = null;

const abortController = new AbortController();
let doneFlag = false;

function ConnectButton({
  history,
  settings,
  setSetting,
  getGovernanceStrike,
  intl
}) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenAccountModal, setIsOpenAccountModal] = useState(false);
  const [isOpenDisclaimerModal, setIsOpenDisclaimerModal] = useState(false);
  const [awaiting, setAwaiting] = useState('');
  const [metamaskError, setMetamaskError] = useState('');
  const [bitkeepError, setBitkeepError] = useState('');
  const [trustwalletError, setTrustwalletError] = useState('');
  const [coinbasewalletError, setCoinbasewalletError] = useState('');
  const currentProvider = useProvider(settings.walletConnected);

  const checkNetwork = async provider => {
    const web3 = new Web3(provider);
    const netId = await web3.eth.getChainId();
    setSetting({
      accountLoading: true
    });
    if (netId) {
      if (netId === 1 || netId === 5) {
        if (netId === 5 && process.env.REACT_APP_ENV === 'prod') {
          message.error(
            intl.formatMessage({
              id: 'Incorrect_Network'
            })
          );
        } else if (netId === 1 && process.env.REACT_APP_ENV === 'dev') {
          message.error(
            intl.formatMessage({
              id: 'Incorrect_Network_1'
            })
          );
        } else {
          setSetting({
            accountLoading: false
          });
        }
      } else {
        message.error(
          intl.formatMessage({
            id: 'Incorrect_Network_2'
          })
        );
      }
    }
  };

  const withTimeoutRejection = async (promise, timeout) => {
    const sleep = new Promise((resolve, reject) =>
      setTimeout(() => reject(new Error(constants.TIMEOUT)), timeout)
    );
    return Promise.race([promise, sleep]);
  };

  const handleMetamaskWatch = useCallback(async () => {
    const provider = getProvider('metamask');
    if (provider) {
      const accs = await provider.request({ method: 'eth_accounts' });
      if (!accs[0]) {
        accounts = [];
        clearTimeout(metamaskWatcher);
        setSetting({ selectedAddress: null });
      }
      if (!accounts.length) {
        setAwaiting('metamask');
      }
    }
    if (metamaskWatcher) {
      clearTimeout(metamaskWatcher);
    }

    let tempWeb3 = null;
    let tempAccounts = [];
    let tempENSName = null;
    let tempENSAvatar = null;
    let tempError = metamaskError;
    let latestBlockNumber = 0;
    try {
      const isLocked =
        metamaskError && metamaskError.message === constants.LOCKED;
      if (!metamask || isLocked) {
        metamask = await withTimeoutRejection(
          InjectWalletClass.initialize(undefined), // if option is existed, add it
          20 * 1000 // timeout
        );
      }
      tempWeb3 = await metamask.getWeb3();
      const currentChainId = await metamask.getChainId();
      const chainId = process.env.REACT_APP_ENV === 'prod' ? '0x1' : '0x5';
      if (currentChainId !== Number(chainId))
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }]
        });
      tempAccounts = await metamask.getAccounts();
      // Lookup ENS name and avatar when possible
      const ethersProvider = new ethers.providers.Web3Provider(
        tempWeb3.currentProvider
      );
      tempENSName = await ethersProvider.lookupAddress(tempAccounts[0]);
      tempENSAvatar = tempENSName
        ? await ethersProvider.getAvatar(tempENSName)
        : null;
      latestBlockNumber = await metamask.getLatestBlockNumber();
      if (latestBlockNumber) {
        await setSetting({ latestBlockNumber });
      }
      tempError = null;
    } catch (err) {
      tempError = err;
      accounts = [];
      await setSetting({ selectedAddress: null });
    }
    await setSetting({
      selectedAddress: tempAccounts[0],
      selectedENSName: tempENSName,
      selectedENSAvatar: tempENSAvatar,
      walletConnected: 'metamask'
    });
    accounts = tempAccounts;
    setMetamaskError(tempError);
    setAwaiting('');
    localStorage.setItem('walletConnected', 'metamask');
  }, [metamaskError]);

  const handleBitkeepWatch = useCallback(async () => {
    const provider = getProvider('bitkeep');
    if (provider) {
      const accs = await provider.request({
        method: 'eth_accounts'
      });
      if (!accs[0]) {
        accounts = [];
        clearTimeout(bitkeepWatcher);
        setSetting({ selectedAddress: null });
      }
      if (!accounts.length) {
        setAwaiting('bitkeep');
      }
    }
    if (bitkeepWatcher) {
      clearTimeout(bitkeepWatcher);
    }

    let tempWeb3 = null;
    let tempAccounts = [];
    let tempENSName = null;
    let tempENSAvatar = null;
    let tempError = bitkeepError;
    let latestBlockNumber = 0;
    try {
      const isLocked =
        bitkeepError && bitkeepError.message === constants.LOCKED;
      if (!bitkeep || isLocked) {
        bitkeep = await withTimeoutRejection(
          InjectWalletClass.initialize({ walletType: 'bitkeep' }), // if option is existed, add it
          20 * 1000 // timeout
        );
      }
      tempWeb3 = await bitkeep.getWeb3();
      const currentChainId = await bitkeep.getChainId();
      const chainId = process.env.REACT_APP_ENV === 'prod' ? '0x1' : '0x5';
      if (currentChainId !== Number(chainId))
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }]
        });
      tempAccounts = await bitkeep.getAccounts();
      // Lookup ENS name and avatar when possible
      const ethersProvider = new ethers.providers.Web3Provider(
        tempWeb3.currentProvider
      );
      tempENSName = await ethersProvider.lookupAddress(tempAccounts[0]);
      tempENSAvatar = tempENSName
        ? await ethersProvider.getAvatar(tempENSName)
        : null;
      latestBlockNumber = await bitkeep.getLatestBlockNumber();
      if (latestBlockNumber) {
        await setSetting({ latestBlockNumber });
      }
      tempError = null;
    } catch (err) {
      tempError = err;
      accounts = [];
      await setSetting({ selectedAddress: null });
    }
    await setSetting({
      selectedAddress: tempAccounts[0],
      selectedENSName: tempENSName,
      selectedENSAvatar: tempENSAvatar,
      walletConnected: 'bitkeep'
    });
    accounts = tempAccounts;
    setBitkeepError(tempError);
    setAwaiting('');
    localStorage.setItem('walletConnected', 'bitkeep');
  }, [bitkeepError]);

  const handleTrustWalletWatch = useCallback(async () => {
    const provider = getProvider('trustwallet');
    if (provider) {
      const accs = await provider.request({
        method: 'eth_accounts'
      });
      if (!accs[0]) {
        accounts = [];
        clearTimeout(trustwalletWatcher);
        setSetting({ selectedAddress: null });
      }
      if (!accounts.length) {
        setAwaiting('trustwallet');
      }
    }
    if (trustwalletWatcher) {
      clearTimeout(trustwalletWatcher);
    }

    let tempWeb3 = null;
    let tempAccounts = [];
    let tempENSName = null;
    let tempENSAvatar = null;
    let tempError = trustwalletError;
    let latestBlockNumber = 0;
    try {
      const isLocked =
        trustwalletError && trustwalletError.message === constants.LOCKED;
      if (!trustwallet || isLocked) {
        trustwallet = await withTimeoutRejection(
          InjectWalletClass.initialize({ walletType: 'trustwallet' }), // if option is existed, add it
          20 * 1000 // timeout
        );
      }
      tempWeb3 = await trustwallet.getWeb3();
      const currentChainId = await trustwallet.getChainId();
      const chainId = process.env.REACT_APP_ENV === 'prod' ? '0x1' : '0x5';
      if (currentChainId !== Number(chainId))
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }]
        });
      tempAccounts = await trustwallet.getAccounts();
      // Lookup ENS name and avatar when possible
      const ethersProvider = new ethers.providers.Web3Provider(
        tempWeb3.currentProvider
      );
      tempENSName = await ethersProvider.lookupAddress(tempAccounts[0]);
      tempENSAvatar = tempENSName
        ? await ethersProvider.getAvatar(tempENSName)
        : null;
      latestBlockNumber = await trustwallet.getLatestBlockNumber();
      if (latestBlockNumber) {
        await setSetting({ latestBlockNumber });
      }
      tempError = null;
    } catch (err) {
      tempError = err;
      accounts = [];
      await setSetting({ selectedAddress: null });
    }
    await setSetting({
      selectedAddress: tempAccounts[0],
      selectedENSName: tempENSName,
      selectedENSAvatar: tempENSAvatar,
      walletConnected: 'trustwallet'
    });
    accounts = tempAccounts;
    setTrustwalletError(tempError);
    setAwaiting('');
    localStorage.setItem('walletConnected', 'trustwallet');
  }, [trustwalletError]);

  const handleCoinbaseWalletWatch = useCallback(async () => {
    const provider = getProvider('coinbase');
    if (provider) {
      const accs = await provider.request({
        method: 'eth_accounts'
      });
      if (!accs[0]) {
        accounts = [];
        clearTimeout(coinbaseWatcher);
        setSetting({ selectedAddress: null });
      }
      if (!accounts.length) {
        setAwaiting('coinbase');
      }
    }
    if (coinbaseWatcher) {
      clearTimeout(coinbaseWatcher);
    }

    let tempWeb3 = null;
    let tempAccounts = [];
    let tempENSName = null;
    let tempENSAvatar = null;
    let tempError = coinbasewalletError;
    let latestBlockNumber = 0;
    try {
      const isLocked =
        coinbasewalletError && coinbasewalletError.message === constants.LOCKED;
      if (!coinbase || isLocked) {
        coinbase = await withTimeoutRejection(
          InjectWalletClass.initialize({ walletType: 'coinbase' }), // if option is existed, add it
          20 * 1000 // timeout
        );
      }
      tempWeb3 = await coinbase.getWeb3();
      const currentChainId = await coinbase.getChainId();
      const chainId = process.env.REACT_APP_ENV === 'prod' ? '0x1' : '0x5';
      if (currentChainId !== Number(chainId))
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }]
        });
      tempAccounts = await coinbase.getAccounts();
      // Lookup ENS name and avatar when possible
      const ethersProvider = new ethers.providers.Web3Provider(
        tempWeb3.currentProvider
      );
      tempENSName = await ethersProvider.lookupAddress(tempAccounts[0]);
      tempENSAvatar = tempENSName
        ? await ethersProvider.getAvatar(tempENSName)
        : null;
      latestBlockNumber = await coinbase.getLatestBlockNumber();
      if (latestBlockNumber) {
        await setSetting({ latestBlockNumber });
      }
      tempError = null;
    } catch (err) {
      tempError = err;
      accounts = [];
      await setSetting({ selectedAddress: null });
    }
    await setSetting({
      selectedAddress: tempAccounts[0],
      selectedENSName: tempENSName,
      selectedENSAvatar: tempENSAvatar,
      walletConnected: 'coinbase'
    });
    accounts = tempAccounts;
    setCoinbasewalletError(tempError);
    setAwaiting('');
    localStorage.setItem('walletConnected', 'coinbase');
  }, [coinbasewalletError]);

  const handleMetaMask = async () => {
    const provider = getProvider('metamask');
    setMetamaskError(provider ? '' : new Error(constants.NOT_INSTALLED));
    handleMetamaskWatch();
  };

  const handleBitKeep = () => {
    setBitkeepError(
      window.bitkeep && window.bitkeep.ethereum
        ? ''
        : new Error(constants.NOT_INSTALLED)
    );
    handleBitkeepWatch();
  };

  const handleTrustWallet = async () => {
    const provider = getProvider('trustwallet');
    setTrustwalletError(provider ? '' : new Error(constants.NOT_INSTALLED));
    handleTrustWalletWatch();
  };

  const handleCoinbaseWallet = async () => {
    const provider = getProvider('coinbase');
    setCoinbasewalletError(provider ? '' : new Error(constants.NOT_INSTALLED));
    handleCoinbaseWalletWatch();
  };

  useEffect(() => {
    if (accounts.length !== 0) {
      setIsOpenModal(false);
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [accounts]);

  useEffect(() => {
    if (settings.walletConnected === 'metamask') {
      handleMetamaskWatch();
    } else if (settings.walletConnected === 'bitkeep') {
      handleBitkeepWatch();
    } else if (settings.walletConnected === 'trustwallet') {
      handleTrustWalletWatch();
    } else if (settings.walletConnected === 'coinbase') {
      handleCoinbaseWalletWatch();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [history]);

  useEffect(() => {
    if (currentProvider && !doneFlag) {
      doneFlag = true;
      window.addEventListener('load', event => {
        checkNetwork(currentProvider);
      });
    }
  }, [currentProvider]);

  const handleDisconnect = () => {
    const disclaimerConfirmed = localStorage.getItem('disclaimerConfirmed');
    localStorage.clear();
    localStorage.setItem('disclaimerConfirmed', disclaimerConfirmed);
    setSetting({
      selectedAddress: null,
      walletConnected: ''
    });
  };

  return (
    <>
      <StyledConnectButton>
        {settings.selectedAddress ? (
          <Button
            className="connect-btn"
            onClick={() => {
              setIsOpenAccountModal(true);
            }}
          >
            {`${settings.selectedAddress.substr(
              0,
              4
            )}...${settings.selectedAddress.substr(
              settings.selectedAddress.length - 4,
              4
            )}`}
          </Button>
        ) : (
          <Button
            className="connect-btn"
            onClick={() => {
              setMetamaskError(null);
              setBitkeepError(null);
              setTrustwalletError(null);
              setCoinbasewalletError(null);
              if (localStorage.getItem('disclaimerConfirmed'))
                setIsOpenModal(true);
              else setIsOpenDisclaimerModal(true);
            }}
          >
            Connect
          </Button>
        )}
      </StyledConnectButton>

      {isOpenModal && (
        <ConnectModal
          visible={isOpenModal}
          metamaskError={metamaskError}
          bitkeepError={bitkeepError}
          trustwalletError={trustwalletError}
          coinbasewalletError={coinbasewalletError}
          awaiting={awaiting}
          onCancel={() => setIsOpenModal(false)}
          onConnectMetaMask={handleMetaMask}
          onConnectBitKeep={handleBitKeep}
          onConnectTrustWallet={handleTrustWallet}
          onConnectCoinbaseWallet={handleCoinbaseWallet}
          checkNetwork={checkNetwork}
        />
      )}
      {isOpenAccountModal && (
        <AccountModal
          visible={isOpenAccountModal}
          onCancel={() => setIsOpenAccountModal(false)}
          onDisconnect={() => handleDisconnect()}
        />
      )}
      {isOpenDisclaimerModal && (
        <DisclaimerModal
          visible={isOpenDisclaimerModal}
          onCancel={() => setIsOpenDisclaimerModal(false)}
          onContinue={() => setIsOpenModal(true)}
        />
      )}
    </>
  );
}

ConnectButton.propTypes = {
  history: PropTypes.object,
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired,
  getGovernanceStrike: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

ConnectButton.defaultProps = {
  settings: {},
  history: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { setSetting, getGovernanceStrike } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting,
      getGovernanceStrike
    },
    dispatch
  );
};

export default injectIntl(
  compose(
    withRouter,
    connectAccount(mapStateToProps, mapDispatchToProps)
  )(ConnectButton)
);
