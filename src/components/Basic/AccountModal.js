import React, { useEffect, useState } from 'react';
// import { initOnRamp } from '@coinbase/cbpay-js/dist/index.js';
import { initOnRamp } from '@coinbase/cbpay-js';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import closeImg from 'assets/img/close.png';
import { connectAccount, accountActionCreators } from 'core';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import AnimatedNumber from 'animated-number-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message, Icon } from 'antd';
import { getBigNumber } from 'utilities/common';
import Button from '@material-ui/core/Button';
import commaNumber from 'comma-number';
import coinbaseImg from 'assets/img/coinbase_pay.png';

const ModalContent = styled.div`
  border-radius: 5px;
  background-color: var(--color-bg-primary);
  padding: 0 20px 32px;
  .close-btn {
    position: absolute;
    top: 23px;
    right: 23px;
  }
  .header {
    padding: 24px;
    font-size: 16px;
    font-weight: bold;
  }

  .wallet {
    width: 100%;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
  }
  .info-wrapper {
    width: 100%;
  }

  @media only screen and (max-width: 768px) {
    padding: 0 20px 10px;
  }
`;

const UserInfoButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  gap: 30px;

  @media only screen and (max-width: 768px) {
    width: 100%;
    margin: 20px 0 0;
  }

  .user-info-btn {
    padding: 0 8px;
    height: 32px;
    box-shadow: 0px 4px 13px 0 rgba(39, 126, 230, 0.64);
    background-color: rgba(39, 126, 230, 0.7);
    display: flex;
    align-items: center;

    @media only screen and (max-width: 768px) {
      padding: 0 8px;
    }

    .MuiButton-label {
      font-size: 13.5px;
      line-height: 1;
      font-weight: 500;
      color: var(--color-white);
      text-transform: capitalize;
      display: flex;
      align-items: center;
    }

    img {
      width: 16px;
      height: 16px;
    }
  }

  .coinbase-pay-btn {
    padding: 0 8px;
    height: 32px;
    box-shadow: 0px 4px 13px 0 rgba(39, 126, 230, 0.64);
    background-color: rgba(39, 126, 230, 0.7);
    display: flex;
    align-items: center;

    @media only screen and (max-width: 768px) {
      padding: 0 8px;
    }

    .MuiButton-label {
      font-size: 13.5px;
      line-height: 1;
      font-weight: 500;
      color: var(--color-white);
      text-transform: capitalize;
      display: flex;
      align-items: center;
    }

    img {
      margin-right: 10px;
      width: 16px;
      height: 16px;
    }
  }

  .item {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    
    svg {
      fill: rgba(0, 0, 0, 0.65);
    }

    &:hover {
      transition: all 0.3s;
      color: rgba(39, 126, 230, 0.7);

      svg {
        transition: all 0.3s;
        fill: rgba(39, 126, 230, 0.7);
      }
    }
  }
`;

const StyledDropdown = styled.div`
  display: flex;
`;

function AccountModal({ visible, onCancel, onDisconnect, settings }) {
  const [onrampInstance, setOnrampInstance] = useState(null);

  const format = commaNumber.bindWith(',', '.');

  const formatValue = value => {
    return `$${format(
      getBigNumber(value)
        .dp(2, 1)
        .toString(10)
    )}`;
  };

  useEffect(() => {
    initOnRamp({
      appId: process.env.REACT_APP_COINBASE_PAY_APP_ID,
      widgetParameters: {
        destinationWallets: [
          {
            address: settings.selectedAddress,
            blockchains: ['ethereum'],
          },
        ],
      },
      onSuccess: () => {
        console.log('success');
      },
      onExit: () => {
        console.log('exit');
      },
      onEvent: (event) => {
        console.log('event', event);
      },
      experienceLoggedIn: 'popup',
      experienceLoggedOut: 'popup',
      closeOnExit: true,
      closeOnSuccess: true,
    }, (_, instance) => {
      setOnrampInstance(instance);
    });

    return () => {
      if (onrampInstance)
        onrampInstance.destroy();
    };
  }, [settings.selectedAddress]);

  const handleCoinbasePayClick = () => {
    if (onrampInstance)
      onrampInstance.open();
  };

  const handleLink = () => {
    window.open(
      `${process.env.REACT_APP_ETH_EXPLORER}/address/${settings.selectedAddress}`,
      '_blank'
    );
  };

  return (
    <Modal
      className="connect-modal"
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
        <div className="header">Your Wallet</div>

        <div className="flex flex-column info-wrapper">

          <div className="wallet">
            {settings.selectedAddress}
          </div>

          <UserInfoButton>
            <div className="item" onClick={() => { handleLink(); }}>
              View on Etherscan
              <svg viewBox="0 0 24 24" width="20px" xmlns="http://www.w3.org/2000/svg" class="sc-bdvvaa cpQaOW"><path d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z"></path>
              </svg>
            </div>

            <CopyToClipboard
              text={settings.selectedAddress}
              onCopy={() => {
                message.success(`Copied address`);
              }}
            >
              <div className="item">
                Copy Address
                <svg viewBox="0 0 24 24" width="20px" color="primary" xmlns="http://www.w3.org/2000/svg" class="sc-bdvvaa cpQaOW"><path d="M15 1H4C2.9 1 2 1.9 2 3V16C2 16.55 2.45 17 3 17C3.55 17 4 16.55 4 16V4C4 3.45 4.45 3 5 3H15C15.55 3 16 2.55 16 2C16 1.45 15.55 1 15 1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM18 21H9C8.45 21 8 20.55 8 20V8C8 7.45 8.45 7 9 7H18C18.55 7 19 7.45 19 8V20C19 20.55 18.55 21 18 21Z"></path>
                </svg>
              </div>
            </CopyToClipboard>
          </UserInfoButton>

          <UserInfoButton>
            <Button className="coinbase-pay-btn" disabled={!onrampInstance} onClick={() => { handleCoinbasePayClick(); }}>
              <img src={coinbaseImg} alt="coinbase" />Coinbase Pay
            </Button>
          </UserInfoButton>

          <UserInfoButton>
            <Button className="user-info-btn" onClick={() => { onDisconnect(); onCancel(); }}>
              Disconnect
            </Button>
          </UserInfoButton>
        </div>

      </ModalContent >
    </Modal >
  );
}

AccountModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onDisconnect: PropTypes.func,
  settings: PropTypes.object,
};

AccountModal.defaultProps = {
  visible: false,
  settings: {},
  onCancel: () => { },
  onDisconnect: () => { }
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, null))(
  AccountModal
);
