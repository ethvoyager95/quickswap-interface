import { Dialog, makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes, { func } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import styled from 'styled-components';
import IconClose from '../../../assets/img/close.svg';
import Loadding from './Loadding';

const useStyles = makeStyles({
  root: {
    '& .MuiDialog-paper': {
      borderRadius: '20px',
      position: 'relative',
      width: '700px',
      color: '#ffffff',
      background: '#141518'
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
  display: block;
  margin: 20px 0;
  width: 100%;
  text-align: center;
  @media only screen and (max-width: 768px) {
    font-size: 22px;
  }
`;
const SLoading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: var(--color-text-secondary);
  text-align: center;
  display: block;
  margin-top: 20px;
`;
const SIcon = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
`;
const SIconClose = styled.img`
  cursor: pointer;
`;
function DialogConfirm({ isConfirm, close, messConfirm }) {
  const classes = useStyles();
  return (
    <>
      <React.Fragment>
        <Dialog
          className={classes.root}
          open={isConfirm}
          onClose={reason => {
            if (reason === 'backdropClick') {
              close();
            }
          }}
        >
          <SMain>
            <SIcon>
              <SIconClose src={IconClose} onClick={close} />
            </SIcon>

            <SLoading>
              <Loadding />
            </SLoading>
            <STitle>Waiting for confirmation</STitle>
            <SText>Confirming the transaction...</SText>
            {messConfirm && <SText>{messConfirm}</SText>}
          </SMain>
        </Dialog>
      </React.Fragment>
    </>
  );
}
DialogConfirm.propTypes = {
  close: PropTypes.func,
  isConfirm: PropTypes.bool,
  messConfirm: PropTypes.string
};

DialogConfirm.defaultProps = {
  close: func,
  isConfirm: false,
  messConfirm: ''
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
