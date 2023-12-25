import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { connectAccount } from 'core';

import strikeImg from 'assets/img/socials/strike.svg';
import mediumImg from 'assets/img/socials/medium.svg';
import telegramImg from 'assets/img/socials/telegram.svg';
import twitterImg from 'assets/img/socials/twitter.svg';
import githubImg from 'assets/img/socials/github.svg';

const FooterWrapper = styled.div`
  padding: 21px 20px 28px;
  background-color: #1e1f25;

  @media (max-width: 768px) {
  }

  .footer-content {
    display: flex;
    justify-content: end;
    gap: 20px;
  }

  .status-circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #01ffb4;
    margin-right: 10px;
  }

  a {
    color: white;
    font-weight: 300;
    font-size: 12px;
    line-height: 14px;
  }

  .block-number {
    color: white;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
  }

  .socials {
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      width: 20px;
    }
  }
`;

function Footer({ settings }) {
  // if (!settings.selectedAddress) {
  //   return null;
  // }
  return (
    <FooterWrapper>
      <div className="footer-content">
        <div className="flex align-center">
          <div className="status-circle" target="_blank" rel="noreferrer" />
          <a
            href={process.env.REACT_APP_ETH_EXPLORER}
            target="_blank"
            rel="noreferrer"
          >
            Latest Block:{' '}
            <span className="block-number">
              {settings.latestBlockNumber || 0}
            </span>
          </a>
        </div>
        <div className="socials">
          <a
            href={`${process.env.REACT_APP_ETH_EXPLORER}/address/0x74232704659ef37c08995e386a2e26cc27a8d7b1`}
            target="_blank"
            rel="noreferrer"
          >
            <img src={strikeImg} alt="strike" />
          </a>

          <a
            href="https://strike-finance.medium.com"
            target="_blank"
            rel="noreferrer"
          >
            <img src={mediumImg} alt="strike" />
          </a>

          <a href="https://t.me/StrikeFinance" target="_blank" rel="noreferrer">
            <img src={telegramImg} alt="telegram" />
          </a>

          <a
            href="https://twitter.com/StrikeFinance"
            target="_blank"
            rel="noreferrer"
          >
            <img src={twitterImg} alt="twitter" />
          </a>

          <a
            href="https://github.com/StrikeFinance"
            target="_blank"
            rel="noreferrer"
          >
            <img src={githubImg} alt="github" />
          </a>
        </div>
      </div>
    </FooterWrapper>
  );
}

Footer.propTypes = {
  settings: PropTypes.object
};

Footer.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(Footer);
