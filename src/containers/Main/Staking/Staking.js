/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import MainLayout from 'containers/Layout/MainLayout';
import { Row, Col, Tooltip } from 'antd';
import { connectAccount, accountActionCreators } from 'core';
import BigNumber from 'bignumber.js';
import Web3 from 'web3'; // eslint-disable-line import/no-unresolved
import axiosInstance from '../../../utilities/axios';
import IconQuestion from '../../../assets/img/question.png';
import DialogUnStake from './DialogUnStake';
import DialogStake from './DialogStake';
import IconDuck from '../../../assets/img/duck.png';
import IconLink from '../../../assets/img/launch.svg';
import IconNoData from '../../../assets/img/no_data.svg';
import '../../../assets/styles/slick.scss';
import {
  SDiv,
  SInput,
  SMax,
  SBtnDisabled,
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
  SHrefErr,
  SLinkErr,
  SImgErr,
  SBtn,
  SClaim,
  SUnClaim,
  SDetails,
  SDetailsColor,
  SFlex,
  SFlexEnd,
  SSlider,
  SSliderNoData,
  SSliderNoDataImg,
  SSliderNoDataText,
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
  STextSelecT,
  SHeader
} from '../../../assets/styles/staking.js';
import DialogConfirm from './DialogConfirm';
import DialogErr from './DialogErr';
import {
  getFarmingContract,
  getLPContract,
  methods
} from '../../../utilities/ContractService';

import DashboardStaking from './Dashboard';
import CountDownClaim from './countDownClaim';
import DialogSuccess from './DialogSuccess';

// eslint-disable-next-line import/order

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

function Staking({ settings }) {
  const [val, setVal] = useState(0);
  const [messErr, setMessErr] = useState({
    mess: '',
    show: false,
    noLP: false
  });
  const [txhash] = useState(
    '0xa0afb0543264006dd824bfe24388e2980aa8618654f1572c7824c0a7277ff004'
  );
  const [dataNFT, setDataNFT] = useState([]);
  const [textErr, setTextErr] = useState('');
  const [isStakeNFT, setIsStakeNFT] = useState(false);
  const [isUnStakeNFT, setIsUnStakeNFT] = useState(false);
  const [isConfirm, setiIsConfirm] = useState(false);
  const [isShowCancel, setIsShowCancel] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [itemStaking, setItemStaking] = useState([]);
  const [itemStaked, setItemStaked] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [expiryTime] = useState(tomorrow);
  const farmingContract = getFarmingContract();
  const lpContract = getLPContract();

  // change amount
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
      if (valueFormat > userInfo?.available) {
        setMessErr({
          mess: 'The amount has exceeded your balance. Try again',
          show: true
        });
      }
    }
  };
  // stake
  const handleStake = async () => {
    if (val > userInfo?.available) {
      setMessErr({
        mess: 'The amount has exceeded your balance. Try again',
        show: true
      });
      return;
    }
    if (!val || val === 0) {
      setMessErr({
        mess: 'Invalid amount',
        show: true
      });
    } else {
      // deposit
      setiIsConfirm(true);
      const accounts = settings.selectedAddress;
      await methods
        .send(
          farmingContract.methods.deposit,
          [0, new BigNumber(val).integerValue()],
          accounts
        )
        .then(() => {
          setiIsConfirm(false);
        })
        .catch(err => {
          if (err.message.includes('User denied')) {
            setIsShowCancel(true);
            setiIsConfirm(false);
            setTextErr('Decline transaction');
          } else {
            setIsShowCancel(true);
            setiIsConfirm(false);
            setTextErr(err.message);
          }
          throw err;
        });
      setMessErr({
        mess: '',
        show: false
      });
    }
  };
  const handleUnStake = async () => {
    if (!val || val === 0) {
      setMessErr({
        mess: 'Invalid amount',
        show: true
      });
    } else {
      // withdraw test
      setiIsConfirm(true);
      const accounts = settings.selectedAddress;
      await methods
        .send(
          farmingContract.methods.withdraw,
          [0, new BigNumber(val).integerValue()],
          accounts[0]
        )
        .then(() => {
          setiIsConfirm(false);
        })
        .catch(err => {
          if (err.message.includes('User denied')) {
            setIsShowCancel(true);
            setiIsConfirm(false);
            setTextErr('Decline transaction');
          } else {
            setIsShowCancel(true);
            setiIsConfirm(false);
            setTextErr(err.message);
          }
          throw err;
        });
      setMessErr({
        mess: '',
        show: false
      });
    }
  };
  // handleClaim
  const handleClainBaseReward = async () => {
    const accounts = settings.selectedAddress;
    await methods
      .send(
        farmingContract.methods.claimBaseRewards,
        [new BigNumber(0).integerValue()],
        accounts[0]
      )
      .then(() => {})
      .catch(err => {
        if (err.message.includes('User denied')) {
          setIsShowCancel(true);
          setiIsConfirm(false);
          setTextErr('Decline transaction');
        } else {
          setIsShowCancel(true);
          setiIsConfirm(false);
          setTextErr(err.message);
        }
        throw err;
      });
  };
  const handleClainBootReward = async () => {
    const accounts = settings.selectedAddress;
    await methods
      .send(
        farmingContract.methods.claimBoostReward,
        [new BigNumber(0).integerValue()],
        accounts[0]
      )
      .then(() => {})
      .catch(err => {
        if (err.message.includes('User denied')) {
          setIsShowCancel(true);
          setiIsConfirm(false);
          setTextErr('Decline transaction');
        } else {
          setIsShowCancel(true);
          setiIsConfirm(false);
          setTextErr(err.message);
        }
        throw err;
      });
  };
  // handleOpen
  const handleStakeNFT = () => {
    setIsStakeNFT(true);
  };
  const handleUnStakeNFT = () => {
    setIsUnStakeNFT(true);
  };
  // handle item slider
  const handleSelectItem = (e, item) => {
    if (e.isTrusted) {
      const dataNFTStake = [...dataNFT];
      const index = dataNFTStake.findIndex(res => {
        return res.id === item.id;
      });
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < dataNFTStake.length; i++) {
        dataNFTStake[index].active = !dataNFTStake[index].active;
      }
      const dataStaking = dataNFTStake.filter(it => {
        return it.active === true;
      });
      setItemStaking(dataStaking);
    }
  };
  const handleSelectItemNFT = (e, item) => {
    if (e.isTrusted) {
      const dataNFTUnStake = [...dataNFT];
      const index = dataNFTUnStake.findIndex(res => {
        return res.id === item.id;
      });
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < dataNFTUnStake.length; i++) {
        dataNFTUnStake[index].active = !dataNFTUnStake[index].active;
      }
      const dataStaked = dataNFTUnStake.filter(it => {
        return it.active === true;
      });
      setItemStaked(dataStaked);
    }
  };
  // Stake NFT
  const handleStakeDialog = async () => {
    setIsStakeNFT(false);
    setiIsConfirm(true);
    const accounts = settings.selectedAddress;

    await methods
      .send(
        farmingContract.methods.boost,
        [new BigNumber(0).integerValue(), new BigNumber(0).integerValue()],
        accounts
      )
      .then(() => {})
      .catch(err => {
        if (err.message.includes('User denied')) {
          setIsShowCancel(true);
          setiIsConfirm(false);
          setTextErr('Decline transaction');
        } else {
          setIsShowCancel(true);
          setiIsConfirm(false);
          setTextErr(err.message);
        }
        throw err;
      });
  };
  // unStake NFT
  const handleUnStakeDialog = async () => {
    setIsUnStakeNFT(false);
    setiIsConfirm(true);
    const accounts = settings.selectedAddress;
    await methods
      .send(
        farmingContract.methods.unboost,
        [new BigNumber(0).integerValue(), new BigNumber(0).integerValue()],
        accounts[0]
      )
      .then(() => {})
      .catch(err => {
        if (err.message.includes('User denied')) {
          setIsShowCancel(true);
          setiIsConfirm(false);
          setTextErr('Decline transaction');
        } else {
          setIsShowCancel(true);
          setiIsConfirm(false);
          setTextErr(err.message);
        }
        throw err;
      });
  };
  // handleClose

  const handleCloseConfirm = () => {
    setiIsConfirm(false);
  };
  const handleCloseSuccess = () => {
    setIsSuccess(false);
  };
  const handleCloseErr = () => {
    setIsShowCancel(false);
  };
  const handleCloseUnStake = () => {
    setIsUnStakeNFT(false);
  };
  const handleCloseStake = () => {
    setIsStakeNFT(false);
  };
  const handleMaxValue = () => {
    setVal(userInfo?.available);
    if (userInfo?.available > 0) {
      setMessErr({
        mess: '',
        show: false
      });
    }
  };
  // get userInfor
  const getDataUserInfor = async () => {
    window.web3 = new Web3(window.ethereum);
    const accounts = settings.selectedAddress;
    const sTokenBalance = await methods.call(lpContract.methods.balanceOf, [
      settings.selectedAddress
    ]);
    await methods
      .call(farmingContract.methods.userInfo, [0, accounts])
      .then(res => {
        const balanceBigNumber = new BigNumber(sTokenBalance).div(
          new BigNumber(10).pow(18)
        );
        const balanceBigFormat = balanceBigNumber
          .toNumber()
          .toFixed(4)
          .toString();
        if (balanceBigNumber.isZero()) {
          setMessErr({
            mess: 'No tokens to stake: Get STRK-ETH LP',
            show: false,
            noLP: true
          });
        }
        setUserInfo({ ...res, available: parseFloat(balanceBigFormat) });
      })
      .catch(err => {
        throw err;
      });
  };

  useEffect(() => {
    getDataUserInfor();
  }, []);
  const fetchNFTs = async () => {
    // get polygon NFTs for address
    await axiosInstance
      .get(
        `/${settings.selectedAddress}/nft?chain=rinkeby&format=decimal&limit=20`
      )
      .then(res => {
        const data = res.data.result;
        if (data.length > 0) {
          // eslint-disable-next-line no-shadow
          const dataConvert = [...data];
          // eslint-disable-next-line array-callback-return
          dataConvert.map(item => {
            // eslint-disable-next-line no-param-reassign
            item.active = false;
            // eslint-disable-next-line no-param-reassign
            item.img = IconDuck;
          });
          setDataNFT(dataConvert);
        }
      });
  };
  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <>
      <React.Fragment>
        <MainLayout title="Dashboard">
          <DashboardStaking />
          <SDiv>
            <SHeader>
              <SText>STRK-ETH Staking</SText>
              <SHref
                target="_blank"
                href="https://app.uniswap.org/#/add/0x74232704659ef37c08995e386a2e26cc27a8d7b1/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/10000?chain=mainnet"
              >
                Get STRK-ETH LPs
              </SHref>
            </SHeader>

            <Row>
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <SInput>
                  <input
                    type="text"
                    value={val}
                    inputMode="decimal"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    min={0}
                    placeholder="Enter a number"
                    onChange={event => handleChangeValue(event)}
                  />
                  {settings.selectedAddress ? (
                    <SMax onClick={handleMaxValue}>MAX</SMax>
                  ) : (
                    <SBtnDisabled>MAX</SBtnDisabled>
                  )}

                  {messErr?.show === true && <SError>{messErr.mess}</SError>}
                  {messErr?.noLP === true && (
                    <SHrefErr>
                      {messErr.mess}
                      <SLinkErr
                        target="_blank"
                        href="https://app.uniswap.org/#/add/0x74232704659ef37c08995e386a2e26cc27a8d7b1/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/10000?chain=rinkeby"
                      >
                        <SImgErr src={IconLink} />
                      </SLinkErr>
                    </SHrefErr>
                  )}

                  <SInfor>
                    <SInforText>Available</SInforText>
                    <SInforValue>{userInfo.available ?? '0'}</SInforValue>
                  </SInfor>
                  <SInfor>
                    <SInforText>Staked</SInforText>
                    <SInforValue>{userInfo.amount ?? '0'}</SInforValue>
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
                  <SInforValue>{userInfo.accBaseReward ?? '0'}</SInforValue>
                </SInforClaim>
                <SInforClaim>
                  <SInforText>Boost Reward</SInforText>
                  <SInforValue>{userInfo.accBoostReward ?? '0'}</SInforValue>
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
                      <SClaim onClick={handleClainBaseReward}>Claim</SClaim>
                      <Tooltip
                        placement="top"
                        title="You can only claim reward once daily"
                      >
                        <SQuestion src={IconQuestion} />
                      </Tooltip>
                    </SBtnClaim>
                  </Col>
                  <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                    <CountDownClaim times={expiryTime} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={{ span: 24 }} lg={{ span: 18 }}>
                    <SBtnClaimStart>
                      <SUnClaim onClick={handleClainBootReward}>Claim</SUnClaim>
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
                  <SDetails>NFT selected: 0/{dataNFT.length}</SDetails>
                </SFlex>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 15 }}>
                <SFlexEnd>
                  <SSTake onClick={handleStakeNFT}>Stake</SSTake>
                </SFlexEnd>
              </Col>
            </Row>
            <SSlider>
              {dataNFT.length === 0 && (
                <SSliderNoData>
                  <SSliderNoDataImg src={IconNoData} />
                  <SSliderNoDataText>You don’t own any NFTs</SSliderNoDataText>
                </SSliderNoData>
              )}

              <Slider {...AUDITOR_SETTING}>
                {dataNFT?.map(item => {
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
                  <SDetails>NFT staked 0/{dataNFT.length}</SDetails>
                </SFlex>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 15 }}>
                <SFlexEnd>
                  <SSUnTake onClick={handleUnStakeNFT}>UnStake</SSUnTake>
                </SFlexEnd>
              </Col>
            </Row>
            <SSlider>
              {dataNFT.length === 0 && (
                <SSliderNoData>
                  <SSliderNoDataImg src={IconNoData} />
                  <SSliderNoDataText>You don’t own any NFTs</SSliderNoDataText>
                </SSliderNoData>
              )}
              <Slider {...AUDITOR_SETTING}>
                {dataNFT?.map(item => {
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
          close={handleCloseStake}
          itemStaking={itemStaking}
          handleStakeDialog={handleStakeDialog}
        />
        {/* UnStake */}
        <DialogUnStake
          isUnStakeNFT={isUnStakeNFT}
          close={handleCloseUnStake}
          itemStaked={itemStaked}
          handleUnStakeDialog={handleUnStakeDialog}
        />
        {/* err */}
        <DialogErr
          isShow={isShowCancel}
          close={handleCloseErr}
          text={textErr}
        />
        {/* Confirm */}
        <DialogConfirm isConfirm={isConfirm} close={handleCloseConfirm} />
        <DialogSuccess
          isSuccess={isSuccess}
          close={handleCloseSuccess}
          address={settings?.selectedAddress}
          txh={txhash}
        />
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
