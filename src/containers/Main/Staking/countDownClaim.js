/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SBtnClaim = styled.div`
  display: flex;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    justify-content: center;
  }
`;
const SBoxTime = styled.button`
  display: flex;
  justify-content: center;
  cursor: pointer;
  background: #fff;
  color: #f84960;
  border-radius: 5px;
  padding: 8px 20px;
  margin-right: 30px;
  width: 250px;
  text-align: center;
  border: 1px solid #f84960;
  outline: none;
  :disabled {
    color: #fff !important;
    cursor: not-allowed;
  }
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;
const STimeClaim = styled.div`
  width: 100%;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const STimeText = styled.div``;

const abortController = new AbortController();

// eslint-disable-next-line react/prop-types
function CountDownClaim({ times, address }) {
  const [expiryTime, setExpiryTime] = useState(times);
  const [loadding, setIsLoading] = useState(true);
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
    const timeInterval = setInterval(() => {
      setIsLoading(true);
      const countdownDateTime = new Date(expiryTime).getTime();
      const currentTime = new Date().getTime();
      const remainingDayTime = countdownDateTime - currentTime;
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
      setCountdownTime(runningCountdownTime);
      setIsLoading(false);
      if (remainingDayTime <= 0) {
        clearInterval(timeInterval);
        setExpiryTime(false);
      }
    }, 2000);
  };
  useEffect(() => {
    let updateTimer;
    if (address) {
      updateTimer = setInterval(() => {
        countdownTimer();
      }, 1000);
    }
    return function cleanup() {
      abortController.abort();
      if (updateTimer) {
        clearInterval(updateTimer);
      }
    };
  });
  return (
    <>
      {expiryTime !== false ? (
        <>
          <SBtnClaim>
            {countdownTime && !loadding && (
              <STimeClaim>
                <SBoxTime disabled>
                  <STimeText>{countdownTime.countdownDays} Days :</STimeText>
                  <STimeText>{countdownTime.countdownHours} Hours :</STimeText>
                  <STimeText>{countdownTime.countdownMinutes} Min :</STimeText>
                  <STimeText>{countdownTime.countdownSeconds} Sec</STimeText>
                </SBoxTime>
              </STimeClaim>
            )}
          </SBtnClaim>
        </>
      ) : (
        <>{}</>
      )}
    </>
  );
}
CountDownClaim.propTypes = {
  times: PropTypes.number
};

CountDownClaim.defaultProps = {
  times: 0
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
