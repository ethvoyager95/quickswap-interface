import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import errorIcon from 'assets/img/err_modal.svg';
import iconSuccess from 'assets/img/success.svg';
import iconCopy from 'assets/img/copy.svg';
import iconLink from 'assets/img/link.svg';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CustomModal, ModalLoadingContent } from './style';
import { getShortAddress } from './helper';
import './overide.scss';

function ModalLoading({ isOpenModal, onCancel, action, type, txh }) {
  const [copySuccess, setCopySuccess] = useState('');

  const copyToClipBoard = () => {
    setCopySuccess('Copied!');
    setTimeout(() => {
      setCopySuccess('');
    }, 2000);
  };

  return (
    <CustomModal
      centered
      width="535px"
      visible={isOpenModal}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
      loading
    >
      <ModalLoadingContent>
        {type === 'loading' && (
          <>
            <LoadingSpinner size={80} />
            <div className="title">{action}</div>
          </>
        )}
        {type === 'reject' && (
          <>
            <img src={errorIcon} alt="" />
            <div className="content">
              <div className="title">Decline transaction</div>
              <div className="sub-title">
                You have declined the transaction in your wallet
              </div>
            </div>
          </>
        )}
        {type === 'other error' && (
          <>
            <img src={errorIcon} alt="" />
            <div className="content">
              <div className="title">Something went wrong</div>
            </div>
          </>
        )}
        {type === 'transaction fail' && (
          <>
            <img src={errorIcon} alt="" />
            <div className="content">
              <div className="title">Liquidate failed</div>
              <div className="sub-title">Your transaction has been failed</div>
            </div>
            <div className="txh-wrapper">
              {getShortAddress(txh)}
              <CopyToClipboard
                text={txh}
                onCopy={() => {
                  copyToClipBoard();
                }}
              >
                <img className="icon-copy" src={iconCopy} alt="" />
              </CopyToClipboard>
              {copySuccess && <div>{copySuccess}</div>}
            </div>
            <a
              className="link"
              target="_blank"
              rel="noreferrer"
              href={`${process.env.REACT_APP_ETH_EXPLORER}/tx/${txh}`}
            >
              View on explorer
              <img src={iconLink} alt="" />
            </a>
          </>
        )}
        {type === 'transaction success' && (
          <>
            <img src={iconSuccess} alt="" />
            <div className="content">
              <div className="title">Liquidate successfully</div>
              <div className="sub-title">
                Your transaction has been executed successfully
              </div>
            </div>
            <div className="txh-wrapper">
              {getShortAddress(txh)}
              <CopyToClipboard
                text={txh}
                onCopy={() => {
                  copyToClipBoard();
                }}
              >
                <img className="icon-copy" src={iconCopy} alt="" />
              </CopyToClipboard>
              {copySuccess && <div>{copySuccess}</div>}
            </div>
            <a
              className="link"
              target="_blank"
              rel="noreferrer"
              href={`${process.env.REACT_APP_ETH_EXPLORER}/tx/${txh}`}
            >
              View on explorer
              <img src={iconLink} alt="" />
            </a>
          </>
        )}
      </ModalLoadingContent>
    </CustomModal>
  );
}

ModalLoading.propTypes = {
  isOpenModal: PropTypes.bool,
  onCancel: PropTypes.func,
  action: PropTypes.string,
  type: PropTypes.string,
  txh: PropTypes.string
};

ModalLoading.defaultProps = {
  isOpenModal: false,
  onCancel: {},
  action: '',
  type: '',
  txh: ''
};

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
)(ModalLoading);
