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
import { MAX_STAKE_NFT } from './helper';
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
// const SItem = styled.div`
//   widht: 100%;
// `;
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
  margin: 10px 0 20px 0;
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
`;
const STitleInput = styled.div`
  color: #6d6f7b;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
`;
// const SCount = styled.div`
//   font-style: normal;
//   font-weight: 700;
//   font-size: 18px;
//   line-height: 32px;
//   display: flex;
//   align-items: center;
//   color: #141414;
// `;
// const SRow = styled.div`
//   display: flex;
//   width: 100%;
//   justify-content: space-between;
//   border-bottom: 1px solid #5a617d;
//   padding: 20px 0 20px 0;
// `;
// const SLeft = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;
// const SRight = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   font-style: normal;
//   font-weight: 700;
//   font-size: 18px;
//   line-height: 20px;
//   text-align: right;
//   letter-spacing: 0.1px;
//   color: rgba(0, 28, 78, 0.87);
// `;
// const SImg = styled.img`
//   width: 72px;
//   height: 72px;
// `;
// const SDetails = styled.div`
//   color: #001c4e;
//   font-style: normal;
//   font-weight: 700;
//   font-size: 14px;
//   line-height: 32px;
//   margin-left: 15px;
// `;
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
const SRowBoxText = styled.div`
  color: #0b0f23;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
`;
const STextBox = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  display: flex;
  align-items: center;
  letter-spacing: 0.1px;
  color: #141414;
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
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: right;
  letter-spacing: 0.1px;
  color: #141414;
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
  padding: 6px 12px;
  display: flex;
  justify-content: center;
  width: 120px;
  margin-left: 10px;
  cursor: pointer;
  border: 1px solid #fff;
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
  padding: 6px 12px;
  display: flex;
  justify-content: center;
  width: 120px;
  margin-left: 10px;
  cursor: pointer;
  outline: none;
  border: none;
  box-shadow: 0px 3px 20px rgba(18, 114, 236, 0.4);
  border-radius: 8px;
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
const PERCENT = 20;

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
  const [disabledBtn, setDisabledBtn] = useState(false);
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
    if (val === '') {
      setMessErr('');
      setDisabledBtn(false);
    }
    if (checked) {
      if (val === '') {
        setMessErr('');
        setDisabledBtn(false);
      }
      // NFT AMOUNT CAN STAKE
      const MAX_STAKE = MAX_STAKE_NFT - listUnStake.length;
      // NFT CURREN AMOUNT
      const AMOUNT_STAKE = listStake.length;
      const NUMBER_VAL = Number(val);
      if (NUMBER_VAL > AMOUNT_STAKE && NUMBER_VAL < MAX_STAKE_NFT) {
        setMessErr(`Invalid number. You can stake only ${AMOUNT_STAKE} NFTs`);
        setDisabledBtn(true);
      } else if (NUMBER_VAL > MAX_STAKE_NFT) {
        setMessErr(`Invalid number. You can not stake more than 10 NFTs`);
        setDisabledBtn(true);
      } else if (AMOUNT_STAKE > 10 && NUMBER_VAL > MAX_STAKE) {
        setMessErr(`Invalid number. You can stake only ${MAX_STAKE} NFTs`);
        setDisabledBtn(true);
      } else {
        setMessErr('');
        setDisabledBtn(false);
      }
    } else {
      const listIds = _.map(listStake, 'token_id');
      if (val && !_.includes(listIds, val)) {
        setMessErr('Invalid tokenID');
        setDisabledBtn(true);
      } else {
        setMessErr('');
        setDisabledBtn(false);
      }
    }
  }, [val, isStakeNFT, listStake, checked]);
  useEffect(() => {
    setValue(valueNFTStake);
    setCurrentNFTAmount(currentNFT);
  }, [valueNFTStake, isStakeNFT, currentNFT]);
  return (
    <>
      <React.Fragment>
        <Dialog className={classes.root} open={isStakeNFT} onClose={close}>
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
              />
            </SInput>
            {messErr && <SError>{messErr}</SError>}
          </SMain>
          <SMainColor>
            {/* <SCount>{itemStaking.length} items</SCount> */}
            {/* <SItem>
              {itemStaking?.map(item => {
                return (
                  <>
                    <SRow>
                      <SLeft>
                        <SImg src={item.img} />
                        <SDetails>{item.name}</SDetails>
                      </SLeft>
                      <SRight>{item.description}</SRight>
                    </SRow>
                  </>
                );
              })}
            </SItem> */}
            <SBox>
              <Row>
                <Col xs={{ span: 24 }} lg={{ span: 10 }}>
                  {/* <SRowBox>
                    <STextBox>NFT selected</STextBox>
                    <SValueBox>
                      {itemSelect}/{totalSelect}
                    </SValueBox>
                  </SRowBox> */}
                  <SRowBox>
                    <SRowBoxText>Staked NFT</SRowBoxText>
                    <SValueBox>
                      {currentNFTAmount}/{totalSelect}
                    </SValueBox>
                  </SRowBox>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 2 }}>
                  {}
                </Col>

                <Col xs={{ span: 24 }} lg={{ span: 10 }}>
                  <SRowBox>
                    <SRowBoxText>Boost APR</SRowBoxText>
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
