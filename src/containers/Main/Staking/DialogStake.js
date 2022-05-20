import { Dialog, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PropTypes, { func } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import styled from 'styled-components';
import { Row, Col } from 'antd';

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
const SItem = styled.div`
  widht: 100%;
`;
const STitle = styled.div`
  color: #333;
  text-align: center;
  margin-top: 30px;
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 33px;
`;
const SCount = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 32px;
  display: flex;
  align-items: center;
  color: #141414;
`;
const SRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid #5a617d;
  padding: 20px 0 20px 0;
`;
const SLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
  text-align: right;
  letter-spacing: 0.1px;
  color: rgba(0, 28, 78, 0.87);
`;
const SImg = styled.img`
  width: 72px;
  height: 72px;
`;
const SDetails = styled.div`
  color: #001c4e;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 32px;
  margin-left: 15px;
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
  box-shadow: 0px 3px 20px rgba(18, 114, 236, 0.4);
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
  box-shadow: 0px 3px 20px rgba(18, 114, 236, 0.4);
`;
const PERCENT = 20;
function DialogStake({
  isStakeNFT,
  close,
  itemStaking,
  listStake,
  listUnStake,
  handleStakeDialog
}) {
  const classes = useStyles();
  const [itemSelect, setItemSelect] = useState(itemStaking?.length);
  const [totalSelect, setTotalSelect] = useState(listStake?.length);
  const [itemStaked, setItemStaked] = useState(listUnStake?.length);
  const [beforeStake, setBeforeStaking] = useState(0);
  const [afterStake, setAfterStake] = useState(0);
  useEffect(() => {
    setItemSelect(itemStaking.length);
    setTotalSelect(listStake.length);
    setItemStaked(listUnStake.length);
    setBeforeStaking(PERCENT * itemStaked);
    setAfterStake(PERCENT * itemSelect + itemStaked * PERCENT);
  }, [itemStaking, listStake, listUnStake, isStakeNFT]);
  return (
    <>
      <React.Fragment>
        <Dialog className={classes.root} open={isStakeNFT} onClose={close}>
          <SMain>
            <STitle>Stake NFT</STitle>
            <SCount>{itemStaking.length} items</SCount>
            <SItem>
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
            </SItem>
            <SBox>
              <Row>
                <Col xs={{ span: 24 }} lg={{ span: 10 }}>
                  <SRowBox>
                    <STextBox>NFT selected</STextBox>
                    <SValueBox>
                      {itemSelect}/{totalSelect}
                    </SValueBox>
                  </SRowBox>
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
                    <SBtnStake onClick={handleStakeDialog}>Stake</SBtnStake>
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
  handleStakeDialog: PropTypes.func
};

DialogStake.defaultProps = {
  close: func,
  isStakeNFT: false,
  itemStaking: [],
  listStake: [],
  listUnStake: [],
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
