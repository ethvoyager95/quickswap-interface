import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import * as constants from 'utilities/constants';
import metamaskImg from 'assets/img/metamask.png';
import bitkeepImg from 'assets/img/bitkeep.png';
import arrowRightImg from 'assets/img/arrow-right.png';
import closeImg from 'assets/img/close.png';
import logoImg from 'assets/img/logo.png';
import WalletLink from 'walletlink';
import { Web3Provider } from '@ethersproject/providers';
import { connectAccount, accountActionCreators } from 'core';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { checkIsValidNetwork } from 'utilities/common';
import coinbaseImg from 'assets/img/coinbase.png';

const ModalContent = styled.div`
  border-radius: 5px;
  background-color: var(--color-bg-primary);
  .close-btn {
    position: absolute;
    top: 23px;
    right: 23px;
  }
  .header-content {
    margin-top: 79px;
    .logo-image {
      margin-bottom: 43px;
    }
    .title {
      font-size: 24.5px;
      color: var(--color-text-main);
    }
  }
  .connect-wallet-content {
    width: 100%;
    padding: 38px 78px 32px 66px;
    .metamask-connect-btn {
      width: 100%;
      cursor: pointer;
      & > div {
        img {
          width: 45px;
          margin-right: 44px;
        }
        span {
          color: var(--color-text-main);
          font-weight: normal;
          font-size: 17px;
        }
      }
      span {
        color: var(--color-text-secondary);
        font-weight: normal;
        font-size: 17px;
      }
      .arrow-icon {
        width: 32px;
      }
    }
    .metamask-status {
      margin-top: 20px;
      background-color: rgba(255, 0, 0, 0.03);
      padding: 5px 10px;
      border-radius: 4px;
      color: var(--color-red);
      a {
        margin-left: 5px;
      }
    }
  }
  .disconnect-btn {
    background-color: #d01f36;
    color: #ffffff;
    font-weight: bold;
    font-size: 17px;
    height: 40px;
    border-radius: 20px;
  }
`;

function ConnectModal({
  visible,
  web3,
  error,
  awaiting,
  onCancel,
  onConnectMetaMask,
  checkNetwork,
  settings,
  setSetting
}) {
  const [web3Library, setWeb3Library] = React.useState();
  const [web3Account, setWeb3Account] = React.useState();
  const [isBitkeepWallet, setIsBitKeepWallet] = React.useState(false);
  const [isMetaMask, setisMetaMask] = React.useState(false);
  const MetaMaskStatus = () => {
    if (error && error.message === constants.NOT_INSTALLED) {
      return (
        <p className="center">
          We could not locate a supported web3 browser extension. We recommend
          using MetaMask or Coinbase.
          <a
            href="https://metamask.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download MetaMask here.
          </a>
          <a
            href="https://www.coinbase.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Coinbase here.
          </a>
        </p>
      );
    }
    if (error) {
      return <span>{error.message}</span>;
    }
    if (!web3 && awaiting) {
      return <span>MetaMask loading...</span>;
    }
    if (!web3) {
      return <span>Please open and allow MetaMask</span>;
    }
    return null;
  };
  const BitkeepStatus = () => {
    if (error && error.message === constants.NOT_INSTALLED) {
      return (
        <p className="center">
          We could not locate a supported web3 browser extension. We recommend
          using Bitkeep or Coinbase.
          <a
            href="https://bitkeep.com/download"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Bitkeep here.
          </a>
          <a
            href="https://www.coinbase.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Coinbase here.
          </a>
        </p>
      );
    }
    if (error) {
      return <span>{error.message}</span>;
    }
    if (!web3 && awaiting) {
      return <span>BitkeppStatus loading...</span>;
    }
    if (!web3) {
      return <span>Please open and allow Bitkeep</span>;
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
        4
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

  // check install meta bitkeep
  useEffect(() => {
    if (window) {
      if (!window.isBitKeep) {
        setIsBitKeepWallet(false);
      }
      setIsBitKeepWallet(window.isBitKeep);
      if (window?.ethereum?.isMetaMask) {
        setisMetaMask(window?.ethereum?.isMetaMask);
      }
      if (window?.ethereum?.isMetaMask === true && window.isBitKeep === true) {
        setisMetaMask(false);
        setIsBitKeepWallet(true);
      }
      if (
        window?.ethereum?.isMetaMask === undefined &&
        window.isBitKeep === undefined
      ) {
        setisMetaMask(false);
        setIsBitKeepWallet(false);
      }
    }
  }, [window.ethereum, settings.selectedAddress]);

  return (
    <Modal
      className="connect-modal"
      width={532}
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
          <p className="title">Connect to start using Strike</p>
        </div>
        <div className="connect-wallet-content">
          {isMetaMask ? (
            <>
              <div
                className="flex align-center just-between metamask-connect-btn"
                onClick={onConnectMetaMask}
              >
                <div className="flex align-center">
                  <img src={metamaskImg} alt="metamask" />
                  <span>MetaMask</span>
                </div>
                <img className="arrow-icon" src={arrowRightImg} alt="arrow" />
              </div>
              {(error || !web3) && (
                <div className="metamask-status">
                  <MetaMaskStatus />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex align-center just-between metamask-connect-btn">
                <div className="flex align-center">
                  <img src={metamaskImg} alt="metamask" />
                  <span>MetaMask</span>
                </div>
                <img className="arrow-icon" src={arrowRightImg} alt="arrow" />
              </div>
              {(error || !web3) && !isMetaMask && !isBitkeepWallet && (
                <div className="metamask-status">
                  <MetaMaskStatus />
                </div>
              )}
            </>
          )}
        </div>

        <div className="connect-wallet-content">
          {isBitkeepWallet ? (
            <>
              <div
                className="flex align-center just-between metamask-connect-btn"
                onClick={onConnectMetaMask}
              >
                <div className="flex align-center">
                  <img className="bitkeep-img" src={bitkeepImg} alt="bitkeep" />
                  <span>Bitkeep</span>
                </div>
                <img className="arrow-icon" src={arrowRightImg} alt="arrow" />
              </div>
              {(error || !web3) && (
                <div className="metamask-status">
                  <BitkeepStatus />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex align-center just-between metamask-connect-btn">
                <div className="flex align-center">
                  <img className="bitkeep-img" src={bitkeepImg} alt="bitkeep" />
                  <span>Bitkeep</span>
                </div>
                <img className="arrow-icon" src={arrowRightImg} alt="arrow" />
              </div>
              {(error || !web3) && !isMetaMask && !isBitkeepWallet && (
                <div className="metamask-status">
                  <BitkeepStatus />
                </div>
              )}
            </>
          )}
        </div>
        <div className="connect-wallet-content">
          <div
            className="flex align-center just-between metamask-connect-btn"
            onClick={connectCoinbase}
          >
            <div className="flex align-center">
              <img src={coinbaseImg} alt="metamask" />
              <span>Coinbase Wallet</span>
            </div>
            <img className="arrow-icon" src={arrowRightImg} alt="arrow" />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

ConnectModal.propTypes = {
  visible: PropTypes.bool,
  web3: PropTypes.object,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  awaiting: PropTypes.bool,
  onCancel: PropTypes.func,
  onConnectMetaMask: PropTypes.func.isRequired,
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired
};

ConnectModal.defaultProps = {
  visible: false,
  web3: {},
  error: '',
  awaiting: false,
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
