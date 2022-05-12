import { Dialog, makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes, { func } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import styled from 'styled-components';

const useStyles = makeStyles({
  root: {
    '& .MuiDialog-paper': {
      borderRadius: '20px',
      position: 'relative',
      width: '700px',
      color: '#ffffff',
      height: '300px'
    }
  },
  closeBtn: {
    position: 'absolute',
    top: 25,
    right: 25,
    cursor: 'pointer',
    zIndex: 9999
  },
  title: {
    fontWeight: 700,
    fontSize: '24px',
    lineHeight: '29.26px',
    textAlign: 'center'
  },
  content: {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '18px',
    color: 'rgba(255, 255, 255, 0.6)',
    background: '#FCFCFD'
  },
  btn: {
    textTransform: 'none',
    height: 36,
    color: '#100F24',
    background: '#71CEF3',
    borderRadius: '5px'
  },
  disable: {
    textTransform: 'none',
    height: 36,
    color: '#100F24',
    background: '#333 !important',
    borderRadius: '5px'
  }
});
const SMain = styled.div`
  margin: 30px 0;
`;

const STitle = styled.div`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 800;
  font-size: 28px;
  line-height: 33px;
  letter-spacing: 0.015em;
  color: rgba(0, 28, 78, 0.87);
  display: block;
  margin: 20px 0;
  width: 100%;
  text-align: center;
`;
const SLoading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SDivLoader = styled.div`
  border: 8px solid #1efcf1;
  border-radius: 50%;
  border-top: 8px solid #4f4c6d;
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
const SText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: #141414;
  text-align: center;
  display: block;
  margin-top: 20px;
`;
const LoaddingCircle = () => {
  return (
    <>
      <SDivLoader />
    </>
  );
};
function DialogConfirm({ isConfirm, close }) {
  const classes = useStyles();

  return (
    <>
      <React.Fragment>
        <Dialog className={classes.root} open={isConfirm} onClose={close}>
          <SMain>
            <STitle>Waiting for confirmation</STitle>
            <SLoading>
              <LoaddingCircle />
            </SLoading>
            <SText>Please confirm your transaction in your wallet</SText>
          </SMain>
        </Dialog>
      </React.Fragment>
    </>
  );
}
DialogConfirm.propTypes = {
  close: PropTypes.func,
  isConfirm: PropTypes.bool
};

DialogConfirm.defaultProps = {
  close: func,
  isConfirm: false
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
)(DialogConfirm);
