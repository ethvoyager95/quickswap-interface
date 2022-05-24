import { Dialog, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PropTypes, { func } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import styled from 'styled-components';
import IconSuccess from '../../../assets/img/success.svg';
import IconClose from '../../../assets/img/close.svg';
import IconCopy from '../../../assets/img/copy.svg';
import IconLink from '../../../assets/img/link.svg';

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
  letter-spacing: 0.015em;
  color: rgba(0, 28, 78, 0.87);
  text-align: center;
  margin-top: 20px;
`;
const SText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: #141414;
  text-align: center;
  margin-top: 20px;
`;
const SImg = styled.img``;
const SLink = styled.div`
  width: 100%;
  display: block;
  margin: auto;
`;
const SView = styled.div``;
const SCopy = styled.div`
  background: #eeeeee;
  border-radius: 8px;
  padding: 5px 10px;
`;
const SAddress = styled.div`
  font-size: 18px;
  line-height: 28px;
  color: #0b0f23;
  text-align: center;
  display: flex;
  justify-content: space-around;
`;
const SNoti = styled.div`
  color: #0b0f23;
  font-size: 14px;
`;
const SIcon = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;
const SIconCopy = styled.img`
  cursor: pointer;
`;
const SIconClose = styled.img`
  cursor: pointer;
`;

const SIconSucsess = styled.img`
  margin: auto;
  display: block;
`;
const SGoto = styled.a`
  font-weight: 900;
  font-size: 16px;
  line-height: 24px;
  color: #107def;
  text-align: center;
  width: 100%;
  display: block;
  margin-top: 20px;
  cursor: pointer;
`;
const SHrefIcon = styled.img`
  margin-left: 10px;
  cursor: pointer;
`;
const ChainId = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4
};
const explorers = {
  etherscan: (link, data, type) => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`;
      default:
        return `${link}/${type}/${data}`;
    }
  }
};
const chains = {
  [ChainId.MAINNET]: {
    link: 'https://etherscan.io',
    builder: explorers.etherscan
  },
  [ChainId.ROPSTEN]: {
    link: 'https://ropsten.etherscan.io',
    builder: explorers.etherscan
  },
  [ChainId.RINKEBY]: {
    link: 'https://rinkeby.etherscan.io',
    builder: explorers.etherscan
  }
};
function DialogSuccess({ isSuccess, close, address, txh }) {
  const classes = useStyles();
  const [copySuccess, setCopySuccess] = useState('');
  const [chainId, setChainId] = useState('');
  const copyToClipBoard = async copyMe => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess('Copied!');
      setInterval(() => {
        setCopySuccess('');
      }, 1500);
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };
  const getEthScanLink = (id, data, type) => {
    const chain = chains[id];

    if (!chain) {
      return '';
    }
    return chain.builder(chain.link, data, type);
  };
  const getChainId = async () => {
    const netId = window.ethereum.networkVersion
      ? +window.ethereum.networkVersion
      : +window.ethereum.chainId;
    setChainId(netId);
  };
  useEffect(() => {
    getChainId();
  }, []);
  return (
    <>
      <React.Fragment>
        <Dialog className={classes.root} open={isSuccess} onClose={close}>
          <SMain>
            <SIcon>
              <SIconClose src={IconClose} onClick={close} />
            </SIcon>
            <SIconSucsess src={IconSuccess} />
            <STitle>Stake STRK successfully</STitle>
            <SImg />
            <SLink>
              <SView>View on explorer</SView>
              <SCopy>
                <SAddress>
                  {address}
                  <SIconCopy
                    src={IconCopy}
                    onClick={() => copyToClipBoard(address)}
                  />
                  <SNoti>{copySuccess}</SNoti>
                </SAddress>
              </SCopy>
            </SLink>
            <SText>Your transaction has been executed successfully</SText>
            <SGoto
              target="_blank"
              href={getEthScanLink(chainId, txh, 'transaction')}
            >
              View on explorer
              <SHrefIcon src={IconLink} />
            </SGoto>
          </SMain>
        </Dialog>
      </React.Fragment>
    </>
  );
}
DialogSuccess.propTypes = {
  close: PropTypes.func,
  isSuccess: PropTypes.bool,
  address: PropTypes.string,
  txh: PropTypes.string
};

DialogSuccess.defaultProps = {
  close: func,
  isSuccess: false,
  address: '',
  txh: ''
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
