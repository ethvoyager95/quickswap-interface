/* eslint-disable no-useless-escape */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import {
  getTokenContract,
  getSbepContract,
  getComptrollerContract,
  methods
} from 'utilities/ContractService';
import MainLayout from 'containers/Layout/MainLayout';
import CoinInfo from 'components/Vote/CoinInfo';
import VotingWallet from 'components/Vote/VotingWallet';
import VotingPower from 'components/Vote/VotingPower';
import Proposals from 'components/Vote/Proposals';
import { promisify } from 'utilities';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Row, Column } from 'components/Basic/Style';
import { checkIsValidNetwork } from 'utilities/common';
import * as constants from 'utilities/constants';

const VoteWrapper = styled.div`
  height: 100%;
`;

const SpinnerWrapper = styled.div`
  height: 85vh;
  width: 100%;

  @media only screen and (max-width: 1440px) {
    height: 70vh;
  }
`;

function Vote({ settings, history, getProposals, setSetting }) {
  const [balance, setBalance] = useState(0);
  const [votingWeight, setVotingWeight] = useState(0);
  const [proposals, setProposals] = useState({});
  const [current, setCurrent] = useState(1);
  const [isLoadingProposal, setIsLoadingPropoasl] = useState(false);
  const [earnedBalance, setEarnedBalance] = useState('0.00000000');

  const loadInitialData = useCallback(async () => {
    setIsLoadingPropoasl(true);
    await promisify(getProposals, {
      offset: 0,
      limit: 5
    })
      .then(res => {
        setIsLoadingPropoasl(false);
        setProposals(res.data);
      })
      .catch(() => {
        setIsLoadingPropoasl(false);
      });
  }, [getProposals]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleChangePage = (pageNumber, offset, limit) => {
    setCurrent(pageNumber);
    setIsLoadingPropoasl(true);
    promisify(getProposals, {
      offset,
      limit
    })
      .then(res => {
        setProposals(res.data);
        setIsLoadingPropoasl(false);
      })
      .catch(() => {
        setIsLoadingPropoasl(false);
      });
  };

  const updateBalance = useCallback(async () => {
    if (settings.selectedAddress && checkIsValidNetwork()) {
      const strkTokenContract = getTokenContract('strk');
      await methods
        .call(strkTokenContract.methods.getCurrentVotes, [
          settings.selectedAddress
        ])
        .then(res => {
          const weight = new BigNumber(res)
            .div(new BigNumber(10).pow(18))
            .toString(10);
          setVotingWeight(weight);
        });

      let temp = await methods.call(strkTokenContract.methods.balanceOf, [
        settings.selectedAddress
      ]);
      temp = new BigNumber(temp)
        .dividedBy(new BigNumber(10).pow(18))
        .dp(4, 1)
        .toString(10);
      setBalance(temp);
    }
  }, [settings.markets]);

  const getVoteInfo = async () => {
    const myAddress = settings.selectedAddress;
    if (!myAddress) return;
    const appContract = getComptrollerContract();
    const [strikeInitialIndex, strikeAccrued] = await Promise.all([
      methods.call(appContract.methods.strikeInitialIndex, []),
      methods.call(appContract.methods.strikeAccrued, [myAddress])
    ]);
    let strikeEarned = new BigNumber(strikeAccrued);
    await Promise.all(
      Object.values(constants.CONTRACT_SBEP_ADDRESS).map(
        async (item, index) => {
          const sBepContract = getSbepContract(item.id);
          let [
            supplyState,
            supplierIndex,
            supplierTokens,
            borrowState,
            borrowerIndex,
            borrowBalanceStored,
            borrowIndex
          ] = await Promise.all([
            methods.call(appContract.methods.strikeSupplyState, [item.address]),
            methods.call(appContract.methods.strikeSupplierIndex, [
              item.address,
              myAddress
            ]),
            methods.call(sBepContract.methods.balanceOf, [myAddress]),
            methods.call(appContract.methods.strikeBorrowState, [item.address]),
            methods.call(appContract.methods.strikeBorrowerIndex, [
              item.address,
              myAddress
            ]),
            methods.call(sBepContract.methods.borrowBalanceStored, [myAddress]),
            methods.call(sBepContract.methods.borrowIndex, [])
          ]);
          const supplyIndex = supplyState.index;
          if (+supplierIndex === 0 && +supplyIndex > 0) {
            supplierIndex = strikeInitialIndex;
          }
          let deltaIndex = new BigNumber(supplyIndex).minus(supplierIndex);

          const supplierDelta = new BigNumber(supplierTokens)
            .multipliedBy(deltaIndex)
            .dividedBy(1e36);

          strikeEarned = strikeEarned.plus(supplierDelta);
          if (+borrowerIndex > 0) {
            deltaIndex = new BigNumber(borrowState.index).minus(borrowerIndex);
            const borrowerAmount = new BigNumber(borrowBalanceStored)
              .multipliedBy(1e18)
              .dividedBy(borrowIndex);
            const borrowerDelta = borrowerAmount
              .times(deltaIndex)
              .dividedBy(1e36);
            strikeEarned = strikeEarned.plus(borrowerDelta);
          }
        }
      )
    );

    strikeEarned = strikeEarned
      .dividedBy(1e18)
      .dp(8, 1)
      .toString(10);
    setEarnedBalance(
      strikeEarned && strikeEarned !== '0' ? `${strikeEarned}` : '0.00000000'
    );
  };

  const handleAccountChange = async () => {
    await getVoteInfo();
    setSetting({
      accountLoading: false
    });
  };

  useEffect(() => {
    if (settings.selectedAddress) {
      updateBalance();
      getVoteInfo();
    }
  }, [settings.markets]);

  useEffect(() => {
    if (settings.accountLoading) {
      handleAccountChange();
    }
  }, [settings.accountLoading]);

  return (
    <MainLayout title="Vote">
      <VoteWrapper>
        {(!settings.selectedAddress || settings.accountLoading) && (
          <SpinnerWrapper>
            <LoadingSpinner />
          </SpinnerWrapper>
        )}
        {settings.selectedAddress && !settings.accountLoading && (
          <>
            <Row>
              <Column xs="12" sm="12" md="5">
                <CoinInfo
                  balance={balance !== '0' ? `${balance}` : '0.00000000'}
                  address={
                    settings.selectedAddress ? settings.selectedAddress : ''
                  }
                  ensName={settings.selectedENSName ? settings.selectedENSName: ''}
                  ensAvatar={settings.selectedENSAvatar ? settings.selectedENSAvatar : ''}
                />
              </Column>
              <Column xs="12" sm="12" md="7">
                <VotingPower
                  power={
                    votingWeight !== '0'
                      ? `${new BigNumber(votingWeight).dp(8, 1).toString(10)}`
                      : '0.00000000'
                  }
                />
              </Column>
            </Row>
            <Row>
              <Column xs="12" sm="12" md="5">
                <VotingWallet
                  balance={balance !== '0' ? `${balance}` : '0.00000000'}
                  earnedBalance={earnedBalance}
                />
              </Column>
              <Column xs="12" sm="12" md="7" style={{ height: '100%' }}>
                <Proposals
                  address={
                    settings.selectedAddress ? settings.selectedAddress : ''
                  }
                  isLoadingProposal={isLoadingProposal}
                  pageNumber={current}
                  proposals={proposals.result}
                  total={proposals.total || 0}
                  votingWeight={votingWeight}
                  onChangePage={handleChangePage}
                />
              </Column>
            </Row>
          </>
        )}
      </VoteWrapper>
    </MainLayout>
  );
}

Vote.propTypes = {
  history: PropTypes.object,
  settings: PropTypes.object,
  getProposals: PropTypes.func.isRequired,
  setSetting: PropTypes.func.isRequired
};

Vote.defaultProps = {
  history: {},
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { getProposals, setSetting } = accountActionCreators;

  return bindActionCreators(
    {
      getProposals,
      setSetting
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Vote);
