import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import MainLayout from 'containers/Layout/MainLayout';
import { connectAccount, accountActionCreators } from 'core';
import { Input, Button } from 'antd';
import styled from 'styled-components';

const SearchBar = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 30px;

  .label {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #0b0f23;
    margin-bottom: 12px;
  }

  .address {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    margin-bottom: 16px;

    .message {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #06c270;
    }

    .refresh {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      text-decoration-line: underline;
      color: #6d6f7b;
      align-self: flex-end;
    }
  }

  button {
    width: 228px;
    height: 50px;
    background: #3b54b5;
    border-radius: 8px;
    font-style: normal;
    font-weight: 900;
    font-size: 18px;
    line-height: 25px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function Liquidator() {
  return (
    <MainLayout>
      <SearchBar>
        <div className="label">Search address to liquidate</div>
        <div className="address">
          <Input.Group compact>
            <Input />
          </Input.Group>
          <Button>Recent Liquidations</Button>
        </div>
        <div className="address">
          <div className="message">This account can be liquidated</div>
          <div className="refresh">Refresh</div>
        </div>
      </SearchBar>
    </MainLayout>
  );
}

Liquidator.propTypes = {};

Liquidator.defaultProps = {};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { setSetting } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Liquidator);
