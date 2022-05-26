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
  justify-content: flex-end;
  margin-top: 10px;
  @media only screen and (max-width: 768px) {
    justify-content: center;
  }
`;
const STimeClaim = styled.div`
  margin-left: 10px;
  display: block;
  width: 100%;
  @media only screen and (max-width: 768px) {
    width: 200px;
  }
`;
const STimeNumer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const STimeText = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SItemTime = styled.div`
  color: #0b0f23;
  font-weight: 900;
  font-size: 16px;
  line-height: 24px;
`;
const SItemText = styled.div`
  color: #6d6f7b;
  font-weight: 500;
  font-size: 12px;
  line-height: 19px;
`;
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
            {countdownTime && (
              <STimeClaim>
                <STimeNumer>
                  <SItemTime>{countdownTime.countdownDays} </SItemTime>
                  <SItemTime>{countdownTime.countdownHours}</SItemTime>
                  <SItemTime>{countdownTime.countdownMinutes}</SItemTime>
                  <SItemTime>{countdownTime.countdownSeconds} </SItemTime>
                </STimeNumer>
                {!loadding && (
                  <STimeText>
                    {countdownTime.countdownDays != null && (
                      <SItemText>DAYS</SItemText>
                    )}
                    {countdownTime.countdownHours != null && (
                      <SItemText>HOURS</SItemText>
                    )}
                    {countdownTime.countdownMinutes != null && (
                      <SItemText>MIN</SItemText>
                    )}
                    {countdownTime.countdownSeconds != null && (
                      <SItemText>SEC</SItemText>
                    )}
                  </STimeText>
                )}
              </STimeClaim>
            )}
          </SBtnClaim>
        </>
      ) : (
        <p>{}</p>
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
