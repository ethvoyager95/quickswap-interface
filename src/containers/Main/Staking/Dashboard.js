import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import _ from 'lodash';
import LogoFlash from '../../../assets/img/logo_flash.svg';
import LogoLP from '../../../assets/img/logo_lp.svg';
import IconFlashSmall from '../../../assets/img/flash_small.svg';
import { axiosInstance } from '../../../utilities/axios';
import {
  divDecimals,
  getBaseApr,
  getLiquidity,
  renderValueFixed,
  FAKE_ETH,
  FAKE_STRK,
  FAKE_TOTAL_SUPPLY
} from './helper';
import {
  getFarmingContract,
  methods
} from '../../../utilities/ContractService';

const SMain = styled.div`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  box-sizing: content-box;
  @media only screen and (max-width: 768px) {
    padding: 0;
  }
`;
const SLogo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  @media only screen and (max-width: 768px) {
    margin-bottom: 20px;
    padding: 0 10px;
  }
`;
const SLogoFlash = styled.img`
  width: 60px;
  height: 60px;
  @media only screen and (max-width: 768px) {
    width: 45px;
    height: 45px;
  }
`;
const SLogoLP = styled.img`
  width: 60px;
  height: 60px;
  margin-left: -10px;
  @media only screen and (max-width: 768px) {
    width: 45px;
    height: 45px;
  }
`;
const STitle = styled.div`
  color: #0b0f23;
  font-weight: 900;
  font-size: 31px;
  margin-left: 30px;
  @media only screen and (max-width: 768px) {
    font-size: 20px;
    width: 100%;
    display: block;
  }
`;
const SText = styled.p`
  color: #107def;
  font-size: 18px;
  line-height: 28px;
  font-weight: 900;
  @media only screen and (max-width: 768px) {
    font-size: 17px;
  }
`;
const SBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  @media only screen and (max-width: 768px) {
    margin-bottom: 20px;
    padding: 0 10px;
  }
`;
const SItemsBox = styled.div`
  display: block;
`;
const STextBox = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #9d9fa7;
  text-align: right;
`;
const SValueBox = styled.div`
  color: #0b0f23;
  font-size: 20px;
  line-height: 27px;
  font-weight: 900;
  text-align: right;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const SUSDBox = styled.div`
  color: #107def;
  font-size: 14px;
  line-height: 22px;
  font-weight: 900;
  text-align: right;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const SIconFlash = styled.img`
  margin-right: 10px;
`;
const abortController = new AbortController();

function DashboardStaking({ address, amount }) {
  const [baseAPR, setBaseAPR] = useState(0);
  const [perblock, setPerblock] = useState(0);
  const [amountStaked, setAmountStaked] = useState(0);
  const [totalLiquidity, setTotalLiqudity] = useState(0);
  const [amountDeposit, setAmountDeposit] = useState(0);
  const farmingContract = getFarmingContract();
  const getPerBlock = async () => {
    await methods
      .call(farmingContract.methods.rewardPerBlock, [])
      .then(res => {
        setPerblock(res);
      })
      .catch(err => {
        throw err;
      });
  };
  useEffect(() => {
    getPerBlock();
    const baseAprCaculator = getBaseApr(amount, perblock);
    const baseAprBigNumber = divDecimals(baseAprCaculator, 18);
    const baseAprPer = renderValueFixed(baseAprBigNumber);
    setBaseAPR(baseAprPer);
  }, [address, amount]);
  const getRate = async () => {
    let rateStrkVsUSD = null;
    let rateStrkVsETH = null;
    let totalSupply = null;
    try {
      await axiosInstance
        .get('/api/price')
        .then(res => {
          if (res) {
            const result = res.data.data.rows;
            const objPriceStrkToUSD = _.find(result, item => {
              return item.symbol === 'strk';
            });
            const objPriceStrkToEthereum = _.find(result, item => {
              return item.symbol === 'eth';
            });
            rateStrkVsUSD = renderValueFixed(objPriceStrkToUSD.amount);
            rateStrkVsETH = renderValueFixed(objPriceStrkToEthereum.amount);
            totalSupply = divDecimals(FAKE_TOTAL_SUPPLY, 18);
            const totalLiquidityBigNumber = getLiquidity(
              rateStrkVsUSD,
              FAKE_STRK,
              rateStrkVsETH,
              FAKE_ETH,
              totalSupply
            );
            const total = renderValueFixed(totalLiquidityBigNumber.toNumber());
            setTotalLiqudity(total);
          }
        })
        .catch(err => {
          throw err;
        });
    } catch (err) {
      throw err;
    }
  };
  const getDataDashBoard = async () => {
    try {
      // eslint-disable-next-line no-debugger
      await axiosInstance
        .get(`/api/user/total_stake`)
        .then(res => {
          if (res) {
            const result = res.data.data;
            const totalDepositString = divDecimals(result.totalDeposit, 18);
            setAmountDeposit(renderValueFixed(totalDepositString.toString()));
            const totalStake = result?.totalBoost;
            setAmountStaked(totalStake);
          }
        })
        .catch(err => {
          throw err;
        });
    } catch (err) {
      throw err;
    }
  };
  useEffect(() => {
    getRate();
    let updateTimer;
    if (address) {
      updateTimer = setInterval(() => {
        getRate();
      }, 15000);
    }
    return function cleanup() {
      abortController.abort();
      if (updateTimer) {
        clearInterval(updateTimer);
      }
    };
  }, [address]);
  useEffect(() => {
    getDataDashBoard();
  }, [address]);
  return (
    <>
      <React.Fragment>
        <SMain>
          <Row>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <SLogo>
                <SLogoFlash src={LogoFlash} />
                <SLogoLP src={LogoLP} />
                <STitle>
                  DeFi Vault 3.0
                  <SText>STRK-ETH Staking</SText>
                </STitle>
              </SLogo>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <SBox>
                <SItemsBox>
                  <STextBox>NFTs Staked</STextBox>
                  <SValueBox>{amountStaked}</SValueBox>
                </SItemsBox>
                <SItemsBox>
                  <STextBox>Liquidity</STextBox>
                  <>
                    <SValueBox>
                      <SIconFlash src={IconFlashSmall} />
                      {amountDeposit}
                    </SValueBox>
                    <SUSDBox>${totalLiquidity}</SUSDBox>
                  </>
                </SItemsBox>
                <SItemsBox>
                  <STextBox>Boost APR</STextBox>
                  <SValueBox>Up to 200% </SValueBox>
                </SItemsBox>
                <SItemsBox>
                  <STextBox>Base APR</STextBox>
                  {address ? (
                    <SValueBox>{baseAPR}% </SValueBox>
                  ) : (
                    <SValueBox>0% </SValueBox>
                  )}
                </SItemsBox>
              </SBox>
            </Col>
          </Row>
        </SMain>
      </React.Fragment>
    </>
  );
}
DashboardStaking.propTypes = {
  amount: PropTypes.number,
  address: PropTypes.string
};

DashboardStaking.defaultProps = {
  amount: 0,
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
)(DashboardStaking);
