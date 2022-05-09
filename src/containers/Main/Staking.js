import React, { useEffect } from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import MainLayout from 'containers/Layout/MainLayout';
import { Row, Col, Tooltip } from 'antd';
import { connectAccount, accountActionCreators } from 'core';
import IconQuestion from '../../assets/img/question.png';
import IconDuck from '../../assets/img/duck.png';

import '../../assets/styles/slick.scss';
import {
  SDiv,
  SRow,
  SBox,
  SItems,
  STitle,
  SValue,
  SCoin,
  SInput,
  SMax,
  SBtnClaim,
  SBtnClaimStart,
  SInforText,
  SInfor,
  SInforValue,
  SQuestion,
  SBtnStake,
  SSTake,
  SSUnTake,
  SBtnUn,
  SBtnUnstake,
  SText,
  SHref,
  SBtn,
  SClaim,
  STimeClaim,
  STimeNumer,
  STimeText,
  SUnClaim,
  SItemTime,
  SDetails,
  SFlex,
  SFlexEnd,
  SSlider,
  SItemSlider,
  SImgSlider,
  SBoxSlider,
  STitleSlider,
  SDescriptionSlider
} from '../../assets/styles/staking.js';

const AUDITOR_SETTING = {
  dots: false,
  infinite: false,
  loop: false,
  autoplay: false,
  speed: 2000,
  autoplaySpeed: 2000,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 820,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        dots: false,
        infinite: false,
        loop: false,
        autoplay: false
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 8,
        slidesToScroll: 1,
        initialSlide: 0,
        dots: false,
        infinite: false,
        loop: false,
        autoplay: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        dots: false,
        infinite: false,
        loop: false,
        autoplay: false
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        dots: false,
        infinite: false,
        loop: false,
        autoplay: false
      }
    }
  ]
};

function Staking({ settings }) {
  const adddress = settings.selectedAddress;
  const { valueInput, setValueInput } = React.useState(0);
  const handleChangeValue = e => {
    const re = /^[0-9]*(?:\.[0-9]*)?$/;
    if (!re.test(e.target.value)) {
      setValueInput(e);
    }
  };
  useEffect(() => {}, [adddress]);
  return (
    <>
      <MainLayout title="Dashboard">
        <SDiv>
          <SRow>STRK-ETH</SRow>
          <SBox>
            <SItems>
              <STitle>NFTs Staked</STitle>
              <SValue>1522/2200</SValue>
              <SCoin>$1000</SCoin>
            </SItems>
            <SItems>
              <STitle>Liquidity</STitle>
              <SValue>8934</SValue>
              <SCoin>$30,005</SCoin>
            </SItems>
            <SItems>
              <STitle>Boots APR</STitle>
              <SValue>Up to 200%</SValue>
            </SItems>
            <SItems>
              <STitle>Base APR</STitle>
              <SValue>200%</SValue>
            </SItems>
          </SBox>
        </SDiv>
        <SDiv>
          <SText>
            STRK-ETH Staking
            <SHref target="_blank" href="https://app.strike.org/">
              Get STRK-ETH LPs
            </SHref>
          </SText>
        </SDiv>
        <SDiv>
          <Row>
            <Col xs={{ span: 12 }} lg={{ span: 12 }}>
              <SInput>
                <input
                  value={valueInput}
                  onChange={e => handleChangeValue(e.target.value)}
                />
                <SMax>MAX</SMax>
                <SInfor>
                  <SInforText>Available</SInforText>
                  <SInforValue>1000.52</SInforValue>
                </SInfor>
                <SInfor>
                  <SInforText>Staked</SInforText>
                  <SInforValue>322.25</SInforValue>
                </SInfor>
              </SInput>
            </Col>
            <Col xs={{ span: 12 }} lg={{ span: 12 }}>
              <Row>
                <Col xs={{ span: 18 }} lg={{ span: 18 }}>
                  <SBtn>
                    <SBtnStake>Stake</SBtnStake>
                    <Tooltip
                      placement="right"
                      title="Countdown will be reset if you stake more without claiming the reward"
                    >
                      <SQuestion src={IconQuestion} />
                    </Tooltip>
                  </SBtn>
                  <SBtnUn>
                    <SBtnUnstake>UnStake</SBtnUnstake>
                    <Tooltip
                      placement="right"
                      title="Countdown will be reset if you unstake a part without claiming the reward"
                    >
                      <SQuestion src={IconQuestion} />
                    </Tooltip>
                  </SBtnUn>
                </Col>
                <Col xs={{ span: 6 }} lg={{ span: 6 }}>
                  {}
                </Col>
              </Row>
            </Col>
          </Row>
        </SDiv>
        <SDiv>
          <SText>STRK-ETH Harvest</SText>
          <Row>
            <Col xs={{ span: 12 }} lg={{ span: 12 }}>
              <SInfor>
                <SInforText>Base Reward</SInforText>
                <SInforValue>0.00</SInforValue>
              </SInfor>
              <SInfor>
                <SInforText>Boost Reward</SInforText>
                <SInforValue>32</SInforValue>
              </SInfor>
            </Col>
            <Col xs={{ span: 12 }} lg={{ span: 12 }}>
              <Row>
                <Col xs={{ span: 18 }} lg={{ span: 18 }}>
                  <SBtnClaim>
                    <SClaim>Claim</SClaim>
                    <Tooltip
                      placement="top"
                      title="You can only claim reward once daily"
                    >
                      <SQuestion src={IconQuestion} />
                    </Tooltip>
                  </SBtnClaim>
                </Col>
                <Col xs={{ span: 6 }} lg={{ span: 6 }}>
                  <SBtnClaim>
                    <STimeClaim>
                      <STimeNumer>
                        <SItemTime>0</SItemTime>
                        <SItemTime>23</SItemTime>
                        <SItemTime>59</SItemTime>
                        <SItemTime>59</SItemTime>
                      </STimeNumer>
                      <STimeText>
                        <SItemTime>DAYS</SItemTime>
                        <SItemTime>HOURS</SItemTime>
                        <SItemTime>MIN</SItemTime>
                        <SItemTime>SEC</SItemTime>
                      </STimeText>
                    </STimeClaim>
                  </SBtnClaim>
                </Col>
              </Row>
              <Row>
                <Col xs={{ span: 18 }} lg={{ span: 18 }}>
                  <SBtnClaimStart>
                    <SUnClaim>Claim</SUnClaim>
                    <Tooltip
                      placement="top"
                      title="You can only claim reward once monthly"
                    >
                      <SQuestion src={IconQuestion} />
                    </Tooltip>
                  </SBtnClaimStart>
                </Col>
                <Col xs={{ span: 6 }} lg={{ span: 6 }}>
                  {}
                </Col>
              </Row>
            </Col>
          </Row>
        </SDiv>
        <SDiv>
          <SText>
            NFT Staking
            <Tooltip
              placement="left"
              title="Only display all NFTs that can be staked into this pool"
            >
              <SQuestion src={IconQuestion} />
            </Tooltip>
          </SText>
        </SDiv>
        <SDiv>
          <Row>
            <Col xs={{ span: 6 }} lg={{ span: 6 }}>
              <SFlex>
                <SDetails>NFT selected: 0/4</SDetails>
                <SSTake>Stake</SSTake>
              </SFlex>
            </Col>
            <Col xs={{ span: 18 }} lg={{ span: 18 }}>
              <SFlexEnd>
                <SDetails> STRK staking value: 0</SDetails>
              </SFlexEnd>
            </Col>
          </Row>
          <SSlider>
            <Slider {...AUDITOR_SETTING}>
              <SItemSlider>
                <SImgSlider src={IconDuck} />
                <SBoxSlider>
                  <STitleSlider>B.Duck</STitleSlider>
                  <SDescriptionSlider>B.Duck #3116</SDescriptionSlider>
                </SBoxSlider>
              </SItemSlider>
              <SItemSlider>
                <SImgSlider src={IconDuck} />
                <SBoxSlider>
                  <STitleSlider>B.Duck 2</STitleSlider>
                  <SDescriptionSlider>B.Duck #3117</SDescriptionSlider>
                </SBoxSlider>
              </SItemSlider>
              <SItemSlider>
                <SImgSlider src={IconDuck} />
                <SBoxSlider>
                  <STitleSlider>B.Duck 3</STitleSlider>
                  <SDescriptionSlider>B.Duck #3118</SDescriptionSlider>
                </SBoxSlider>
              </SItemSlider>
              <SItemSlider>
                <SImgSlider src={IconDuck} />
                <SBoxSlider>
                  <STitleSlider>B.Duck 4</STitleSlider>
                  <SDescriptionSlider>B.Duck #3119</SDescriptionSlider>
                </SBoxSlider>
              </SItemSlider>
              <SItemSlider>
                <SImgSlider src={IconDuck} />
                <SBoxSlider>
                  <STitleSlider>B.Duck 5</STitleSlider>
                  <SDescriptionSlider>B.Duck #3119</SDescriptionSlider>
                </SBoxSlider>
              </SItemSlider>
            </Slider>
          </SSlider>
        </SDiv>

        <SDiv>
          <Row>
            <Col xs={{ span: 6 }} lg={{ span: 6 }}>
              <SFlex>
                <SDetails>NFT staked</SDetails>
              </SFlex>
            </Col>
            <Col xs={{ span: 18 }} lg={{ span: 18 }}>
              <SFlexEnd>
                <SDetails> Your Boost APR: 0% </SDetails>
              </SFlexEnd>
            </Col>
          </Row>
        </SDiv>
        <SDiv>
          <Row>
            <Col xs={{ span: 6 }} lg={{ span: 6 }}>
              <SFlex>
                <SDetails>NFT staked 2/6</SDetails>
                <SSUnTake>UnStake</SSUnTake>
              </SFlex>
            </Col>
            <Col xs={{ span: 18 }} lg={{ span: 18 }}>
              <SFlexEnd>
                <SDetails> STRK staking value: 0 </SDetails>
              </SFlexEnd>
            </Col>
          </Row>
          <SSlider>
            <Slider {...AUDITOR_SETTING}>
              <SItemSlider>
                <SImgSlider src={IconDuck} />
                <SBoxSlider>
                  <STitleSlider>B.Duck</STitleSlider>
                  <SDescriptionSlider>B.Duck #3116</SDescriptionSlider>
                </SBoxSlider>
              </SItemSlider>
              <SItemSlider>
                <SImgSlider src={IconDuck} />
                <SBoxSlider>
                  <STitleSlider>B.Duck 2</STitleSlider>
                  <SDescriptionSlider>B.Duck #3117</SDescriptionSlider>
                </SBoxSlider>
              </SItemSlider>
              <SItemSlider>
                <SImgSlider src={IconDuck} />
                <SBoxSlider>
                  <STitleSlider>B.Duck 3</STitleSlider>
                  <SDescriptionSlider>B.Duck #3118</SDescriptionSlider>
                </SBoxSlider>
              </SItemSlider>
              <SItemSlider>
                <SImgSlider src={IconDuck} />
                <SBoxSlider>
                  <STitleSlider>B.Duck 4</STitleSlider>
                  <SDescriptionSlider>B.Duck #3119</SDescriptionSlider>
                </SBoxSlider>
              </SItemSlider>
              <SItemSlider>
                <SImgSlider src={IconDuck} />
                <SBoxSlider>
                  <STitleSlider>B.Duck 5</STitleSlider>
                  <SDescriptionSlider>B.Duck #3119</SDescriptionSlider>
                </SBoxSlider>
              </SItemSlider>
            </Slider>
          </SSlider>
        </SDiv>
      </MainLayout>
      ;
    </>
  );
}

Staking.propTypes = {
  settings: PropTypes.object
};

Staking.defaultProps = {
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
)(Staking);
