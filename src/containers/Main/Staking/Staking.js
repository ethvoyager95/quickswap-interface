import React, { useState } from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import MainLayout from 'containers/Layout/MainLayout';
import { Row, Col, Tooltip } from 'antd';
import { connectAccount, accountActionCreators } from 'core';
import IconQuestion from '../../../assets/img/question.png';
import DialogUnStake from './DialogUnStake';
import DialogStake from './DialogStake';
import IconDuck from '../../../assets/img/duck.png';
import '../../../assets/styles/slick.scss';
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
  SInforClaim,
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
  SDetailsColor,
  SFlex,
  SFlexEnd,
  SSlider,
  SItemSlider,
  SImgSlider,
  SBoxSlider,
  STitleSlider,
  SDescriptionSlider,
  SNexSlider,
  SPrevSlider,
  SError,
  SSactive,
  SSUnactive,
  STextSelecT
} from '../../../assets/styles/staking.js';
import DialogConfirm from './DialogConfirm';

const DATA_SLIDER = [
  {
    id: 1,
    name: 'B.Duck',
    description: 'B.Duck #3116',
    img: IconDuck,
    active: false
  },
  {
    id: 2,
    name: 'B.Duck',
    description: 'B.Duck #3117',
    img: IconDuck,
    active: false
  },
  {
    id: 3,
    name: 'B.Duck',
    description: 'B.Duck #3118',
    img: IconDuck,
    active: false
  },
  {
    id: 4,
    name: 'B.Duck',
    description: 'B.Duck #3119',
    img: IconDuck,
    active: false
  },
  {
    id: 5,
    name: 'B.Duck',
    description: 'B.Duck #3120',
    img: IconDuck,
    active: false
  }
];
const DATA_NFT = [
  {
    id: 1,
    name: 'B.Duck',
    description: 'B.Duck #3116',
    img: IconDuck,
    active: false
  },
  {
    id: 2,
    name: 'B.Duck',
    description: 'B.Duck #3117',
    img: IconDuck,
    active: false
  },
  {
    id: 3,
    name: 'B.Duck',
    description: 'B.Duck #3118',
    img: IconDuck,
    active: false
  },
  {
    id: 4,
    name: 'B.Duck',
    description: 'B.Duck #3119',
    img: IconDuck,
    active: false
  },
  {
    id: 5,
    name: 'B.Duck',
    description: 'B.Duck #3120',
    img: IconDuck,
    active: false
  }
];
function SampleNextArrow(props) {
  // eslint-disable-next-line react/prop-types
  const { onClick } = props;
  return <SNexSlider className="slick-arrow slick-next" onClick={onClick} />;
}
function SamplePrevArrow(props) {
  // eslint-disable-next-line react/prop-types
  const { onClick } = props;
  return <SPrevSlider className="slick-arrow slick-prev" onClick={onClick} />;
}
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
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
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

function Staking() {
  const [val, setVal] = useState(0);
  const [messErr, setMessErr] = useState({ mess: '', show: false });
  const [text, setText] = useState('');
  const [textNFT, setTextNFT] = useState('');
  const [isStakeNFT, setIsStakeNFT] = useState(false);
  const [isUnStakeNFT, setIsUnStakeNFT] = useState(false);
  const [isConfirm, setiIsConfirm] = useState(false);
  const [data] = useState(DATA_SLIDER);
  const [itemStaking, setItemStaking] = useState([]);
  const [itemStaked, setItemStaked] = useState([]);
  const handleChangeValue = event => {
    const numberDigitsRegex = /^\d*(\.\d{0,18})?$/g;
    if (!numberDigitsRegex.test(event.target.value)) {
      return;
    }
    setMessErr({
      mess: '',
      show: false
    });
    if (event.target.value < 0) {
      setVal(0);
    } else {
      const valueFormat = event?.target.value.replace(/,/g, '.');
      setVal(valueFormat);
    }
  };
  const handleStake = () => {
    if (!val || val === 0) {
      setMessErr({
        mess: 'Invalid amount',
        show: true
      });
    } else {
      setText('Stake STRK-ETH LPs');
      setMessErr({
        mess: '',
        show: false
      });
    }
  };
  const handleUnStake = () => {
    if (!val || val === 0) {
      setMessErr({
        mess: 'Invalid amount',
        show: true
      });
    } else {
      setText('Unstake STRK-ETH LPs');
      setMessErr({
        mess: '',
        show: false
      });
    }
  };
  const handleStakeNFT = () => {
    setIsStakeNFT(true);
    setTextNFT('Stake NFT');
  };
  const handleUnStakeNFT = () => {
    setIsUnStakeNFT(true);
    setTextNFT('Unstake NFT');
  };

  const handleCloseUnStake = () => {
    console.log('close stake');
    setIsUnStakeNFT(false);
  };
  const handleCloseStake = () => {
    console.log('close unstake');
    setIsStakeNFT(false);
  };
  const handleSelectItem = (e, item) => {
    if (e.isTrusted) {
      const index = DATA_SLIDER.findIndex(res => {
        return res.id === item.id;
      });
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < DATA_SLIDER.length; i++) {
        DATA_SLIDER[index].active = !DATA_SLIDER[index].active;
      }
      const dataStaking = DATA_SLIDER.filter(it => {
        return it.active === true;
      });
      setItemStaking(dataStaking);
    }
  };
  const handleSelectItemNFT = (e, item) => {
    if (e.isTrusted) {
      const index = DATA_NFT.findIndex(res => {
        return res.id === item.id;
      });
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < DATA_NFT.length; i++) {
        DATA_NFT[index].active = !DATA_NFT[index].active;
      }
      const dataStaked = DATA_NFT.filter(it => {
        return it.active === true;
      });
      console.log(dataStaked, 'dataStaked');
      setItemStaked(dataStaked);
    }
  };
  const handleStakeDialog = () => {
    console.log('111');
    setIsStakeNFT(false);
    setiIsConfirm(true);
  };
  const handleCloseConfirm = () => {
    setiIsConfirm(false);
  };

  return (
    <>
      <React.Fragment>
        <MainLayout title="Dashboard">
          <SDiv>
            <SRow>STRK-ETH</SRow>
          </SDiv>
          <SDiv>
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
            <Row>
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <SInput>
                  <input
                    type="text"
                    value={val}
                    inputMode="decimal"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    min={0}
                    onChange={event => handleChangeValue(event)}
                  />
                  <SMax>MAX</SMax>
                  {messErr?.show === true && <SError>{messErr.mess}</SError>}

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
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <Row>
                  <Col xs={{ span: 24 }} lg={{ span: 18 }}>
                    <SBtn>
                      <SBtnStake onClick={handleStake}>Stake</SBtnStake>
                      <Tooltip
                        placement="right"
                        title="Countdown will be reset if you stake more without claiming the reward"
                      >
                        <SQuestion src={IconQuestion} />
                      </Tooltip>
                    </SBtn>
                    <SBtnUn>
                      <SBtnUnstake onClick={handleUnStake}>UnStake</SBtnUnstake>
                      <Tooltip
                        placement="right"
                        title="Countdown will be reset if you unstake a part without claiming the reward"
                      >
                        <SQuestion src={IconQuestion} />
                      </Tooltip>
                    </SBtnUn>
                  </Col>
                  <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                    {}
                  </Col>
                </Row>
              </Col>
            </Row>
          </SDiv>
          <SDiv>
            <SText>STRK-ETH Harvest</SText>
            <Row>
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <SInforClaim>
                  <SInforText>Base Reward</SInforText>
                  <SInforValue>0.00</SInforValue>
                </SInforClaim>
                <SInforClaim>
                  <SInforText>Boost Reward</SInforText>
                  <SInforValue>32</SInforValue>
                </SInforClaim>
                <SInforClaim>
                  <SInforText>vStrk</SInforText>
                  <SInforValue>0.00</SInforValue>
                </SInforClaim>
              </Col>
              {/* Claim */}
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <Row>
                  <Col xs={{ span: 24 }} lg={{ span: 18 }}>
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
                  <Col xs={{ span: 24 }} lg={{ span: 6 }}>
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
                  <Col xs={{ span: 24 }} lg={{ span: 18 }}>
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
                  <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                    {}
                  </Col>
                </Row>
                <Row>
                  <Col xs={{ span: 24 }} lg={{ span: 18 }}>
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
                  <Col xs={{ span: 24 }} lg={{ span: 6 }}>
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
            <Row>
              <Col xs={{ span: 24 }} lg={{ span: 9 }}>
                <SFlex>
                  <SDetails>NFT selected: 0/4</SDetails>
                </SFlex>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 15 }}>
                <SFlexEnd>
                  <SSTake onClick={handleStakeNFT}>Stake</SSTake>
                </SFlexEnd>
              </Col>
            </Row>
            <SSlider>
              <Slider {...AUDITOR_SETTING}>
                {data?.map(item => {
                  return (
                    <SItemSlider
                      key={item.id}
                      onClick={event => handleSelectItem(event, item)}
                    >
                      <SImgSlider src={item.img} />
                      <SBoxSlider>
                        <STitleSlider>{item.name}</STitleSlider>
                        <SDescriptionSlider>
                          {item.description}
                        </SDescriptionSlider>
                      </SBoxSlider>
                      {item.active === false ? (
                        <SSactive>Select</SSactive>
                      ) : (
                        <SSUnactive>Remove</SSUnactive>
                      )}
                    </SItemSlider>
                  );
                })}
              </Slider>
            </SSlider>
            <STextSelecT>Please select NFTs you want to stake</STextSelecT>
          </SDiv>
          <SDiv>
            <Row>
              <Col xs={{ span: 24 }} lg={{ span: 9 }}>
                <SFlex>
                  <SText>NFT staked</SText>
                </SFlex>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 15 }}>
                <SFlexEnd>
                  <SDetailsColor> Your Boost APR: 0% </SDetailsColor>
                </SFlexEnd>
              </Col>
            </Row>
            <Row>
              <Col xs={{ span: 24 }} lg={{ span: 9 }}>
                <SFlex>
                  <SDetails>NFT staked 0/10</SDetails>
                </SFlex>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 15 }}>
                <SFlexEnd>
                  <SSUnTake onClick={handleUnStakeNFT}>UnStake</SSUnTake>
                </SFlexEnd>
              </Col>
            </Row>
            <SSlider>
              <Slider {...AUDITOR_SETTING}>
                {DATA_NFT?.map(item => {
                  return (
                    <SItemSlider
                      key={item.id}
                      onClick={event => handleSelectItemNFT(event, item)}
                    >
                      <SImgSlider src={item.img} />
                      <SBoxSlider>
                        <STitleSlider>{item.name}</STitleSlider>
                        <SDescriptionSlider>
                          {item.description}
                        </SDescriptionSlider>
                      </SBoxSlider>
                      {item.active === false ? (
                        <>
                          <SSactive>Select</SSactive>
                        </>
                      ) : (
                        <SSUnactive>Remove</SSUnactive>
                      )}
                    </SItemSlider>
                  );
                })}
              </Slider>
            </SSlider>
            <STextSelecT>Please select NFTs you want to unstake</STextSelecT>
          </SDiv>
        </MainLayout>
        {/* Stake */}
        <DialogStake
          isStakeNFT={isStakeNFT}
          text={textNFT}
          close={handleCloseStake}
          itemStaking={itemStaking}
          handleStakeDialog={handleStakeDialog}
        />
        {/* UnStake */}
        <DialogUnStake
          isUnStakeNFT={isUnStakeNFT}
          text={text}
          close={handleCloseUnStake}
          itemStaked={itemStaked}
        />
        <DialogConfirm isConfirm={isConfirm} close={handleCloseConfirm} />
      </React.Fragment>
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
