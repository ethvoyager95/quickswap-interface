import React, { useEffect, useState, useRef } from 'react';
import { initOnRamp } from '@coinbase/cbpay-js/dist/index.js';
// import { initOnRamp } from '@coinbase/cbpay-js';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { connectAccount } from 'core';
import { compose } from 'recompose';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message } from 'antd';
import coinbaseImg from 'assets/img/coinbase_pay.svg';
import buyCryptoWithFiatImg from 'assets/img/buy_crypto_banner.svg';

const ModalContent = styled.div`
  border-radius: 5px;
  background-color: var(--color-bg-primary);
  padding: 27px 32px 23px 32px;
  color: black;
  gap: 25px;
  user-select: none;

  .close-btn {
    position: absolute;
    top: 30px;
    right: 32px;
  }

  .header {
    width: 100%;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    
    &:hover {
      transition: all 0.3s;
      color: rgba(39, 126, 230, 0.7);

      svg path {
        transition: all 0.3s;
        fill: rgba(39, 126, 230, 0.7);
      }
    }
  }

  .fiat-option {
    width: 100%;
    height: 212px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);


  }

  .disconnect-button {
    width: 100%;
    font-weight: 500;
    font-size: 18px;
    padding: 10px 0px;
    border-radius: 5px;    
    border: 1px solid rgba(0, 0, 0, 0.2);
    text-align: center;
    cursor: pointer;    
  }
`;

const StyledPaymentMethod = styled.div`
  margin: auto;
  width: 100%;
	position: relative;
`;

const StyledPayment = styled.div`
  margin: auto;
	width: 90%;
	height: 41px;
	border: 1px solid rgba(0, 0, 0, 0.2);
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 16px;
	cursor: pointer;
`;

const StyledPaymentSelect = styled.div`
	position: absolute;
  left: 50%;
  top: 50px;
  transform: translate(-50%, 0%);
  margin: auto;
  width: 90%;
	background: #EEEEEE;
  border-radius: 5px;
`;

const StyledPaymentItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 15px;
	cursor: pointer;
	height: 50px;
	width: 100%;

	&:not(:last-child) {
		margin-bottom: 8px;
	}

	&.active {
		background: #EEEEEE;
	}
`;

const StyledName = styled.div`
	font-family: 'Inter-Medium';
	font-weight: 500;
	font-size: 16px;
	line-height: 19px;
  display: flex;
	align-items: center;
  gap: 10px;
`;

export const useOutside = (ref, onClick) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClick();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClick]);
};


function AccountModal({ visible, onCancel, onDisconnect, settings }) {
  const onrampInstance = useRef();
  const [isReady, setIsReady] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);

  const wrapperRef = useRef(null);
  useOutside(wrapperRef, setOpenDropdown);

  useEffect(() => {
    if (settings.selectedAddress) {
      onrampInstance.current = null;
      setIsReady(false);

      initOnRamp({
        appId: process.env.REACT_APP_COINBASE_PAY_APP_ID,
        experienceLoggedIn: 'embedded',
        experienceLoggedOut: 'popup',
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
        onExit: (event) => {
          console.log('exit', event);
        },
        onEvent: (event) => {
          console.log('onEvent', event);
        },
        closeOnExit: true,
        closeOnSuccess: true,
      }, (error, instance) => {
        if (instance) {
          onrampInstance.current = instance;
          setIsReady(true);
        }
      });

      return () => {
        if (onrampInstance.current)
          onrampInstance.current.destroy();
      };
    }
  }, [settings.selectedAddress]);

  const handleCoinbasePayClick = () => {
    if (onrampInstance.current)
      onrampInstance.current.open();
  };

  const handleLink = () => {
    window.open(
      `${process.env.REACT_APP_ETH_EXPLORER}/address/${settings.selectedAddress}`,
      '_blank'
    );
  };

  return (
    <Modal
      className="info-modal"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      maskClosable
      centered
    >
      <ModalContent className="flex flex-column align-center just-center">

        <div className="close-btn pointer" onClick={onCancel}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.37608 0L0 1.37608L6.12392 7.5L0 13.6239L1.37608 15L7.5 8.87608L13.6239 15L15 13.6239L8.87608 7.5L15 1.37608L13.6239 0L7.5 6.12392L1.37608 0Z" fill="black" />
          </svg>
        </div>

        <div className="header">
          <div className="flex">
            {settings.selectedAddress ? `${settings.selectedAddress.substr(
              0,
              6
            )}...${settings.selectedAddress.substr(
              settings.selectedAddress.length - 4,
              4
            )}` : ''}
          </div>

          <div className="item" onClick={() => { handleLink(); }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.66667 0C0.755208 0 0 0.755208 0 1.66667V13.3333C0 14.2448 0.755208 15 1.66667 15H13.3333C14.2448 15 15 14.2448 15 13.3333V7.5H13.3333V13.3333H1.66667V1.66667H7.5V0H1.66667ZM9.16667 0V1.66667H12.1549L4.41081 9.41081L5.58919 10.5892L13.3333 2.84505V5.83333H15V0H9.16667Z" fill="black" />
            </svg>
          </div>

          <CopyToClipboard
            text={settings.selectedAddress}
            onCopy={() => {
              message.success(`Copied address`);
            }}
          >
            <div className="item">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 0C0.670898 0 0 0.670898 0 1.5V12H1.5V1.5H12V0H1.5ZM4.5 3C3.6709 3 3 3.6709 3 4.5V13.5C3 14.3291 3.6709 15 4.5 15H13.5C14.3291 15 15 14.3291 15 13.5V4.5C15 3.6709 14.3291 3 13.5 3H4.5ZM4.5 4.5H13.5V13.5H4.5V4.5Z" fill="black" />
              </svg>
            </div>
          </CopyToClipboard>
        </div>


        <div className="flex flex-column fiat-option">
          <img src={buyCryptoWithFiatImg} alt='buy_crypto_with_fiat' />
          <StyledPaymentMethod>
            <StyledPayment
              onClick={() => setOpenDropdown(!openDropdown)}
            // onMouseDown={(e) => {
            //   e.preventDefault();
            //   e.stopPropagation();
            //   setOpenDropdown(!openDropdown);
            // }}
            >
              Buy crypto with Fiat
              {openDropdown ? (
                <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 0L0 7.5L1.85328 9.35328L7.5 3.70656L13.1467 9.35328L15 7.5L7.5 0Z" fill="black" />
                </svg>
              ) : (
                <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 9.35327L15 1.85327L13.1467 -1.04904e-05L7.5 5.64671L1.85328 -1.04904e-05L0 1.85327L7.5 9.35327Z" fill="black" />
                </svg>
              )}
            </StyledPayment>
            {openDropdown && (
              <StyledPaymentSelect ref={wrapperRef}>
                <StyledPaymentItem
                  className={`${paymentMethod === 'coinbase_pay' ? 'active' : ''}`}
                  disabled={!isReady}
                  onClick={() => {
                    setPaymentMethod('coinbase_pay');
                    setOpenDropdown(false);
                    handleCoinbasePayClick();
                  }}
                >
                  <StyledName>
                    <img src={coinbaseImg} alt='token' />
                    {' '}Coinbase Pay
                  </StyledName>
                </StyledPaymentItem>
              </StyledPaymentSelect>
            )}
          </StyledPaymentMethod>
        </div>

        <div className="disconnect-button" onClick={() => { onDisconnect(); onCancel(); }}>
          Disconnect
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
