import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Input, Icon } from 'antd';
import Button from '@material-ui/core/Button';

const VotingWrapper = styled.div`
  .close-btn {
    position: absolute;
    top: 23px;
    right: 23px;
  }

  .header-content {
    font-size: 24.5px;
    font-weight: normal;
    color: var(--color-text-main);
    margin-bottom: 38px;
  }

  .check-image {
    width: 38px;
    margin-right: 25px;
  }

  .arrow-image {
    width: 26px;
    height: 16px;
  }

  .voting-selection {
    width: 100%;
    border-top: 1px solid var(--color-bg-active);
    padding: 43px 0;

    .address {
      color: var(--color-text-main);
      font-weight: 500;
      font-size: 17px;
    }

    .leaderboard {
      color: var(--color-text-blue);
      font-weight: 500;
      font-size: 13.5px;
      cursor: pointer;
    }

    .detail {
      font-size: 13.5px;
      font-weight: normal;
      color: var(--color-text-secondary);
      padding-top: 12px;
    }

    .ant-input {
      margin-top: 35px;
      height: 48px;
      background-color: var(--color-bg-main);
      border: 1px solid #797979;
      font-size: 13.5px;
      text-align: center;
      color: var(--color-text-main);
    }

    .vote-btn {
      margin-top: 45px;
      width: 100%;
      height: 48px;
      border-radius: 6px;
      background: linear-gradient(
        242deg,
        #246cf9 0%,
        #1e68f6 0.01%,
        #0047d0 100%,
        #0047d0 100%
      );

      .MuiButton-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--color-white);
        text-transform: capitalize;
      }
    }
  }
`;

function DelegationVoting({ history, isLoading, onDelegate, intl }) {
  const [delegateAddress, setDelegateAddress] = useState('');
  return (
    <VotingWrapper>
      <div className="flex align-center just-center header-content">
        <p>
          <FormattedMessage id="Delegate_Voting" />
        </p>
      </div>
      <div className="flex flex-column voting-selection">
        <div className="flex align-center just-start">
          <span className="address">
            <FormattedMessage id="Select_and_Address" />
          </span>
        </div>
        <div className="detail">
          <FormattedMessage id="Select_and_Address_desc" />
        </div>
      </div>
      <div className="flex flex-column voting-selection">
        <div className="flex align-center just-between">
          <span className="address">
            <FormattedMessage id="Delegate_Address" />
          </span>
          <span
            className="leaderboard pointer"
            onClick={() => history.push('/vote/leaderboard')}
          >
            <FormattedMessage id="Delegate_Leaderboard" />
          </span>
        </div>
        <Input
          value={delegateAddress}
          placeholder={intl.formatMessage({
            id: 'Enter_0x_address'
          })}
          onChange={e => setDelegateAddress(e.target.value)}
        />
        <Button
          className="vote-btn"
          disabled={isLoading}
          onClick={() => onDelegate(delegateAddress)}
        >
          {isLoading && <Icon type="loading" />}{' '}
          <FormattedMessage id="Delegate_Votes" />
        </Button>
      </div>
    </VotingWrapper>
  );
}

DelegationVoting.propTypes = {
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onDelegate: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

export default injectIntl(compose(withRouter)(DelegationVoting));
