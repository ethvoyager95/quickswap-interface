import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
// import { Input } from 'antd';
import arrowRightImg from 'assets/img/arrow-right.png';

const HeaderWrapper = styled.div`
  height: 50px;
  margin: 20px 15px 0;
  .title-wrapper {
    img {
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

  .apr {
    font-size: 18px;
  }

  @media only screen and (max-width: 768px) {
    display: none;

    .apr {
      font-size: 15px;
    }
  }
`;

function Header({ title, apr, history }) {
  const handleRoute = () => {
    if (title === 'Overview' || title === 'Details') {
      history.go(-1);
    }
    if (title === 'Market') {
      history.push('/market');
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
          title === 'Market') && <img src={arrowRightImg} alt="arrow-left" />}
        <p
          className={`${
            title === 'Overview' || title === 'Details' ? 'highlight' : ''
          }`}
        >
          {title}
        </p>
      </div>
      {apr !== '' && <div className="flex align-center apr">APR: {apr}%</div>}
    </HeaderWrapper>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  apr: PropTypes.string,
  history: PropTypes.object
};

Header.defaultProps = {
  title: '',
  apr: '',
  history: {}
};
export default compose(withRouter)(Header);
