/* eslint-disable no-console */
import { useEffect, useState, useMemo, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import * as constants from 'utilities/constants';
import useRefresh from './useRefresh';
import { useMulticall } from './useContract';

const MONTHLY_REWARD = 10000; //  $10,000

export const useRewardData = (instance, account, strkPrice, ethPrice) => {
  const numberFormat = Intl.NumberFormat('en-US');

  const multicall = useMulticall(instance);
  const [stakingPoint, setStakingPoint] = useState(0);
  const [estimatedReward, setEstimatedReward] = useState(new BigNumber(0));
  const [reserveApy, setReserveApy] = useState(0);

  const { slowRefresh } = useRefresh();

  const calls = useMemo(() => {
    let temp = [
      {
        reference: 'lpBalance',
        contractAddress: constants.CONTRACT_LP_ADDRESS,
        abi: JSON.parse(constants.CONTRACT_LP_TOKEN_ABI),
        calls: [
          {
            methodName: 'balanceOf',
            methodParameters: [constants.CONTRACT_FARMING_ADDRESS]
          }
        ]
      },
      {
        reference: 'nftBalance',
        contractAddress: constants.NFT_ADDRESS,
        abi: JSON.parse(constants.NFT_ABI),
        calls: [
          {
            methodName: 'balanceOf',
            methodParameters: [constants.CONTRACT_FARMING_ADDRESS]
          }
        ]
      },
      {
        reference: 'lpTotalSupply',
        contractAddress: constants.CONTRACT_LP_ADDRESS,
        abi: JSON.parse(constants.CONTRACT_LP_TOKEN_ABI),
        calls: [
          {
            methodName: 'totalSupply',
            methodParameters: []
          }
        ]
      },
      {
        reference: 'strkBalanceInLp',
        contractAddress: constants.CONTRACT_TOKEN_ADDRESS.strk.address,
        abi: JSON.parse(constants.STRK_ABI),
        calls: [
          {
            methodName: 'balanceOf',
            methodParameters: [constants.CONTRACT_LP_ADDRESS]
          }
        ]
      },
      {
        reference: 'nftPrice',
        contractAddress: constants.NFT_ADDRESS,
        abi: JSON.parse(constants.NFT_ABI),
        calls: [
          {
            methodName: 'PRICE',
            methodParameters: []
          }
        ]
      }
    ];
    if (account) {
      temp = temp.concat([
        {
          reference: 'userInfo',
          contractAddress: constants.CONTRACT_FARMING_ADDRESS,
          abi: JSON.parse(constants.FARMING_ABI),
          calls: [
            {
              methodName: 'getUserInfo',
              methodParameters: [0, account]
            }
          ]
        }
      ]);
    }

    return temp;
  }, [account]);

  useEffect(() => {
    const fetchRewardData = async () => {
      try {
        if (strkPrice === 0) return;

        const data = await multicall.call(calls);
        // console.log('data = ', data);

        const lpBalance = new BigNumber(
          data.results.lpBalance.callsReturnContext[0].returnValues[0].hex
        );
        const nftBalance = new BigNumber(
          data.results.nftBalance.callsReturnContext[0].returnValues[0].hex
        );
        const lpTotalSupply = new BigNumber(
          data.results.lpTotalSupply.callsReturnContext[0].returnValues[0].hex
        );
        const strkBalanceInLp = new BigNumber(
          data.results.strkBalanceInLp.callsReturnContext[0].returnValues[0].hex
        );
        const nftPrice = new BigNumber(
          data.results.nftPrice.callsReturnContext[0].returnValues[0].hex
        );
        const userLp = new BigNumber(
          data.results.userInfo.callsReturnContext[0].returnValues[0].hex
        );
        const userNftCount =
          data.results.userInfo.callsReturnContext[0].returnValues[4].length;

        const userDepositedDate = new BigNumber(
          data.results.userInfo.callsReturnContext[0].returnValues[3].hex
        ).toNumber();

        const lpPrice = strkBalanceInLp
          .times(strkPrice)
          .times(2)
          .div(lpTotalSupply);

        const totalLockedPrice = lpPrice
          .times(lpBalance)
          .div(1e18)
          .plus(
            nftBalance
              .times(nftPrice)
              .times(ethPrice)
              .div(1e18)
          );

        if (account) {
          let rewardDate = 0;
          const depositDate = moment.unix(userDepositedDate);
          const currentDate = moment();

          if (currentDate.month() === depositDate.month()) {
            rewardDate = Math.floor(
              (currentDate.unix() - userDepositedDate) / 86400
            );
          } else {
            rewardDate = currentDate.date();
          }

          const userLockedPrice = lpPrice
            .times(userLp)
            .div(1e18)
            .plus(
              new BigNumber(userNftCount)
                .times(nftPrice)
                .times(ethPrice)
                .div(1e18)
            );
          setStakingPoint(
            userLp
              .times(1 + 0.1 * userNftCount)
              .times(rewardDate)
              .div(1e18)
              .times(1e6)
              .toNumber()
              .toFixed(1)
          );

          setEstimatedReward(
            userLockedPrice
              .div(totalLockedPrice)
              .times(MONTHLY_REWARD)
              .toNumber()
              .toFixed(1)
          );
        }

        setReserveApy(
          Number(
            (MONTHLY_REWARD * 12 * 100) / totalLockedPrice.toNumber()
          ).toFixed(1)
        );
      } catch (e) {
        console.error('Fetching staking data had error', e);
      }
    };

    fetchRewardData();
  }, [slowRefresh, multicall, account, strkPrice, ethPrice]);

  return {
    stakingPoint,
    estimatedReward: numberFormat.format(estimatedReward),
    totalReserveReward: numberFormat.format(MONTHLY_REWARD),
    reserveApy
  };
};
