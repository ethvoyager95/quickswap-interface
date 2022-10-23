import { useMemo } from 'react';
import { getSTRKContract, getStakingContract } from 'utilities/ContractService';

export const useStrkContract = () => {
  return useMemo(() => getSTRKContract(), []);
};

export const useStakingContract = () => {
  return useMemo(() => getStakingContract(), []);
};
