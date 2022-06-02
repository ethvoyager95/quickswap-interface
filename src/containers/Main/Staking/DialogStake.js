/* eslint-disable no-useless-return */
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
import { MAX_STAKE_NFT, LIST_BLOCK_VALUE } from './helper';
import IconClose from '../../../assets/img/close.svg';

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
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;
const SRowBoxTextApr = styled.div`
  color: #0b0f23;
  font-weight: 900;
  font-size: 16px;
  line-height: 24px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
    margin-left: 5%;
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
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const SCircle = styled.div`
  width: 5px;
  height: 5px;
  background: #0b0f23;
  border-radius: 50%;
  margin-right: 10px;
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
const SBtnStake = styled.button`
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #fff;
  background: #107def;
  border-radius: 8px;
  padding: 15px 12px;
  display: flex;
  justify-content: center;
  width: 150px;
  margin-left: 10px;
  cursor: pointer;
  outline: none;
  border: none;
  box-shadow: 0px 3px 20px rgba(18, 114, 236, 0.4);
  border-radius: 8px;
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

function DialogStake({
  isStakeNFT,
  close,
  itemStaking,
  listStake,
  listUnStake,
  valueNFTStake,
  currentNFT,
  handleStakeDialog
}) {
  const classes = useStyles();
  const [val, setValue] = useState(valueNFTStake);
  const [messErr, setMessErr] = useState();
  const [, setItemSelect] = useState(itemStaking?.length);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [totalSelect] = useState(MAX_STAKE_NFT);
  const [currentNFTAmount, setCurrentNFTAmount] = useState(0);
  const [itemStaked, setItemStaked] = useState(listUnStake?.length);
  const [beforeStake, setBeforeStaking] = useState(0);
  const [afterStake, setAfterStake] = useState(0);
  const [checked, setChecked] = useState(false);

  const handleChangeValueStakeNft = useCallback(
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
    setItemSelect(itemStaking.length);
    // setTotalSelect(listStake.length);
    setItemStaked(listUnStake.length);
    const listIds = _.map(listStake, 'token_id');
    if (checked) {
      const ITEM_UNSTAKE = listUnStake.length;
      if (val === '') {
        setBeforeStaking(itemStaked * PERCENT);
        setAfterStake(itemStaked * PERCENT);
      } else if (itemStaked === 0 && val * PERCENT === PERCENT) {
        setBeforeStaking(0);
        setAfterStake(0);
      } else {
        setBeforeStaking(PERCENT * ITEM_UNSTAKE);
        setAfterStake(PERCENT * val + itemStaked * PERCENT);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (val === '' || (val && !_.includes(listIds, val))) {
        setBeforeStaking(itemStaked * PERCENT);
        setAfterStake(itemStaked * PERCENT);
      } else {
        setBeforeStaking(itemStaked * PERCENT);
        setAfterStake(PERCENT + itemStaked * PERCENT);
      }
    }
  }, [itemStaking, listStake, listUnStake, isStakeNFT, checked, val]);

  useEffect(() => {
    // NFT AMOUNT CAN STAKE
    const MAX_STAKE = MAX_STAKE_NFT - listUnStake.length;
    const CURRENT_STAKED = listUnStake.length;
    // NFT CURREN AMOUNT
    const NUMBER_VAL = Number(val);
    const NFT_BEGIN_STAKED = NUMBER_VAL + CURRENT_STAKED;
    if (val === '') {
      setMessErr('');
      setDisabledBtn(true);
    }
    if (checked) {
      if (val === '') {
        setMessErr('');
        setDisabledBtn(true);
      }

      if (itemStaked === 0 && NUMBER_VAL > MAX_STAKE_NFT) {
        setMessErr(`Invalid number. You can not stake more than 20 NFTs`);
        setDisabledBtn(true);
      } else if (itemStaked > 0 && NFT_BEGIN_STAKED > MAX_STAKE_NFT) {
        setMessErr(`Invalid number. You can stake only ${MAX_STAKE} NFTs`);
        setDisabledBtn(true);
      } else if (!val) {
        setMessErr('');
        setDisabledBtn(true);
      } else {
        setMessErr('');
        setDisabledBtn(false);
      }
      if (Number(val) === 0) {
        setMessErr('');
        setDisabledBtn(true);
      }
    } else {
      const listIds = _.map(listStake, 'token_id');
      if (val && !_.includes(listIds, val)) {
        setMessErr('Invalid tokenID');
        setDisabledBtn(true);
      } else if (itemStaked > 0 && NFT_BEGIN_STAKED > MAX_STAKE_NFT) {
        setMessErr(`Invalid number. You can stake only ${MAX_STAKE} NFTs`);
        setDisabledBtn(true);
      } else if (val) {
        setMessErr('');
        setDisabledBtn(false);
      }
    }
  }, [val, isStakeNFT, listStake, checked]);
  useEffect(() => {
    setCurrentNFTAmount(currentNFT);
    setValue(valueNFTStake);
  }, [valueNFTStake, isStakeNFT, currentNFT]);
  return (
    <>
      <React.Fragment>
        <Dialog
          className={classes.root}
          open={isStakeNFT}
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
            <STitle>Stake NFT</STitle>
            <SRowText>
              {checked ? (
                <STitleInput>
                  Please input total number NFTs you want to stake
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
                // pattern="^[0-9]*[.,]?[0-9]*$"
                min={0}
                minLength={1}
                maxLength={79}
                placeholder="Enter a number"
                onChange={event => handleChangeValueStakeNft(event)}
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
                  <SRowBox>
                    <SRowBoxTextApr>Boost APR</SRowBoxTextApr>
                  </SRowBox>
                  <SUl>
                    <SRowBox>
                      <STextBox>
                        <SCircle />
                        Before staking
                      </STextBox>
                      <SValueBox>{beforeStake}%</SValueBox>
                    </SRowBox>

                    <SRowBox>
                      <STextBox>
                        <SCircle />
                        After staking
                      </STextBox>
                      <SValueBox>{afterStake}%</SValueBox>
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
                    <SBtnStake
                      disabled={disabledBtn}
                      onClick={event =>
                        handleStakeDialog(val, event, checked, messErr)
                      }
                    >
                      Stake
                    </SBtnStake>
                  </SBtn>
                </Col>
              </Row>
            </SBox>
          </SMainColor>
        </Dialog>
      </React.Fragment>
    </>
  );
}
DialogStake.propTypes = {
  close: PropTypes.func,
  isStakeNFT: PropTypes.bool,
  itemStaking: PropTypes.array,
  listStake: PropTypes.array,
  listUnStake: PropTypes.array,
  valueNFTStake: PropTypes.string,
  currentNFT: PropTypes.number,
  handleStakeDialog: PropTypes.func
};

DialogStake.defaultProps = {
  close: func,
  isStakeNFT: false,
  itemStaking: [],
  listStake: [],
  listUnStake: [],
  valueNFTStake: '',
  currentNFT: 0,
  handleStakeDialog: func
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
)(DialogStake);
