import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Web3 from 'web3';
import { compose } from 'recompose';
import { Pagination, Icon, message } from 'antd';
import Button from '@material-ui/core/Button';
import {
  getTokenContract,
  getVoteContract,
  methods
} from 'utilities/ContractService';
import { connectAccount } from 'core';
import Proposal from 'components/Basic/Proposal';
import ProposalModal from 'components/Vote/ProposalModal';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import arrowRightImg from 'assets/img/arrow-right.png';
import { Card } from 'components/Basic/Card';

import { STRK_BALANCE } from 'apollo/queries';
import { governanceClient } from 'apollo/client';

const ProposalsWrapper = styled.div`
  width: 100%;
  height: 555px;
  border-radius: 5px;
  background-color: var(--color-bg-primary);
  padding: 20px 30px;

  .proposal-head {
    margin-bottom: 20px;
    .header {
      font-size: 17px;
      font-weight: 900;
      color: var(--color-text-main);
    }
    .create-proposal-btn {
      width: 210px;
      height: 40px;
      border-radius: 5px;
      background-color: var(--color-blue);
      box-shadow: 0px 4px 13px 0 rgba(39, 126, 230, 0.64);
      .MuiButton-label {
        font-size: 17px;
        font-weight: 500;
        color: var(--color-white);
        text-transform: capitalize;
      }
    }
  }

  .body {
    height: 100%;
  }

  .footer {
    margin-top: 40px;
    .pages {
      font-size: 16px;
      color: var(--color-text-secondary);
    }

    .ant-pagination-prev,
    .ant-pagination-next {
      display: none;
    }

    .ant-pagination-item a {
      color: var(--color-text-main);
    }

    .ant-pagination-item:focus a,
    .ant-pagination-item:hover a {
      color: var(--color-blue);
    }

    .ant-pagination-item-active {
      background: transparent;
      border-color: transparent;
      a {
        color: var(--color-blue);
      }
    }

    .button {
      width: 200px;
      flex-direction: row-reverse;
      span {
        font-size: 16px;
        font-weight: 900;
        color: var(--color-text-main);
      }

      img {
        width: 26px;
        height: 16px;
        border-radius: 50%;
      }

      .button-prev {
        cursor: pointer;
        img {
          margin-right: 25px;
          transform: rotate(180deg);
        }
      }

      .button-next {
        cursor: pointer;
        span {
          margin-right: 25px;
        }
      }

      .button-prev:focus,
      .button-prev:hover,
      .button-next:focus,
      .button-next:hover {
        span {
          color: var(--color-blue);
        }
      }
    }
  }
`;

const NoProposalWrapper = styled.div`
  width: 100%;
  height: 100%;

  .title {
    font-size: 16px;
    font-weight: 900;
    color: var(--color-text-main);
  }
`;
function Proposals({
  address,
  isLoadingProposal,
  settings,
  votingWeight,
  pageNumber,
  proposals,
  total,
  onChangePage
}) {
  const [current, setCurrent] = useState(pageNumber);
  const [pageSize, setPageSize] = useState(5);

  const [proposalModal, setProposalModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [proposalThreshold, setProposalThreshold] = useState(0);
  const [maxOperation, setMaxOperation] = useState(0);
  const [delegateAddress, setDelegateAddress] = useState('');

  useEffect(() => {
    if (address) {
      const voteContract = getVoteContract();
      methods.call(voteContract.methods.proposalThreshold, []).then(res => {
        setProposalThreshold(+Web3.utils.fromWei(res, 'ether'));
      });
      methods.call(voteContract.methods.proposalMaxOperations, []).then(res => {
        setMaxOperation(res);
      });
    }
  }, [address]);

  const getDelegateAddress = async () => {
    const { data: result } = await governanceClient.query({
      query: STRK_BALANCE,
      variables: {
        id: `${settings.selectedAddress.toLowerCase()}`
      },
      fetchPolicy: 'cache-first'
    });
    if (result.tokenHolder && result.tokenHolder.delegate) {
      setDelegateAddress(result.tokenHolder.delegate.id);
    } else {
      setDelegateAddress('');
    }
  };

  useEffect(() => {
    if (
      settings.selectedAddress &&
      (delegateAddress === '' ||
        delegateAddress === '0x0000000000000000000000000000000000000000')
    ) {
      if (process.env.REACT_APP_ENV === 'dev') {
        const tokenContract = getTokenContract('strk');
        methods
          .call(tokenContract.methods.delegates, [address])
          .then(res => {
            setDelegateAddress(res);
          })
          .catch(() => {});
      } else {
        getDelegateAddress();
      }
    }
  }, [settings.selectedAddress, address, delegateAddress]);

  const handleChangePage = (page, size) => {
    setCurrent(page);
    setPageSize(size);
    onChangePage(page, (page - 1) * size, size);
  };

  const onNext = () => {
    handleChangePage(current + 1, 5);
  };

  const onPrev = () => {
    handleChangePage(current - 1, 5);
  };

  const handleShowProposalModal = () => {
    if (+votingWeight < +proposalThreshold) {
      message.error(`You can't create proposal. Your voting power should be ${proposalThreshold} STRK at least`);
      return;
    }
    const voteContract = getVoteContract();
    setIsLoading(true);
    methods
      .call(voteContract.methods.latestProposalIds, [address])
      .then(pId => {
        if (pId !== '0') {
          methods.call(voteContract.methods.state, [pId]).then(status => {
            if (status === '0' || status === '1') {
              message.error(`You can't create proposal. there is proposal in progress!`);
            } else {
              setProposalModal(true);
            }
            setIsLoading(false);
          });
        } else {
          setProposalModal(true);
          setIsLoading(false);
        }
      });
  };

  return (
    <Card>
      <ProposalsWrapper className="flex flex-column">
        <div className="flex align-center just-between proposal-head">
          <p className="header">Governance Proposals</p>
          {address && (
            <Button
              className="create-proposal-btn"
              onClick={handleShowProposalModal}
            >
              {isLoading && <Icon type="loading" />} Create Proposal
            </Button>
          )}
        </div>
        <div className="body">
        {isLoadingProposal ? <LoadingSpinner /> : 
          proposals && proposals.length !== 0 ? (        
            proposals.map(item => {
              return (
                <Proposal
                  proposal={item}
                  votingWeight={votingWeight}
                  delegateAddress={delegateAddress}
                  address={address}
                  key={item.id}
                />
              );
            })        
          ) : (
          <NoProposalWrapper className="flex just-center align-center">
            <div className="title">No Proposals</div>
          </NoProposalWrapper>
        )}
        </div>
        {proposals && proposals.length !== 0 && (
          <div className="flex align-center just-between footer">
            <Pagination
              size="small"
              defaultCurrent={1}
              defaultPageSize={5}
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={handleChangePage}
            />
            <div className="flex just-between align-center button">
              {current * pageSize < total && (
                <div className="flex align-center button-next" onClick={onNext}>
                  <span>Next</span>
                  <img src={arrowRightImg} alt="arrow" />
                </div>
              )}
              {current > 1 && (
                <div className="flex align-center button-prev" onClick={onPrev}>
                  <img src={arrowRightImg} alt="arrow" />
                  <span>Prev</span>
                </div>
              )}
            </div>
          </div>
        )}
        <ProposalModal
          address={address}
          visible={proposalModal}
          maxOperation={maxOperation}
          onCancel={() => setProposalModal(false)}
        />
      </ProposalsWrapper>
    </Card>
  );
}

Proposals.propTypes = {
  address: PropTypes.string.isRequired,
  isLoadingProposal: PropTypes.bool.isRequired,
  votingWeight: PropTypes.number.isRequired,
  settings: PropTypes.object.isRequired,
  proposals: PropTypes.array,
  pageNumber: PropTypes.number,
  total: PropTypes.number,
  onChangePage: PropTypes.func.isRequired
};

Proposals.defaultProps = {
  proposals: [],
  pageNumber: 1,
  total: 0
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(Proposals);
