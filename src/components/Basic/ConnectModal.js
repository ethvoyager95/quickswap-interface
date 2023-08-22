import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import WalletLink from 'walletlink';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { Web3Provider } from '@ethersproject/providers';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { connectAccount, accountActionCreators } from 'core';
import * as constants from 'utilities/constants';
import { checkIsValidNetwork } from 'utilities/common';
import metamaskImg from 'assets/img/metamask.png';
import bitkeepImg from 'assets/img/bitkeep.png';
import coinbaseImg from 'assets/img/coinbase.png';
import walletConnectImg from 'assets/img/walletconnect.png';
import trusteWalletImg from 'assets/img/trustwallet.png';
import arrowRightImg from 'assets/img/arrow-right.svg';
import closeImg from 'assets/img/close.png';
import logoImg from 'assets/img/logo.png';

const ModalContent = styled.div`
  border-radius: 6px;
  box-shadow: 0px 0px 10px 0px #1760ed;

  .close-btn {
    position: absolute;
    top: 23px;
    right: 23px;
  }
  .header-content {
    margin-top: 45px;
    .logo-image {
      margin-bottom: 30px;
    }
    .title {
      font-size: 24.5px;
      color: var(--color-text-main);
    }
  }
  .connect-wallet-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 20px;
    column-gap: 20px;
    margin-bottom: 48px;
  }

  .connect-wallet-content {
    .metamask-connect-btn {
      background: #1f242c;
      padding: 20px 0px 16px;
      width: 204px;
      border-radius: 6px;
      border: 1px solid #1f242c;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;

      img {
        height: 40px;
      }

      span {
        color: var(--color-text-main);
        font-weight: normal;
        font-size: 14px;
        margin-top: 10px;
      }

      .arrow-icon {
        height: 25px;
      }

      &:hover {
        border: 1px solid #0c8ce9;
        background: #2b3947;

        span {
          color: white;
        }

        svg path {
          fill: white !important;
        }
      }
    }

    .metamask-status {
      margin-top: 20px;
      width: 204px;
      background-color: rgba(255, 0, 0, 0.03);
      padding: 5px 10px;
      border-radius: 6px;
      color: var(--color-red);
      a {
        margin-left: 5px;
      }
    }
  }

  .terms {
    color: var(--color-text-secondary);
    font-size: 12px;
    margin-bottom: 23px;

    a {
      color: white;
      font-weight: bold;
    }
  }

  @media (max-width: 420px) {
    .connect-wallet-wrapper {
      margin-bottom: 20px;
    }
    .connect-wallet-content {
      .metamask-connect-btn {
        padding: 20px 0px 16px;
        width: 160px;
      }

      .metamask-status {
        width: 160px;
      }
    }
  }
`;

function ConnectModal({
  visible,
  web3,
  metamaskError,
  bitkeepError,
  trustwalletError,
  awaiting,
  onCancel,
  onConnectMetaMask,
  onConnectBitKeep,
  onConnectTrustWallet,
  checkNetwork,
  settings,
  setSetting
}) {
  const MetaMaskStatus = () => {
    if (metamaskError && metamaskError.message === constants.NOT_INSTALLED) {
      return (
        <p className="center">
          We could not locate a supported web3 browser extension.
          <a
            href="https://metamask.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download MetaMask here.
          </a>
        </p>
      );
    }
    if (metamaskError) {
      return <span>{metamaskError.message}</span>;
    }
    // if (!web3) {
    //   return <span>Please open and allow MetaMask</span>;
    // }
    if (awaiting === 'metamask') {
      return <span>MetaMask loading...</span>;
    }
    return null;
  };

  const BitkeepStatus = () => {
    if (bitkeepError && bitkeepError.message === constants.NOT_INSTALLED) {
      return (
        <p className="center">
          We could not locate a supported web3 browser extension.
          <a
            href="https://bitkeep.com/download"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Bitkeep here.
          </a>
        </p>
      );
    }
    if (bitkeepError) {
      return <span>{bitkeepError.message}</span>;
    }
    // if (!web3) {
    //   return <span>Please open and allow Bitkeep</span>;
    // }
    if (awaiting === 'bitkeep') {
      return <span>Bitkepp loading...</span>;
    }
    return null;
  };

  const TrustWalletStatus = () => {
    if (
      trustwalletError &&
      trustwalletError.message === constants.NOT_INSTALLED
    ) {
      return (
        <p className="center">
          We could not locate a supported web3 browser extension.
          <a
            href="https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Trust Wallet here.
          </a>
        </p>
      );
    }
    if (trustwalletError) {
      return <span>{trustwalletError.message}</span>;
    }
    // if (!web3) {
    //   return <span>Please open and allow Trust Wallet</span>;
    // }
    if (awaiting === 'trustwallet') {
      return <span>Trust Wallet loading...</span>;
    }
    return null;
  };

  const connectCoinbase = async () => {
    try {
      // Initialize WalletLink
      const walletLink = new WalletLink({
        appName: 'STRIKE-APP',
        darkMode: true
      });

      const provider = walletLink.makeWeb3Provider(
        'https://rinkeby.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4',
        1
      );
      // setWalletlinkProvider(provider);
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });
      const account = accounts[0];
      if (!account) {
        setSetting({
          selectedAddress: null
        });
      } else {
        console.log(account);
        const library = new Web3Provider(provider, 'any');
        console.log(settings);
        console.log(library);
        setSetting({
          selectedAddress: account.toString()
        });
        onCancel();
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const connectWalletConnect = async () => {
    try {
      const walletConnector = new WalletConnectConnector({
        rpc: {
          1: 'https://mainnet.infura.io/v3/55d040fb60064deaa7acc8e320d99bd4'
        },
        pollingInterval: 10000,
        bridge: 'https://bridge.walletconnect.org',
        qrcode: true
      });

      await walletConnector.activate();
      const account = walletConnector.getAccount();
      if (!account) {
        setSetting({
          selectedAddress: null
        });
      } else {
        console.log(account);
        console.log(settings);
        setSetting({
          selectedAddress: account.toString()
        });
        onCancel();
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.addEventListener('load', event => {
        checkNetwork();
      });
    }
  }, [window.ethereum]);

  useEffect(() => {
    if (!settings.selectedAddress) {
      return;
    }
    if (window.ethereum && checkIsValidNetwork()) {
      window.ethereum.on('accountsChanged', accs => {
        setSetting({
          selectedAddress: accs[0],
          accountLoading: true
        });
      });
    }
  }, [window.ethereum, settings.selectedAddress]);

  return (
    <Modal
      className="connect-modal"
      width={480}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      maskClosable
      centered
    >
      <ModalContent className="flex flex-column align-center just-center">
        <img
          className="close-btn pointer"
          src={closeImg}
          alt="close"
          onClick={onCancel}
        />
        <div className="flex flex-column align-center just-center header-content">
          <img src={logoImg} alt="logo" className="logo-image" />
          {/* <p className="title">Connect to start using Strike</p> */}
        </div>
        <div className="connect-wallet-wrapper">
          <div className="connect-wallet-content">
            <div className="metamask-connect-btn" onClick={onConnectMetaMask}>
              <img src={metamaskImg} alt="metamask" />
              <span>MetaMask</span>
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.1327 13L8.19682 7.15601C7.93216 6.89559 7.93486 6.4789 8.20222 6.21848L9.26355 5.195C9.53632 4.93457 9.97381 4.93457 10.2439 5.1976L17.7975 12.5286C17.9325 12.6588 18 12.8281 18 13C18 13.1719 17.9325 13.3412 17.7975 13.4714L10.2439 20.8024C9.97381 21.0654 9.53632 21.0654 9.26356 20.805L8.20222 19.7815C7.93486 19.5211 7.93216 19.1044 8.19682 18.844L14.1327 13Z"
                  fill="#34384C"
                />
              </svg>
            </div>
            {(metamaskError || awaiting) && (
              <div className="metamask-status">
                <MetaMaskStatus />
              </div>
            )}
          </div>

          <div className="connect-wallet-content">
            <div className="metamask-connect-btn" onClick={onConnectBitKeep}>
              <img className="bitkeep-img" src={bitkeepImg} alt="bitkeep" />
              <span>Bitkeep</span>
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.1327 13L8.19682 7.15601C7.93216 6.89559 7.93486 6.4789 8.20222 6.21848L9.26355 5.195C9.53632 4.93457 9.97381 4.93457 10.2439 5.1976L17.7975 12.5286C17.9325 12.6588 18 12.8281 18 13C18 13.1719 17.9325 13.3412 17.7975 13.4714L10.2439 20.8024C9.97381 21.0654 9.53632 21.0654 9.26356 20.805L8.20222 19.7815C7.93486 19.5211 7.93216 19.1044 8.19682 18.844L14.1327 13Z"
                  fill="#34384C"
                />
              </svg>
            </div>
            {(bitkeepError || awaiting) && (
              <div className="metamask-status">
                <BitkeepStatus />
              </div>
            )}
          </div>

          <div className="connect-wallet-content">
            <div className="metamask-connect-btn" onClick={connectCoinbase}>
              <img src={coinbaseImg} alt="metamask" />
              <span>Coinbase Wallet</span>
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.1327 13L8.19682 7.15601C7.93216 6.89559 7.93486 6.4789 8.20222 6.21848L9.26355 5.195C9.53632 4.93457 9.97381 4.93457 10.2439 5.1976L17.7975 12.5286C17.9325 12.6588 18 12.8281 18 13C18 13.1719 17.9325 13.3412 17.7975 13.4714L10.2439 20.8024C9.97381 21.0654 9.53632 21.0654 9.26356 20.805L8.20222 19.7815C7.93486 19.5211 7.93216 19.1044 8.19682 18.844L14.1327 13Z"
                  fill="#34384C"
                />
              </svg>
            </div>
          </div>

          <div className="connect-wallet-content">
            <div
              className="metamask-connect-btn"
              onClick={connectWalletConnect}
            >
              <img src={walletConnectImg} alt="metamask" />
              <span>Wallet Connect</span>
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.1327 13L8.19682 7.15601C7.93216 6.89559 7.93486 6.4789 8.20222 6.21848L9.26355 5.195C9.53632 4.93457 9.97381 4.93457 10.2439 5.1976L17.7975 12.5286C17.9325 12.6588 18 12.8281 18 13C18 13.1719 17.9325 13.3412 17.7975 13.4714L10.2439 20.8024C9.97381 21.0654 9.53632 21.0654 9.26356 20.805L8.20222 19.7815C7.93486 19.5211 7.93216 19.1044 8.19682 18.844L14.1327 13Z"
                  fill="#34384C"
                />
              </svg>
            </div>
          </div>

          <div className="connect-wallet-content">
            <div
              className="metamask-connect-btn"
              onClick={onConnectTrustWallet}
            >
              <img src={trusteWalletImg} alt="metamask" />
              <span>Trust Wallet</span>
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.1327 13L8.19682 7.15601C7.93216 6.89559 7.93486 6.4789 8.20222 6.21848L9.26355 5.195C9.53632 4.93457 9.97381 4.93457 10.2439 5.1976L17.7975 12.5286C17.9325 12.6588 18 12.8281 18 13C18 13.1719 17.9325 13.3412 17.7975 13.4714L10.2439 20.8024C9.97381 21.0654 9.53632 21.0654 9.26356 20.805L8.20222 19.7815C7.93486 19.5211 7.93216 19.1044 8.19682 18.844L14.1327 13Z"
                  fill="#34384C"
                />
              </svg>
            </div>
            {(trustwalletError || awaiting) && (
              <div className="metamask-status">
                <TrustWalletStatus />
              </div>
            )}
          </div>
        </div>
        <div className="terms">
          By connecting, I accept Strike’s{' '}
          <a href="https://strike.org/terms" target="_blank" rel="noreferrer">
            Terms of Service
          </a>
        </div>
      </ModalContent>
    </Modal>
  );
}

ConnectModal.propTypes = {
  visible: PropTypes.bool,
  web3: PropTypes.object,
  metamaskError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  bitkeepError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  trustwalletError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  awaiting: PropTypes.string,
  settings: PropTypes.object,
  onCancel: PropTypes.func,
  onConnectMetaMask: PropTypes.func.isRequired,
  onConnectBitKeep: PropTypes.func.isRequired,
  onConnectTrustWallet: PropTypes.func.isRequired,
  checkNetwork: PropTypes.func.isRequired,
  setSetting: PropTypes.func.isRequired
};

ConnectModal.defaultProps = {
  visible: false,
  web3: {},
  metamaskError: '',
  bitkeepError: '',
  trustwalletError: '',
  awaiting: '',
  settings: {},
  onCancel: () => {}
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

export default compose(connectAccount(mapStateToProps, mapDispatchToProps))(
  ConnectModal
);
