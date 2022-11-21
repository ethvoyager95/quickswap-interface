import { useEffect, useState, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import * as constants from 'utilities/constants';
import { multicall } from 'utilities/ContractService';
import useRefresh from './useRefresh';

export const useBalance = (account, forceUpdate) => {
  const [strkBalance, setStrkBalance] = useState(new BigNumber(0));
  const [strkStakingAllowance, setStrkStakingAllowance] = useState(
    new BigNumber(0)
  );

  const { fastRefresh } = useRefresh();

  const calls = useMemo(() => {
    return [
      {
        reference: 'balance',
        contractAddress: constants.CONTRACT_TOKEN_ADDRESS.strk.address,
        abi: JSON.parse(constants.STRK_ABI),
        calls: [
          {
            methodName: 'balanceOf',
            methodParameters: [account]
          }
        ]
      },
      {
        reference: 'allowance',
        contractAddress: constants.CONTRACT_TOKEN_ADDRESS.strk.address,
        abi: JSON.parse(constants.STRK_ABI),
        calls: [
          {
            methodName: 'allowance',
            methodParameters: [account, constants.STAKING_ADDRESS]
          }
        ]
      }
    ];
  }, [account]);

  useEffect(() => {
    async function checkBalance() {
      if (account) {
        const data = await multicall.call(calls);
        setStrkBalance(
          new BigNumber(
            data.results.balance.callsReturnContext[0].returnValues[0].hex
          )
        );
        setStrkStakingAllowance(
          new BigNumber(
            data.results.allowance.callsReturnContext[0].returnValues[0].hex
          )
        );
      } else {
        setStrkBalance(new BigNumber(0));
        setStrkStakingAllowance(new BigNumber(0));
      }
    }

    checkBalance();
  }, [account, fastRefresh, multicall, forceUpdate]);

  return {
    strkBalance,
    strkStakingAllowance
  };
};
