import React, { useEffect, useState, useRef } from 'react';
import { initOnRamp } from '@coinbase/cbpay-js';
// import { initOnRamp } from '@coinbase/cbpay-js';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal, message } from 'antd';
import { compose } from 'recompose';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connectAccount } from 'core';
import coinbaseImg from 'assets/img/coinbase_pay.svg';
import buyCryptoWithFiatImg from 'assets/img/buy_crypto_banner.svg';
import closeImg from 'assets/img/close.png';
import IconLinkBlue from 'assets/img/link_blue.svg';

const ModalContent = styled.div`
  border-radius: 6px;
  padding: 27px 32px 23px 32px;
  color: white;
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

  .content {
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .title {
    font-size: 20px;
  }

  .link-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .link {
    display: flex;
    align-items: center;
    gap: 5px;

    img {
      width: 14px;
      height: 14px;
    }
  }

  .button-group {
    display: flex;
    gap: 20px;
    justify-content: start;
  }

  .button {
    width: 100px;
    font-weight: 500;
    font-size: 18px;
    padding: 6px 0px;
    border-radius: 6px;
    border: 1px solid var(--color-text-secondary);
    text-align: center;
    cursor: pointer;
  }

  .button.continue {
    background: linear-gradient(
      242deg,
      #246cf9 0%,
      #1e68f6 0.01%,
      #0047d0 100%,
      #0047d0 100%
    );
    border: 0px;
  }
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

function DisclaimerModal({ visible, onCancel, onContinue, settings }) {
  const onrampInstance = useRef();
  const [isReady, setIsReady] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);

  const wrapperRef = useRef(null);
  useOutside(wrapperRef, setOpenDropdown);

  return (
    <Modal
      id="info-modal"
      className="info-modal"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      maskClosable
      centered
    >
      <ModalContent className="flex flex-column align-center just-center">
        {/* <img
          className="close-btn pointer"
          src={closeImg}
          alt="close"
          onClick={onCancel}
        /> */}

        <div className="content">
          <span className="title">
            We like to be upfront about lending risk
          </span>
          <span>
            While our markets are isolated from each other, you are still
            exposed to all the underlying assets of the markets you deposit
            into.
          </span>
          <span>
            We rely on 3rd-party oracles that may be manipulated or report
            erroneous prices, resulting in the loss of funds. The protocol has
            no way to track oracle risk or prevent it.
          </span>
          <span>
            Lack of on-chain liquidity, or liquidators malfunctioning, may
            prevent liquidation of insolvent positions, resulting in bad debt.
          </span>
          <span>
            You can manage your risk by using markets where you trust all
            underlying assets and oracles.
          </span>
          <div className="link-group">
            <div className="link">
              <a
                href="https://t.me/StrikeFinance"
                target="_blank"
                rel="noreferrer"
              >
                Speak to the team for help at Telegram
              </a>
              <img src={IconLinkBlue} alt="link" />
            </div>
            <div className="link">
              <a
                className="link"
                href="https://docs.strike.org"
                target="_blank"
                rel="noreferrer"
              >
                Understand risk and make better decisions
              </a>
              <img src={IconLinkBlue} alt="link" />
            </div>
          </div>
          <div className="button-group">
            <div
              className="button"
              onClick={() => {
                onCancel();
              }}
            >
              Cancel
            </div>

            <div
              className="button continue"
              onClick={() => {
                localStorage.setItem('disclaimerConfirmed', true);
                onCancel();
                onContinue();
              }}
            >
              Continue
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

DisclaimerModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onContinue: PropTypes.func,
  settings: PropTypes.object
};

DisclaimerModal.defaultProps = {
  visible: false,
  settings: {},
  onCancel: () => {},
  onContinue: () => {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, null))(DisclaimerModal);
