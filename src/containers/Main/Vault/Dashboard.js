/* eslint-disable no-unused-vars */
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
  renderValueFixedDashboard,
  FAKE_ETH,
  FAKE_STRK,
  STRK,
  ETH,
  FAKE_TOTAL_SUPPLY,
  FAKE_TOTAL_DEPOSIT
} from './helper';
import {
  getFarmingContract,
  getSTRKClaimContract,
  getSTRKContract,
  methods
} from '../../../utilities/ContractService';
import * as ST from '../../../assets/styles/staking.js';
import IconLpSmall from '../../../assets/img/lp_small.svg';

const SMain = styled.div`
  width: 100%;
  padding: 15px;
  border-radius: 6px;
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
    width: 30px;
    height: 30px;
  }
`;
const SLogoLP = styled.img`
  width: 60px;
  height: 60px;
  margin-left: -10px;
  @media only screen and (max-width: 768px) {
    width: 30px;
    height: 30px;
  }
`;
const STitle = styled.div`
  color: var(--color-text-main);
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
    display: grid;
    justify-content: center;
    grid-template-columns: auto auto;
    gap: 12px 48px;
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
  @media only screen and (max-width: 768px) {
    text-align: left;
  }
`;
const SValueBox = styled.div`
  color: var(--color-text-main);
  font-size: 20px;
  line-height: 27px;
  font-weight: 900;
  text-align: right;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
    text-align: left;
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
    text-align: left;
  }
`;
const SIconFlash = styled.img`
  margin-right: 10px;
`;
const abortController = new AbortController();
function DashboardStaking({ amount, txh }) {
  const [baseAPR, setBaseAPR] = useState(0);
  const [amountStaked, setAmountStaked] = useState(0);
  const [totalLiquidity, setTotalLiqudity] = useState(0);
  const [amountDeposit, setAmountDeposit] = useState(0);
  const farmingContract = getFarmingContract();
  const strkContract = getSTRKClaimContract();
  const strkContractCustomer = getSTRKContract();
  const getRate = async () => {
    let rateStrkVsUSD = null;
    let rateStrkVsETH = null;
    let totalSupply = null;
    let decimalTotal = null;
    let totalETH = null;
    let totalSTRK = null;
    let totalDepositString = null;
    try {
      // get decimals
      await methods
        .call(strkContractCustomer.methods.decimals, [])
        .then(res => {
          if (res) {
            decimalTotal = res;
          }
        })
        .catch(err => {});
      // get total supply strk customer mainet
      await methods
        .call(strkContractCustomer.methods.totalSupply, [])
        .then(res => {
          if (res) {
            totalSupply = res;
          }
        })
        .catch(err => {});
      // get lp pool
      await methods
        .call(strkContractCustomer.methods.getReserves, [])
        .then(res => {
          if (res) {
            totalSTRK = divDecimals(res[0], decimalTotal);
            totalETH = divDecimals(res[1], decimalTotal);
          }
        })
        .catch(err => {});
      await axiosInstance.get(`/user/total_stake`).then(res => {
        if (res) {
          const result = res.data.data;
          totalDepositString = result?.totalDeposit;
        }
      });

      // get rate
      await axiosInstance
        .get('/price')
        .then(res => {
          if (res) {
            const result = res?.data?.data?.rows;

            const objPriceStrkToUSD = _.find(result, item => {
              return item.symbol.toLowerCase() === STRK;
            });
            const objPriceStrkToEthereum = _.find(result, item => {
              return item.symbol.toLowerCase() === ETH;
            });
            rateStrkVsUSD = objPriceStrkToUSD?.amount;
            rateStrkVsETH = objPriceStrkToEthereum?.amount;
            // production env
            if (process?.env?.REACT_APP_ENV === 'prod') {
              // eslint-disable-next-line no-self-assign
              totalETH = totalETH?.toNumber();
              // eslint-disable-next-line no-self-assign
              totalSTRK = totalSTRK?.toNumber();
            } else {
              // development env
              totalETH = FAKE_ETH;
              totalSTRK = FAKE_STRK;
              totalSupply = FAKE_TOTAL_SUPPLY;
              totalDepositString = FAKE_TOTAL_DEPOSIT;
            }

            const totalLiquidityBigNumber = getLiquidity(
              rateStrkVsUSD,
              totalSTRK,
              rateStrkVsETH,
              totalETH,
              totalSupply,
              totalDepositString
            );
            const total = renderValueFixedDashboard(
              totalLiquidityBigNumber.toNumber()
            );
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
    let totalLiquid = 0;
    let decimalStrkClaim = null;
    try {
      // eslint-disable-next-line no-debugger
      await axiosInstance
        .get(`/user/total_stake`)
        .then(res => {
          if (res) {
            const result = res.data.data;
            const totalDepositString = divDecimals(result?.totalDeposit, 0);
            const totalLiquidityString = divDecimals(result?.totalDeposit, 18);
            const totalDepositNumber = totalLiquidityString?.toNumber();
            totalLiquid = totalDepositString?.toNumber();
            setAmountDeposit(renderValueFixedDashboard(totalDepositNumber));
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
    await methods
      .call(strkContract.methods.decimals, [])
      .then(res => {
        if (res) {
          decimalStrkClaim = res;
        }
      })
      .catch(err => {
        throw err;
      });
    await methods
      .call(farmingContract.methods.rewardPerBlock, [])
      .then(res => {
        if (res) {
          const result = divDecimals(res, 6).toNumber();
          const baseAprCaculator = getBaseApr(totalLiquid, result);
          const baseAprPer = renderValueFixedDashboard(
            baseAprCaculator.toNumber()
          );
          setBaseAPR(baseAprPer);
        }
      })
      .catch(err => {
        throw err;
      });
  };
  useEffect(() => {
    getRate();
    let updateTimer;
    // eslint-disable-next-line prefer-const
    updateTimer = setInterval(() => {
      getRate();
      getDataDashBoard();
    }, 5000);
    return function cleanup() {
      abortController.abort();
      if (updateTimer) {
        clearInterval(updateTimer);
      }
    };
  }, [amount, txh]);

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
                      <ST.SIconSmall>
                        <ST.SImgFlashSmall src={IconFlashSmall} />
                        <ST.SImgLpSmall src={IconLpSmall} />
                      </ST.SIconSmall>
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
                  <SValueBox>{baseAPR}% </SValueBox>
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
  txh: PropTypes.string
};

DashboardStaking.defaultProps = {
  amount: 0,
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
)(DashboardStaking);
