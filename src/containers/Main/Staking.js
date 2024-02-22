import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import styled from 'styled-components';
import { Tooltip, message } from 'antd';
import { toast } from 'react-toastify';
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
import IconQuestion from 'assets/img/question-blue.svg';
import { useInstance, useMulticall } from 'hooks/useContract';

const VaultContainer = styled.div`
  img {
    width: 100%;
  }

  .header-container {
    padding: 30px 20px 10px 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;

    .title {
      font-size: 20px;
      font-weight: 900;
      color: var(--color-text-main);
    }

    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--color-bg-primary);
      border-radius: 6px;
      padding: 12px 24px;
      margin-left: 10px;

      .item {
        text-align: center;
        .label {
          font-size: 16px;
          color: #9d9fa7;
        }

        .value {
          font-size: 16px;
          color: var(--color-blue);
        }
      }
    }

    @media (max-width: 1280px) {
      display: block;

      .info {
        margin-left: 0px;
      }

      .title {
        margin-bottom: 10px;
      }
    }

    @media (max-width: 768px) {
      display: block;

      .info {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
      }
    }
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
  .flex {
    display: flex;
  }
  .gap {
    gap: 20px;
  }

  .container {
    padding: 24px;
    background: var(--color-bg-primary);
    border-radius: 6px;
    margin-bottom: 20px;
  }

  .scroll-div {
    max-height: 125px;
    overflow: auto;
    overflow-x: hidden;
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
      font-size: 16px;
      color: var(--color-text-main);
    }

    .text {
      font-weight: 600;
      font-size: 18px;
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
    border: 1px solid var(--color-bg-main);
    border-radius: 6px;
    padding: 24px;
  }
  .mb {
    margin-bottom: 20px;
  }

  .header {
    border-bottom: 1px solid var(--color-text-secondary);
    padding-bottom: 10px;
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
    border-radius: 6px;
    border: 1px solid #a5accf;
  }

  .button {
    width: 100%;
    background-color: var(--color-blue);
    color: white;
    text-align: center;
    padding: 12px;
    border: none;
    border-radius: 6px;
  }

  .button-disable {
    width: 100%;
    background-color: var(--color-text-secondary);
    color: #a5accf;
    text-align: center;
    padding: 12px;
    border: none;
    border-radius: 6px;

    &:hover {
      background: var(--color-text-secondary) !important;
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
    background: var(--color-bg-main);
    border-radius: 6px;
  }

  .max-button {
    white-space: nowrap;
    padding: 5px 20px;
    color: var(--color-text-main);
    background: linear-gradient(
      242deg,
      #246cf9 0%,
      #1e68f6 0.01%,
      #0047d0 100%,
      #0047d0 100%
    );
    border-radius: 6px;
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
    font-size: 14px;
    line-height: 140%;
    letter-spacing: -0.02em;
  }

  .apr {
    color: var(--color-blue);
    font-weight: bold;
    font-size: 14px;
    line-height: 140%;
    letter-spacing: -0.02em;
    margin-right: 20px;
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
    border-bottom: 1px solid var(--color-text-secondary);
  }

  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }

  .lock-text {
    font-weight: 500;
    font-size: 13px;
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
  width: 14px !important;
  height: 14px !important;
  margin-left: 10px;
`;

const format = commaNumber.bindWith(',', '.');

const Staking = ({ settings, intl }) => {
  const instance = useInstance(settings.walletConnected);
  const [strkPrice, setStrkPrice] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');
  const [lockAmount, setLockAmount] = useState('');
  const [lockPending, setLockPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    totalLocked,
    totalStaked,
    stakeApr,
    lockApr,
    unlockedBalance,
    withdrawableBalance,
    locks,
    unlockable,
    fees,
    // totalEarned,
    vests,
    strkEmission,
    reserves,
    isExcludedFromPenalty
  } = useStakingData(instance, settings.selectedAddress, strkPrice);
  const { strkBalance, strkStakingAllowance } = useBalance(
    instance,
    settings.selectedAddress,
    false
  );
  const { handleStake, pending: stakePending } = useStakeCallback(
    instance,
    settings.selectedAddress
  );
  const { handleApprove, pending: approvePending } = useStrkApproveCallback(
    instance,
    settings.selectedAddress
  );
  const { handleWithdraw, pending: withdrawPending } = useWithdrawCallback(
    instance,
    settings.selectedAddress
  );
  const { handleGetReward, pending: getRewardPending } = useGetRewardCallback(
    instance,
    settings.selectedAddress
  );
  const {
    handleWithdrawExpiredLocks,
    pending: withdrawExpiredLocksPending
  } = useWithdrawExpiredLocksCallback(instance, settings.selectedAddress);

  // const reserves = Number(settings.reserves);

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
        message.success(
          intl.formatMessage({
            id: 'Approved_successfully'
          })
        );
      }
      // else {
      //   message.error('Something went wrong while approving.');
      // }
    } else {
      if (
        strkBalance.lt(
          new BigNumber(lock ? lockAmount : stakeAmount).times(1e18)
        )
      ) {
        message.error(
          intl.formatMessage({
            id: 'Insufficient_balance'
          })
        );
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
        message.success(
          lock
            ? intl.formatMessage({
                id: 'Locked_successfully'
              })
            : intl.formatMessage({
                id: 'Staked_successfully'
              })
        );
      }
      // else {
      //   message.error(
      //     `Something went wrong while ${lock ? 'locking' : 'staking'}.`
      //   );
      // }
    }
    if (lock) {
      setLockPending(false);
    }
  };

  const withdraw = useCallback(async () => {
    if (isPending()) {
      return;
    }

    if (!settings.selectedAddress) {
      return;
    }

    let claimAmount = unlockedBalance;
    if (isExcludedFromPenalty) {
      claimAmount = vests.reduce(
        (total, e) => total.plus(e.amount),
        new BigNumber(0)
      );
    }

    if (claimAmount.eq(0)) {
      toast.info(
        intl.formatMessage({
          id: 'You_have_not_claimable_STRK'
        })
      );
      return;
    }

    const tx = await handleWithdraw(claimAmount.toString(10));
    if (tx) {
      message.success(
        intl.formatMessage({
          id: 'Claim_successfully'
        })
      );
    }
    // else {
    //   message.error('Something went wrong while claim.');
    // }
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
      message.success(
        intl.formatMessage({
          id: 'Claim_reward_successfully'
        })
      );
    }
    // else {
    //   message.error('Something went wrong while claiming reward.');
    // }
  };

  const withdrawExpiredLocks = useCallback(async () => {
    if (isPending()) {
      return;
    }
    if (unlockable.eq(0)) {
      toast.info(
        intl.formatMessage({
          id: 'You_have_not_STRK_to_withdraw'
        })
      );
      return;
    }

    const tx = await handleWithdrawExpiredLocks();
    if (tx) {
      message.success(
        intl.formatMessage({
          id: 'Withdraw_locks_successfully'
        })
      );
    }
    // else {
    //   message.error('Something went wrong while withdrawal.');
    // }
  }, [handleWithdrawExpiredLocks, unlockable]);

  const overview = [
    // {
    //   name: 'Total STRK Staked',
    //   img: TotalStakedImg,
    //   value: totalStaked
    //     .div(1e18)
    //     .toNumber()
    //     .toLocaleString('en-US', { maximumFractionDigits: 0 })
    // },
    {
      name: <FormattedMessage id="Total_STRK_Locked" />,
      img: TotalLockedImg,
      value: totalLocked
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 0 })
    },
    {
      name: <FormattedMessage id="Reserve_Vault" />,
      img: AccumulatedFeesImg,
      value: `${reserves.toNumber().toLocaleString('en-US', {
        maximumFractionDigits: 3
      })} USDC`
    },
    {
      name: <FormattedMessage id="Penalty_STRK_Emission" />,
      img: TotalStakedImg,
      value: `${strkEmission
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 3 })}`
    }
  ];

  const input = [
    // {
    //   name: 'Stake STRK',
    //   text: [`Stake STRK and earn platform fees with no lockup period.`],
    //   apr: `${stakeApr.toLocaleString('en-US', { maximumFractionDigits: 0 })}%`
    // },
    {
      name: <FormattedMessage id="Lock_STRK" />,
      text: [
        <FormattedMessage id="Lock_STRK_desc_1" />,
        <FormattedMessage id="Lock_STRK_desc_2" />,
        <FormattedMessage id="Lock_STRK_desc_3" />
      ],
      apr: `${lockApr.toLocaleString('en-US', { maximumFractionDigits: 0 })}%`
    }
  ];

  const claim = [
    {
      name: <FormattedMessage id="Claimable_STRK" />,
      description: <FormattedMessage id="Vested_STRK" />,
      value: `${
        isExcludedFromPenalty
          ? vests
              .reduce((total, e) => total + e.amount.div(1e18).toNumber(), 0)
              .toLocaleString('en-US', {
                maximumFractionDigits: 3
              })
          : unlockedBalance
              .div(1e18)
              .toNumber()
              .toLocaleString('en-US', { maximumFractionDigits: 3 })
      } STRK`,
      claim: <FormattedMessage id="Claim" />,
      handler: withdraw
    },
    {
      name: <FormattedMessage id="STRK_in_Vesting" />,
      description: <FormattedMessage id="STRK_in_Vesting_desc" />,
      value: `${
        isExcludedFromPenalty
          ? '0'
          : vests
              .reduce((total, e) => total + e.amount.div(1e18).toNumber(), 0)
              .toLocaleString('en-US', {
                maximumFractionDigits: 3
              })
      } STRK`,
      claim: ''
    },
    {
      name: <FormattedMessage id="Claim_all_STRK_above" />,
      description: <FormattedMessage id="Early_Exit_Penalty" />,
      value: `${withdrawableBalance
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 3 })} STRK`,
      claim: <FormattedMessage id="Claim_with_penalty" />,
      handler: () => setIsModalOpen(true)
    },
    {
      name: <FormattedMessage id="Expired_Locked_STRK" />,
      description: '',
      value: `${unlockable
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 3 })} STRK`,
      claim: <FormattedMessage id="Withdraw" />,
      handler: withdrawExpiredLocks
    }
  ];

  return (
    <MainLayout>
      <VaultContainer>
        <div className="header-container mt-2 mx-auto">
          <div className="title">
            <FormattedMessage id="Revenue_Share_Staking" />
          </div>
          <div className="info">
            <div className="item">
              <div className="label">
                <FormattedMessage id="Total_Locked" />
              </div>
              <div className="value">
                ${' '}
                {totalLocked
                  .div(1e18)
                  .times(strkPrice)
                  .toNumber()
                  .toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="item">
              <div className="label">
                <FormattedMessage id="Lock_APR" />
              </div>
              <div className="value">
                {lockApr.toLocaleString('en-US', {
                  maximumFractionDigits: 0
                })}
                %
              </div>
            </div>
            <div className="item">
              <div className="label">
                <FormattedMessage id="Total_Vested" />
              </div>
              <div className="value">
                ${' '}
                {totalStaked
                  .div(1e18)
                  .times(strkPrice)
                  .toNumber()
                  .toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="item">
              <div className="label">
                <FormattedMessage id="Vesting_APR" />
              </div>
              <div className="value">
                {stakeApr.toLocaleString('en-US', {
                  maximumFractionDigits: 0
                })}
                %
              </div>
            </div>
          </div>
        </div>
        <div className="main-container mt-1 mx-auto gap">
          <div className="col">
            <div className="container">
              {overview.map((e, index) => (
                <div key={`overview-${index}`}>
                  <div className="info_row">
                    <div>
                      <img className="subimage" src={e.img} alt={e.name} />
                      <p className="subtitle">{e.name}</p>
                      {index === 2 && (
                        <Tooltip
                          placement="right"
                          title={
                            <div className="mb-2">
                              <FormattedMessage id="Penalty_STRK_Emission_help" />
                            </div>
                          }
                        >
                          <SQuestion src={IconQuestion} />
                        </Tooltip>
                      )}
                    </div>
                    <div>
                      <p className="text">
                        {e.value} {index === 0 && 'STRK'}{' '}
                      </p>
                    </div>
                  </div>
                  {index !== overview.length - 1 && <div className="divider" />}
                </div>
              ))}
            </div>

            {input.map((e, index) => (
              <div key={`input-${index}`} className="container">
                <div className="flex space-between mb-2 header">
                  <div className="flex">
                    <p className="title mr-1">{e.name}</p>
                    {/* <Tooltip
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
                    </Tooltip> */}
                  </div>
                  <div className="APR">
                    <FormattedMessage id="APR" /> {e.apr}
                  </div>
                </div>
                <div className="mb-3">
                  {e.text.map((it, i) => (
                    <div key={`e-text-${i}`}>
                      <span className="lock-text">{it}</span>
                      <br />
                    </div>
                  ))}
                </div>
                <div className="input-bg mb-2">
                  <div className="flex align-center space-between balance_row mb-1">
                    <p className="amount">
                      <FormattedMessage id="Amount" />
                    </p>
                    <p className="balance">
                      <FormattedMessage id="Balance" />{' '}
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
                    <input
                      style={{ width: '100%' }}
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
                        ) {
                          const regex = /([0-9]*[.|,]{0,1}[0-9]{0,18})/s;
                          const value = event.target.value.match(regex)[0];

                          if (
                            value.length > 1 &&
                            value[0] === '0' &&
                            value[1] !== '.'
                          ) {
                            setLockAmount('0');
                            return;
                          }

                          setLockAmount(value);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="max-button"
                      onClick={() => {
                        // if (index === 0)
                        //   setStakeAmount(strkBalance.div(1e18).toString());
                        // else
                        setLockAmount(
                          strkBalance
                            .div(1e18)
                            .dp(18, 0)
                            .toString()
                        );
                      }}
                    >
                      <FormattedMessage id="MAX" />
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
                    <span>
                      <FormattedMessage id="Pending..." />
                    </span>
                  ) : (
                    <>
                      {isApprove() ? <FormattedMessage id="Approve" /> : e.name}
                    </>
                  )}
                </button>
              </div>
            ))}

            <div className="container">
              <div className="flex space-between mb header">
                <p className="title">
                  <FormattedMessage id="Claimable_Fees" />
                </p>
                <p className="value">
                  <span className="span-total">
                    <FormattedMessage id="Total" />
                  </span>{' '}
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
                  <div
                    key={`fee-${index}`}
                    className="flex align-center space-between"
                  >
                    <div className="flex align-center">
                      <img
                        src={['coins/strk.png', 'coins/usdc.png'][index]}
                        alt=""
                        className="mr-1 max-20"
                      />
                      <p>{['STRK', 'USDC'][index]}</p>
                    </div>
                    <p>
                      {e
                        .div(index === 1 ? 1e6 : 1e18)
                        .toNumber()
                        .toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
              <p className="link text-right" onClick={getReward}>
                <FormattedMessage id="Claim_All" />{' '}
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
                <div key={`claim-${index}`}>
                  <div className="claim_row">
                    <p
                      className="subtitle"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      {e.name}
                      {index === 1 && (
                        <Tooltip
                          placement="right"
                          title={
                            <div className="mb-2">
                              <FormattedMessage id="Early_Widthraw_help" />
                            </div>
                          }
                        >
                          <SQuestion src={IconQuestion} />
                        </Tooltip>
                      )}
                    </p>{' '}
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
              <div className="flex space-between mb header">
                <p className="title">
                  STRK <FormattedMessage id="Vests" />
                </p>
                <div className="flex align-center">
                  <p className="apr">
                    APR{' '}
                    {stakeApr.toLocaleString('en-US', {
                      maximumFractionDigits: 0
                    })}
                    %
                  </p>
                  <p className="value">
                    <span className="span-total">
                      <FormattedMessage id="Total" />
                    </span>{' '}
                    {isExcludedFromPenalty
                      ? '0'
                      : vests
                          .reduce(
                            (total, e) => total + e.amount.div(1e18).toNumber(),
                            0
                          )
                          .toLocaleString('en-US', {
                            maximumFractionDigits: 3
                          })}{' '}
                    <span className="span-strk">STRK</span>
                  </p>
                </div>
              </div>
              <div className="border flex flex-column center input-bg scroll-div">
                {(isExcludedFromPenalty ? [] : vests).map((e, index) => (
                  <div
                    key={`vest-${index}`}
                    className={`flex align-center space-between ${index <
                      vests.length - 1 && 'mb-2'}`}
                  >
                    <div className="flex align-center">
                      <img src="icon.png" alt="" className="mr-1 max-20" />
                      <p className="mr-1 align-center">
                        {e.amount
                          .div(1e18)
                          .toNumber()
                          .toLocaleString('en-US', {
                            maximumFractionDigits: 3
                          })}
                      </p>{' '}
                      <p>STRK</p>
                    </div>
                    {/* <p className="mobile-show">
                      {moment.unix(e.unlockTime).format('DD/MM HH:mm')}
                    </p> */}
                    <p className="desktop-show">
                      Expired at{' '}
                      {moment.unix(e.unlockTime).format('DD/MM/YYYY HH:mm:ss')}
                    </p>
                  </div>
                ))}
                {(isExcludedFromPenalty || !vests.length) && (
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
                          fill="#5D6588"
                        />
                      </svg>

                      <p>
                        <FormattedMessage id="No_vesting_found" />
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="container">
              <div className="flex space-between mb header">
                <p className="title">
                  STRK <FormattedMessage id="Locks" />
                </p>
                <div className="flex align-center">
                  <p className="apr">
                    APR{' '}
                    {lockApr.toLocaleString('en-US', {
                      maximumFractionDigits: 0
                    })}
                    %
                  </p>
                  <p className="value">
                    <span className="span-total">
                      <FormattedMessage id="Total" />
                    </span>{' '}
                    {locks
                      .reduce(
                        (total, e) => total + e.amount.div(1e18).toNumber(),
                        unlockable.div(1e18).toNumber()
                      )
                      .toLocaleString('en-US', {
                        maximumFractionDigits: 3
                      })}{' '}
                    <span className="span-strk">STRK</span>
                  </p>
                </div>
              </div>
              <div className="border flex flex-column center input-bg scroll-div">
                {locks.map((e, index) => (
                  <div
                    key={`lock-${index}`}
                    className={`flex align-center space-between ${index <
                      locks.length - 1 && 'mb-2'}`}
                  >
                    <div className="flex align-center">
                      <img src="icon.png" alt="" className="mr-1 max-20" />
                      <p className="mr-1 align-center">
                        {e.amount
                          .div(1e18)
                          .toNumber()
                          .toLocaleString('en-US', {
                            maximumFractionDigits: 3
                          })}
                      </p>{' '}
                      <p>STRK</p>
                    </div>
                    {/* <p className="mobile-show">
                      {moment.unix(e.unlockTime).format('DD/MM HH:mm')}
                    </p> */}
                    <p className="desktop-show">
                      <FormattedMessage id="Expired_at" />{' '}
                      {moment.unix(e.unlockTime).format('DD/MM/YYYY HH:mm:ss')}
                    </p>
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
                          fill="#5D6588"
                        />
                      </svg>

                      <p>
                        <FormattedMessage id="No_locking_found" />
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </VaultContainer>
      {isModalOpen && (
        <PenaltyModal
          visible={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </MainLayout>
  );
};

Staking.propTypes = {
  settings: PropTypes.object,
  intl: intlShape.isRequired
};

Staking.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default injectIntl(
  compose(withRouter, connectAccount(mapStateToProps, null))(Staking)
);
