import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { connectAccount } from 'core';
import logoImg from 'assets/img/footer-logo.png';

const FooterWrapper = styled.div`
  padding: 75px 75px 44px;
  background-color: #090d27;

  @media (max-width: 768px) {
    padding: 35px;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;

    @media (max-width: 768px) {
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      img {
        margin-bottom: 20px;
      }
    }

    .logo-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      img {
        height: 31px;
      }
    }

    .link-wrapper {
      display: flex;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
      }

      p {
        font-size: 14px;
        font-weight: bold;
        color: #107def;
        margin-bottom: 40px;

        @media (max-width: 576px) {
          font-size: 18px;
        }
      }
      a {
        font-size: 14px;
        font-weight: 600;
        color: #39496a;

        &:hover {
          color: #FFFFFF;
        }

        &:not(:last-child) {
          margin-bottom: 25px;
        }

        @media (max-width: 576px) {
          font-size: 16px;
        }
      }

      .link-list {
        display: flex;
        flex-direction: column;

        &:not(:last-child) {
          margin-right: 97px;

          @media (max-width: 1024px) {
            margin-right: 50px;
          }

          @media (max-width: 768px) {
            margin-right: 30px;
          }

          @media (max-width: 576px) {
            margin-right: 20px;
          }
        }

        @media (max-width: 768px) {
          margin-top: 40px;
        }
      }
    }
  }

  .app-btn {
    width: 150px;
    height: 32px;
    border-radius: 5px;
    box-shadow: 0px 4px 13px 0 rgba(39, 126, 230, 0.64);
    background-color: #277ee6;
    font-size: 13.5px;
    font-weight: 500;
    color: #ffffff;
    cursor: pointer;
    &:hover {
      background-color: #477ee6;
      color: #ffffff;
    }

    &.desktop-view {
      opacity: 1;

      @media (max-width: 768px) {
        opacity: 0;
      }
    }

    &.mobile-view {
      opacity: 0;

      @media (max-width: 768px) {
        opacity: 1;
      }
    }
  }

  .latest-block-wrapper {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    margin-top: 50px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      margin-top: 50px;
    }

    .copyright {
      font-size: 14px;
      font-weight: 600;
      color: #39496a;

      @media (max-width: 768px) {
        margin-top: 20px;
      }
    }
    .status-circle {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: #97cc60;
      margin-right: 21px;
    }

    a {
      color: #39496a;
      font-size: 14px;
      font-weight: 600;
      margin-right: 20px;
    }
  }
`;

function Footer({ settings }) {
  if (!settings.selectedAddress) {
    return null;
  }
  return (
    <FooterWrapper>
      <div className="footer-content">
        <div className="logo-wrapper">
          <NavLink to="/">
            <img src={logoImg} alt="logo" />
          </NavLink>
        </div>
        <div className="link-wrapper">
          <div className="link-list">
            <p>Protocol</p>
            <NavLink to="/market">Markets</NavLink>
            <a href="https://docs.strike.org/" target="_blank" rel="noreferrer">
              Documentation
            </a>
            <a href="https://strike.org/terms" target="_blank" rel="noreferrer">
              Terms
            </a>
          </div>
          <div className="link-list">
            <p>Governance</p>
            <NavLink to="/vote">Proposals</NavLink>
            <NavLink to="/strk">STRK</NavLink>
            <NavLink to="/vote/leaderboard">Leaderboard</NavLink>
          </div>
          <div className="link-list">
            <p>Community</p>
            <a
              href="https://community.strike.org/"
              target="_blank"
              rel="noreferrer"
            >
              Forums
            </a>
            <a
              href="https://twitter.com/StrikeFinance"
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://t.me/StrikeFinance"
              target="_blank"
              rel="noreferrer"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
      <div className="latest-block-wrapper">
        <div className="flex align-center">
          <div className="status-circle" target="_blank" rel="noreferrer" />
          <a
            href={process.env.REACT_APP_ETH_EXPLORER}
            target="_blank"
            rel="noreferrer"
          >
            Latest Block: {settings.latestBlockNumber || 0}
          </a>
        </div>
        <p className="copyright">
          © {new Date().getUTCFullYear()} Strike.org All Rights Reserved. The Strike Decentralized App does not support US based users.
        </p>
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
