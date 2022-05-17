import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import LogoFlash from '../../../assets/img/logo_flash.svg';
import LogoLP from '../../../assets/img/logo_lp.svg';

const SMain = styled.div`
  width: 100%;
  background: #fff;
  padding: 15px;
  margin-top: 10px;
  border-radius: 8px;
  box-sizing: content-box;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 3%);
`;
const SLogo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const SLogoFlash = styled.img`
  width: 60px;
  height: 60px;
`;
const SLogoLP = styled.img`
  width: 60px;
  height: 60px;
  margin-left: -10px;
`;
const STitle = styled.div`
  color: #0b0f23;
  font-weight: 500;
  font-size: 31px;
  margin-left: 30px;
`;
const SText = styled.p`
  color: #107def;
  font-size: 18px;
  line-height: 28px;
`;
const SBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const SItemsBox = styled.div`
  display: block;
`;
const STextBox = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #9d9fa7;
`;
const SValueBox = styled.div`
  color: #0b0f23;
  font-size: 20px;
  line-height: 27px;
`;
const SUSDBox = styled.div`
  color: #107def;
  font-size: 14px;
  line-height: 22px;
`;
function DashboardStaking({ settings }) {
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
                  <SText>STRK-ETH</SText>
                </STitle>
              </SLogo>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <SBox>
                <SItemsBox>
                  <STextBox>NFTs Staked</STextBox>
                  <SValueBox>1522/2000</SValueBox>
                  <SUSDBox>$1000</SUSDBox>
                </SItemsBox>
                <SItemsBox>
                  <STextBox>Liquidity</STextBox>
                  <SValueBox>8934.55</SValueBox>
                  <SUSDBox>$30,005</SUSDBox>
                </SItemsBox>
                <SItemsBox>
                  <STextBox>Boost APR</STextBox>
                  <SValueBox>Up to 200% </SValueBox>
                </SItemsBox>
                <SItemsBox>
                  <STextBox>Base APR</STextBox>
                  <SValueBox>15% </SValueBox>
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
  settings: PropTypes.object
};

DashboardStaking.defaultProps = {
  settings: {}
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
