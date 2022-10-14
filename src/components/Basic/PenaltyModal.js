import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal, Icon, message } from 'antd';
import BigNumber from 'bignumber.js';
// import { useStakingData, useWithdrawCallback } from 'hooks/useStaking';
import closeImg from 'assets/img/close.png';

const ModalContent = styled.div`
  border-radius: 20px;
  background-color: var(--color-bg-primary);
  padding: 25px;

  .close-btn {
    position: absolute;
    top: 23px;
    right: 23px;
  }

  .title {
    position: absolute;
    font-size: 24.5px;
    color: var(--color-text-main);
    top: 23px;
    left: 23px;
  }

  .loading-section {
    margin: 50px 0;
  }

  .modal-body {
    margin-top: 80px;
    color: white;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    border-radius: 15px;
    border: 1px solid #303030;
    width: 100%;
    padding: 25px;
  }

  .maxValue {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 16px;
    background: #242a3e;
    border-radius: 8px;

    & div:first-child {
      display: flex;
      align-items: center;
    }
    & img {
      margin-right: 10px;
    }
    & input {
      background: transparent;
      border: none;
      &:focus {
        outline: none;
      }
      @media (max-width: 768px) {
        width: 100px;
      }
    }

    & button {
      padding: 10px 20px;
      color: #dcdfea;

      background: #30374f;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
    }
  }

  .info {
    margin-top: 25px;
    display: flex;
    justify-content: space-between;
  }

  .confirm-btn {
    margin-top: 20px;
    width: 100%;
    height: 50px;
    background-color: #7839ee;
    color: #fbfaff;
    text-align: center;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    &:disabled {
      background-color: #404968 !important;
      color: #7d89b0;
      cursor: not-allowed;
    }
  }
`;

const antIcon = <Icon type="loading" style={{ fontSize: 64 }} spin />;

function PenaltyModal({ visible, onCancel }) {
  // const {
  //   unlockedBalance,
  //   totalEarned,
  //   withdrawableBalance
  // } = useStakingData();

  const unlockedBalance = new BigNumber(0);
  const totalEarned = new BigNumber(0);
  const withdrawableBalance = new BigNumber(0);

  // const { handleWithdraw, pending } = useWithdrawCallback();
  const handleWithdraw = () => {};
  const pending = false;

  const [claimAmount, setClaimAmount] = React.useState('');

  const withdraw = async () => {
    if (pending) {
      return;
    }

    const tx = await handleWithdraw(
      new BigNumber(claimAmount).times(1e18).toString(10)
    );
    if (tx) {
      message.success('Claimed successfully.');
    } else {
      message.error('Something went wrong while claiming reward.');
    }
  };

  return (
    <Modal
      className="collateral-confirm-modal"
      width={800}
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
          <div className="maxValue">
            <p>Amount</p>
            <p className="desktop-show">
              Max Claimable: {withdrawableBalance.div(1e18).toFixed(3)} LOAN
            </p>
            <p className="mobile-show">
              {withdrawableBalance.div(1e18).toFixed(3)} LOAN
            </p>
          </div>
          <div className="input">
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
          </div>
          <div className="info">
            <p className="desktop-show">Released LOAN (Vested, Staked)</p>
            <p className="mobile-show">Released LOAN</p>
            <p>{unlockedBalance.div(1e18).toFixed(3)} LOAN</p>
          </div>
          <div className="info">
            <p>Vesting LOAN</p>
            <p>{totalEarned.div(1e18).toFixed(3)} LOAN</p>
          </div>
          <div className="info">
            <p>Early Claimed Penalty</p>
            <p>
              {Number(claimAmount) > unlockedBalance.div(1e18).toNumber()
                ? `-${(
                    Number(claimAmount) - unlockedBalance.div(1e18).toNumber()
                  ).toFixed(3)}`
                : 0}{' '}
              LOAN
            </p>
          </div>
          <div className="info">
            <p>You Will Receive</p>
            <p>{claimAmount} LOAN</p>
          </div>
        </div>
        <button
          className="confirm-btn"
          onClick={withdraw}
          disabled={
            pending ||
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
  onCancel: PropTypes.func
};

PenaltyModal.defaultProps = {
  visible: false,
  onCancel: () => {}
};

export default PenaltyModal;
