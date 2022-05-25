import { Dialog, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PropTypes, { func } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import styled from 'styled-components';
import { Row, Col, Switch } from 'antd';
import _ from 'lodash';

const useStyles = makeStyles({
  root: {
    '& .MuiDialog-paper': {
      borderRadius: '20px',
      position: 'relative',
      width: '700px',
      color: '#ffffff',
      height: '600px'
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
// const SItem = styled.div`
//   widht: 100%;
// `;
const STitle = styled.div`
  color: #333;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 33px;
  @media only screen and (max-width: 768px) {
    font-size: 22px;
  }
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
//   padding: 0 0 20px 0;
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
  height: 130px;
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
  border: 1px solid #107def;
`;
const SBtnUnStake = styled.div`
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
  padding: 6px 12px;
  display: flex;
  justify-content: center;
  width: 120px;
  cursor: pointer;
  margin-left: 10px;
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
    width: 450px;
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
      width: 300px;
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
const PERCENT = 20;

function DialogUnStake({
  isUnStakeNFT,
  close,
  itemStaked,
  list,
  valueNFTUnStake,
  handleUnStakeDialog
}) {
  const [val, setValue] = useState(valueNFTUnStake);
  const [messErr, setMessErr] = useState();
  const [, setItemSelect] = useState(0);
  const [totalSelect, setTotalSelect] = useState(0);
  const [beforeUnStake, setBeforeUnStake] = useState(0);
  const [afterUnStake, setAfterUnStake] = useState(0);
  const [checked, setChecked] = useState(false);
  const handleChangeValueUnStakeNft = event => {
    const numberDigitsRegex = /^\d*(\.\d{0,18})?$/g;
    if (!numberDigitsRegex.test(event.target.value)) {
      return;
    }
    if (event.target.value < 0) {
      setValue(0);
    } else {
      const valueFormat = event?.target.value.replace(/,/g, '.');
      setValue(valueFormat);
    }
  };
  const onChangeSwitch = check => {
    setChecked(check);
    setValue('');
  };
  useEffect(() => {
    setItemSelect(itemStaked.length);
    setTotalSelect(list.length);
    const ITEM_STAKE = list.length;

    const listIds = _.map(list, 'token_id');
    if (checked) {
      if (val === '') {
        setBeforeUnStake(ITEM_STAKE * PERCENT);
        setAfterUnStake(ITEM_STAKE * PERCENT);
      } else {
        setBeforeUnStake(PERCENT * ITEM_STAKE);
        setAfterUnStake(PERCENT * ITEM_STAKE - val * PERCENT);
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
  }, [itemStaked, list, isUnStakeNFT, checked, val]);

  useEffect(() => {
    if (val === '') {
      setMessErr('');
    }
    if (checked) {
      const MAX_UNSTAKE = list.length;
      if (val && val > MAX_UNSTAKE) {
        setMessErr(
          `Invalid number. You can only unstake upto ${MAX_UNSTAKE} NFTs`
        );
      } else {
        setMessErr('');
      }
      if (val === '') {
        setMessErr('');
      }
    } else {
      const listIds = _.map(list, 'token_id');
      if (val && !_.includes(listIds, val)) {
        setMessErr('Invalid tokenID');
      } else {
        setMessErr('');
      }
    }
  }, [val, isUnStakeNFT, list, checked]);

  const classes = useStyles();
  return (
    <>
      <React.Fragment>
        <Dialog className={classes.root} open={isUnStakeNFT} onClose={close}>
          <SMain>
            <STitle>Unstake NFT</STitle>
            <SInput>
              <input
                type="text"
                value={val}
                inputMode="decimal"
                pattern="^[0-9]*[.,]?[0-9]*$"
                min={0}
                minLength={1}
                maxLength={79}
                placeholder="Enter a number"
                onChange={event => handleChangeValueUnStakeNft(event)}
              />
              <Switch checked={checked} onChange={onChangeSwitch} />;
            </SInput>
            {messErr && <SError>{messErr}</SError>}
            {/* <SCount>{itemStaked.length} items</SCount>
            <SItem>
              {itemStaked?.map(item => {
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
                    <STextBox>Staked NFT</STextBox>
                    <SValueBox>0/{totalSelect}</SValueBox>
                  </SRowBox>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 2 }}>
                  {}
                </Col>

                <Col xs={{ span: 24 }} lg={{ span: 10 }}>
                  <SRowBox>
                    <div style={{ color: '#333' }}>Boost APR</div>
                  </SRowBox>
                  <SUl>
                    <SRowBox>
                      <STextBox>Before unStaking</STextBox>
                      <SValueBox>{beforeUnStake}%</SValueBox>
                    </SRowBox>
                    <SRowBox>
                      <STextBox>After unStaking</STextBox>
                      <SValueBox>{afterUnStake}%</SValueBox>
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
                      onClick={event =>
                        handleUnStakeDialog(val, event, checked, messErr)
                      }
                    >
                      UnStake
                    </SBtnUnStake>
                  </SBtn>
                </Col>
              </Row>
            </SBox>
          </SMain>
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
  valueNFTUnStake: PropTypes.number,
  handleUnStakeDialog: PropTypes.func
};

DialogUnStake.defaultProps = {
  close: func,
  isUnStakeNFT: false,
  itemStaked: [],
  list: [],
  valueNFTUnStake: 0,
  handleUnStakeDialog: func
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
