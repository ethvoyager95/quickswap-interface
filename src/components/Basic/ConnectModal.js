import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import * as constants from 'utilities/constants';
import metamaskImg from 'assets/img/metamask.png';
import arrowRightImg from 'assets/img/arrow-right.png';
import closeImg from 'assets/img/close.png';
import logoImg from 'assets/img/logo.png';

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
      padding: 27px 0px;

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
`;

function ConnectModal({
  visible,
  web3,
  error,
  awaiting,
  onCancel,
  onConnectMetaMask
}) {
  const MetaMaskStatus = () => {
    if (error && error.message === constants.NOT_INSTALLED) {
      return (
        <p className="center">
          We could not locate a supported web3 browser extension. We recommend
          using MetaMask.
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
  onConnectMetaMask: PropTypes.func.isRequired
};

ConnectModal.defaultProps = {
  visible: false,
  web3: {},
  error: '',
  awaiting: false,
  onCancel: () => {}
};

export default ConnectModal;
