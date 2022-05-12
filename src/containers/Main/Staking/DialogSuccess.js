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
      height: '450px'
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
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 800;
  font-size: 28px;
  line-height: 33px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.015em;
  color: rgba(0, 28, 78, 0.87);
`;
const SText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  letter-spacing: 0.25px;
  color: #141414;
`;
const SImg = styled.img``;
const SLink = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-beetween;
`;
const SView = styled.div``;
const SCopy = styled.div``;
function DialogSuccess({ isShow, text, close }) {
  const classes = useStyles();

  return (
    <>
      <React.Fragment>
        <Dialog className={classes.root} open={isShow} onClose={close}>
          <SMain>
            <STitle>{text}</STitle>
            <SImg />
            <SLink>
              <SView>View on explorer</SView>
              <SCopy>Copy Address</SCopy>
            </SLink>
            <SText>Your transaction has been executed successfully</SText>
          </SMain>
        </Dialog>
      </React.Fragment>
    </>
  );
}
DialogSuccess.propTypes = {
  close: PropTypes.func,
  isShow: PropTypes.bool,
  text: PropTypes.string
};

DialogSuccess.defaultProps = {
  close: func,
  isShow: false,
  text: ''
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
)(DialogSuccess);
