import { useEffect, useState, useMemo, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import * as constants from 'utilities/constants';
import moment from 'moment';
import { multicall } from 'utilities/ContractService';

import useRefresh from './useRefresh';
import { useStakingContract, useStrkContract } from './useContract';

export const useStakingData = (account, strkPrice, forceUpdate) => {
  const [totalLocked, setTotalLocked] = useState(new BigNumber(0));
  const [totalStaked, setTotalStaked] = useState(new BigNumber(0));
  const [stakeApr, setStakeApr] = useState(0);
  const [lockApr, setLockApr] = useState(0);
  const [withdrawableBalance, setWithdrawableBalance] = useState(
    new BigNumber(0)
  );
  const [penaltyAmount, setPenaltyAmount] = useState(new BigNumber(0));
  const [unlockedBalance, setUnlockedBalance] = useState(new BigNumber(0));
  const [totalEarned, setTotalEarned] = useState(new BigNumber(0));
  const [vests, setVests] = useState([]);
  const [locks, setLocks] = useState([]);
  const [unlockable, setUnlockable] = useState(new BigNumber(0));
  const [fees, setFees] = useState([]);
  const [strkEmission, setStrkEmission] = useState(new BigNumber(0));
  const [reserves, setReserves] = useState(new BigNumber(0));

  const { fastRefresh } = useRefresh();

  const calls = useMemo(() => {
    let temp = [
      {
        reference: 'lockedSupply',
        contractAddress: constants.STAKING_ADDRESS,
        abi: JSON.parse(constants.STAKING_ABI),
        calls: [
          {
            methodName: 'lockedSupply',
            methodParameters: []
          }
        ]
      },
      {
        reference: 'totalSupply',
        contractAddress: constants.STAKING_ADDRESS,
        abi: JSON.parse(constants.STAKING_ABI),
        calls: [
          {
            methodName: 'totalSupply',
            methodParameters: []
          }
        ]
      },
      {
        reference: 'rewardDataSTRK',
        contractAddress: constants.STAKING_ADDRESS,
        abi: JSON.parse(constants.STAKING_ABI),
        calls: [
          {
            methodName: 'rewardData',
            methodParameters: [constants.CONTRACT_TOKEN_ADDRESS.strk.address]
          }
        ]
      },
      {
        reference: 'rewardDataUSDC',
        contractAddress: constants.STAKING_ADDRESS,
        abi: JSON.parse(constants.STAKING_ABI),
        calls: [
          {
            methodName: 'rewardData',
            methodParameters: [constants.CONTRACT_TOKEN_ADDRESS.usdc.address]
          }
        ]
      },
      {
        reference: 'reservedUSDC',
        contractAddress: constants.CONTRACT_TOKEN_ADDRESS.usdc.address,
        abi: JSON.parse(constants.CONTRACT_USDC_TOKEN_ABI),
        calls: [
          {
            methodName: 'balanceOf',
            methodParameters: [constants.STAKING_ADDRESS]
          }
        ]
      }
    ];
    if (account) {
      temp = temp.concat([
        {
          reference: 'withdrawableBalance',
          contractAddress: constants.STAKING_ADDRESS,
          abi: JSON.parse(constants.STAKING_ABI),
          calls: [
            {
              methodName: 'withdrawableBalance',
              methodParameters: [account]
            }
          ]
        },
        {
          reference: 'unlockedBalance',
          contractAddress: constants.STAKING_ADDRESS,
          abi: JSON.parse(constants.STAKING_ABI),
          calls: [
            {
              methodName: 'unlockedBalance',
              methodParameters: [account]
            }
          ]
        },
        {
          reference: 'earnedBalances',
          contractAddress: constants.STAKING_ADDRESS,
          abi: JSON.parse(constants.STAKING_ABI),
          calls: [
            {
              methodName: 'earnedBalances',
              methodParameters: [account]
            }
          ]
        },
        {
          reference: 'lockedBalances',
          contractAddress: constants.STAKING_ADDRESS,
          abi: JSON.parse(constants.STAKING_ABI),
          calls: [
            {
              methodName: 'lockedBalances',
              methodParameters: [account]
            }
          ]
        },
        {
          reference: 'claimableRewards',
          contractAddress: constants.STAKING_ADDRESS,
          abi: JSON.parse(constants.STAKING_ABI),
          calls: [
            {
              methodName: 'claimableRewards',
              methodParameters: [account]
            }
          ]
        }
      ]);
    }

    return temp;
  }, [account]);

  const contract = useStakingContract();

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        let data;
        let _unlockedBalance;

        if (!account) {
          data = await multicall.call(calls);
        } else {
          [data, _unlockedBalance] = await Promise.all([
            multicall.call(calls),
            contract.methods.unlockedBalance(account).call({
              from: account
            })
          ]);
        }
        // console.log('data = ', data);

        const totalLockedAmount = new BigNumber(
          data.results.lockedSupply.callsReturnContext[0].returnValues[0].hex
        );
        const totalSupplyAmount = new BigNumber(
          data.results.totalSupply.callsReturnContext[0].returnValues[0].hex
        );

        let _lockApr = 0;
        const lockRewardPeriodFinish = Number(
          data.results.rewardDataSTRK.callsReturnContext[0].returnValues[0].hex
        );
        const lockRewardRate = new BigNumber(
          data.results.rewardDataSTRK.callsReturnContext[0].returnValues[1].hex
        );
        if (lockRewardPeriodFinish < moment().unix()) {
          _lockApr = 0;
        } else if (totalLockedAmount.gt(0)) {
          _lockApr = lockRewardRate
            .times(3600 * 24 * 365)
            .div(totalLockedAmount)
            .times(100)
            .toNumber();
        }

        let _stakingApr = 0;
        if (strkPrice > 0) {
          // USDC reward
          const stakingRewardPeriodFinish = Number(
            data.results.rewardDataUSDC.callsReturnContext[0].returnValues[0]
              .hex
          );
          const stakingRewardRate = new BigNumber(
            data.results.rewardDataUSDC.callsReturnContext[0].returnValues[1].hex
          );

          if (stakingRewardPeriodFinish < moment().unix()) {
            _stakingApr = 0;
          } else {
            _stakingApr = stakingRewardRate
              .times(3600 * 24 * 365)
              .div(1e6) // USDC decimal
              .times(1) // USDC price
              .times(1e18)
              .times(100)
              .div(totalSupplyAmount)
              .div(strkPrice)
              .toNumber();
          }
        }

        _lockApr += _stakingApr;

        setTotalLocked(totalLockedAmount);
        setTotalStaked(totalSupplyAmount.minus(totalLockedAmount));
        setLockApr(_lockApr);
        setStakeApr(_stakingApr);
        setStrkEmission(
          new BigNumber(
            data.results.rewardDataSTRK.callsReturnContext[0].returnValues[1].hex
          )
        );

        setReserves(
          new BigNumber(
            data.results.reservedUSDC.callsReturnContext[0].returnValues[0].hex
          ).div(1e6)
        );

        const startIndex = 4;
        if (account) {
          setWithdrawableBalance(
            new BigNumber(
              data.results.withdrawableBalance.callsReturnContext[0].returnValues[0].hex
            )
          );
          setPenaltyAmount(
            new BigNumber(
              data.results.withdrawableBalance.callsReturnContext[0].returnValues[1].hex
            )
          );
          setUnlockedBalance(
            new BigNumber(
              data.results.unlockedBalance.callsReturnContext[0].returnValues[0].hex
            )
          );

          setTotalEarned(
            new BigNumber(
              data.results.earnedBalances.callsReturnContext[0].returnValues[0].hex
            )
          );
          const _earningsData = [];
          data.results.earnedBalances.callsReturnContext[0].returnValues[1].forEach(
            e => {
              _earningsData.push({
                amount: new BigNumber(e[0].hex),
                unlockTime: Number(e[1].hex)
              });
            }
          );
          setVests(_earningsData);

          const _locks = [];
          data.results.lockedBalances.callsReturnContext[0].returnValues[3].forEach(
            e => {
              _locks.push({
                amount: new BigNumber(e[0].hex),
                unlockTime: Number(e[1].hex)
              });
            }
          );
          setLocks(_locks);
          setUnlockable(
            new BigNumber(
              data.results.lockedBalances.callsReturnContext[0].returnValues[1].hex
            )
          );

          if (
            data.results.claimableRewards.callsReturnContext[0].returnValues
              .length > 1
          )
            setFees([
              new BigNumber(
                data.results.claimableRewards.callsReturnContext[0].returnValues[0][1].hex
              ),
              new BigNumber(
                data.results.claimableRewards.callsReturnContext[0].returnValues[1][1].hex
              )
            ]);
          else
            setFees([
              new BigNumber(
                data.results.claimableRewards.callsReturnContext[0].returnValues[0][1].hex
              ),
              new BigNumber(0)
            ]);

          setUnlockedBalance(new BigNumber(_unlockedBalance));
        } else {
          setWithdrawableBalance(new BigNumber(0));
          setPenaltyAmount(new BigNumber(0));
          setUnlockedBalance(new BigNumber(0));
          setTotalEarned(new BigNumber(0));
          setVests([]);
          setLocks([]);
        }
      } catch (e) {
        console.error('Fetching staking data had error', e);
      }
    };

    fetchGlobalData();
  }, [fastRefresh, forceUpdate, multicall, account, contract]);

  return {
    totalLocked,
    totalStaked,
    stakeApr,
    lockApr,
    withdrawableBalance,
    penaltyAmount,
    unlockedBalance,
    totalEarned,
    vests,
    locks,
    unlockable,
    fees,
    strkEmission,
    reserves
  };
};

export const useStakeCallback = account => {
  const [pending, setPending] = useState(false);
  const contract = useStakingContract();

  const handleStake = useCallback(
    async (amount, lock) => {
      try {
        setPending(true);
        const tx = await contract.methods.stake(amount, lock).send({
          from: account
        });
        setPending(false);
        return tx;
      } catch (e) {
        console.error('Stake had error :>> ', e);
        setPending(false);
        return false;
      }
    },
    [account, contract]
  );

  return { handleStake, pending };
};

export const useWithdrawCallback = account => {
  const [pending, setPending] = useState(false);
  const contract = useStakingContract();

  const handleWithdraw = useCallback(
    async amount => {
      try {
        setPending(true);
        const tx = await contract.methods.withdraw(amount).send({
          from: account
        });
        setPending(false);
        return tx;
      } catch (e) {
        console.error('Withdraw had error :>> ', e);
        setPending(false);
        return false;
      }
    },
    [account, contract]
  );

  return { handleWithdraw, pending };
};

export const useWithdrawExpiredLocksCallback = account => {
  const [pending, setPending] = useState(false);
  const contract = useStakingContract();

  const handleWithdrawExpiredLocks = useCallback(async () => {
    try {
      setPending(true);
      const tx = await contract.methods.withdrawExpiredLocks().send({
        from: account
      });
      setPending(false);
      return tx;
    } catch (e) {
      console.error('WithdrawExpiredLocks had error :>> ', e);
      setPending(false);
      return false;
    }
  }, [account, contract]);

  return { handleWithdrawExpiredLocks, pending };
};

export const useGetRewardCallback = account => {
  const [pending, setPending] = useState(false);
  const contract = useStakingContract();

  const handleGetReward = useCallback(async () => {
    try {
      setPending(true);
      const tx = await contract.methods.getReward().send({
        from: account
      });
      setPending(false);
      return tx;
    } catch (e) {
      console.error('GetReward had error :>> ', e);
      setPending(false);
      return false;
    }
  }, [account, contract]);

  return { handleGetReward, pending };
};

export const useStrkApproveCallback = account => {
  const [pending, setPending] = useState(false);

  const contract = useStrkContract();

  const handleApprove = useCallback(async () => {
    try {
      setPending(true);
      const tx = await contract.methods
        .approve(
          constants.STAKING_ADDRESS,
          '115792089237316195423570985008687907853269984665640564039457584007913129639935'
        )
        .send({
          from: account
        });
      setPending(false);
      return tx;
    } catch (e) {
      console.error('Approve had error :>> ', e);
      setPending(false);
      return false;
    }
  }, [account, contract]);

  return { handleApprove, pending };
};
