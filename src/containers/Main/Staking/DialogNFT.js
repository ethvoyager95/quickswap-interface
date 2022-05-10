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
      width: '475px',
      color: '#ffffff',
      height: '250px'
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
  margin: 0 20px;
`;
const STitle = styled.div`
  color: #333;
  text-align: center;
  margin-top: 30px;
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 33px;
`;
const SRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
const SInput = styled.div`
  color: #333;
  margin-top: 20px;
  text-align: left;
  padding: 8px;
  border: 1px solid #ccc !important;
  border-radius: 8px;
  width: 100%;
`;

const SText = styled.div`
  color: #001c4e;
  font-weight: 400;
  font-size: 18px;
  line-height: 33px;
`;
const SValue = styled.div`
  color: #001c4e;
  font-weight: 400;
  font-size: 18px;
  line-height: 33px;
`;
const SConfirm = styled.div`
  cursor: pointer;
  cursor: pointer;
  background: #ffffff;
  color: #107def;
  border-radius: 50px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  margin-right: 10px;
  margin: auto;
  box-shadow: 0px 2px 6px rgba(68, 68, 68, 0.5);
  @media only screen and (max-width: 768px) {
    min-width: 150px;
  }
`;
function DialogNFT({ isStakeNFT, text, close, value }) {
  const classes = useStyles();
  return (
    <>
      <React.Fragment>
        <Dialog className={classes.root} open={isStakeNFT} onClose={close}>
          <SMain>
            <STitle>{text}</STitle>
            <SRow>
              <SInput>{value}</SInput>
            </SRow>

            <SRow>
              <SText>Available Balance</SText>
              <SValue>1000.52</SValue>
            </SRow>
            <SRow>
              <SText>Staked</SText>
              <SValue>322.25 </SValue>
            </SRow>
            <SRow>
              <SConfirm onClick={close}>Confirm</SConfirm>
            </SRow>
          </SMain>
        </Dialog>
      </React.Fragment>
    </>
  );
}
DialogNFT.propTypes = {
  text: PropTypes.string,
  close: PropTypes.func,
  isStakeNFT: PropTypes.bool,
  value: PropTypes.number
};

DialogNFT.defaultProps = {
  text: '',
  close: func,
  isStakeNFT: false,
  value: 0
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
)(DialogNFT);
