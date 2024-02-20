/* eslint-disable no-console */
import { useEffect, useState, useMemo, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import * as constants from 'utilities/constants';
import { getTokenContract, methods } from 'utilities/ContractService';
import useRefresh from './useRefresh';
import { useMulticall, useStakingContract } from './useContract';

const QUART = 25000; //  25%
const HALF = 65000; //  65%
const WHOLE = 100000; // 100%
const vestDuration = 86400 * 14 * 6; // 12 weeks

function _penaltyInfo(earning) {
  const currentTimestamp = parseInt(new Date().getTime() / 1000, 10);

  let penaltyFactor = 0;
  if (Number(earning.unlockTime) > currentTimestamp) {
    // 90% on day 1, decays to 25% on day 90
    penaltyFactor =
      ((earning.unlockTime - currentTimestamp) * HALF) / vestDuration + QUART; // 25% + timeLeft/vestDuration * 65%
  }
  const penaltyAmount = earning.amount.times(penaltyFactor).div(WHOLE);
  const amount = earning.amount.minus(penaltyAmount);

  return {
    amount,
    penaltyFactor,
    penaltyAmount
  };
}

export const useStakingData = (instance, account, strkPrice, forceUpdate) => {
  const multicall = useMulticall(instance);
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
  const [isExcludedFromPenalty, setIsExcludedFromPenalty] = useState(false);

  const { fastRefresh } = useRefresh();

  const getPenalty = (amount, _vests) => {
    let remaining = amount;
    let penalty = new BigNumber(0);

    for (let i = 0; i < _vests.length; i += 1) {
      const earnedAmount = _vests[i].amount;
      // eslint-disable-next-line no-continue
      if (earnedAmount.eq(0)) continue;
      const { penaltyFactor } = _penaltyInfo(_vests[i]);

      // Amount required from this lock, taking into account the penalty
      let requiredAmount = remaining.times(WHOLE).div(WHOLE - penaltyFactor);
      if (requiredAmount.gte(earnedAmount)) {
        requiredAmount = earnedAmount;
        remaining = remaining.minus(
          earnedAmount
            .times(new BigNumber(WHOLE).minus(penaltyFactor))
            .div(WHOLE)
        ); // remaining -= earned * (1 - pentaltyFactor)
        if (remaining.eq(0)) i += 1;
      } else {
        remaining = new BigNumber(0);
      }
      penalty = penalty.plus(requiredAmount.times(penaltyFactor).div(WHOLE)); // penalty += amount * penaltyFactor
      if (remaining.eq(0)) {
        break;
      }
    }

    return penalty;
  };

  const calcPenaltyAmount = useCallback(
    amount => {
      if (
        isExcludedFromPenalty ||
        !amount ||
        amount.gt(withdrawableBalance) ||
        !vests.length
      ) {
        return new BigNumber(0);
      }

      return getPenalty(amount, vests);
    },
    [withdrawableBalance, vests, isExcludedFromPenalty]
  );

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
        },
        {
          reference: 'isExcludedFromPenalty',
          contractAddress: constants.STAKING_ADDRESS,
          abi: JSON.parse(constants.STAKING_ABI),
          calls: [
            {
              methodName: 'isExcludedFromPenalty',
              methodParameters: [account]
            }
          ]
        }
      ]);
    }

    return temp;
  }, [account]);

  const contract = useStakingContract(instance);

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

        if (account) {
          setWithdrawableBalance(
            new BigNumber(
              data.results.withdrawableBalance.callsReturnContext[0].returnValues[0].hex
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

          setPenaltyAmount(
            getPenalty(
              new BigNumber(
                data.results.withdrawableBalance.callsReturnContext[0].returnValues[0].hex
              ),
              _earningsData
            )
          );

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
          setIsExcludedFromPenalty(
            data.results.isExcludedFromPenalty.callsReturnContext[0]
              .returnValues[0]
          );
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
    reserves,
    isExcludedFromPenalty,
    calcPenaltyAmount
  };
};

export const useStakeCallback = (instance, account) => {
  const [pending, setPending] = useState(false);
  const contract = useStakingContract(instance);

  const handleStake = useCallback(
    async (amount, lock) => {
      try {
        setPending(true);
        return methods
          .send(instance, contract.methods.stake, [amount, lock], account)
          .then(res => {
            setPending(false);
            return true;
          })
          .catch(err => {
            setPending(false);
            return false;
          });
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

export const useWithdrawCallback = (instance, account) => {
  const [pending, setPending] = useState(false);
  const contract = useStakingContract(instance);

  const handleWithdraw = useCallback(
    async amount => {
      try {
        setPending(true);
        return methods
          .send(instance, contract.methods.withdraw, [amount], account)
          .then(res => {
            setPending(false);
            return true;
          })
          .catch(err => {
            setPending(false);
            return false;
          });
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

export const useWithdrawExpiredLocksCallback = (instance, account) => {
  const [pending, setPending] = useState(false);
  const contract = useStakingContract(instance);

  const handleWithdrawExpiredLocks = useCallback(async () => {
    try {
      setPending(true);
      return methods
        .send(instance, contract.methods.withdrawExpiredLocks, [], account)
        .then(res => {
          setPending(false);
          return true;
        })
        .catch(err => {
          setPending(false);
          return false;
        });
    } catch (e) {
      console.error('WithdrawExpiredLocks had error :>> ', e);
      setPending(false);
      return false;
    }
  }, [account, contract]);

  return { handleWithdrawExpiredLocks, pending };
};

export const useGetRewardCallback = (instance, account) => {
  const [pending, setPending] = useState(false);
  const contract = useStakingContract(instance);

  const handleGetReward = useCallback(async () => {
    try {
      setPending(true);
      return methods
        .send(instance, contract.methods.getReward, [], account)
        .then(res => {
          setPending(false);
          return true;
        })
        .catch(err => {
          setPending(false);
          return false;
        });
    } catch (e) {
      console.error('GetReward had error :>> ', e);
      setPending(false);
      return false;
    }
  }, [account, contract]);

  return { handleGetReward, pending };
};

export const useExitCallback = (instance, account) => {
  const [pending, setPending] = useState(false);
  const contract = useStakingContract(instance);

  const handleExit = useCallback(async () => {
    try {
      setPending(true);
      return methods
        .send(instance, contract.methods.exit, [], account)
        .then(res => {
          setPending(false);
          return true;
        })
        .catch(err => {
          setPending(false);
          return false;
        });
    } catch (e) {
      console.error('Exit had error :>> ', e);
      setPending(false);
      return false;
    }
  }, [account, contract]);

  return { handleExit, pending };
};

export const useStrkApproveCallback = (instance, account) => {
  const [pending, setPending] = useState(false);

  const contract = getTokenContract(instance, 'strk');

  const handleApprove = useCallback(async () => {
    try {
      setPending(true);
      return methods
        .send(
          instance,
          contract.methods.approve,
          [
            constants.STAKING_ADDRESS,
            '115792089237316195423570985008687907853269984665640564039457584007913129639935'
          ],
          account
        )
        .then(res => {
          setPending(false);
          return true;
        })
        .catch(err => {
          setPending(false);
          return false;
        });
    } catch (e) {
      console.error('Approve had error :>> ', e);
      setPending(false);
      return false;
    }
  }, [account, contract]);

  return { handleApprove, pending };
};
