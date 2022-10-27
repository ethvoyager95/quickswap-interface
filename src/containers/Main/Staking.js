import React, { useState, useCallback, useEffect } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import styled from 'styled-components';
import { Tooltip, message } from 'antd';
import commaNumber from 'comma-number';
import MainLayout from 'containers/Layout/MainLayout';
import { connectAccount } from 'core';
import { useBalance } from 'hooks/useBalance';
import {
  useStakingData,
  useStakeCallback,
  useWithdrawCallback,
  useGetRewardCallback,
  useWithdrawExpiredLocksCallback,
  useStrkApproveCallback
} from 'hooks/useStaking';
// import { useMarkets } from 'hooks/useMarkets';
import PenaltyModal from 'components/Basic/PenaltyModal';

import TotalStakedImg from 'assets/img/total_staked.svg';
import TotalLockedImg from 'assets/img/total_locked.svg';
import AccumulatedFeesImg from 'assets/img/accumulated_fees.svg';
import IconQuestion from 'assets/img/question.png';

const VaultContainer = styled.div`
  img {
    width: 100%;
  }

  .main-container {
    padding: 0px 20px;
    @media (min-width: 768px) {
      display: flex;
      max-width: 100%;
    }

    display: block;
  }

  .max-20 {
    max-width: 20px;
    max-height: 20px;
  }
  .max-25 {
    max-width: 20px;
    max-height: 20px;
  }

  color: var(--color-text-secondary);
  width: 99%;
  .flex {
    display: flex;
  }
  .gap {
    gap: 20px;
  }
  .container {
    padding: 24px;
    background: white;
    border-radius: 5px;
    margin-bottom: 20px;
  }

  .info_row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    div {
      display: flex;
      align-items: center;
    }

    .subimage {
      width: 45px;
      height: 45px;
    }

    .subtitle {
      padding-left: 20px;
      font-size: 18px;
    }

    .text {
      font-weight: 600;
      font-size: 20px;
      line-height: 100%;
      color: var(--color-text-main);
    }

    @media only screen and (max-width: 768px) {
      .subimage {
        width: 28px;
        height: 28px;
      }

      .subtitle {
        padding-left: 10px;
        font-size: 13px;
      }

      .text {
        font-weight: 600;
        font-size: 13px;
        line-height: 100%;
        color: var(--color-text-main);
      }
    }
  }

  .claim_row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .subtitle {
      color: var(--color-text-main);
      font-size: 16px;
    }

    .value {
      color: var(--color-text-main);
      font-size: 16px;
    }

    .description {
      font-size: 12px;
    }

    .link {
      font-size: 12px;
      color: var(--color-blue);
      text-decoration: none;
      cursor: pointer;
    }
  }

  .col {
    flex: 1;
  }

  .space-between {
    justify-content: space-between;
  }

  .link {
    color: #0074ff;
    text-decoration: none;
    cursor: pointer;
  }

  .text-right {
    text-align: right;
  }

  .border {
    border: 1px solid #30374f;
    border-radius: 5px;
    padding: 24px;
  }
  .mb {
    margin-bottom: 20px;
  }

  .title {
    font-weight: 600;
    font-size: 18px;
    line-height: 140%;
    white-space: nowrap;

    letter-spacing: -0.02em;

    color: var(--color-text-main);
  }

  .subtitle {
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
  }

  .APR {
    padding: 5px 10px;
    font-size: 14px;
    color: var(--color-blue);
    line-height: 100%;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .button {
    width: 100%;
    background-color: var(--color-blue);
    color: white;
    text-align: center;
    padding: 12px;
    border: none;
    border-radius: 5px;
  }

  .button-disable {
    width: 100%;
    background-color: #f0f0f0;
    color: rgba(0, 0, 0, 0.5);
    text-align: center;
    padding: 12px;
    border: none;
    border-radius: 5px;

    &:hover {
      background: #f0f0f0 !important;
    }
  }
  .w-100 {
    width: 100%;
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

    background: #f0f0f0;
    border-radius: 5px;
  }

  .max-button {
    padding: 10px 20px;
    color: var(--color-blue);

    background: #e4e4e4;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;

    &:hover {
      color: white;
    }
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

  .divider {
    margin: 20px -20px;
    border-bottom: 1px solid #eef1fa;
  }

  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }

  .lock-text {
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
  }

  .balance_row {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-main);
  }

  .fee_list {
    color: var(--color-text-main);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

const SQuestion = styled.img`
  width: 23px;
  height: 23px;
  margin-right: 10px;
  @media only screen and (max-width: 768px) {
    width: 15px;
    height: 15px;
    margin-right: 0;
  }
`;

const format = commaNumber.bindWith(',', '.');

const Staking = ({ settings }) => {
  const [strkPrice, setStrkPrice] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');
  const [lockAmount, setLockAmount] = useState('');
  const [lockPending, setLockPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    totalLocked,
    totalStaked,
    // stakeApr,
    lockApr,
    unlockedBalance,
    penaltyAmount,
    locks,
    unlockable,
    fees,
    // totalEarned,
    vests
  } = useStakingData(settings.selectedAddress, strkPrice);
  const { strkBalance, strkStakingAllowance } = useBalance(
    settings.selectedAddress,
    false
  );
  const { handleStake, pending: stakePending } = useStakeCallback(
    settings.selectedAddress
  );
  const { handleApprove, pending: approvePending } = useStrkApproveCallback(
    settings.selectedAddress
  );
  const { handleWithdraw, pending: withdrawPending } = useWithdrawCallback(
    settings.selectedAddress
  );
  const { handleGetReward, pending: getRewardPending } = useGetRewardCallback(
    settings.selectedAddress
  );
  const {
    handleWithdrawExpiredLocks,
    pending: withdrawExpiredLocksPending
  } = useWithdrawExpiredLocksCallback(settings.selectedAddress);

  const reserves = Number(settings.reserves);

  // const totalLocked = new BigNumber(0);
  // const totalStaked = new BigNumber(0);
  // const lockApr = new BigNumber(0);
  // const unlockedBalance = new BigNumber(0);
  // const penaltyAmount = new BigNumber(0);
  // const locks = [];
  // const unlockable = new BigNumber(0);
  // const fees = [new BigNumber(100.55e18), new BigNumber(200.23e6)];
  // const vests = [];
  // const reserves = 0;
  // const strkPrice = 0;

  // const handleStake = () => {};
  // const handleApprove = () => {};
  // const handleWithdraw = () => {};
  // const handleGetReward = () => {};
  // const handleWithdrawExpiredLocks = () => {};

  // const stakePending = false;
  // const approvePending = false;
  // const withdrawPending = false;
  // const getRewardPending = false;
  // const withdrawExpiredLocksPending = false;

  useEffect(() => {
    const market = settings.markets.find(
      ele => ele.underlyingSymbol === 'STRK'
    );
    if (market) {
      setStrkPrice(Number(market.tokenPrice));
    }
  }, [settings.markets]);

  const isPending = () => {
    if (
      approvePending ||
      stakePending ||
      withdrawPending ||
      withdrawExpiredLocksPending ||
      getRewardPending
    ) {
      return true;
    }

    return false;
  };

  const isApprove = () => {
    if (
      strkStakingAllowance.eq(0) ||
      strkStakingAllowance.lt(new BigNumber(stakeAmount).times(1e18))
    ) {
      return true;
    }

    return false;
  };

  const stake = async lock => {
    if (isPending()) {
      return;
    }

    if (!settings.selectedAddress) {
      return;
    }

    if (lock) {
      setLockPending(true);
    }
    if (isApprove()) {
      const tx = await handleApprove();
      if (tx) {
        message.success('Approved successfully.');
      } else {
        message.error('Something went wrong while approving.');
      }
    } else {
      if (
        strkBalance.lt(
          new BigNumber(lock ? lockAmount : stakeAmount).times(1e18)
        )
      ) {
        message.error('Insufficient balance.');
        return;
      }

      const tx = await handleStake(
        new BigNumber(lock ? lockAmount : stakeAmount)
          .times(1e18)
          .integerValue()
          .toString(10),
        lock
      );
      if (tx) {
        message.success(lock ? 'Locked successfully.' : 'Staked successfully.');
      } else {
        message.error(
          `Something went wrong while ${lock ? 'locking' : 'staking'}.`
        );
      }
    }
    if (lock) {
      setLockPending(false);
    }
  };

  const withdraw = useCallback(async () => {
    if (isPending()) {
      return;
    }
    if (unlockedBalance.eq(0)) {
      return;
    }

    if (!settings.selectedAddress) {
      return;
    }

    const tx = await handleWithdraw(unlockedBalance.toString(10));
    if (tx) {
      message.success('Claim successfully.');
    } else {
      message.error('Something went wrong while claim.');
    }
  }, [handleWithdraw, unlockedBalance, settings.selectedAddress]);

  const getReward = async () => {
    if (isPending()) {
      return;
    }
    if (fees.length < 1) {
      return;
    }

    const tx = await handleGetReward();
    if (tx) {
      message.success('Claim reward successfully.');
    } else {
      message.error('Something went wrong while claiming reward.');
    }
  };

  const withdrawExpiredLocks = useCallback(async () => {
    if (isPending()) {
      return;
    }
    if (unlockable.eq(0)) {
      return;
    }

    const tx = await handleWithdrawExpiredLocks();
    if (tx) {
      message.success('Withdraw locks successfully.');
    } else {
      message.error('Something went wrong while withdrawal.');
    }
  }, [handleWithdrawExpiredLocks, unlockable]);

  const overview = [
    {
      name: 'Total STRK Staked',
      img: TotalStakedImg,
      value: totalStaked
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 0 })
    },
    {
      name: 'Total STRK Locked',
      img: TotalLockedImg,
      value: totalLocked
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 0 })
    },
    {
      name: 'Protocol Reserve',
      img: AccumulatedFeesImg,
      value: `${reserves.toLocaleString('en-US', {
        maximumFractionDigits: 3
      })} USD`
    }
  ];

  const input = [
    // {
    //   name: 'Stake STRK',
    //   text: [`Stake STRK and earn platform fees with no lockup period.`],
    //   apr: `${stakeApr.toLocaleString('en-US', { maximumFractionDigits: 0 })}%`
    // },
    {
      name: 'Lock STRK',
      text: [
        `Lock STRK and earn platform fees and penalty fees in unlocked STRK.`,
        `The lock period is 24 weeks`,
        `Locked STRK will continue to earn fees after the locks expire if you do not withdraw.`
      ],
      apr: `${lockApr.toLocaleString('en-US', { maximumFractionDigits: 0 })}%`
    }
  ];

  const claim = [
    {
      name: 'Claimable STRK',
      description: 'Include staked STRK and vested STRK',
      value: `${unlockedBalance
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 3 })} STRK`,
      claim: 'Claim',
      handler: withdraw
    },
    {
      name: 'STRK in Vesting',
      description: 'STRK amount that can be claimed with a 50% penalty',
      value: `${penaltyAmount
        .times(2)
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 3 })} STRK`,
      claim: ''
    },
    {
      name: 'Claim all STRK above',
      description: 'Early Exit Penalty',
      value: `${penaltyAmount
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 3 })} STRK`,
      claim: 'Claim with penalty',
      handler: () => setIsModalOpen(true)
    },
    {
      name: 'Expired Locked STRK',
      description: '',
      value: `${unlockable
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 3 })} STRK`,
      claim: 'Withdraw',
      handler: withdrawExpiredLocks
    }
  ];

  return (
    <MainLayout title="Vault">
      <VaultContainer>
        <div className="main-container mt-1 mx-auto gap">
          <div className="col">
            <div className="container">
              {overview.map((e, index) => (
                <div>
                  <div className="info_row" key={e.name}>
                    <div>
                      <img className="subimage" src={e.img} alt={e.name} />
                      <p className="subtitle">{e.name}</p>
                    </div>
                    <div>
                      <p className="text">
                        {e.value} {index !== 2 && 'STRK'}
                      </p>
                    </div>
                  </div>
                  {index !== overview.length - 1 && <div className="divider" />}
                </div>
              ))}
            </div>

            {input.map((e, index) => (
              <div key={e.name} className="container">
                <div className="flex space-between mb-3">
                  <div className="flex">
                    <p className="title mr-1">{e.name}</p>
                    <Tooltip
                      placement="right"
                      title={
                        <div className="mb-2">
                          {e.text.map((it, i) => (
                            <>
                              <p key={i} className="lock-text">
                                {it}
                              </p>
                              <br />
                            </>
                          ))}
                        </div>
                      }
                    >
                      <SQuestion src={IconQuestion} />
                    </Tooltip>
                  </div>
                  <div className="APR">APR {e.apr}</div>
                </div>
                <div className="input-bg mb-2">
                  <div className="flex align-center space-between balance_row">
                    <p className="amount">Amount</p>
                    <p className="balance">
                      Balance{' '}
                      {format(
                        strkBalance
                          .div(1e18)
                          .dp(2, 1)
                          .toString(10)
                      )}{' '}
                      <span className="span-strk">STRK</span>
                    </p>
                  </div>
                  <div className="flex align-center space-between">
                    <div className="flex align-center">
                      <input
                        placeholder="0.00"
                        value={lockAmount}
                        onChange={event => {
                          // if (
                          //   index === 0 &&
                          //   (!event.target.value.length ||
                          //     Number(event.target.value) >= 0)
                          // )
                          //   setStakeAmount(event.target.value);
                          if (
                            index === 0 &&
                            (!event.target.value.length ||
                              Number(event.target.value) >= 0)
                          )
                            setLockAmount(event.target.value);
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="max-button"
                      onClick={() => {
                        // if (index === 0)
                        //   setStakeAmount(strkBalance.div(1e18).toString());
                        // else
                        setLockAmount(strkBalance.div(1e18).toString());
                      }}
                    >
                      MAX
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className={
                    approvePending ||
                    stakePending ||
                    (settings.selectedAddress &&
                      strkBalance.lt(new BigNumber(lockAmount).times(1e18))) ||
                    new BigNumber(Number(lockAmount)).eq(0)
                      ? 'button-disable'
                      : 'button'
                  }
                  onClick={() => {
                    stake(true);
                  }}
                >
                  {index === 0 && approvePending && lockPending ? (
                    <span>Pending...</span>
                  ) : (
                    <>{isApprove() ? 'Approve' : e.name}</>
                  )}
                </button>
              </div>
            ))}

            <div className="container">
              <div className="flex space-between mb">
                <p className="title">Claimable Fees</p>
                <p className="value">
                  <span className="span-total">Total</span>{' '}
                  {fees.length >= 2
                    ? fees[0]
                        .div(1e18)
                        .times(strkPrice)
                        .plus(fees[1].div(1e6).times(1))
                        .toNumber()
                        .toLocaleString('en-US', { maximumFractionDigits: 3 })
                    : 0}{' '}
                  USD
                </p>
              </div>
              <div className="fee_list input-bg mb-2">
                {fees.map((e, index) => (
                  <div key={index} className="flex align-center space-between">
                    <div className="flex align-center">
                      <img
                        src={['coins/strk.png', 'coins/usdc.png'][index]}
                        alt=""
                        className="mr-1 max-20"
                      />
                      <p1>{['STRK', 'USDC'][index]}</p1>
                    </div>
                    <p1>
                      {e
                        .div(index === 1 ? 1e6 : 1e18)
                        .toNumber()
                        .toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </p1>
                  </div>
                ))}
              </div>
              <p className="link text-right" onClick={getReward}>
                Claim All{' '}
                <svg
                  width="6"
                  height="9"
                  viewBox="0 0 6 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.9992 3.15029C5.99428 3.02059 5.93827 2.89776 5.84394 2.80736L3.34808 0.342936L2.99728 0L2.64648 0.342936L0.15062 2.80736C-0.0468874 3.00192 -0.050818 3.3193 0.142759 3.51779C0.336336 3.7153 0.654706 3.71923 0.852213 3.52467L2.49811 1.89548L2.49811 8.15774C2.49516 8.33756 2.58949 8.50461 2.74573 8.59501C2.90098 8.68639 3.09358 8.68639 3.24883 8.59501C3.40409 8.50461 3.4994 8.33756 3.49645 8.15774L3.49645 1.89548L5.14137 3.52467C5.28679 3.67501 5.50887 3.72021 5.70146 3.63669C5.89209 3.55218 6.01099 3.35959 5.9992 3.15029Z"
                    fill="#0074FF"
                  />
                </svg>
              </p>
            </div>
          </div>

          <div className="col">
            <div className="container">
              {claim.map((e, index) => (
                <div key={e.name}>
                  <div className="claim_row">
                    <p className="subtitle">{e.name}</p>
                    <p className="value">{e.value}</p>
                  </div>
                  <div className="claim_row">
                    <p className="description">{e.description}</p>
                    {e.claim && (
                      <p className="link" onClick={e.handler}>
                        {e.claim}{' '}
                        <svg
                          width="6"
                          height="9"
                          viewBox="0 0 6 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.9992 3.15029C5.99428 3.02059 5.93827 2.89776 5.84394 2.80736L3.34808 0.342936L2.99728 0L2.64648 0.342936L0.15062 2.80736C-0.0468874 3.00192 -0.050818 3.3193 0.142759 3.51779C0.336336 3.7153 0.654706 3.71923 0.852213 3.52467L2.49811 1.89548L2.49811 8.15774C2.49516 8.33756 2.58949 8.50461 2.74573 8.59501C2.90098 8.68639 3.09358 8.68639 3.24883 8.59501C3.40409 8.50461 3.4994 8.33756 3.49645 8.15774L3.49645 1.89548L5.14137 3.52467C5.28679 3.67501 5.50887 3.72021 5.70146 3.63669C5.89209 3.55218 6.01099 3.35959 5.9992 3.15029Z"
                            fill="#277ee6"
                          />
                        </svg>
                      </p>
                    )}
                  </div>
                  {index !== claim.length - 1 && <div className="divider" />}
                </div>
              ))}
            </div>

            <div className="container">
              <div className="flex space-between mb">
                <p className="title">STRK Vests</p>
                <p className="value">
                  <span className="span-total">Total</span>{' '}
                  {vests
                    .reduce(
                      (total, e) => total + e.amount.div(1e18).toNumber(),
                      0
                    )
                    .toLocaleString('en-US', { maximumFractionDigits: 3 })}{' '}
                  <span className="span-strk">STRK</span>
                </p>
              </div>
              <div className="border flex flex-column center">
                {vests.map((e, index) => (
                  <div
                    key={e}
                    className={`flex align-center space-between input-bg ${index <
                      vests.length - 1 && 'mb-2'}`}
                  >
                    <div className="flex align-center">
                      <img src="icon.png" alt="" className="mr-1 max-20" />
                      <p1 className="mr-1 align-center">
                        {e.amount
                          .div(1e18)
                          .toNumber()
                          .toLocaleString('en-US', {
                            maximumFractionDigits: 3
                          })}
                      </p1>{' '}
                      <p1>STRK</p1>
                    </div>
                    {/* <p1 className="mobile-show">
                      {moment.unix(e.unlockTime).format('DD/MM HH:mm')}
                    </p1> */}
                    <p1 className="desktop-show">
                      Expired at{' '}
                      {moment.unix(e.unlockTime).format('DD/MM/YYYY HH:mm:ss')}
                    </p1>
                  </div>
                ))}
                {!vests.length && (
                  <div>
                    <img
                      className="mb-3 mx-auto max-25"
                      src="icon2.png"
                      alt=""
                    />
                    <div>
                      <svg
                        width="16"
                        height="25"
                        viewBox="0 0 16 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.27102 25C4.18047 25 4.08993 24.9796 4.00391 24.9344C3.75944 24.8053 3.64173 24.5224 3.72322 24.2598L6.60934 14.8001H0.574514C0.352678 14.8001 0.153479 14.6733 0.056143 14.4741C-0.038929 14.2749 -0.0117657 14.0395 0.126315 13.8652L11.0777 0.215542C11.2498 0.000497638 11.5463 -0.0606205 11.7885 0.0638792C12.0353 0.190642 12.153 0.469069 12.0783 0.731649L9.38682 10.2004H15.1953C15.4171 10.2004 15.6186 10.3272 15.7137 10.5264C15.8087 10.7256 15.7816 10.9632 15.6457 11.1353L4.71922 24.785C4.6083 24.9253 4.44079 25 4.27102 25Z"
                          fill="black"
                        />
                      </svg>

                      <p>No vesting found</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="container">
              <div className="flex space-between mb">
                <p className="title">STRK Locks</p>
                <p className="value">
                  <span className="span-total">Total</span>{' '}
                  {locks
                    .reduce(
                      (total, e) => total + e.amount.div(1e18).toNumber(),
                      0
                    )
                    .toLocaleString('en-US', { maximumFractionDigits: 3 })}{' '}
                  <span className="span-strk">STRK</span>
                </p>
              </div>
              <div className="border flex flex-column center">
                {locks.map((e, index) => (
                  <div
                    key={e}
                    className={`flex align-center space-between input-bg ${index <
                      locks.length - 1 && 'mb-2'}`}
                  >
                    <div className="flex align-center">
                      <img src="icon.png" alt="" className="mr-1 max-20" />
                      <p1 className="mr-1 align-center">
                        {e.amount
                          .div(1e18)
                          .toNumber()
                          .toLocaleString('en-US', {
                            maximumFractionDigits: 3
                          })}
                      </p1>{' '}
                      <p1>STRK</p1>
                    </div>
                    {/* <p1 className="mobile-show">
                      {moment.unix(e.unlockTime).format('DD/MM HH:mm')}
                    </p1> */}
                    <p1 className="desktop-show">
                      Expired at{' '}
                      {moment.unix(e.unlockTime).format('DD/MM/YYYY HH:mm:ss')}
                    </p1>
                  </div>
                ))}
                {!locks.length && (
                  <div>
                    <img
                      className="mb-3 mx-auto max-25"
                      src="icon2.png"
                      alt=""
                    />
                    <div>
                      <svg
                        width="16"
                        height="25"
                        viewBox="0 0 16 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.27102 25C4.18047 25 4.08993 24.9796 4.00391 24.9344C3.75944 24.8053 3.64173 24.5224 3.72322 24.2598L6.60934 14.8001H0.574514C0.352678 14.8001 0.153479 14.6733 0.056143 14.4741C-0.038929 14.2749 -0.0117657 14.0395 0.126315 13.8652L11.0777 0.215542C11.2498 0.000497638 11.5463 -0.0606205 11.7885 0.0638792C12.0353 0.190642 12.153 0.469069 12.0783 0.731649L9.38682 10.2004H15.1953C15.4171 10.2004 15.6186 10.3272 15.7137 10.5264C15.8087 10.7256 15.7816 10.9632 15.6457 11.1353L4.71922 24.785C4.6083 24.9253 4.44079 25 4.27102 25Z"
                          fill="black"
                        />
                      </svg>

                      <p>No locking found</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </VaultContainer>
      <PenaltyModal
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      />
    </MainLayout>
  );
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(
  withRouter,
  connectAccount(mapStateToProps, null)
)(Staking);
