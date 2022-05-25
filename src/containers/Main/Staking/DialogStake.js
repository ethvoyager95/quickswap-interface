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
const SBtnStake = styled.div`
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

function DialogStake({
  isStakeNFT,
  close,
  itemStaking,
  listStake,
  listUnStake,
  valueNFTStake,
  handleStakeDialog
}) {
  const classes = useStyles();
  const [val, setValue] = useState(valueNFTStake);
  const [messErr, setMessErr] = useState();
  const [, setItemSelect] = useState(itemStaking?.length);
  // const [totalSelect, setTotalSelect] = useState(listStake?.length);
  const [itemStaked, setItemStaked] = useState(listUnStake?.length);
  const [beforeStake, setBeforeStaking] = useState(0);
  const [afterStake, setAfterStake] = useState(0);
  const [checked, setChecked] = useState(false);
  const handleChangeValueStakeNft = useCallback(
    event => {
      if (event.isTrusted) {
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
    }
    if (checked) {
      const MAX_STAKE = MAX_STAKE_NFT - listUnStake.length;
      if (val && val > MAX_STAKE_NFT) {
        setMessErr('Invalid number. You can not stake more than 10 NFTs');
      } else {
        setMessErr('');
      }
      if (val && val > MAX_STAKE) {
        setMessErr(`Invalid number. You can stake only ${MAX_STAKE} NFTs`);
      } else {
        setMessErr('');
      }
      if (val === '') {
        setMessErr('');
      }
      if (val === 0) {
        setMessErr('Invalid amount');
      }
    } else {
      const listIds = _.map(listStake, 'token_id');
      if (val && !_.includes(listIds, val)) {
        setMessErr('Invalid tokenID');
      } else {
        setMessErr('');
      }
    }
  }, [val, isStakeNFT, listStake, checked]);
  return (
    <>
      <React.Fragment>
        <Dialog className={classes.root} open={isStakeNFT} onClose={close}>
          <SMain>
            <STitle>Stake NFT</STitle>
            {checked ? (
              <STitleInput>
                Please input total number NFTs you want to stake
              </STitleInput>
            ) : (
              <STitleInput>Please input your NFT ID</STitleInput>
            )}
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
                onChange={event => handleChangeValueStakeNft(event)}
              />
              <Switch checked={checked} onChange={onChangeSwitch} />;
            </SInput>
            {messErr && <SError>{messErr}</SError>}
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
                    <STextBox>Staked NFT</STextBox>
                    <SValueBox>0/{itemStaked}</SValueBox>
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
                      <STextBox>Before staking</STextBox>
                      <SValueBox>{beforeStake}%</SValueBox>
                    </SRowBox>
                    <SRowBox>
                      <STextBox>After staking</STextBox>
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
          </SMain>
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
  valueNFTStake: PropTypes.number,
  handleStakeDialog: PropTypes.func
};

DialogStake.defaultProps = {
  close: func,
  isStakeNFT: false,
  itemStaking: [],
  listStake: [],
  listUnStake: [],
  valueNFTStake: 0,
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
