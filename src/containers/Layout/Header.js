import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import * as constants from 'utilities/constants';
// import { Input } from 'antd';
import arrowRightImg from 'assets/img/arrow-right.png';

const HeaderWrapper = styled.div`
  // height: 50px;
  margin: 20px 15px 0;
  .title-wrapper {
    .arrow-left {
      height: 16px;
      transform: rotate(180deg);
      margin-right: 18px;
    }
    p {
      font-size: 20px;
      font-weight: 900;
      color: var(--color-text-main);
    }
  }

  .asset-img {
    width: 36px;
    height: 36px;
    margin-right: 5px;
  }

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

function Header({ title, history, currentAsset }) {
  const handleRoute = () => {
    if (title === 'Overview' || title === 'Details') {
      history.go(-1);
    }
    if (title === 'Market') {
      history.push('/market');
    }
    if (title === 'Deprecated Market Detail') {
      history.push('/marketdeprecated');
    }
  };

  return (
    <HeaderWrapper className="flex align-center just-between">
      <div
        className="flex align-center pointer title-wrapper"
        onClick={handleRoute}
      >
        {(title === 'Overview' ||
          title === 'Details' ||
          title === 'Market' ||
          title === 'Deprecated Market Detail') && (
          <img className="arrow-left" src={arrowRightImg} alt="arrow-left" />
        )}
        <p
          className={`${
            title === 'Overview' || title === 'Details' ? 'highlight' : ''
          }`}
        >
          {title === 'Market' || title === 'Deprecated Market Detail' ? (
            <div className="flex align-center">
              <img
                className="asset-img"
                src={
                  constants.CONTRACT_TOKEN_ADDRESS[currentAsset]
                    ? constants.CONTRACT_TOKEN_ADDRESS[currentAsset].asset
                    : null
                }
                alt="asset"
              />
              <p>{currentAsset.toUpperCase()}</p>
            </div>
          ) : (
            <FormattedMessage id={title} />
          )}
        </p>
      </div>
    </HeaderWrapper>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  currentAsset: PropTypes.string,
  history: PropTypes.object
};

Header.defaultProps = {
  title: '',
  currentAsset: '',
  history: {}
};
export default compose(withRouter)(Header);
