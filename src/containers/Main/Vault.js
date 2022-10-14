import React, { useState, useMemo, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { message } from 'antd';
import commaNumber from 'comma-number';
import MainLayout from 'containers/Layout/MainLayout';
import { Row, Column } from 'components/Basic/Style';
// import { useBalance } from '../../hooks/useBalance';
// import {
//   useStakingData,
//   useStakeCallback,
//   useWithdrawCallback,
//   useGetRewardCallback,
//   useWithdrawExpiredLocksCallback,
//   useStrkApproveCallback
// } from '../../hooks/useStaking';
// import { useMarkets } from 'hooks/useMarkets';
import PenaltyModal from 'components/Basic/PenaltyModal';

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

  .col {
    flex: 1;
  }

  .space-between {
    justify-content: space-between;
  }

  .link {
    color: #0074FF;
    text-decoration: underline;
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
    font-size: 20px;
    line-height: 140%;

    letter-spacing: -0.02em;

    color: var(--color-text-main);
  }

  .subtitle {
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
  }

  .text {
    font-weight: 600;
    font-size: 24px;
    line-height: 135%;
    letter-spacing: -0.02em;
  }

  .APR {
    font-weight: 600;
    font-size: 20px;
    line-height: 140%;
    letter-spacing: -0.02em;
  }
  .APR-number {
    font-weight: 600;
    font-size: 20px;
    line-height: 140%;
    letter-spacing: -0.02em;
  }
  .balance {
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;
    text-align: right;
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
    background-color: #404968;
    color: white;
    text-align: center;
    padding: 12px;
    border: none;
    border-radius: 5px;
  }
  .w-100 {
    width: 100%;
  }

  input {
    background: transparent;
    border: none;
    &:focus {
      outline: none;
    }
  }

  .input-bg {
    padding: 16px;

    background: #242a3e;
    border-radius: 5px;
  }

  .input-button {
    padding: 10px 20px;
    color: var(--color-blue);

    background: #30374f;
    border-radius: 5px;
    border: none;
    cursor: pointer;
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
    font-weight: 600;
    font-size: 20px;
    line-height: 140%;
    letter-spacing: -0.02em;
  }

  .span-total {
    font-weight: 600;
    font-size: 20px;
    line-height: 140%;
    letter-spacing: -0.02em;
  }

  .align-center {
    align-items: center;
  }

  .divider {
    border: 1px solid #30374f;
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
`;

const format = commaNumber.bindWith(',', '.');

const Vault = () => {
  //   const {
  //     totalLocked,
  //     totalStaked,
  //     stakeApr,
  //     lockApr,
  //     unlockedBalance,
  //     penaltyAmount,
  //     locks,
  //     unlockable,
  //     fees,
  //     totalEarned,
  //     vests
  //   } = useStakingData();
  //   const { strkBalance, strkStakingAllowance } = useBalance();
  //   const { handleStake, pending: stakePending } = useStakeCallback();
  //   const { handleApprove, pending: approvePending } = useStrkApproveCallback();
  //   const { handleWithdraw, pending: withdrawPending } = useWithdrawCallback();
  //   const { handleGetReward, pending: getRewardPending } = useGetRewardCallback();
  //   const {
  //     handleWithdrawExpiredLocks,
  //     pending: withdrawExpiredLocksPending
  //   } = useWithdrawExpiredLocksCallback();
  //   const { reserves, strkPrice } = useMarkets();

  const totalLocked = new BigNumber(0);
  const totalStaked = new BigNumber(0);
  const stakeApr = new BigNumber(0);
  const lockApr = new BigNumber(0);
  const unlockedBalance = new BigNumber(0);
  const penaltyAmount = new BigNumber(0);
  const locks = [];
  const unlockable = new BigNumber(0);
  const fees = [];
  const totalEarned = new BigNumber(0);
  const vests = [];
  const strkBalance = new BigNumber(0);
  const strkStakingAllowance = new BigNumber(0);
  const reserves = new BigNumber(0);
  const strkPrice = new BigNumber(0);
  
  const handleStake = () => {};
  const handleApprove = () => {};
  const handleWithdraw = () => {};
  const handleGetReward = () => {};
  const handleWithdrawExpiredLocks = () => {};
  
  const stakePending = false;
  const approvePending = false;
  const withdrawPending = false;
  const getRewardPending = false;
  const withdrawExpiredLocksPending = false;


  const { account } = useWeb3React();

  const [stakeAmount, setStakeAmount] = useState('');
  const [lockAmount, setLockAmount] = useState('');
  const [lockPending, setLockPending] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const stake = async (lock = false) => {
    if (isPending()) {
      return;
    }

    if (!account) {
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

    if (!account) {
      return;
    }

    const tx = await handleWithdraw(unlockedBalance.toString(10));
    if (tx) {
      message.success('Claim successfully.');
    } else {
      message.error('Something went wrong while claim.');
    }
  }, [handleWithdraw, unlockedBalance, account]);

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
      value: totalStaked
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 0 })
    },
    {
      name: 'Total STRK Locked',
      value: totalLocked
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 0 })
    },
    {
      name: 'Protocol Reserves',
      value: `$${reserves.toLocaleString('en-US', {
        maximumFractionDigits: 3
      })}`
    },
    {
      name: 'Wallet STRK Balance',
      value: strkBalance
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 0 })
    }
  ];

  const input = [
    {
      name: 'Stake STRK',
      apr: `${stakeApr.toLocaleString('en-US', { maximumFractionDigits: 0 })}%`
    },
    {
      name: 'Lock STRK',
      text: [
        `Lock STRK and earn platform fees and penalty fees in unlocked STRK`,
        `The lock period is 4 weeks`,
        `Locked STRK will continue to earn fees after the locks expire if you do not withdraw.`
      ],
      apr: `${lockApr.toLocaleString('en-US', { maximumFractionDigits: 0 })}%`
    }
  ];

  const claim = [
    {
      name: 'Claimable STRK',
      value: `${unlockedBalance
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 3 })} STRK`,
      claim: 'Claim',
      handler: withdraw
    },
    {
      name: 'STRK in Vesting',
      value: `${penaltyAmount
        .times(2)
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 3 })} STRK`,
      claim: ''
    },
    {
      name: 'Claim all STRK above',
      value: `${penaltyAmount
        .div(1e18)
        .toNumber()
        .toLocaleString('en-US', { maximumFractionDigits: 3 })} STRK`,
      claim: 'Claim with penalty',
      handler: () => setIsModalOpen(true)
    },
    {
      name: 'Expired Locked STRK',
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
              <p className="title mb-3">Overview</p>
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'row wrap'
                }}
              >
                {overview.map(e => (
                  <div key={e.name} style={{ width: '50%' }}>
                    <div className="flex mb-1">
                      <p className="subtitle mr-1">{e.name}</p>
                    </div>
                    <p className="text mb-2">{e.value}</p>
                  </div>
                ))}
              </div>
            </div>
            {input.map((e, index) => (
              <div key={e.name} className="container">
                <div className="flex space-between mb-3">
                  <div className="flex">
                    <p className="title mr-1">{e.name}</p>
                  </div>
                  <div className="flex">
                    <p className="APR mr-1">APR: </p>
                    <p className="APR-number">{e.apr}</p>
                  </div>
                </div>
                <div>
                  <div className="flex align-center space-between input-bg mb-2">
                    <div className="flex align-center">
                      <img src="icon.png" alt="" className="mr-1 max-20" />
                      <input
                        placeholder="0.00"
                        value={index === 0 ? stakeAmount : lockAmount}
                        onChange={event => {
                          index === 0 &&
                            (!event.target.value.length ||
                              Number(event.target.value) >= 0) &&
                            setStakeAmount(event.target.value);
                          index === 1 &&
                            (!event.target.value.length ||
                              Number(event.target.value) >= 0) &&
                            setLockAmount(event.target.value);
                        }}
                      />
                    </div>
                    <button
                      className="input-button"
                      onClick={() => {
                        index === 0 &&
                          setStakeAmount(strkBalance.div(1e18).toString());
                        index === 1 &&
                          setLockAmount(strkBalance.div(1e18).toString());
                      }}
                    >
                      MAX
                    </button>
                  </div>
                </div>
                <div className="flex space-between mb-2">
                  <p className="subtitle">Wallet balance</p>
                  <p className="balance">
                    {format(
                      strkBalance
                        .div(1e18)
                        .dp(2, 1)
                        .toString(10)
                    )}{' '}
                    <span className="span-strk">STRK</span>
                  </p>
                </div>
                {e.text && (
                  <div className="mb-2">
                    {e.text.map((e, index) => (
                      <p key={index} className="lock-text">
                        {e}
                      </p>
                    ))}
                  </div>
                )}
                <button
                  className={
                    approvePending ||
                    stakePending ||
                    (account &&
                      strkBalance.lt(
                        new BigNumber(
                          index === 0 ? stakeAmount : lockAmount
                        ).times(1e18)
                      )) ||
                    new BigNumber(
                      Number(index === 0 ? stakeAmount : lockAmount)
                    ).eq(0)
                      ? 'button-disable'
                      : 'button'
                  }
                  onClick={() => {
                    stake(index === 1);
                  }}
                >
                  {(index === 0 &&
                    (stakePending || approvePending) &&
                    !lockPending) ||
                  (index === 1 &&
                    (stakePending || approvePending) &&
                    lockPending) ? (
                    <div className="loader" color="#656170" />
                  ) : (
                    <>{isApprove() ? 'Approve' : e.name}</>
                  )}
                </button>
              </div>
            ))}
          </div>
          <div className="col">
            <div className="container">
              {claim.map((e, index) => (
                <div className=" mb-3" key={e.name}>
                  <div className="flex space-between mb-1 ">
                    <div className="flex w-100">
                      <p className="subtitle mr-1">{e.name}</p>
                    </div>
                    <p className="value w-100 text-right">{e.value}</p>
                  </div>
                  <p className="link text-right mb-3" onClick={e.handler}>
                    {e.claim}
                  </p>
                  {index !== claim.length - 1 && <div className="divider" />}
                </div>
              ))}
            </div>
            <div className="container">
              <div className="flex space-between mb">
                <p className="title">STRK Vests</p>
                <p className="value">
                  <span className="span-total">Total:</span>{' '}
                  {vests
                    .reduce(
                      (total, e) => total + e.amount.div(1e18).toNumber(),
                      0
                    )
                    .toLocaleString('en-US', { maximumFractionDigits: 3 })}{' '}
                  STRK
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
                    <p1 className="mobile-show">
                      {moment.unix(e.unlockTime).format('DD/MM HH:mm')}
                    </p1>
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
                  <span className="span-total">Total:</span>{' '}
                  {locks
                    .reduce(
                      (total, e) => total + e.amount.div(1e18).toNumber(),
                      0
                    )
                    .toLocaleString('en-US', { maximumFractionDigits: 3 })}{' '}
                  STRK
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
                    <p1 className="mobile-show">
                      {moment.unix(e.unlockTime).format('DD/MM HH:mm')}
                    </p1>
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
                      <p>No locking found</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="container">
              <div className="flex space-between mb">
                <p className="title">Claimable Fees</p>
                <p className="value">
                  <span className="span-total">Total:</span>{' '}
                  {fees.length >= 2
                    ? fees[0]
                        .div(1e18)
                        .times(strkPrice)
                        .plus(fees[1].div(1e6).times(1))
                        .toNumber()
                        .toLocaleString('en-US', { maximumFractionDigits: 3 })
                    : 0}{' '}
                  $
                </p>
              </div>
              {fees.map((e, index) => (
                <div
                  key={e}
                  className="flex align-center space-between input-bg mb-2"
                >
                  <div className="flex align-center">
                    <img
                      src={['icon.png', 'coins/usdc.svg'][index]}
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
              <p className="link text-right" onClick={getReward}>
                Claim All
              </p>
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

export default Vault;
