import { useMemo } from 'react';
import {
  getTokenContract,
  getStakingContract
} from 'utilities/ContractService';

export const useStrkContract = () => {
  return useMemo(() => getTokenContract('strk'), []);
};

export const useStakingContract = () => {
  return useMemo(() => getStakingContract(), []);
};
