import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import styled from 'styled-components';

const SDivLoader = styled.div`
  border: 8px solid #107def;
  border-radius: 50%;
  border-top: 8px solid #d7d7d7;
  width: 100px;
  height: 100px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const SDIV = styled.div`
  margin: auto;
  display: flex;
  justify-content: center;
`;
const LoaddingCircle = () => {
  return (
    <>
      <SDIV>
        <SDivLoader />
      </SDIV>
    </>
  );
};
function Loadding() {
  return (
    <>
      <React.Fragment>
        <LoaddingCircle />
      </React.Fragment>
    </>
  );
}
Loadding.propTypes = {};

Loadding.defaultProps = {};

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
)(Loadding);
