import React, { useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Icon } from 'antd';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import { getVoteContract, methods } from 'utilities/ContractService';
import { Row, Column } from 'components/Basic/Style';
import { connectAccount } from 'core';
import dashImg from 'assets/img/dash.png';
import { Label } from './Label';

const ProposalWrapper = styled.div`
  width: 100%;
  padding: 15px 0;
  border-bottom: 1px solid var(--color-bg-active);

  .title {
    margin-bottom: 10px;
    * {
      width: 80%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 20px;
      font-weight: 900;
      color: var(--color-text-main);
    }
  }
  .detail {
    display: flex;
    align-items: center;

    @media only screen and (max-width: 768px) {
      flex-direction: column;
    }
  }

  .orange-text {
    font-size: 16px;
    font-weight: bold;
    color: var(--color-blue);
  }
  .Passed-btn {
    color: var(--color-green);
  }
  .Active-btn {
    color: var(--color-yellow);
  }
  .Succeeded-btn,
  .Queued-btn {
    color: var(--color-blue);
  }
  .Failed-btn {
    color: var(--color-red);
  }

  .description {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .vote-status {
    padding: 10px;
    img {
      width: 29px;
      height: 29px;
      border-radius: 50%;
      margin-right: 40px;
    }
    button {
      height: 32px;
      border-radius: 6px;
      background: linear-gradient(
        242deg,
        #246cf9 0%,
        #1e68f6 0.01%,
        #0047d0 100%,
        #0047d0 100%
      );

      .MuiButton-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--color-text-main);
        text-transform: capitalize;
      }
      &:not(:last-child) {
        margin-right: 5px;
      }
    }

    @media only screen and (max-width: 768px) {
      img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 40px;
      }
    }
  }
`;

function Proposal({
  address,
  delegateAddress,
  proposal,
  votingWeight,
  history,
  settings
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [voteType, setVoteType] = useState('like');
  const [voteStatus, setVoteStatus] = useState('');

  const getStatus = p => {
    if (p.state === 'Executed') {
      return 'Passed';
    }
    if (p.state === 'Active') {
      return 'Active';
    }
    if (p.state === 'Defeated') {
      return 'Failed';
    }
    return p.state;
  };

  const getRemainTime = item => {
    if (item.state === 'Active') {
      const diffBlock = item.endBlock - item.blockNumber;
      const duration = moment.duration(
        diffBlock < 0 ? 0 : diffBlock * 15,
        'seconds'
      );
      const days = Math.floor(duration.asDays());
      const hours = Math.floor(duration.asHours()) - days * 24;
      const minutes =
        Math.floor(duration.asMinutes()) - days * 24 * 60 - hours * 60;
      return `${
        days > 0 ? `${days} ${days > 1 ? 'days' : 'day'},` : ''
      } ${hours} ${hours > 1 ? 'hrs' : 'hr'} ${
        days === 0 ? `, ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}` : ''
      } left`;
    }
    if (item.state === 'Pending') {
      return `${moment(item.createdTimestamp * 1000).format('MMMM DD, YYYY')}`;
    }
    if (item.state === 'Active') {
      return `${moment(item.startTimestamp * 1000).format('MMMM DD, YYYY')}`;
    }
    if (item.state === 'Canceled' || item.state === 'Defeated') {
      return `${moment(item.endTimestamp * 1000).format('MMMM DD, YYYY')}`;
    }
    if (item.state === 'Queued') {
      return `${moment(item.queuedTimestamp * 1000).format('MMMM DD, YYYY')}`;
    }
    if (item.state === 'Expired' || item.state === 'Executed') {
      return `${moment(item.executedTimestamp * 1000).format('MMMM DD, YYYY')}`;
    }
    return `${moment(item.updatedAt).format('MMMM DD, YYYY')}`;
  };

  const getIsHasVoted = useCallback(async () => {
    const voteContract = getVoteContract();
    await methods
      .call(voteContract.methods.getReceipt, [proposal.id, address])
      .then(res => {
        setVoteStatus(res.hasVoted ? 'voted' : 'novoted');
      });
  }, [address, proposal]);

  useEffect(() => {
    if (address && proposal.id) {
      getIsHasVoted();
    }
  }, [address, proposal, getIsHasVoted]);

  const handleVote = support => {
    setIsLoading(true);
    setVoteType(support);
    const appContract = getVoteContract();
    methods
      .send(
        appContract.methods.castVote,
        [proposal.id, support === 'like'],
        address
      )
      .then(res => {
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  return (
    <ProposalWrapper
      className="flex flex-column pointer"
      onClick={() => history.push(`/vote/proposal/${proposal.id}`)}
    >
      <div className="title">
        <ReactMarkdown>{proposal.description.split('\n')[0]}</ReactMarkdown>
      </div>
      <Row className="detail">
        <Column xs="12" sm={settings.selectedAddress ? '9' : '12'}>
          <Row>
            <Column xs="12" sm="7" className="description">
              <Label size="16">{proposal.id}</Label>
              <Label size="16">{proposal.state}</Label>
              <Label size="16">
                {moment(proposal.createdAt).format('MMMM Do, YYYY')}
              </Label>
            </Column>
            <Column xs="12" sm="5" className="description">
              <div className={`orange-text ${getStatus(proposal)}-btn`}>
                {getStatus(proposal)}
              </div>
              <Label size="16">{getRemainTime(proposal)}</Label>
            </Column>
          </Row>
        </Column>
        {settings.selectedAddress && (
          <Column xs="12" sm="3" className="vote-status">
            {voteStatus &&
              voteStatus === 'novoted' &&
              proposal.state !== 'Active' && (
                <div className="flex align-center">
                  <img src={dashImg} alt="dash" />
                  <p className="orange-text">NO VOTE</p>
                </div>
              )}
            {voteStatus && voteStatus === 'voted' && (
              <div className="flex align-center">
                <p className="orange-text">VOTED</p>
              </div>
            )}
            {voteStatus &&
              voteStatus === 'novoted' &&
              proposal.state === 'Active' &&
              delegateAddress !==
                '0x0000000000000000000000000000000000000000' && (
                <div
                  className="flex align-center"
                  onClick={e => e.stopPropagation()}
                >
                  <Button
                    className="vote-btn"
                    disabled={
                      votingWeight === '0' ||
                      !proposal ||
                      (proposal && proposal.state !== 'Active')
                    }
                    onClick={() => handleVote('like')}
                  >
                    {isLoading && voteType === 'like' && (
                      <Icon type="loading" />
                    )}{' '}
                    For
                  </Button>
                  <Button
                    className="vote-btn"
                    disabled={
                      votingWeight === '0' ||
                      !proposal ||
                      (proposal && proposal.state !== 'Active')
                    }
                    onClick={() => handleVote('dislike')}
                  >
                    {isLoading && voteType === 'dislike' && (
                      <Icon type="loading" />
                    )}{' '}
                    Against
                  </Button>
                </div>
              )}
          </Column>
        )}
      </Row>
    </ProposalWrapper>
  );
}

Proposal.propTypes = {
  address: PropTypes.string,
  delegateAddress: PropTypes.string.isRequired,
  votingWeight: PropTypes.number.isRequired,
  proposal: PropTypes.shape({
    id: PropTypes.number,
    description: PropTypes.string,
    state: PropTypes.string,
    forVotes: PropTypes.string,
    againstVotes: PropTypes.string,
    voted: PropTypes.bool,
    createdAt: PropTypes.string
  }),
  history: PropTypes.object,
  settings: PropTypes.object
};

Proposal.defaultProps = {
  address: '',
  proposal: {},
  history: {},
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(
  withRouter,
  connectAccount(mapStateToProps, null)
)(Proposal);
