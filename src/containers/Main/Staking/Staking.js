/* eslint-disable import/no-duplicates */
/* eslint-disable no-self-compare */
/* eslint-disable no-const-assign */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useCallback } from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import MainLayout from 'containers/Layout/MainLayout';
import { Row, Col, Tooltip } from 'antd';
import { connectAccount, accountActionCreators } from 'core';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import _ from 'lodash';
import * as constants from 'utilities/constants';
// eslint-disable-next-line import/named
import { axiosInstance, axiosInstanceMoralis } from '../../../utilities/axios';
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
  SIconSmall,
  SImgFlashSmall,
  SImgLpSmall,
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
// eslint-disable-next-line import/no-duplicates
import DialogConfirm from './DialogConfirm';
import DialogErr from './DialogErr';
import {
  getFarmingContract,
  getLPContract,
  getVSTRKContract,
  methods
} from '../../../utilities/ContractService';
import DashboardStaking from './Dashboard';
import CountDownClaim from './countDownClaim';
import DialogSuccess from './DialogSuccess';
import DialogUnStake from './DialogUnStake';
import DialogStake from './DialogStake';
// eslint-disable-next-line import/no-named-as-default
import Loadding from './Loadding';
// eslint-disable-next-line import/order
import IconQuestion from '../../../assets/img/error-outline.svg';
import IconDuck from '../../../assets/img/default_slider.svg';
import IconLink from '../../../assets/img/launch.svg';
import IconNoData from '../../../assets/img/no_data.svg';
import IConNext from '../../../assets/img/arrow-next.svg';
import IConPrev from '../../../assets/img/arrow-prev.svg';
import IconFlashSmall from '../../../assets/img/flash_small.svg';
import IconLpSmall from '../../../assets/img/lp_small.svg';
import IconVstrkSmall from '../../../assets/img/flash_vstrk.svg';
import IconSelect from '../../../assets/img/select.svg';
import IconNotSelect from '../../../assets/img/not_select.svg';
// eslint-disable-next-line import/order

function SampleNextArrow(props) {
  // eslint-disable-next-line react/prop-types
  const { onClick } = props;
  return (
    <SNexSlider
      src={IConNext}
      className="slick-arrow slick-next"
      onClick={onClick}
    />
  );
}
function SamplePrevArrow(props) {
  // eslint-disable-next-line react/prop-types
  const { onClick } = props;
  return (
    <SPrevSlider
      src={IConPrev}
      className="slick-arrow slick-prev"
      onClick={onClick}
    />
  );
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
  const [txhash, setTxhash] = useState('');
  const [dataNFT, setDataNFT] = useState([]);
  const [dataNFTUnState, setDataNFTUnState] = useState([]);
  const [textErr, setTextErr] = useState('');
  const [isStakeNFT, setIsStakeNFT] = useState(false);
  const [isUnStakeNFT, setIsUnStakeNFT] = useState(false);
  const [isConfirm, setiIsConfirm] = useState(false);
  const [isShowCancel, setIsShowCancel] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [isUnStake, setIsUnStake] = useState(false);
  const [isClaimBaseReward, setisClaimBaseReward] = useState(false);
  const [isClaimBootReward, setIsClaimBootReward] = useState(false);
  const [isUnStakeLp, setIsUnStakeLp] = useState(false);
  const [itemStaking, setItemStaking] = useState([]);
  const [itemStaked, setItemStaked] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const timeBase = new Date();
  const timeBoots = new Date();
  timeBase.setDate(timeBase.getDate() + 1);
  timeBoots.setDate(timeBoots.getDate() + 30);
  const [expiryTimeBase, setExpiryTimeBase] = useState(timeBase);
  const [expiryTimeBoost, setExpiryTimeBoost] = useState(timeBoots);
  const farmingContract = getFarmingContract();
  const lpContract = getLPContract();
  const vStrkContract = getVSTRKContract();
  // get userInfor
  const getDataUserInfor = async () => {
    window.web3 = new Web3(window.ethereum);
    const accounts = settings.selectedAddress;
    const sTokenBalance = await methods.call(lpContract.methods.balanceOf, [
      settings.selectedAddress
    ]);
    const total = {
      totalBoost: '',
      totalDeposit: ''
    };
    try {
      // eslint-disable-next-line no-debugger
      await axiosInstance
        .get(`/api/user/total_stake`)
        .then(res => {
          if (res) {
            const result = res.data.data;
            const totalDepositString = +new BigNumber(result.totalDeposit).div(
              new BigNumber(10).pow(18)
            );

            total.totalBoost = result?.totalBoost;
            total.totalDeposit = totalDepositString.toString();
          }
        })
        .catch(err => {
          throw err;
        });
    } catch (err) {
      throw err;
    }
    let objUser = {};
    await methods
      .call(farmingContract.methods.userInfo, [0, accounts])
      .then(res => {
        const balanceBigNumber = new BigNumber(sTokenBalance).div(
          new BigNumber(10).pow(18)
        );
        const pendingAmountString = +new BigNumber(res.pendingAmount).div(
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
        setExpiryTimeBase(new Date(res.depositedDate) * 1000);
        setExpiryTimeBoost(new Date(res.boostedDate) * 1000);
        const currentTime = Math.floor(new Date().getTime() / 1000);
        const timeBaseUnstake = res.depositedDate;
        const timeBootsUnstake = res.boostedDate;
        const overTimeBaseReward = currentTime - timeBaseUnstake;
        const overTimeBootReward = currentTime - timeBootsUnstake;
        const second24h = 86400;
        const second2day = 172800;
        const second30days = 2592000;
        setisClaimBaseReward(overTimeBaseReward >= second24h);
        setIsClaimBootReward(overTimeBootReward >= second30days);
        setIsUnStakeLp(overTimeBaseReward >= second2day);
        console.log(isUnStakeLp, 'ttt');
        objUser = {
          ...res,
          available: parseFloat(balanceBigFormat).toString(),
          totalBoost: total.totalBoost ?? '',
          totalDeposit: total.totalDeposit ?? '',
          pendingAmount: pendingAmountString.toString()
        };
      })
      .catch(err => {
        throw err;
      });
    await methods
      .call(vStrkContract.methods.balanceOf, [accounts])
      .then(res => {
        const vStrkString = +new BigNumber(res).div(new BigNumber(10).pow(18));
        if (vStrkString < 0.001) {
          setUserInfo({ ...objUser, vStrk: '< 0.001' });
          return;
        }
        setUserInfo({ ...objUser, vStrk: vStrkString });
      });
  };
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
      if (valueFormat > +userInfo?.available) {
        setMessErr({
          mess: 'The amount has exceded your balance. Try again',
          show: true
        });
      }
    }
  };
  // stake
  const handleStake = async () => {
    if (val > +userInfo?.available) {
      setMessErr({
        mess: 'The amount has exceded your balance. Try again',
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
      const valueBigNumber = new BigNumber(val).times(
        new BigNumber(10).pow(18)
      );
      await methods
        .send(
          farmingContract.methods.deposit,
          [0, new BigNumber(valueBigNumber).integerValue()],
          accounts
        )
        .then(res => {
          if (res) {
            getDataUserInfor();
            setTxhash(res.transactionHash);
            setiIsConfirm(false);
            setIsSuccess(true);
          }
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
          accounts
        )
        .then(res => {
          setTxhash(res.transactionHash);
          setiIsConfirm(false);
          setIsSuccess(true);
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
  const handleSelectItem = useCallback(
    (e, item) => {
      if (e.isTrusted) {
        const index = dataNFT.findIndex(res => {
          return res.token_id === item.token_id;
        });
        const dataActiveStakeNFT = _.map(dataNFT, (i, _index) => {
          if (_index === index) {
            return {
              ...i,
              active: !i.active
            };
          }
          return {
            ...i
          };
        });
        setDataNFT(dataActiveStakeNFT);
        const dataStaking = dataNFT.filter(it => {
          return it.active === true;
        });
        setItemStaking(dataStaking);
      }
    },
    [dataNFT]
  );
  const handleSelectItemNFT = useCallback(
    (e, item) => {
      if (e.isTrusted) {
        const index = dataNFTUnState.findIndex(res => {
          return res.token_id === item.token_id;
        });
        // eslint-disable-next-line no-plusplus
        const dataActiveUnStakeNFT = _.map(dataNFTUnState, (i, _index) => {
          if (_index === index) {
            return {
              ...i,
              active: !i.active
            };
          }
          return {
            ...i
          };
        });
        setDataNFTUnState(dataActiveUnStakeNFT);
        const dataStaked = dataNFTUnState.filter(it => {
          return it.active === true;
        });
        setItemStaked(dataStaked);
      }
    },
    [dataNFTUnState]
  );
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

  useEffect(() => {
    getDataUserInfor();
  }, [txhash]);
  const fetchNFTs = async () => {
    // get polygon NFTs for address
    setIsLoading(true);
    try {
      await axiosInstanceMoralis
        .get(
          `/${settings.selectedAddress}/nft?chain=rinkeby&format=decimal&limit=20`
        )
        .then(res => {
          const data = res.data.result;
          if (data.length > 0) {
            // eslint-disable-next-line no-shadow
            const dataConvert = _.cloneDeep(data);
            // eslint-disable-next-line array-callback-return
            dataConvert.map(item => {
              // eslint-disable-next-line no-param-reassign
              item.active = false;
              // eslint-disable-next-line no-param-reassign
              item.img = IconDuck;
              // eslint-disable-next-line no-param-reassign
              item.name = `${item.name}${' #'}${item.token_id}`;
            });
            const dataStakeClone = _.cloneDeep(dataConvert);
            const dataCloneUnState = _.cloneDeep(dataConvert);
            setDataNFT(dataStakeClone);
            setDataNFTUnState(dataCloneUnState);
            setIsLoading(false);
          }
        });
    } catch (err) {
      throw err;
    }
  };
  useEffect(() => {
    fetchNFTs();
  }, []);
  return (
    <>
      <React.Fragment>
        <MainLayout title="Dashboard">
          <DashboardStaking
            totalBoost={userInfo?.totalBoost}
            totalDeposit={userInfo?.totalDeposit}
            amount={userInfo?.amount}
            address={settings?.selectedAddress}
          />
          <SDiv>
            <SHeader>
              <SText>STRK-ETH Staking</SText>
              <SHref target="_blank" href={constants.SUPPORT_URL}>
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
                    {settings.selectedAddress ? (
                      <SInforValue>
                        <SIconSmall>
                          <SImgFlashSmall src={IconFlashSmall} />
                          <SImgLpSmall src={IconLpSmall} />
                        </SIconSmall>
                        {userInfo.available ?? '0'}
                      </SInforValue>
                    ) : (
                      <SInforValue>-</SInforValue>
                    )}
                  </SInfor>
                  <SInfor>
                    <SInforText>Staked</SInforText>
                    {settings.selectedAddress ? (
                      <SInforValue>
                        <SIconSmall>
                          <SImgFlashSmall src={IconFlashSmall} />
                          <SImgLpSmall src={IconLpSmall} />
                        </SIconSmall>
                        {userInfo.amount ?? '0'}
                      </SInforValue>
                    ) : (
                      <SInforValue>-</SInforValue>
                    )}
                  </SInfor>
                </SInput>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <Row>
                  <Col xs={{ span: 24 }} lg={{ span: 18 }}>
                    {settings.selectedAddress ? (
                      <>
                        <SBtn>
                          <SBtnStake onClick={handleStake}>Stake</SBtnStake>
                          <Tooltip
                            placement="top  "
                            title="Countdown will be reset if you stake more without claiming the reward"
                          >
                            <SQuestion src={IconQuestion} />
                          </Tooltip>
                        </SBtn>
                        <SBtnUn>
                          {isUnStakeLp ? (
                            <SBtnUnstake onClick={handleUnStake}>
                              UnStake
                            </SBtnUnstake>
                          ) : (
                            <SBtnUnstake style={{ cursor: 'not-allowed' }}>
                              UnStake
                            </SBtnUnstake>
                          )}

                          <Tooltip
                            placement="top"
                            title="Countdown will be reset if you unstake a part without claiming the reward"
                          >
                            <SQuestion src={IconQuestion} />
                          </Tooltip>
                        </SBtnUn>
                      </>
                    ) : (
                      <></>
                    )}
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
                  {settings.selectedAddress ? (
                    <SInforValue>
                      <SIconSmall>
                        <SImgFlashSmall src={IconFlashSmall} />
                      </SIconSmall>

                      {userInfo.accBaseReward ?? '0'}
                    </SInforValue>
                  ) : (
                    <SInforValue>-</SInforValue>
                  )}
                </SInforClaim>
                <SInforClaim>
                  <SInforText>Boost Reward</SInforText>
                  {settings.selectedAddress ? (
                    <SInforValue>
                      <SIconSmall>
                        <SImgFlashSmall src={IconFlashSmall} />
                      </SIconSmall>
                      {!userInfo.accBoostReward ||
                      userInfo.accBaseReward !== '0'
                        ? '0'
                        : userInfo.accBaseReward}
                    </SInforValue>
                  ) : (
                    <SInforValue>-</SInforValue>
                  )}
                </SInforClaim>
                <SInforClaim>
                  <SInforText>vStrk</SInforText>
                  {settings.selectedAddress ? (
                    <SInforValue>
                      <SIconSmall>
                        <SImgLpSmall src={IconVstrkSmall} />
                      </SIconSmall>
                      {userInfo.vStrk ?? '0'}
                    </SInforValue>
                  ) : (
                    <SInforValue>-</SInforValue>
                  )}
                </SInforClaim>
              </Col>
              {/* Claim */}
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <Row>
                  <Col xs={{ span: 24 }} lg={{ span: 18 }}>
                    <SBtnClaim>
                      {settings.selectedAddress && !!isClaimBaseReward ? (
                        <SClaim onClick={handleClainBaseReward}>Claim</SClaim>
                      ) : (
                        <SUnClaim>Claim</SUnClaim>
                      )}
                      <Tooltip
                        placement="top"
                        title="You can only claim reward once daily"
                      >
                        <SQuestion src={IconQuestion} />
                      </Tooltip>
                    </SBtnClaim>
                  </Col>
                  <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                    <CountDownClaim
                      times={expiryTimeBase}
                      address={settings?.selectedAddress}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={{ span: 24 }} lg={{ span: 18 }}>
                    <SBtnClaimStart>
                      {settings.selectedAddress && !!isClaimBootReward ? (
                        <SClaim onClick={handleClainBootReward}>Claim</SClaim>
                      ) : (
                        <SUnClaim onClick={handleClainBootReward}>
                          Claim
                        </SUnClaim>
                      )}
                      <Tooltip
                        placement="top"
                        title="You can only claim reward once monthly"
                      >
                        <SQuestion src={IconQuestion} />
                      </Tooltip>
                    </SBtnClaimStart>
                  </Col>
                  <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                    <CountDownClaim
                      times={expiryTimeBoost}
                      address={settings?.selectedAddress}
                    />
                  </Col>
                </Row>
                {/* <Row>
                  <Col xs={{ span: 24 }} lg={{ span: 18 }}>
                    <SBtnClaimStart>
                      {settings.selectedAddress ? (
                        <SClaim>Claim</SClaim>
                      ) : (
                        <SUnClaim>Claim</SUnClaim>
                      )}
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
                </Row> */}
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
                  <SDetails>
                    NFT selected: {itemStaking.length}/{dataNFT.length}
                  </SDetails>
                </SFlex>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 15 }}>
                <SFlexEnd>
                  {settings.selectedAddress && dataNFT.length > 0 ? (
                    <SSTake onClick={handleStakeNFT}>Stake</SSTake>
                  ) : (
                    <></>
                  )}
                </SFlexEnd>
              </Col>
            </Row>
            {isLoading ? (
              <>
                <Loadding />
              </>
            ) : (
              <>
                <SSlider>
                  {dataNFT.length === 0 && (
                    <SSliderNoData>
                      <SSliderNoDataImg src={IconNoData} />
                      <SSliderNoDataText>
                        You don’t own any NFTs
                      </SSliderNoDataText>
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
                            <SSactive src={IconNotSelect} />
                          ) : (
                            <SSUnactive src={IconSelect} />
                          )}
                        </SItemSlider>
                      );
                    })}
                  </Slider>
                </SSlider>
              </>
            )}
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
                  <SDetails>
                    NFT staked {itemStaked.length}/{dataNFTUnState.length}
                  </SDetails>
                </SFlex>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 15 }}>
                <SFlexEnd>
                  {settings.selectedAddress && dataNFTUnState.length > 0 ? (
                    <SSUnTake onClick={handleUnStakeNFT}>UnStake</SSUnTake>
                  ) : (
                    <></>
                  )}
                </SFlexEnd>
              </Col>
            </Row>
            {isLoading ? (
              <>
                <Loadding />
              </>
            ) : (
              <>
                <SSlider>
                  {dataNFTUnState.length === 0 && (
                    <SSliderNoData>
                      <SSliderNoDataImg src={IconNoData} />
                      <SSliderNoDataText>
                        You don’t own any NFTs
                      </SSliderNoDataText>
                    </SSliderNoData>
                  )}
                  <Slider {...AUDITOR_SETTING}>
                    {dataNFTUnState?.map(item => {
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
                            <SSactive src={IconNotSelect} />
                          ) : (
                            <SSUnactive src={IconSelect} />
                          )}
                        </SItemSlider>
                      );
                    })}
                  </Slider>
                </SSlider>
              </>
            )}

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
