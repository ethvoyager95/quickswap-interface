/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-concat */
/* eslint-disable no-sequences */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-self-compare */
/* eslint-disable no-const-assign */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  SDivPadding,
  SInput,
  SMax,
  SBtnDisabled,
  SBtnClaim,
  SBtnClaimStart,
  SInforText,
  SVSTRKTootip,
  SInfor,
  SInforClaim,
  SInforValue,
  SIconSmall,
  SImgFlashSmall,
  SImgLpSmall,
  SQuestion,
  SBtnStake,
  SSTake,
  SBtnUn,
  SBtnUnstake,
  SSUnTake,
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
  getNFTContract,
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
import IconLinkBlue from '../../../assets/img/link_blue.svg';
import IconNoData from '../../../assets/img/no_data.svg';
import IConNext from '../../../assets/img/arrow-next.svg';
import IConPrev from '../../../assets/img/arrow-prev.svg';
import IconFlashSmall from '../../../assets/img/flash_small.svg';
import IconLpSmall from '../../../assets/img/lp_small.svg';
import IconVstrkSmall from '../../../assets/img/flash_vstrk.svg';
import IconSelect from '../../../assets/img/select.svg';
import IconNotSelect from '../../../assets/img/not_select.svg';
import IconNotConnect from '../../../assets/img/not_connect_data.svg';

// eslint-disable-next-line import/order
const MAX_STAKE_NFT = 10;
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
  const address = settings.selectedAddress;
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
  const [isApproveLP, setIsApproveLP] = useState(true);
  const [isApproveNFT, setIsApproveNFT] = useState(true);
  const [isClaimBaseReward, setisClaimBaseReward] = useState(false);
  const [isClaimBootReward, setIsClaimBootReward] = useState(false);
  const [countNFT, setCounNFT] = useState(0);
  const [isUnStakeLp, setIsUnStakeLp] = useState(false);
  const [itemStaking, setItemStaking] = useState([]);
  const [itemStaked, setItemStaked] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [expectedBoostAPR, setExpectedBoostAPR] = useState(0);
  const [yourBoostAPR, setYourBoostAPR] = useState(0);
  // contract
  const farmingContract = getFarmingContract();
  const lpContract = getLPContract();
  const vStrkContract = getVSTRKContract();
  const nFtContract = getNFTContract();
  // get userInfor
  const getDataUserInfor = async () => {
    window.web3 = new Web3(window.ethereum);
    let sTokenBalance = null;
    if (address) {
      sTokenBalance = await methods.call(lpContract.methods.balanceOf, [
        address
      ]);
    }
    const total = {
      totalBoost: '',
      totalDeposit: ''
    };
    setIsLoading(true);
    try {
      // eslint-disable-next-line no-debugger
      await axiosInstance
        .get(`/api/user/total_stake`)
        .then(res => {
          if (res) {
            const result = res.data.data;
            total.totalBoost = result.totalBoost;
            const totalDepositString = +new BigNumber(+result.totalDeposit).div(
              new BigNumber(10).pow(18)
            );
            total.totalDeposit = totalDepositString.toString();
          }
        })
        .catch(err => {
          throw err;
        });
      setIsLoading(false);
    } catch (err) {
      throw err;
    }
    let objUser = {};
    await methods
      .call(farmingContract.methods.userInfo, [0, address])
      .then(res => {
        const balanceBigNumber = new BigNumber(sTokenBalance).div(
          new BigNumber(10).pow(18)
        );
        const pendingAmountString = +new BigNumber(res.pendingAmount).div(
          new BigNumber(10).pow(18)
        );
        const amountNumber = +new BigNumber(res.amount).div(
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
        const currentTime = Math.floor(new Date().getTime() / 1000);
        const timeBaseUnstake = +res.depositedDate;
        const timeBootsUnstake = +res.boostedDate;
        const overTimeBaseReward = currentTime - timeBaseUnstake;
        const overTimeBootReward = currentTime - timeBootsUnstake;
        const second24h = 86400;
        const second2day = 172800;
        const second30days = 2592000;

        if (timeBaseUnstake === 0) {
          setisClaimBaseReward(false);
          setIsUnStakeLp(false);
        } else {
          setisClaimBaseReward(overTimeBaseReward >= second24h);
          setIsUnStakeLp(overTimeBaseReward >= second2day);
        }
        if (timeBootsUnstake === 0) {
          setIsClaimBootReward(false);
        } else {
          setIsClaimBootReward(overTimeBootReward >= second30days);
        }
        objUser = {
          ...res,
          amount: amountNumber < 0.001 ? '<0.001' : amountNumber.toString(),
          available: parseFloat(balanceBigFormat).toString(),
          totalBoost: total.totalBoost ?? '',
          totalDeposit: total.totalDeposit ?? '',
          pendingAmount: pendingAmountString.toString(),
          depositedDate: timeBaseUnstake,
          boostedDate: timeBootsUnstake
        };
      })
      .catch(err => {
        throw err;
      });
    await methods.call(vStrkContract.methods.balanceOf, [address]).then(res => {
      const vStrkString = +new BigNumber(res).div(new BigNumber(10).pow(18));
      if (vStrkString < 0.001) {
        setUserInfo({ ...objUser, vStrk: '< 0.001' });
        return;
      }
      setUserInfo({ ...objUser, vStrk: vStrkString });
    });
  };
  // get data
  const getDataLP = useCallback(async () => {
    if (!address) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      await axiosInstanceMoralis
        .get(`/${address}/nft?chain=rinkeby&format=decimal&limit=20`)
        .then(res => {
          const data = res.data.result;
          if (data.length > 0) {
            const dataMyContract = _.filter(data, item => {
              return item.token_address === constants.NFT_ADDRESS.toLowerCase();
            });
            // eslint-disable-next-line no-shadow
            const dataConvert = _.cloneDeep(dataMyContract);
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
            const dataStakeCloneSort = _.sortBy(dataStakeClone, 'token_id');
            setDataNFT(dataStakeCloneSort);
            setIsLoading(false);
          }
          setIsLoading(false);
        });
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, [address]);
  const getDataNFT = useCallback(async () => {
    if (!address) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      await methods
        .call(farmingContract.methods.getUserInfo, [0, address])
        .then(res => {
          const lstStakedId = res.boostFactors;
          const dataCovert = [...lstStakedId];
          setCounNFT(dataCovert.length);
          // eslint-disable-next-line no-unused-vars
          const newArray = dataCovert?.map(item => {
            // eslint-disable-next-line no-return-assign
            return (item = {
              name: 'AnnexIronWolf ' + `#${item}`,
              token_id: item,
              img: IconDuck,
              active: false
            });
          });
          const newArraySort = _.sortBy(newArray, 'token_id');
          setDataNFTUnState(newArraySort);
          setIsLoading(false);
        });
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
    setIsLoading(false);
  }, [address]);
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
      if (+valueFormat > +userInfo?.available) {
        setMessErr({
          mess: 'The amount has exceded your balance. Try again',
          show: true
        });
      }
    }
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
  // check approve lp
  const checkApproveLP = useCallback(async () => {
    if (!address) {
      setIsApproveLP(true);
      return;
    }
    await methods
      .call(lpContract.methods.allowance, [
        address,
        constants.CONTRACT_FARMING_ADDRESS
      ])
      .then(res => {
        const lpApproved = +new BigNumber(res).div(new BigNumber(10).pow(18));
        if (messErr.show || messErr.noLP) {
          setIsApproveLP(true);
        }
        if (lpApproved === 0 || +val > lpApproved) {
          setIsApproveLP(false);
        } else {
          setIsApproveLP(true);
        }
      });
  }, [val, address, handleMaxValue]);
  const checkApproveNFT = useCallback(async () => {
    setIsApproveNFT(true);
    await methods
      .call(nFtContract.methods.isApprovedForAll, [
        address,
        constants.CONTRACT_FARMING_ADDRESS
      ])
      .then(res => {
        if (res) {
          setIsApproveNFT(res);
        }
      });
  }, [address]);

  // approved Lp
  const handleApproveLp = useCallback(async () => {
    setiIsConfirm(true);
    const MAX_APPROVE = new BigNumber(2)
      .pow(256)
      .minus(1)
      .toString(10);
    await methods
      .send(
        lpContract.methods.approve,
        [constants.CONTRACT_FARMING_ADDRESS, MAX_APPROVE],
        address
      )
      .then(res => {
        if (res) {
          setiIsConfirm(false);
          setTxhash(res.transactionHash);
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
          setTextErr('Some thing went wrong!');
        }
        throw err;
      });
  }, [val, handleMaxValue]);
  // check approve lp
  useEffect(() => {
    checkApproveLP();
    checkApproveNFT();
  }, [val, handleMaxValue, isApproveLP, txhash]);
  const handleApproveNFT = useCallback(async () => {
    setiIsConfirm(true);
    await methods
      .send(
        nFtContract.methods.setApprovalForAll,
        [constants.CONTRACT_FARMING_ADDRESS, true],
        address
      )
      .then(res => {
        if (res) {
          if (res) {
            setiIsConfirm(false);
            setTxhash(res.transactionHash);
          }
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
          setTextErr('Some thing went wrong!');
        }
        throw err;
      });
  }, []);
  // time claim base reward countdown
  const expiryTimeBase = useMemo(() => {
    if (userInfo) {
      const overOneDate = new Date(userInfo.depositedDate * 1000);
      return overOneDate.setDate(overOneDate.getDate() + 1);
    }
    return null;
  }, [userInfo, address]);
  // time claim boost reward count down
  const expiryTimeBoost = useMemo(() => {
    if (userInfo) {
      const over30days = new Date(userInfo.boostedDate * 1000);
      return over30days.setDate(over30days.getDate() + 30);
    }
    return null;
  }, [userInfo, address]);

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
      const valueBigNumber = new BigNumber(val).times(
        new BigNumber(10).pow(18)
      );
      if (valueBigNumber.isZero()) {
        setMessErr({
          mess: 'Invalid amount',
          show: true
        });
        setiIsConfirm(false);
        return;
      }
      await methods
        .send(
          farmingContract.methods.deposit,
          [0, new BigNumber(valueBigNumber).integerValue()],
          address
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
            setTextErr('Some thing went wrong!');
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
      await methods
        .send(
          farmingContract.methods.withdraw,
          [0, new BigNumber(val).integerValue()],
          address
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
            setTextErr('Some thing went wrong!');
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
    await methods
      .send(
        farmingContract.methods.claimBaseRewards,
        [new BigNumber(0).integerValue()],
        address
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
          setTextErr('Some thing went wrong!');
        }
        throw err;
      });
  };
  const handleClainBootReward = async () => {
    await methods
      .send(
        farmingContract.methods.claimBoostReward,
        [new BigNumber(0).integerValue()],
        address
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
          setTextErr('Some thing went wrong!');
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
        const dataStaking = dataActiveStakeNFT.filter(it => {
          return it.active === true;
        });
        const valueExpected = dataStaking.length * 20;
        setExpectedBoostAPR(valueExpected);
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
        const dataStaked = dataActiveUnStakeNFT.filter(it => {
          return it.active === true;
        });
        const valueBoots = dataStaked.length * 20;
        setYourBoostAPR(valueBoots);
        setItemStaked(dataStaked);
      }
    },
    [dataNFTUnState]
  );
  // Stake NFT
  const handleStakeDialog = async () => {
    setIsStakeNFT(false);
    setiIsConfirm(true);
    const id = itemStaking[itemStaking.length - 1].token_id;
    await methods
      .send(
        farmingContract.methods.boost,
        [0, new BigNumber(id).integerValue()],
        address
      )
      .then(res => {
        setTxhash(res.transactionHash);
        setiIsConfirm(false);
        setIsSuccess(true);
        getDataNFT();
        getDataLP();
        setItemStaking([]);
      })
      .catch(err => {
        if (err.message.includes('User denied')) {
          setIsShowCancel(true);
          setiIsConfirm(false);
          setTextErr('Decline transaction');
        } else {
          setIsShowCancel(true);
          setiIsConfirm(false);
          setTextErr('Some thing went wrong!');
        }
        throw err;
      });
  };
  // unStake NFT
  const handleUnStakeDialog = async () => {
    setIsUnStakeNFT(false);
    setiIsConfirm(true);
    const id = itemStaked[itemStaked.length - 1].token_id;
    await methods
      .send(
        farmingContract.methods.unBoost,
        [0, new BigNumber(id).integerValue()],
        address
      )
      .then(res => {
        setTxhash(res.transactionHash);
        setiIsConfirm(false);
        setIsSuccess(true);
        getDataNFT();
        getDataLP();
        setItemStaked([]);
      })
      .catch(err => {
        if (err.message.includes('User denied')) {
          setIsShowCancel(true);
          setiIsConfirm(false);
          setTextErr('Decline transaction');
        } else {
          setIsShowCancel(true);
          setiIsConfirm(false);
          setTextErr('Some thing went wrong!');
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

  useEffect(() => {
    if (address) {
      getDataUserInfor();
    }
  }, [txhash, address]);

  useEffect(() => {
    if (address) {
      getDataLP();
      getDataNFT();
    }
  }, [address]);

  return (
    <>
      <React.Fragment>
        <MainLayout title="">
          <DashboardStaking
            totalBoost={userInfo?.totalBoost}
            totalDeposit={userInfo?.totalDeposit}
            amount={countNFT}
            address={settings?.selectedAddress}
            loadding={isLoading}
          />
          <SDivPadding>
            <SHeader>
              <SText>Interest Rate Model</SText>
              <SHref target="_blank" href={constants.SUPPORT_URL}>
                Get STRK-ETH LPs
                <SImgErr src={IconLinkBlue} />
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
                    minLength={1}
                    maxLength={79}
                    placeholder="Enter a number"
                    onChange={event => handleChangeValue(event)}
                  />
                  {address ? (
                    <SMax onClick={handleMaxValue}>MAX</SMax>
                  ) : (
                    <SBtnDisabled>MAX</SBtnDisabled>
                  )}

                  {messErr?.show === true && <SError>{messErr.mess}</SError>}
                  {messErr?.noLP === true && (
                    <SHrefErr>
                      {messErr.mess}
                      <SLinkErr target="_blank" href={constants.SUPPORT_URL}>
                        <SImgErr src={IconLink} />
                      </SLinkErr>
                    </SHrefErr>
                  )}
                </SInput>
              </Col>
            </Row>
            <Row>
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <SInfor>
                  <SInforText>Available</SInforText>
                  {address ? (
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
                  {address ? (
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
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <Row>
                  <Col xs={{ span: 24 }} lg={{ span: 18 }}>
                    {isApproveLP && address ? (
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
                            <>
                              <SBtnUnstake onClick={handleUnStake}>
                                UnStake
                              </SBtnUnstake>
                            </>
                          ) : (
                            <>
                              <SSUnTake
                                disabled
                                style={{ cursor: 'pointer !important' }}
                              >
                                UnStake
                              </SSUnTake>
                            </>
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
                      <>
                        {address && (
                          <SBtn>
                            <SBtnStake onClick={handleApproveLp}>
                              Approve Staking
                            </SBtnStake>
                          </SBtn>
                        )}
                      </>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </SDivPadding>
          <SDivPadding>
            <SText>STRK-ETH Harvest</SText>
            <Row>
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <SInforClaim>
                  <SInforText>Base Reward</SInforText>
                  {address ? (
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
                  {address ? (
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
                  <SInforText>
                    vSTRK claimed
                    <SVSTRKTootip>
                      <Tooltip
                        placement="top"
                        title="vSTRK is auto-claimed to your wallet 
                      (10 vSTRK is minted for each STRK-ETH to stake)"
                      >
                        <SQuestion src={IconQuestion} />
                      </Tooltip>
                    </SVSTRKTootip>
                  </SInforText>
                  {address ? (
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
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <Row>
                  <Col xs={{ span: 24 }} lg={{ span: 18 }}>
                    {address && isApproveLP && (
                      <SBtnClaim>
                        {isClaimBaseReward ? (
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
                    )}
                  </Col>
                  <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                    {expiryTimeBase && address && isApproveLP ? (
                      <CountDownClaim
                        times={expiryTimeBase}
                        address={address}
                      />
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <Row>
                  <Col xs={{ span: 24 }} lg={{ span: 18 }}>
                    {address && isApproveLP && (
                      <SBtnClaimStart>
                        {isClaimBootReward ? (
                          <SClaim onClick={handleClainBootReward}>Claim</SClaim>
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
                    )}
                  </Col>
                  <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                    {expiryTimeBoost && address && isApproveLP ? (
                      <CountDownClaim
                        times={expiryTimeBoost}
                        address={address}
                      />
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </SDivPadding>
          <SDiv>
            <Row>
              <Col xs={{ span: 24 }} lg={{ span: 9 }}>
                <SFlex>
                  <SText>
                    NFT Staking
                    <Tooltip
                      placement="left"
                      title="Only display all NFTs that can be staked into this pool"
                    >
                      <SQuestion src={IconQuestion} />
                    </Tooltip>
                  </SText>
                </SFlex>
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 15 }}>
                <SFlexEnd>
                  <SDetailsColor>
                    {' '}
                    Expected Boost APR: {expectedBoostAPR}%{' '}
                  </SDetailsColor>
                </SFlexEnd>
              </Col>
            </Row>
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
                  {address && dataNFT.length > 0 ? (
                    <>
                      {isApproveNFT ? (
                        <>
                          <SSTake
                            disabled={
                              itemStaking.length === 0 ||
                              itemStaking.length > MAX_STAKE_NFT
                            }
                            onClick={handleStakeNFT}
                          >
                            Stake
                          </SSTake>
                        </>
                      ) : (
                        <>
                          <SSTake onClick={handleApproveNFT}>
                            Approve Staking
                          </SSTake>
                        </>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </SFlexEnd>
              </Col>
            </Row>
            {isLoading ? (
              <Row>
                <Loadding />
              </Row>
            ) : (
              <>
                <SSlider>
                  {dataNFT.length === 0 && (
                    <SSliderNoData>
                      <SSliderNoDataImg
                        src={address ? IconNoData : IconNotConnect}
                      />
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
                {address && (
                  <STextSelecT>
                    Please select NFTs you want to stake
                  </STextSelecT>
                )}
              </>
            )}
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
                  <SDetailsColor>
                    {' '}
                    Your Boost APR: {yourBoostAPR}%{' '}
                  </SDetailsColor>
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
                  {address && dataNFTUnState.length > 0 ? (
                    <>
                      {isApproveNFT ? (
                        <>
                          <SSTake
                            disabled={itemStaked.length === 0}
                            onClick={handleUnStakeNFT}
                          >
                            UnStake
                          </SSTake>
                        </>
                      ) : (
                        <>
                          <SSTake onClick={handleApproveNFT}>
                            Approve Staking
                          </SSTake>
                        </>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </SFlexEnd>
              </Col>
            </Row>
            {isLoading ? (
              <Row>
                <Loadding />
              </Row>
            ) : (
              <>
                <SSlider>
                  {dataNFTUnState.length === 0 && (
                    <SSliderNoData>
                      <SSliderNoDataImg
                        src={address ? IconNoData : IconNotConnect}
                      />
                      <SSliderNoDataText>
                        You don’t own any NFTs
                      </SSliderNoDataText>
                    </SSliderNoData>
                  )}
                  <Slider {...AUDITOR_SETTING}>
                    {dataNFTUnState &&
                      dataNFTUnState?.map(item => {
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
                {address && (
                  <STextSelecT>
                    Please select NFTs you want to stake
                  </STextSelecT>
                )}
              </>
            )}
          </SDiv>
        </MainLayout>
        {/* Stake */}
        <DialogStake
          isStakeNFT={isStakeNFT}
          close={handleCloseStake}
          itemStaking={itemStaking}
          listStake={dataNFT}
          listUnStake={dataNFTUnState}
          handleStakeDialog={handleStakeDialog}
        />
        {/* UnStake */}
        <DialogUnStake
          isUnStakeNFT={isUnStakeNFT}
          close={handleCloseUnStake}
          itemStaked={itemStaked}
          list={dataNFTUnState}
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
