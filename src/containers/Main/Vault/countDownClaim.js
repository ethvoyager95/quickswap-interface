/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { Tooltip } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connectAccount, accountActionCreators } from 'core';
import IconQuestion from '../../../assets/img/error-outline.svg';
import { UNSTAKE, CLAIMBASE, CLAIMBOOST, UNSTAKENFT } from './helper';

const SBtnClaim = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media only screen and (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;
const SBoxTime = styled.button`
  display: flex;
  justify-content: center;
  cursor: pointer;
  background: #fff;
  color: #f84960;
  border-radius: 6px;
  padding: 8px 16px;
  margin-right: 10px;
  width: 280px;
  text-align: center;
  border: 1px solid #f84960;
  outline: none;
  :disabled {
    color: #fff !important;
    cursor: not-allowed;
  }
  @media only screen and (max-width: 768px) {
    width: 100%;
    margin-right: 15px;
  }
`;
const STimeClaim = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;
const STimeNumber = styled.div`
  font-weight: 900;
  margin-right: 5px;
  display: flex;
`;
const STimeText = styled.div`
  margin-left: 5px;
  font-weight: 400;
`;
const SUntake = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;
const SBtnUnstake = styled.button`
  cursor: pointer;
  color: #f84960;
  background: #fff;
  border-radius: 6px;
  padding: 8px 20px;
  width: 280px;
  text-align: center;
  border: 1px solid #f84960;
  margin-right: 15px;
  outline: none;
  &:hover {
    background: #fff !important;
  }
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
  :disabled {
    color: #fff !important;
    cursor: not-allowed;
    &:hover {
      background: #d9d9d9 !important;
    }
  }
`;
export const SClaim = styled.button`
  cursor: pointer;
  background: #107def;
  color: #fff;
  font-weight: 700;
  border-radius: 6px;
  padding: 8px 20px;
  width: 280px;
  text-align: center;
  margin-right: 15px;
  outline: none;
  border: none;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
  :disabled {
    color: #fff !important;
    cursor: not-allowed;
    &:hover {
    }
  }
`;
export const SSUnTaked = styled.button`
  cursor: pointer;
  color: #f84960;
  background: #fff;
  border-radius: 6px;
  padding: 8px 20px;
  min-width: 150px;
  text-align: center;
  border: 1px solid #f84960;
  margin-right: 15px;
  margin-top: 10px;
  outline: none;
  :disabled {
    color: #fff !important;
    cursor: not-allowed;
  }
  :hover {
    background: #fff !important;
  }
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;
const SBoxAproving = styled.div`
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
`;
export const SApproving = styled.button`
  cursor: pointer;
  background: #107def;
  color: #fff;
  font-weight: 700;
  border-radius: 6px;
  padding: 8px 20px;
  width: 280px;
  text-align: center;
  margin-right: 50px;
  margin-top: 10px;
  outline: none;
  border: none;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;
const SQuestion = styled.img`
  width: 23px;
  height: 23px;
  margin-right: 10px;
  @media only screen and (max-width: 768px) {
    width: 15px;
    height: 15px;
    margin-right: 0;
  }
`;
const abortController = new AbortController();

// eslint-disable-next-line react/prop-types
function CountDownClaim({
  times,
  address,
  type,
  handleUnStake,
  handleClainBaseReward,
  handleClainBootReward,
  handleUnStakeNFT,
  valUnStake,
  isAprroveVstrk,
  handleApproveVstrk
}) {
  const [expiryTime, setExpiryTime] = useState(times);
  const [isLoadding, setIsLoading] = useState(false);
  const [countdownTime, setCountdownTime] = useState({
    countdownDays: '',
    countdownHours: '',
    countdownlMinutes: '',
    countdownSeconds: ''
  });

  const countdownTimer = () => {
    if (!address) {
      setCountdownTime({
        countdownDays: '',
        countdownHours: '',
        countdownlMinutes: '',
        countdownSeconds: ''
      });
    }
    const countdownDateTime = new Date(expiryTime).getTime();
    const currentTime = new Date().getTime();
    const remainingDayTime = countdownDateTime - currentTime;
    if (remainingDayTime <= 0) {
      setExpiryTime(false);
    }
    const totalDays = Math.floor(remainingDayTime / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(
      (remainingDayTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const totalMinutes = Math.floor(
      (remainingDayTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const totalSeconds = Math.floor((remainingDayTime % (1000 * 60)) / 1000);
    const runningCountdownTime = {
      countdownDays: totalDays ?? '',
      countdownHours: totalHours ?? '',
      countdownMinutes: totalMinutes ?? '',
      countdownSeconds: totalSeconds ?? ''
    };
    // setIsLoading(true);

    setCountdownTime(runningCountdownTime);
  };
  useEffect(() => {
    if (times <= new Date().getTime()) {
      setExpiryTime(false);
    } else {
      setExpiryTime(times);
    }
    let updateTimer;
    if (address) {
      updateTimer = setInterval(() => {
        countdownTimer();
      }, 1000);
    }
    return function cleanup() {
      abortController.abort();
      setIsLoading(false);
      if (updateTimer) {
        clearInterval(updateTimer);
        setIsLoading(true);
      }
    };
  }, [times, countdownTime]);
  return (
    <>
      {expiryTime !== false ? (
        <>
          <SBtnClaim>
            {countdownTime && isLoadding && (
              <>
                <STimeClaim className={type === UNSTAKENFT ? 'margin-0' : ''}>
                  <SBoxTime disabled>
                    <STimeNumber>
                      {countdownTime.countdownDays}
                      <STimeText>
                        <FormattedMessage id="Days" /> :
                      </STimeText>
                    </STimeNumber>
                    <STimeNumber>
                      {countdownTime.countdownHours}
                      <STimeText>
                        <FormattedMessage id="Hours" /> :
                      </STimeText>
                    </STimeNumber>
                    <STimeNumber>
                      {countdownTime.countdownMinutes}
                      <STimeText>
                        <FormattedMessage id="Min" /> :
                      </STimeText>
                    </STimeNumber>
                    <STimeNumber>
                      {countdownTime.countdownSeconds}
                      <STimeText>
                        <FormattedMessage id="Sec" />
                      </STimeText>
                    </STimeNumber>
                  </SBoxTime>
                </STimeClaim>
                {type === UNSTAKE && (
                  <Tooltip
                    placement="right"
                    title={<FormattedMessage id="Countdown_Tooltip2" />}
                  >
                    <SQuestion src={IconQuestion} />
                  </Tooltip>
                )}
                {type === CLAIMBASE && (
                  <Tooltip
                    placement="right"
                    title={<FormattedMessage id="Countdown_Tooltip3" />}
                  >
                    <SQuestion src={IconQuestion} />
                  </Tooltip>
                )}
                {type === CLAIMBOOST && (
                  <Tooltip
                    placement="right"
                    title={<FormattedMessage id="Countdown_Tooltip4" />}
                  >
                    <SQuestion src={IconQuestion} />
                  </Tooltip>
                )}
              </>
            )}
          </SBtnClaim>
        </>
      ) : (
        <>
          {type === UNSTAKE && (
            <>
              {isAprroveVstrk ? (
                <>
                  <SUntake>
                    <SBtnUnstake
                      disabled={valUnStake === 0 || valUnStake === ''}
                      onClick={handleUnStake}
                    >
                      <FormattedMessage id="Unstake" />
                    </SBtnUnstake>
                    <Tooltip
                      placement="right"
                      title={<FormattedMessage id="Countdown_Tooltip2" />}
                    >
                      <SQuestion src={IconQuestion} />
                    </Tooltip>
                  </SUntake>
                </>
              ) : (
                <>
                  <SBoxAproving>
                    <SApproving onClick={handleApproveVstrk}>
                      <FormattedMessage id="Approve_Staking" />
                    </SApproving>
                  </SBoxAproving>
                </>
              )}
            </>
          )}
          {type === CLAIMBASE && (
            <SUntake>
              <SClaim onClick={handleClainBaseReward}>
                <FormattedMessage id="Claim" />
              </SClaim>
              <Tooltip
                placement="right"
                title={<FormattedMessage id="Countdown_Tooltip3" />}
              >
                <SQuestion src={IconQuestion} />
              </Tooltip>
            </SUntake>
          )}
          {type === CLAIMBOOST && (
            <SUntake>
              <SClaim onClick={handleClainBootReward}>
                <FormattedMessage id="Claim" />
              </SClaim>
              <Tooltip
                placement="right"
                title={<FormattedMessage id="Countdown_Tooltip4" />}
              >
                <SQuestion src={IconQuestion} />
              </Tooltip>
            </SUntake>
          )}
          {type === UNSTAKENFT && (
            <SUntake>
              <SSUnTaked onClick={handleUnStakeNFT}>
                <FormattedMessage id="UnStake" />
              </SSUnTaked>
            </SUntake>
          )}
        </>
      )}
    </>
  );
}
CountDownClaim.propTypes = {
  times: PropTypes.number,
  address: PropTypes.string,
  type: PropTypes.string,
  handleUnStake: PropTypes.func,
  handleClainBaseReward: PropTypes.func,
  handleClainBootReward: PropTypes.func,
  handleUnStakeNFT: PropTypes.func,
  valUnStake: PropTypes.number,
  isAprroveVstrk: PropTypes.bool,
  handleApproveVstrk: PropTypes.func
};

CountDownClaim.defaultProps = {
  times: 0,
  address: '',
  type: '',
  handleUnStake: '',
  handleClainBaseReward: '',
  handleClainBootReward: '',
  handleUnStakeNFT: '',
  valUnStake: 0,
  isAprroveVstrk: false,
  handleApproveVstrk: ''
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { getVoterAccounts } = accountActionCreators;

  return bindActionCreators(
    {
      getVoterAccounts
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(CountDownClaim);
