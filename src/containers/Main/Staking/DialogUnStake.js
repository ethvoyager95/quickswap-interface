import { Dialog, makeStyles } from '@material-ui/core';
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes, { func } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import styled from 'styled-components';
import { Row, Col, Switch } from 'antd';
import _ from 'lodash';
import IconClose from '../../../assets/img/close.svg';
import { MAX_STAKE_NFT, LIST_BLOCK_VALUE } from './helper';

const useStyles = makeStyles({
  root: {
    '& .MuiDialog-paper': {
      borderRadius: '20px',
      position: 'relative',
      width: '700px',
      color: '#ffffff'
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
const SWrapper = styled.div`
  overflow-y: auto;
  /* width */
  &::-webkit-scrollbar {
    width: 7px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    -webkit-border-radius: 3px;
    background-color: var(--color-blue);
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #539ef9;
  }

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }
`;
const SMain = styled.div`
  padding: 0 20px;
`;
const SMainColor = styled.div`
  padding: 0 20px 50px 20px;
  background: #eceff9;
  margin-top: 20px;
`;

const STitle = styled.div`
  color: #0b0f23;
  text-align: center;
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 33px;
  @media only screen and (max-width: 768px) {
    font-size: 22px;
  }
`;
const SRowText = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 30px 0 20px 0;
  align-items: center;
`;
const STack = styled.div`
  color: #6d6f7b;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  button {
    margin-right: 10px;
  }
  @media only screen and (max-width: 768px) {
    font-size: 12px;
    min-width: 100px;
  }
`;
const STitleInput = styled.div`
  color: #6d6f7b;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const SBox = styled.div`
  width: 100%;
  margin-top: 30px;
  display: block;
`;
const SRowBox = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  display: flex;
  align-items: center;
  letter-spacing: 0.1px;
  color: #141414;
  display: flex;
  justify-content: space-between;
  ul {
    padding: 0 0 0 20px;
    width: 100%;
  }
`;
const SColBox = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  display: flex;
  align-items: center;
  letter-spacing: 0.1px;
  color: #141414;
  display: flex;
  margin-bottom: 5px;
  ul {
    padding: 0 0 0 20px;
    width: 100%;
  }
`;
const SRowBoxText = styled.div`
  color: #0b0f23;
  font-weight: 900;
  font-size: 16px;
  line-height: 24px;
  margin-top: 10px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const STextBox = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  display: flex;
  align-items: center;
  letter-spacing: 0.1px;
  color: #0b0f23;
  margin-left: 10px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const SValueBox = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: right;
  letter-spacing: 0.1px;
  color: #0b0f23;
`;
const SCircle = styled.div`
  width: 5px;
  height: 5px;
  background: #0b0f23;
  border-radius: 50%;
  margin-right: 10px;
`;
const SUl = styled.div`
  margin-left: 15px;
`;
const SBtn = styled.div`
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const SBtnCancel = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #107def;
  background: #ffffff;
  border-radius: 8px;
  padding: 15px 12px;
  display: flex;
  justify-content: center;
  width: 150px;
  margin-left: 10px;
  cursor: pointer;
  border: 1px solid #fff;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
    padding: 10px 12px;
  }
`;
const SBtnUnStake = styled.button`
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #f84960;
  background: #eceff9;
  border: 1px solid #f84960;
  border-radius: 8px;
  padding: 15px 12px;
  display: flex;
  justify-content: center;
  width: 150px;
  cursor: pointer;
  margin-left: 10px;
  outline: none;
  :disabled {
    color: #fff !important;
    :hover {
      background-color: #d3d3d3 !important;
    }
  }
  &:hover {
    background: #eceff9 !important;
  }
  @media only screen and (max-width: 768px) {
    font-size: 14px;
    padding: 10px 12px;
  }
`;
const SInput = styled.div`
  position: relative;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  input {
    color: #6d6f7b;
    border: 1px solid #ccc !important;
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    outline: none;
    &:hover,
    &:active,
    &:focus,
    &:focus-visible {
      border: 1px solid #ccc !important;
      outline: none;
    }
  }

  @media only screen and (max-width: 768px) {
    input {
      margin-right: 20px;
    }
  }
`;
const SError = styled.div`
  color: #e80e0e;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 23px;
`;
const SIcon = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;
const SIconClose = styled.img`
  cursor: pointer;
`;
const PERCENT = 10;

function DialogUnStake({
  isUnStakeNFT,
  close,
  itemStaked,
  list,
  valueNFTUnStake,
  currentNFT,
  handleUnStakeDialog,
  address
}) {
  const [val, setValue] = useState(valueNFTUnStake);
  const [messErr, setMessErr] = useState();
  const [, setItemSelect] = useState(0);
  const [totalSelect] = useState(MAX_STAKE_NFT);
  const [beforeUnStake, setBeforeUnStake] = useState(0);
  const [afterUnStake, setAfterUnStake] = useState(0);
  const [currentNFTAmount, setCurrentNFTAmount] = useState(0);
  const [checked, setChecked] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);

  const handleChangeValueUnStakeNft = useCallback(
    event => {
      if (event.isTrusted) {
        // eslint-disable-next-line no-useless-escape
        const re = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (!re.test(event.target.value)) {
          const valueFormat = event.target.value;
          setValue(valueFormat);
        } else {
          setValue('');
        }
      }
    },
    [val]
  );
  const onChangeSwitch = check => {
    setChecked(check);
    setValue('');
  };
  useEffect(() => {
    setItemSelect(itemStaked.length);
    const ITEM_STAKE = list.length;

    const listIds = _.map(list, 'token_id');
    if (checked) {
      if (val === '') {
        setBeforeUnStake(ITEM_STAKE * PERCENT);
        setAfterUnStake(ITEM_STAKE * PERCENT);
      } else {
        setBeforeUnStake(PERCENT * ITEM_STAKE);
        const value_after_unstake = PERCENT * ITEM_STAKE - val * PERCENT;
        setAfterUnStake(value_after_unstake);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (val === '' || (val && !_.includes(listIds, val))) {
        setBeforeUnStake(ITEM_STAKE * PERCENT);
        setAfterUnStake(ITEM_STAKE * PERCENT);
      } else {
        setBeforeUnStake(PERCENT * ITEM_STAKE);
        setAfterUnStake(PERCENT * ITEM_STAKE - PERCENT);
      }
    }
  }, [itemStaked, list, isUnStakeNFT, checked, val, address]);

  useEffect(() => {
    if (val === '') {
      setMessErr('');
      setDisabledBtn(true);
    }
    if (checked) {
      const CURRENT_STAKED = list.length;
      const NUMBER_VAL = Number(val);
      if (val === '') {
        setMessErr('');
        setDisabledBtn(true);
      }
      if (NUMBER_VAL > CURRENT_STAKED) {
        setMessErr(
          `Invalid number. You can only unstake upto ${CURRENT_STAKED} NFTs`
        );
        setDisabledBtn(true);
      } else if (NUMBER_VAL > MAX_STAKE_NFT) {
        setMessErr(`Invalid number. You can not unstake more than 20 NFTs`);
        setDisabledBtn(true);
      } else {
        setMessErr('');
        setDisabledBtn(false);
      }
      if (val === '0' || (val && Number(val) === 0)) {
        setMessErr('Invalid amount');
        setDisabledBtn(true);
      }
    } else {
      const listIds = _.map(list, 'token_id');
      if (val && !_.includes(listIds, val)) {
        setMessErr('Invalid tokenID');
        setDisabledBtn(true);
      } else if (val) {
        setMessErr('');
        setDisabledBtn(false);
      }
    }
  }, [val, isUnStakeNFT, list, checked, address]);
  useEffect(() => {
    setValue(valueNFTUnStake);
    setCurrentNFTAmount(currentNFT);
  }, [valueNFTUnStake, isUnStakeNFT, currentNFT, address]);
  const classes = useStyles();
  return (
    <>
      <React.Fragment>
        <Dialog
          className={classes.root}
          open={isUnStakeNFT}
          onClose={reason => {
            if (reason === 'backdropClick') {
              close();
            }
          }}
        >
          <SWrapper>
            <SMain>
              <SIcon>
                <SIconClose src={IconClose} onClick={close} />
              </SIcon>
              <STitle>Unstake NFT</STitle>
              <SRowText>
                {checked ? (
                  <STitleInput>
                    Please input total number NFTs you want to unstake
                  </STitleInput>
                ) : (
                  <STitleInput>Please input your NFT ID</STitleInput>
                )}
                <STack>
                  <Switch checked={checked} onChange={onChangeSwitch} />
                  Stack
                </STack>
              </SRowText>
              <SInput>
                <input
                  type="number"
                  value={val}
                  inputMode="decimal"
                  pattern="^[0-9]*[]?[0-9]*$"
                  min={0}
                  minLength={1}
                  maxLength={79}
                  placeholder="Enter a number"
                  onChange={event => handleChangeValueUnStakeNft(event)}
                  onKeyPress={event => {
                    if (_.includes(LIST_BLOCK_VALUE, event.which)) {
                      event.preventDefault();
                    }
                  }}
                />
              </SInput>
              {messErr && <SError>{messErr}</SError>}
            </SMain>
            <SMainColor>
              <SBox>
                <Row>
                  <Col xs={{ span: 8 }} lg={{ span: 10 }}>
                    <SColBox>
                      <SRowBoxText>Staked NFT</SRowBoxText>
                    </SColBox>
                    <SValueBox>
                      {currentNFTAmount}/{totalSelect}
                    </SValueBox>
                  </Col>
                  <Col xs={{ span: 0 }} lg={{ span: 2 }}>
                    {}
                  </Col>
                  <Col xs={{ span: 16 }} lg={{ span: 10 }}>
                    <SUl>
                      <SRowBoxText>Boost APR:</SRowBoxText>

                      <SRowBox>
                        <STextBox>
                          <SCircle />
                          Before unstaking
                        </STextBox>
                        <SValueBox>{beforeUnStake}%</SValueBox>
                      </SRowBox>
                      <SRowBox>
                        <STextBox>
                          <SCircle />
                          After unstaking
                        </STextBox>
                        {afterUnStake && afterUnStake <= 0 ? (
                          <>
                            <SValueBox>-</SValueBox>
                          </>
                        ) : (
                          <>
                            <SValueBox>{afterUnStake}%</SValueBox>
                          </>
                        )}
                      </SRowBox>
                    </SUl>
                  </Col>
                </Row>
              </SBox>
              <SBox>
                <Row>
                  <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                    <SBtn>
                      <SBtnCancel onClick={close}>Cancel</SBtnCancel>
                      <SBtnUnStake
                        disabled={disabledBtn}
                        onClick={event =>
                          handleUnStakeDialog(val, event, checked, messErr)
                        }
                      >
                        Unstake
                      </SBtnUnStake>
                    </SBtn>
                  </Col>
                </Row>
              </SBox>
            </SMainColor>
          </SWrapper>
        </Dialog>
      </React.Fragment>
    </>
  );
}
DialogUnStake.propTypes = {
  close: PropTypes.func,
  isUnStakeNFT: PropTypes.bool,
  itemStaked: PropTypes.array,
  list: PropTypes.array,
  valueNFTUnStake: PropTypes.string,
  currentNFT: PropTypes.number,
  handleUnStakeDialog: PropTypes.func,
  address: PropTypes.string
};

DialogUnStake.defaultProps = {
  close: func,
  isUnStakeNFT: false,
  itemStaked: [],
  list: [],
  valueNFTUnStake: '',
  currentNFT: 0,
  handleUnStakeDialog: func,
  address: ''
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
)(DialogUnStake);
