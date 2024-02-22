import { Dialog, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PropTypes, { func } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { connectAccount, accountActionCreators } from 'core';
import ErrIcon from '../../../assets/img/err_modal.svg';
import IconClose from '../../../assets/img/close.svg';

const useStyles = makeStyles({
  root: {
    '& .MuiDialog-paper': {
      borderRadius: '20px',
      position: 'relative',
      width: '700px',
      color: '#ffffff',
      height: '320px',
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
  text-align: center;
  letter-spacing: 0.015em;
  width: 100%;
  display: block;
  @media only screen and (max-width: 768px) {
    font-size: 22px;
  }
`;
const SText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: var(--color-text-secondary);
  text-align: center;
  width: 100%;
  display: block;
  margin-top: 20px;
`;
const SImg = styled.img`
  margin: 30px auto;
  display: block;
`;
const SIcon = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
`;
const SIconClose = styled.img`
  cursor: pointer;
`;
function DialogErr({ isShow, text, close }) {
  const classes = useStyles();
  const [notDeclined, setNotIsDeClined] = useState(false);
  useEffect(() => {
    if (text.includes('Some thing went wrong')) {
      setNotIsDeClined(true);
    } else {
      setNotIsDeClined(false);
    }
  }, [text]);
  return (
    <>
      <React.Fragment>
        <Dialog
          className={classes.root}
          open={isShow}
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
            <SImg src={ErrIcon} />
            <STitle>
              <FormattedMessage id={text} />
            </STitle>
            {!notDeclined ? (
              <SText>
                <FormattedMessage id="You_have_declined_transaction_wallet" />
              </SText>
            ) : (
              <SText />
            )}
          </SMain>
        </Dialog>
      </React.Fragment>
    </>
  );
}
DialogErr.propTypes = {
  close: PropTypes.func,
  text: PropTypes.string,
  isShow: PropTypes.bool
};

DialogErr.defaultProps = {
  close: func,
  text: '',
  isShow: false
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
)(DialogErr);
