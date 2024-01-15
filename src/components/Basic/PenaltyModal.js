import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal, Icon, message } from 'antd';
import BigNumber from 'bignumber.js';
import { connectAccount } from 'core';
import {
  useStakingData,
  useWithdrawCallback,
  useExitCallback
} from 'hooks/useStaking';
import closeImg from 'assets/img/close.png';
import { useInstance, useMulticall } from 'hooks/useContract';

const ModalContent = styled.div`
  border-radius: 6px;
  padding: 25px;

  .close-btn {
    position: absolute;
    top: 23px;
    right: 23px;
  }

  .title {
    position: absolute;
    font-size: 22px;
    font-weight: 600;
    color: var(--color-text-main);
    top: 23px;
    left: 23px;
  }

  .loading-section {
    margin: 50px 0;
  }

  .modal-body {
    margin-top: 80px;
    color: var(--color-text-secondary);
    display: flex;
    flex-direction: column;
    font-size: 18px;
    width: 100%;
  }

  .flex {
    display: flex;
  }

  input {
    // font-size: 26px;
    color: var(--color-text-main);
    background: transparent;
    border: none;

    &:focus {
      outline: none;
    }

    ::placeholder {
      color: var(--color-text-secondary);
    }
  }

  .input-bg {
    padding: 16px;
    background: var(--color-bg-main);
    border-radius: 6px;
  }

  .max-button {
    padding: 10px 20px;
    background: var(--color-blue);
    color: var(--color-text-main);
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
  }

  .mb-1 {
    margin-bottom: 8px;
  }
  .mb-2 {
    margin-bottom: 16px;
  }
  .mb-3 {
    margin-bottom: 24px;
  }
  .mr-1 {
    margin-right: 8px;
  }

  .mt-1 {
    margin-top: 10px;
  }

  .mt-3 {
    margin-top: 34px;
  }

  .span- {
    margin-left: 8px;
  }

  .value {
    color: var(--color-text-main);
    font-weight: 600;
    font-size: 12px;
    line-height: 140%;
    letter-spacing: -0.02em;
  }

  .span-total {
    font-weight: 600;
    font-size: 12px;
    line-height: 140%;
    letter-spacing: -0.02em;
  }

  .span-strk {
    color: var(--color-blue);
  }

  .align-center {
    align-items: center;
  }

  .space-between {
    justify-content: space-between;
  }

  .balance_row {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-main);
  }

  .info {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 500;

    .span-strk {
      color: var(--color-blue);
      font-size: 12px;
    }

    .value {
      color: var(--color-text-main);
      font-size: 14px;
    }
  }

  .confirm-btn {
    margin-top: 20px;
    width: 100%;
    background-color: var(--color-blue);
    color: white;
    text-align: center;
    padding: 12px;
    border: none;
    border-radius: 6px;

    &:disabled {
      // cursor: not-allowed;
    }
  }
`;

// const antIcon = <Icon type="loading" style={{ fontSize: 64 }} spin />;

function PenaltyModal({ visible, onCancel, settings }) {
  const instance = useInstance(settings.walletConnected);
  const [strkPrice, setStrkPrice] = useState(0);

  useEffect(() => {
    const market = settings.markets.find(
      ele => ele.underlyingSymbol === 'STRK'
    );
    if (market) {
      setStrkPrice(Number(market.tokenPrice));
    }
  }, [settings.markets]);

  const {
    unlockedBalance,
    totalEarned,
    withdrawableBalance,
    calcPenaltyAmount
  } = useStakingData(instance, settings.selectedAddress, strkPrice);

  const { handleWithdraw, pending } = useWithdrawCallback(
    instance,
    settings.selectedAddress
  );
  const { handleExit, pending: pendingExit } = useExitCallback(
    instance,
    settings.selectedAddress
  );

  const [claimAmount, setClaimAmount] = React.useState('');
  const [isMax, setIsMax] = React.useState(false);

  const withdraw = async () => {
    if (pending || pendingExit) {
      return;
    }

    const tx = !isMax
      ? await handleWithdraw(
          new BigNumber(claimAmount).times(1e18).toString(10)
        )
      : await handleExit();
    if (tx) {
      message.success('Claimed successfully.');
    } else {
      message.error('Something went wrong while claiming reward.');
    }
  };

  return (
    <Modal
      className="collateral-confirm-modal"
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
        <p className="title">Claim with penalty</p>
        <div className="modal-body">
          <div className="input-bg mb-2">
            <div className="flex align-center space-between balance_row">
              <p className="amount">Amount</p>
              <p className="balance">
                Max Claimable {withdrawableBalance.div(1e18).toFixed(3)}{' '}
                <span className="span-strk">STRK</span>
              </p>
            </div>
            <div className="flex align-center space-between">
              <div className="flex align-center">
                <input
                  placeholder="0.00"
                  value={claimAmount}
                  onChange={event => {
                    if (
                      !event.target.value.length ||
                      Number(event.target.value) >= 0
                    ) {
                      setClaimAmount(event.target.value);
                      setIsMax(false);
                    }
                  }}
                />
              </div>
              <button
                type="button"
                className="max-button"
                onClick={() => {
                  setClaimAmount(withdrawableBalance.div(1e18).toString(10));
                  setIsMax(true);
                }}
              >
                MAX
              </button>
            </div>
          </div>
          {/* <div className="input">
            <div>
              <img src="icon.png" alt="" />
              <input
                placeholder="0.00"
                value={claimAmount}
                onChange={event => {
                  (!event.target.value.length ||
                    Number(event.target.value) >= 0) &&
                    setClaimAmount(event.target.value);
                }}
              />
            </div>
            <button
              onClick={() => {
                setClaimAmount(withdrawableBalance.div(1e18).toString(10));
              }}
            >
              MAX
            </button>
          </div> */}
          <div className="info">
            <p>Released STRK (Vested)</p>
            <div className="flex">
              <span className="value">
                {unlockedBalance.div(1e18).toFixed(3)}
              </span>
              <span className="span-strk">&nbsp;STRK</span>
            </div>
          </div>
          <div className="info">
            <p>Vesting STRK</p>
            <div className="flex">
              <span className="value">{totalEarned.div(1e18).toFixed(3)}</span>
              <span className="span-strk">&nbsp;STRK</span>
            </div>
          </div>
          <div className="info">
            <p>Early Claimed Penalty</p>
            <div className="flex">
              <span className="value">
                {calcPenaltyAmount(
                  new BigNumber(claimAmount === '' ? 0 : claimAmount).times(
                    1e18
                  )
                )
                  .div(1e18)
                  .toFixed(3)}
              </span>
              <span className="span-strk">&nbsp;STRK</span>
            </div>
          </div>
          <div className="info">
            <p>You Will Receive</p>
            <div className="flex">
              <span className="value">
                {new BigNumber(claimAmount || '0')
                  .times(1e18)
                  .minus(
                    calcPenaltyAmount(
                      new BigNumber(claimAmount === '' ? 0 : claimAmount).times(
                        1e18
                      )
                    )
                  )
                  .div(1e18)
                  .toString(10)}
              </span>
              <span className="span-strk">&nbsp;STRK</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="confirm-btn"
          onClick={withdraw}
          disabled={
            pending ||
            pendingExit ||
            new BigNumber(Number(claimAmount)).eq(0) ||
            withdrawableBalance.lt(new BigNumber(claimAmount).times(1e18))
          }
        >
          Confirm
        </button>
      </ModalContent>
    </Modal>
  );
}

PenaltyModal.propTypes = {
  visible: PropTypes.bool,
  settings: PropTypes.object,
  onCancel: PropTypes.func
};

PenaltyModal.defaultProps = {
  visible: false,
  settings: {},
  onCancel: () => {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(
  withRouter,
  connectAccount(mapStateToProps, null)
)(PenaltyModal);
