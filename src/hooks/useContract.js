import { useMemo } from 'react';
import Web3 from 'web3';
import {
  getTokenContract,
  getStakingContract,
  getMulticall,
  getProvider,
  getSbepContract,
  getComptrollerContract,
  getPriceOracleContract,
  getVoteContract,
  getInterestModelContract,
  getFarmingContract,
  getLPContract,
  getNFTContract,
  getVSTRKContract,
  getSTRKClaimContract,
  getSTRKContract,
  getPrimeRewardPoolContract
} from 'utilities/ContractService';

export const useProvider = walletType => {
  return useMemo(() => getProvider(walletType), [walletType]);
};

export const useInstance = walletType => {
  return useMemo(
    () =>
      new Web3(
        getProvider(walletType)
          ? getProvider(walletType)
          : process.env.REACT_APP_MAIN_RPC
      ),
    [walletType]
  );
};

export const useMulticall = instance => {
  return useMemo(() => getMulticall(instance), [instance]);
};

export const useTokenContract = (instance, name) => {
  return useMemo(() => getTokenContract(instance, name), [instance, name]);
};

export const useStakingContract = instance => {
  return useMemo(() => getStakingContract(instance), [instance]);
};

export const useSbepContract = (instance, name) => {
  return useMemo(() => getSbepContract(instance, name), [instance, name]);
};

export const useComptrollerContract = instance => {
  return useMemo(() => getComptrollerContract(instance), [instance]);
};

export const usePriceOracleContract = (instance, address) => {
  return useMemo(() => getPriceOracleContract(instance, address), [
    instance,
    address
  ]);
};

export const useVoteContract = instance => {
  return useMemo(() => getVoteContract(instance), [instance]);
};

export const useInterestModelContract = (instance, address) => {
  return useMemo(() => getInterestModelContract(instance, address), [
    instance,
    address
  ]);
};

export const useFarmingContract = instance => {
  return useMemo(() => getFarmingContract(instance), [instance]);
};

export const useLPContract = instance => {
  return useMemo(() => getLPContract(instance), [instance]);
};

export const useNFTContract = instance => {
  return useMemo(() => getNFTContract(instance), [instance]);
};

export const useVSTRKContract = instance => {
  return useMemo(() => getVSTRKContract(instance), [instance]);
};

export const useSTRKClaimContract = instance => {
  return useMemo(() => getSTRKClaimContract(instance), [instance]);
};

export const useSTRKContract = instance => {
  return useMemo(() => getSTRKContract(instance), [instance]);
};

export const usePrimeRewardPoolContract = instance => {
  return useMemo(() => getPrimeRewardPoolContract(instance), [instance]);
};
