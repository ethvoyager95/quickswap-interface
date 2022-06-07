/* eslint-disable consistent-return */
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
import _ from 'lodash';
import * as constants from 'utilities/constants';
// import { checkIsValidNetwork } from 'utilities/common';
import {
  DECIMALS_INPUT,
  divDecimals,
  renderValueFixed,
  renderValueDecimal,
  divDecimalsBigNumber,
  MAX_APPROVE,
  MINIMUM_VALUE,
  SECOND24H,
  SECOND2DAY,
  SECOND30DAY,
  PERCENT_APR,
  MAX_STAKE_NFT,
  SETTING_SLIDER,
  UNSTAKE,
  CLAIMBASE,
  CLAIMBOOST,
  UNSTAKENFT
} from './helper';
// eslint-disable-next-line import/named
import { axiosInstance, axiosInstanceMoralis } from '../../../utilities/axios';
import '../../../assets/styles/slick.scss';
import * as ST from '../../../assets/styles/staking.js';
// eslint-disable-next-line import/no-duplicates
import DialogConfirm from './DialogConfirm';
import DialogErr from './DialogErr';
import {
  getFarmingContract,
  getLPContract,
  getVSTRKContract,
  getNFTContract,
  getSTRKClaimContract,
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
import IconLink from '../../../assets/img/launch.svg';
import IconLinkBlue from '../../../assets/img/link_blue.svg';
import IconNoData from '../../../assets/img/no_data.svg';
import IConNext from '../../../assets/img/arrow-next.svg';
import IConPrev from '../../../assets/img/arrow-prev.svg';
import IconFlashSmall from '../../../assets/img/flash_small.svg';
import IconLpSmall from '../../../assets/img/lp_small.svg';
import IconDuck from '../../../assets/img/duck.svg';

// eslint-disable-next-line import/order
function SampleNextArrow(props) {
  // eslint-disable-next-line react/prop-types
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, background: IConNext, display: 'block' }}
      onClick={onClick}
    />
  );
}
function SamplePrevArrow(props) {
  // eslint-disable-next-line react/prop-types
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, background: IConPrev, display: 'block' }}
      onClick={onClick}
    />
  );
}
const AUDITOR_SETTING = {
  ...SETTING_SLIDER,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />
};
const abortController = new AbortController();

// eslint-disable-next-line react/prop-types
function Staking({ settings, setSetting }) {
  const address = settings.selectedAddress;
  const [val, setVal] = useState('');
  const [isMaxValue, setIsMaxValue] = useState(false);
  const [isMaxValueUnStake, setIsMaxValueUnStake] = useState(false);
  const [valUnStake, setValUnStake] = useState('');
  const [messErr, setMessErr] = useState({
    mess: '',
    show: false,
    noLP: false
  });
  const [messErrUnStake, setMessErrUnStake] = useState({
    mess: '',
    show: false,
    noLP: false
  });
  const [txhash, setTxhash] = useState('');
  const [dataNFT, setDataNFT] = useState([]);
  const [dataNFTUnState, setDataNFTUnState] = useState([]);
  const [textErr, setTextErr] = useState('');
  const [textSuccess, setTextSuccess] = useState('');
  const [isStakeNFT, setIsStakeNFT] = useState(false);
  const [isUnStakeNFT, setIsUnStakeNFT] = useState(false);
  const [isConfirm, setiIsConfirm] = useState(false);
  const [isShowCancel, setIsShowCancel] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [isLoadingUnStake, setIsLoadingUnStake] = useState(false);
  const [isApproveLP, setIsApproveLP] = useState(true);
  const [isApproveNFT, setIsApproveNFT] = useState(false);
  const [isAprroveVstrk, setIsAprroveVstrk] = useState(false);
  const [isClaimBaseReward, setisClaimBaseReward] = useState(false);
  const [isClaimBootReward, setIsClaimBootReward] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [disabledBtnUn, setDisabledBtnUn] = useState(false);
  const [countNFT, setCounNFT] = useState(0);
  const [isUnStakeLp, setIsUnStakeLp] = useState(false);
  const [isShowCountDownUnStake, setIsShowCountDownUnStake] = useState(false);
  const [isShowCountDownClaimBase, setIsShowCountDownClaimBase] = useState(
    false
  );
  const [isShowCountDownClaimBoost, setIsShowCountDownClaimBoost] = useState(
    false
  );
  const [isShowCountDownUnStakeNFT, setIsShowCountDownUnStakeNFT] = useState(
    false
  );

  const [itemStaking, setItemStaking] = useState([]);
  const [itemStaked, setItemStaked] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [yourBoostAPR, setYourBoostAPR] = useState(0);
  const [valueNFTStake, setValueNFTStake] = useState('');
  const [valueNFTUnStake, setValueNFTUnStake] = useState('');
  const [fakeImgNFT, setFakeImgNFT] = useState('');
  // contract
  const farmingContract = getFarmingContract();
  const lpContract = getLPContract();
  const vStrkContract = getVSTRKContract();
  const nFtContract = getNFTContract();
  const strkContract = getSTRKClaimContract();
  // get userInfor
  useMemo(async () => {
    let sTokenBalance = null;
    let decimalLp = null;
    let decimalStrkClaim = null;
    if (address) {
      sTokenBalance = await methods.call(lpContract.methods.balanceOf, [
        address
      ]);
    }
    const objClaim = {
      accBaseReward: '',
      accBoostReward: ''
    };
    let objUser = {};
    if (address) {
      await methods
        .call(lpContract.methods.decimals, [])
        .then(res => {
          decimalLp = res;
        })
        .catch(err => {
          throw err;
        });
      await methods
        .call(strkContract.methods.decimals, [])
        .then(res => {
          decimalStrkClaim = res;
        })
        .catch(err => {
          throw err;
        });
      await methods
        .call(farmingContract.methods.pendingBaseReward, [0, address])
        .then(res => {
          objClaim.accBaseReward = res;
        })
        .catch(err => {
          throw err;
        });
      await methods
        .call(farmingContract.methods.pendingBoostReward, [0, address])
        .then(res => {
          objClaim.accBoostReward = res;
        })
        .catch(err => {
          throw err;
        });
      await methods
        .call(farmingContract.methods.userInfo, [0, address])
        .then(res => {
          const balanceBigNumber = divDecimals(sTokenBalance, decimalLp);
          const pendingAmountNumber = divDecimals(res.pendingAmount, decimalLp);
          const amountNumber = divDecimals(res.amount, decimalLp);
          const totalAmount = amountNumber.plus(pendingAmountNumber);
          const totalUnStake = new BigNumber(res?.pendingAmount).plus(
            new BigNumber(res?.amount)
          );
          const totalAmountNumber = totalAmount.toNumber();
          const accBaseRewardBigNumber = divDecimals(
            objClaim.accBaseReward,
            decimalStrkClaim
          );
          const accBoostRewardBigNumber = divDecimals(
            objClaim.accBoostReward,
            decimalStrkClaim
          );
          const accBaseRewardString = accBaseRewardBigNumber.toNumber();
          const accBoostRewardString = accBoostRewardBigNumber.toNumber();
          const balanceBigFormat = balanceBigNumber.toNumber().toString();
          const totalAmountBigNumber = totalAmount.toNumber().toString();
          if (balanceBigNumber.isZero()) {
            setMessErr({
              mess: 'No token to stake: Get STRK-ETH LPs',
              show: false,
              noLP: true
            });
          } else {
            setMessErr({
              mess: '',
              show: false,
              noLP: false
            });
          }
          const currentTime = Math.floor(new Date().getTime() / 1000);
          const timeBaseUnstake = +res.depositedDate;
          const timeBootsUnstake = +res.boostedDate;
          const overTimeBaseReward = currentTime - timeBaseUnstake;
          const overTimeBootReward = currentTime - timeBootsUnstake;
          if (timeBaseUnstake === 0) {
            setisClaimBaseReward(false);
            setIsUnStakeLp(false);
          } else {
            setisClaimBaseReward(overTimeBaseReward >= SECOND24H);
            if (overTimeBaseReward >= SECOND2DAY) {
              setIsUnStakeLp(true);
            } else {
              setIsUnStakeLp(false);
            }
          }
          if (timeBootsUnstake === 0) {
            setIsClaimBootReward(false);
          } else {
            setIsClaimBootReward(overTimeBootReward >= SECOND30DAY);
          }
          if (accBaseRewardString > 0) {
            setisClaimBaseReward(true);
          } else {
            setisClaimBaseReward(false);
          }
          if (accBoostRewardString > 0) {
            setIsClaimBootReward(true);
          } else {
            setIsClaimBootReward(false);
          }
          objUser = {
            ...res,
            amount: renderValueFixed(totalAmountBigNumber),
            amountNumber: totalAmountNumber,
            available: renderValueFixed(balanceBigFormat).toString(),
            availableNumber: balanceBigNumber.toNumber(),
            availableMax: sTokenBalance,
            amountMax: totalUnStake,
            accBaseReward: renderValueFixed(accBaseRewardString),
            accBoostReward: renderValueFixed(accBoostRewardString),
            depositedDate: timeBaseUnstake,
            boostedDate: timeBootsUnstake,
            decimalLp
          };
        })
        .catch(err => {
          throw err;
        });
      if (address) {
        await axiosInstance
          .get('api/user/total_claim', {
            params: {
              user_address: address
            }
          })
          .then(res => {
            const totalClaim = divDecimals(
              res.data.data.totalClaim,
              18
            ).toNumber();
            setUserInfo({
              ...objUser,
              totalClaim: totalClaim ? renderValueFixed(totalClaim) : '0.0'
            });
          });
      }
    }
  }, [address, txhash, window.ethereum]);

  // get base boost available realtime
  const getBaseBoostRealTime = async () => {
    if (address) {
      let objUser = {};
      let decimalStrkClaim = null;
      let sTokenBalance = null;
      let decimalLp = null;
      const objClaim = {
        accBaseReward: '',
        accBoostReward: ''
      };
      await methods
        .call(strkContract.methods.decimals, [])
        .then(res => {
          decimalStrkClaim = res;
        })
        .catch(err => {
          throw err;
        });
      await methods
        .call(farmingContract.methods.pendingBaseReward, [0, address])
        .then(res => {
          objClaim.accBaseReward = res;
        })
        .catch(err => {
          throw err;
        });
      await methods
        .call(farmingContract.methods.pendingBoostReward, [0, address])
        .then(res => {
          objClaim.accBoostReward = res;
        })
        .catch(err => {
          throw err;
        });
      await methods
        .call(lpContract.methods.decimals, [])
        .then(res => {
          decimalLp = res;
        })
        .catch(err => {
          throw err;
        });
      sTokenBalance = await methods.call(lpContract.methods.balanceOf, [
        address
      ]);
      const accBaseRewardBigNumber = divDecimals(
        objClaim.accBaseReward,
        decimalStrkClaim
      );
      const accBoostRewardBigNumber = divDecimals(
        objClaim.accBoostReward,
        decimalStrkClaim
      );
      const accBaseRewardString = accBaseRewardBigNumber.toNumber();
      const accBoostRewardString = accBoostRewardBigNumber.toNumber();
      const balanceBigNumber = divDecimals(sTokenBalance, decimalLp);
      const balanceBigFormat = balanceBigNumber.toNumber().toString();

      objUser = {
        ...userInfo,
        accBaseReward: renderValueFixed(accBaseRewardString),
        accBoostReward: renderValueFixed(accBoostRewardString),
        available: renderValueFixed(balanceBigFormat).toString(),
        availableNumber: balanceBigNumber.toNumber()
      };
      setUserInfo({ ...objUser });
    }
  };

  // get data
  useMemo(async () => {
    if (!address) {
      setIsLoading(false);
      setDataNFT([]);
      return;
    }
    setIsLoading(true);
    let tokenUri = null;
    let imgFake = null;
    try {
      await methods
        .call(nFtContract.methods.notRevealedUri, [])
        .then(res => {
          tokenUri = res;
        })
        .catch(err => {
          throw err;
        });
      if (tokenUri) {
        await axiosInstance
          .get(`${tokenUri}`)
          .then(res => {
            if (res) {
              imgFake = res?.data.image ?? '';
              setFakeImgNFT(imgFake);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      await axiosInstanceMoralis
        .get(`/${address}/nft?chain=rinkeby&format=decimal&limit=20`)
        .then(res => {
          const data = res.data.result;
          if (data && data.length > 0) {
            const dataMyContract = _.filter(data, item => {
              return item.token_address === constants.NFT_ADDRESS.toLowerCase();
            });
            // eslint-disable-next-line no-shadow
            const dataConvert = _.cloneDeep(dataMyContract);
            if (dataConvert.length > 0) {
              // eslint-disable-next-line array-callback-return
              dataConvert.map(item => {
                item.active = false;
                item.name = `${item.name}${' #'}${item.token_id}`;
                item.id = +item.token_id;
                item.metadata = JSON.parse(item.metadata);
                if (item?.metadata?.image) {
                  item.img = item?.metadata?.image;
                } else {
                  item.img = IconDuck;
                }
              });
            }

            const dataStakeClone = _.cloneDeep(dataConvert);
            console.log(dataStakeClone, 'dataStakeClone');
            setDataNFT(dataStakeClone);
            setIsLoading(false);
          } else {
            setDataNFT([]);
          }
          setIsLoading(false);
        });
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, [address, window.ethereum]);

  useMemo(async () => {
    if (!address) {
      setIsLoading(false);
      setDataNFTUnState([]);
      return;
    }
    setIsLoading(true);
    try {
      await methods
        .call(farmingContract.methods.getUserInfo, [0, address])
        .then(res => {
          if (res && res.boostFactors.length > 0) {
            const lstStakedId = res.boostFactors;
            const dataCovert = [...lstStakedId];
            setCounNFT(dataCovert.length);
            const newArray = dataCovert?.map(item => {
              // eslint-disable-next-line no-return-assign
              return (item = {
                name: 'AnnexIronWolf ' + `#${item}`,
                token_id: item,
                id: +item,
                img: fakeImgNFT || IconDuck,
                active: false
              });
            });
            const lengthArr = newArray.length;
            if (lengthArr === 0 || lengthArr === 1) {
              setYourBoostAPR(0);
            } else {
              const yourBoostAPRPer = PERCENT_APR * lengthArr;
              setYourBoostAPR(yourBoostAPRPer);
            }
            setDataNFTUnState(newArray);
            setIsLoading(false);
          } else {
            setDataNFTUnState([]);
            setCounNFT(0);
            setYourBoostAPR(0);
          }
        });
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
    setIsLoading(false);
  }, [address, window.ethereum, dataNFT]);

  const expiryTimeUnstakeLP = useMemo(() => {
    if (userInfo) {
      const overOneDate = new Date(userInfo.depositedDate * 1000);
      const result = overOneDate.setMinutes(overOneDate.getMinutes() + 4); // 4 minute
      // return overOneDate.setDate(overOneDate.getDate() + 2); // 2 days
      const currentDateTime = new Date();
      const resultInSecondsCurrent = Math.floor(
        currentDateTime.getTime() / 1000
      );
      const afterStakeSeconds = Math.floor(
        resultInSecondsCurrent - result / 1000
      );
      if (afterStakeSeconds > 0) {
        setIsShowCountDownUnStake(false);
      } else {
        setIsShowCountDownUnStake(true);
      }
      const timeInterval = setInterval(() => {
        if (afterStakeSeconds > 0) {
          setIsShowCountDownUnStake(false);
        }
        clearInterval(timeInterval);
      }, 2000);
      return result;
    }
  }, [address, txhash, isApproveLP, userInfo, window.ethereum]);

  // time claim base reward countdown
  const expiryTimeBase = useMemo(() => {
    if (userInfo) {
      const overOneDate = new Date(userInfo.depositedDate * 1000);
      const result = overOneDate.setMinutes(overOneDate.getMinutes() + 3); // 3 minute
      // return overOneDate.setDate(overOneDate.getDate() + 1); // 1 dâys
      const currentDateTime = new Date();
      const resultInSecondsCurrent = Math.floor(
        currentDateTime.getTime() / 1000
      );
      const afterStakeSeconds = Math.floor(
        resultInSecondsCurrent - result / 1000
      );
      if (afterStakeSeconds > 0) {
        setIsShowCountDownClaimBase(false);
      } else {
        setIsShowCountDownClaimBase(true);
      }
      const timeInterval = setInterval(() => {
        if (afterStakeSeconds > 0) {
          setIsShowCountDownClaimBase(false);
        }
        clearInterval(timeInterval);
      }, 2000);
      return result;
    }
  }, [address, txhash, isApproveLP, userInfo, window.ethereum]);

  // time claim boost reward count down
  const expiryTimeBoost = useMemo(() => {
    if (userInfo) {
      const over30days = new Date(userInfo.boostedDate * 1000);
      const result = over30days.setMinutes(over30days.getMinutes() + 5); // 3 minute
      // return over30days.setDate(over30days.getDate() + 30); // 30 days
      const currentDateTime = new Date();
      const resultInSecondsCurrent = Math.floor(
        currentDateTime.getTime() / 1000
      );
      const afterStakeSeconds = Math.floor(
        resultInSecondsCurrent - result / 1000
      );
      if (afterStakeSeconds > 0) {
        setIsShowCountDownClaimBoost(false);
      } else {
        setIsShowCountDownClaimBoost(true);
      }
      const timeInterval = setInterval(() => {
        if (afterStakeSeconds > 0) {
          setIsShowCountDownClaimBoost(false);
        }
        clearInterval(timeInterval);
      }, 2000);
      return result;
    }
  }, [address, txhash, isApproveLP, userInfo, window.ethereum]);

  const expiryTimeUnstakeNFT = useMemo(() => {
    if (userInfo) {
      const overOneDate = new Date(userInfo.depositedDate * 1000);
      const result = overOneDate.setMinutes(overOneDate.getMinutes() + 4); // 4 minute
      // return overOneDate.setDate(overOneDate.getDate() + 2); // 2 days
      const currentDateTime = new Date();
      const resultInSecondsCurrent = Math.floor(
        currentDateTime.getTime() / 1000
      );
      const afterStakeSeconds = Math.floor(
        resultInSecondsCurrent - result / 1000
      );

      if (afterStakeSeconds > 0) {
        setIsShowCountDownUnStakeNFT(false);
      } else {
        setIsShowCountDownUnStakeNFT(true);
      }

      const timeInterval = setInterval(() => {
        if (afterStakeSeconds > 0) {
          setIsShowCountDownUnStakeNFT(false);
        }
        clearInterval(timeInterval);
      }, 2000);
      return result;
    }
  }, [address, txhash, isApproveNFT, userInfo, window.ethereum]);
  // change amount
  const enforcer = nextUserInput => {
    const numberDigitsRegex = /^\d*(\.\d{0,18})?$/g;
    if (nextUserInput === '' || numberDigitsRegex.test(nextUserInput)) {
      setVal(nextUserInput);
    }
  };
  const enforcerUnStake = nextUserInput => {
    const numberDigitsRegexUn = /^\d*(\.\d{0,18})?$/g;
    if (nextUserInput === '' || numberDigitsRegexUn.test(nextUserInput)) {
      setValUnStake(nextUserInput);
    }
  };
  const replaceValue = value => {
    const valueFormat = value.replace(/,/g, '.');
    const lstValueFormat = valueFormat?.toString().split('.');
    if (lstValueFormat.length > 1) {
      const result = `${lstValueFormat[0]}.${lstValueFormat[1]?.slice(
        0,
        DECIMALS_INPUT
      )}`;
      return Number(result);
    }
  };
  // ear input value
  useMemo(() => {
    if (Number(val) > +userInfo?.availableNumber) {
      setMessErr({
        mess: 'The amount has exceeded your balance. Try again!',
        show: true
      });
    }
  }, [val, userInfo]);
  useMemo(() => {
    if (Number(valueNFTUnStake) > +userInfo?.amountNumber) {
      setMessErrUnStake({
        mess: 'The amount has exceeded your balance. Try again!',
        show: true
      });
    }
  }, [valUnStake, userInfo]);
  const handleChangeValue = event => {
    enforcer(event.target.value.replace(/,/g, '.'));
    const numberDigitsRegex = /^\d*(\.\d{0,18})?$/g;
    if (!numberDigitsRegex.test(event.target.value)) {
      return;
    }
    setMessErr({
      mess: '',
      show: false
    });
    const number = event.target.value;
    setIsMaxValue(false);
    if (number === '') {
      setMessErr({
        mess: '',
        show: false
      });
    }
    if (number !== '' && Number(number) === 0) {
      setMessErr({
        mess: 'Invalid amount',
        show: true
      });
      setDisabledBtn(true);
    } else {
      setMessErr({
        mess: '',
        show: false
      });
      setDisabledBtn(false);
    }
    if (Number(number) > +userInfo?.availableNumber) {
      setMessErr({
        mess: 'The amount has exceeded your balance. Try again!',
        show: true
      });
    }
    if (Number(number) && !+userInfo?.availableNumber) {
      setMessErr({
        mess: 'The amount has exceeded your balance. Try again!',
        show: true
      });
    }
    if (Number(number) < 0) {
      setVal(0);
    } else if (Number(number) >= 0) {
      const valueFormat = event?.target.value.replace(/,/g, '.');
      const lstValueFormat = valueFormat?.toString().split('.');
      if (lstValueFormat.length > 1) {
        const result = `${lstValueFormat[0]}.${lstValueFormat[1]?.slice(
          0,
          DECIMALS_INPUT
        )}`;
        setVal(result);
        return;
      }
      setVal(valueFormat);
    }
  };
  const handleChangeValueUnstake = event => {
    enforcerUnStake(event.target.value.replace(/,/g, '.'));
    const numberDigitsRegex = /^\d*(\.\d{0,18})?$/g;
    if (!numberDigitsRegex.test(event.target.value)) {
      return;
    }
    setMessErrUnStake({
      mess: '',
      show: false
    });
    const number = event.target.value;
    setIsMaxValueUnStake(false);
    if (number === '') {
      setMessErrUnStake({
        mess: '',
        show: false
      });
    }
    if (number !== '' && Number(number) === 0) {
      setMessErrUnStake({
        mess: 'Invalid amount',
        show: true
      });
      setDisabledBtnUn(true);
    } else {
      setMessErrUnStake({
        mess: '',
        show: false
      });
      setDisabledBtnUn(false);
    }
    if (number > +userInfo?.amountNumber) {
      setMessErrUnStake({
        mess: 'The amount has exceeded your balance. Try again!',
        show: true
      });
    }
    if (number && !+userInfo?.amountNumber) {
      setMessErrUnStake({
        mess: 'The amount has exceeded your balance. Try again!',
        show: true
      });
    }
    if (Number(number) < 0) {
      setValUnStake(0);
    } else if (Number(number) >= 0) {
      const valueFormat = event?.target.value.replace(/,/g, '.');
      const lstValueFormat = valueFormat?.toString().split('.');
      if (lstValueFormat.length > 1) {
        const result = `${lstValueFormat[0]}.${lstValueFormat[1]?.slice(
          0,
          DECIMALS_INPUT
        )}`;
        setValUnStake(result);
        return;
      }
      setValUnStake(valueFormat);
    }
  };

  const handleMaxValue = () => {
    setIsMaxValue(true);
    const valueDecimals = renderValueDecimal(userInfo.availableNumber);
    if (valueDecimals < MINIMUM_VALUE) {
      setVal(0);
      setMessErr({
        mess: 'Invalid amount',
        show: true
      });
    } else {
      setVal(valueDecimals);
      setMessErr({
        mess: '',
        show: false
      });
    }
    if (
      userInfo?.availableNumber > 0 &&
      userInfo.availableNumber > MINIMUM_VALUE
    ) {
      setMessErr({
        mess: '',
        show: false
      });
    }
  };
  const handleMaxValueStaked = () => {
    setIsMaxValueUnStake(true);
    const valueDecimals = renderValueDecimal(userInfo.amountNumber);
    if (valueDecimals < MINIMUM_VALUE) {
      setValUnStake(0);
      setMessErrUnStake({
        mess: 'Invalid amount',
        show: true
      });
    } else {
      setValUnStake(valueDecimals);
      setMessErrUnStake({
        mess: '',
        show: false
      });
    }
    if (userInfo?.amountNumber > 0 && userInfo.amountNumber > MINIMUM_VALUE) {
      setMessErrUnStake({
        mess: '',
        show: false
      });
    }
  };
  // check approve lp
  const checkApproveLP = useCallback(async () => {
    if (!address) {
      setIsApproveLP(false);
      return;
    }
    await methods
      .call(lpContract.methods.allowance, [
        address,
        constants.CONTRACT_FARMING_ADDRESS
      ])
      .then(res => {
        const lpApproved = divDecimals(res, 18);
        if (lpApproved.isZero() || +val > lpApproved.toNumber()) {
          setIsApproveLP(false);
        } else {
          setIsApproveLP(true);
        }
      });
  }, [val, address, handleMaxValue, userInfo, handleMaxValueStaked, txhash]);
  const checkApproveNFT = useCallback(async () => {
    if (address) {
      await methods
        .call(nFtContract.methods.isApprovedForAll, [
          address,
          constants.CONTRACT_FARMING_ADDRESS
        ])
        .then(res => {
          setIsApproveNFT(res);
        });
    }
  }, [address, txhash, userInfo, window.ethereum]);
  const checkApproveVstrk = useCallback(async () => {
    await methods
      .call(vStrkContract.methods.allowance, [
        address,
        constants.CONTRACT_FARMING_ADDRESS
      ])
      .then(res => {
        if (res) {
          const lpVstrkAprroved = divDecimals(res, 18);
          if (lpVstrkAprroved.isZero() || +val > lpVstrkAprroved.toNumber()) {
            setIsAprroveVstrk(false);
          } else {
            setIsAprroveVstrk(true);
          }
        }
      });
  }, [val, handleMaxValue, handleMaxValueStaked, address, userInfo, txhash]);
  // approved Lp
  const handleApproveLp = useCallback(async () => {
    setiIsConfirm(true);
    await methods
      .send(
        lpContract.methods.approve,
        [constants.CONTRACT_FARMING_ADDRESS, MAX_APPROVE],
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
        if (err.code === 4001 || err.message.includes('User denied')) {
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
  }, [address]);

  const handleApproveVstrk = useCallback(async () => {
    setiIsConfirm(true);
    await methods
      .send(
        vStrkContract.methods.approve,
        [constants.CONTRACT_FARMING_ADDRESS, MAX_APPROVE],
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
        if (err.code === 4001 || err.message.includes('User denied')) {
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
  }, [address]);

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
        if (err.code === 4001 || err.message.includes('User denied')) {
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
  }, [address]);

  // stake
  const handleStake = async () => {
    if (val > +userInfo?.availableNumber) {
      setMessErr({
        mess: 'The amount has exceeded your balance. Try again!',
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
      setIsLoadingBtn(true);
      const valueMaxStake = divDecimalsBigNumber(
        userInfo.availableMax,
        userInfo.decimalLp
      );
      const valueBigNumber = isMaxValue
        ? new BigNumber(valueMaxStake)
        : new BigNumber(val);
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
          [
            0,
            valueBigNumber
              .times(new BigNumber(10).pow(18))
              .integerValue()
              .toString(10)
          ],
          address
        )
        .then(res => {
          if (res) {
            setTxhash(res.transactionHash);
            setTextSuccess('Stake STRK-ETH successfully');
            setiIsConfirm(false);
            setIsSuccess(true);
            setIsLoadingBtn(false);
            setIsMaxValue(false);
            setVal('');
          }
        })
        .catch(err => {
          if (err.code === 4001 || err.message.includes('User denied')) {
            setIsShowCancel(true);
            setiIsConfirm(false);
            setIsLoadingBtn(false);
            setTextErr('Decline transaction');
          } else {
            setIsShowCancel(true);
            setiIsConfirm(false);
            setIsLoadingBtn(false);
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
    if (valUnStake > +userInfo?.amountNumber) {
      setMessErrUnStake({
        mess: 'The amount has exceeded your balance. Try again!',
        show: true
      });
      return;
    }
    if (!valUnStake || valUnStake === 0) {
      setMessErrUnStake({
        mess: 'Invalid amount',
        show: true
      });
    } else {
      setMessErrUnStake({
        mess: '',
        show: true
      });
      // withdraw test
      setiIsConfirm(true);
      setIsLoadingUnStake(true);
      const valueMaxUnStake = divDecimalsBigNumber(
        userInfo.amountMax,
        userInfo.decimalLp
      );
      const valueBigNumber = isMaxValueUnStake
        ? new BigNumber(valueMaxUnStake)
        : new BigNumber(valUnStake);
      await methods
        .send(
          farmingContract.methods.withdraw,
          [
            0,
            valueBigNumber
              .times(new BigNumber(10).pow(18))
              .integerValue()
              .toString(10)
          ],
          address
        )
        .then(res => {
          setTxhash(res.transactionHash);
          setTextSuccess('Unstake STRK-ETH successfully');
          setiIsConfirm(false);
          setIsSuccess(true);
          setIsLoadingUnStake(false);
          setIsMaxValueUnStake(false);
          setValUnStake('');
        })
        .catch(err => {
          if (err.code === 4001 || err.message.includes('User denied')) {
            setIsShowCancel(true);
            setiIsConfirm(false);
            setIsLoadingUnStake(false);
            setTextErr('Decline transaction');
          } else {
            setIsShowCancel(true);
            setiIsConfirm(false);
            setIsLoadingUnStake(false);
            setTextErr('Some thing went wrong!');
          }
          throw err;
        });
      setMessErrUnStake({
        mess: '',
        show: false
      });
    }
  };
  // handleClaim
  const handleClainBaseReward = async () => {
    setiIsConfirm(true);
    const zero = 0;
    await methods
      .send(
        farmingContract.methods.claimBaseRewards,
        [zero.toString(10)],
        address
      )
      .then(res => {
        if (res) {
          setTxhash(res.transactionHash);
          setiIsConfirm(false);
          setIsSuccess(true);
          setTextSuccess('Claim Base Reward successfully');
        }
      })
      .catch(err => {
        if (err.code === 4001 || err.message.includes('User denied')) {
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
    setiIsConfirm(true);
    const zero = 0;
    await methods
      .send(
        farmingContract.methods.claimBoostReward,
        [zero.toString(10)],
        address
      )
      .then(res => {
        if (res) {
          setTxhash(res.transactionHash);
          setiIsConfirm(false);
          setIsSuccess(true);
          setTextSuccess('Claim Boost Reward successfully');
        }
      })
      .catch(err => {
        if (err.code === 4001 || err.message.includes('User denied')) {
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

  // Stake NFT
  const handleStakeDialog = useCallback(
    async (value, event, checked, mess) => {
      if (!value) {
        return;
      }
      if (mess) {
        return;
      }
      if (value && event.isTrusted) {
        setiIsConfirm(true);
        setIsStakeNFT(false);
        const lstBeginStakeNft = dataNFT?.slice(value, dataNFT.length);
        console.log(lstBeginStakeNft, 'lstBeginStakeNft');
        await methods
          .send(
            checked
              ? farmingContract.methods.boostPartially
              : farmingContract.methods.boost,
            [0, value.toString(10)],
            address
          )
          .then(res => {
            if (res) {
              setTxhash(res.transactionHash);
              setTextSuccess('Stake NFT successfully');
              setiIsConfirm(false);
              setIsSuccess(true);
              setValueNFTStake('');
              setItemStaking([]);
              setDataNFT(lstBeginStakeNft);
            }
          })
          .catch(err => {
            if (err.code === 4001 || err.message.includes('User denied')) {
              setIsShowCancel(true);
              setiIsConfirm(false);
              setTextErr('Decline transaction');
              setValueNFTStake('');
            } else {
              setIsShowCancel(true);
              setiIsConfirm(false);
              setTextErr('Some thing went wrong!');
              setValueNFTStake('');
            }
            throw err;
          });
      }
    },
    [dataNFT]
  );

  // unStake NFT
  const handleUnStakeDialog = useCallback(
    async (value, event, checked, mess) => {
      if (!value) {
        return;
      }
      if (mess) {
        return;
      }
      if (value && event.isTrusted) {
        setiIsConfirm(true);
        setIsUnStakeNFT(false);
        const lstBeginUnStakeNft = dataNFTUnState?.slice(
          0,
          dataNFTUnState.length - value
        );
        await methods
          .send(
            checked
              ? farmingContract.methods.unBoostPartially
              : farmingContract.methods.unBoost,
            [0, value.toString(10)],
            address
          )
          .then(res => {
            if (res) {
              setTxhash(res.transactionHash);
              setTextSuccess('Unstake NFT successfully');
              setiIsConfirm(false);
              setIsSuccess(true);
              setValueNFTUnStake('');
              setItemStaked([]);
              setDataNFTUnState(lstBeginUnStakeNft);
            }
          })
          .catch(err => {
            if (err.code === 4001 || err.message.includes('User denied')) {
              setValueNFTUnStake('');
              setIsShowCancel(true);
              setiIsConfirm(false);
              setTextErr('Decline transaction');
            } else {
              setValueNFTUnStake('');
              setIsShowCancel(true);
              setiIsConfirm(false);
              setTextErr('Some thing went wrong!');
            }
            throw err;
          });
      }
    },
    [dataNFTUnState]
  );
  // handleOpen
  const handleStakeNFT = () => {
    if (!userInfo.amountNumber) {
      return setIsStakeNFT(false);
    }
    setIsStakeNFT(true);
  };
  const handleUnStakeNFT = () => {
    setIsUnStakeNFT(true);
  };
  // handle Close
  const handleCloseConfirm = () => {
    setiIsConfirm(false);
  };
  const handleCloseSuccess = () => {
    setIsSuccess(false);
    // window.location.reload();
  };
  const handleCloseErr = () => {
    setIsShowCancel(false);
  };
  const handleCloseUnStake = () => {
    setIsUnStakeNFT(false);
    setValueNFTUnStake('');
  };
  const handleCloseStake = () => {
    setIsStakeNFT(false);
    setValueNFTStake('');
  };
  // check approve lp
  useEffect(() => {
    checkApproveLP();
    checkApproveNFT();
    checkApproveVstrk();
  }, [
    val,
    handleMaxValue,
    handleMaxValueStaked,
    isApproveLP,
    txhash,
    dataNFTUnState
  ]);
  // change accounts
  useEffect(() => {
    if (!address) {
      setYourBoostAPR(0);
      return;
    }
    if (window.ethereum) {
      // && checkIsValidNetwork()
      window.ethereum.on('accountsChanged', acc => {
        setSetting({
          selectedAddress: acc[0],
          accountLoading: true
        });
        setVal('');
        setValUnStake('');
        setMessErr({
          mess: '',
          show: false,
          noLP: false
        });
        setMessErrUnStake({
          mess: '',
          show: false
        });
      });
    }
  }, [window.ethereum, address]);
  // realtime base boost reward
  useEffect(() => {
    let updateTimerBaseBoost;
    // eslint-disable-next-line prefer-const
    updateTimerBaseBoost = setInterval(() => {
      getBaseBoostRealTime();
    }, 5000);
    return function cleanup() {
      abortController.abort();
      if (updateTimerBaseBoost) {
        clearInterval(updateTimerBaseBoost);
      }
    };
  });
  return (
    <>
      <MainLayout>
        <ST.SMain>
          <ST.SHr />
          <Row className="all-section">
            <Col xs={{ span: 24 }} lg={{ span: 24 }}>
              <DashboardStaking amount={countNFT} txh={txhash} />
              <ST.SDivPadding>
                <ST.SHeader>
                  <ST.STextModel>STRK-ETH Staking</ST.STextModel>
                  <ST.SHref target="_blank" href={constants.SUPPORT_URL}>
                    Get STRK-ETH LPs
                    <ST.SImgErr src={IconLinkBlue} />
                  </ST.SHref>
                </ST.SHeader>

                <Row>
                  <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Row>
                      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                        <ST.SInput>
                          <input
                            type="text"
                            value={val}
                            inputMode="decimal"
                            pattern="^[0-9]*[.,]?[0-9]*$"
                            min={0}
                            minLength={1}
                            spellCheck="false"
                            autoComplete="off"
                            autoCorrect="off"
                            maxLength={79}
                            placeholder="Enter a number"
                            onChange={event => handleChangeValue(event)}
                            onBlur={event => {
                              if (event.target.value !== '') {
                                setVal(event.target.value);
                              } else {
                                replaceValue(event.target.value);
                              }
                            }}
                          />
                          <ST.SMax
                            disabled={
                              userInfo.availableNumber === 0 || !address
                            }
                            onClick={handleMaxValue}
                          >
                            MAX
                          </ST.SMax>
                        </ST.SInput>
                      </Col>
                      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                        {messErr.show === true && (
                          <ST.SError>{messErr.mess}</ST.SError>
                        )}
                        {messErr?.noLP === true && (
                          <ST.SLinkErr
                            target="_blank"
                            href={constants.SUPPORT_URL}
                          >
                            {messErr.mess}
                            <ST.SLinkErr>
                              <ST.SImgErrNoMargin src={IconLink} />
                            </ST.SLinkErr>
                          </ST.SLinkErr>
                        )}
                      </Col>
                      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                        <ST.SInfor>
                          <ST.SInforText>Available</ST.SInforText>
                          {address ? (
                            <ST.SInforValue>
                              <ST.SIconSmall>
                                <ST.SImgFlashSmall src={IconFlashSmall} />
                                <ST.SImgLpSmall src={IconLpSmall} />
                              </ST.SIconSmall>
                              {userInfo.availableNumber > 0
                                ? userInfo.available
                                : '0.0'}
                            </ST.SInforValue>
                          ) : (
                            <ST.SInforValue>
                              <ST.SIconSmall>
                                <ST.SImgFlashSmall src={IconFlashSmall} />
                                <ST.SImgLpSmall src={IconLpSmall} />
                              </ST.SIconSmall>
                              -
                            </ST.SInforValue>
                          )}
                        </ST.SInfor>
                        <ST.SRowColumn>
                          {/* check approve lp */}
                          {address && isApproveLP && (
                            <>
                              {/* stake lp */}
                              <ST.SBoxUnState>
                                <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                                  <ST.SBtnUn>
                                    {!userInfo.available ||
                                    Number(userInfo.available) === 0 ? (
                                      <>
                                        <Col
                                          xs={{ span: 24 }}
                                          lg={{ span: 12 }}
                                        >
                                          <ST.SBtnUnStakeStart>
                                            <ST.SBtnStake disabled>
                                              Stake
                                            </ST.SBtnStake>
                                            <Tooltip
                                              placement="right"
                                              title="Countdown time will be reset if you stake more without claiming the rewards"
                                            >
                                              <ST.SQuestion
                                                src={IconQuestion}
                                              />
                                            </Tooltip>
                                          </ST.SBtnUnStakeStart>
                                        </Col>
                                      </>
                                    ) : (
                                      <>
                                        {isLoadingBtn ? (
                                          <>
                                            <Col
                                              xs={{ span: 24 }}
                                              lg={{ span: 12 }}
                                            >
                                              <ST.SBtnUnStakeStart>
                                                <ST.SBtnLoadding disabled>
                                                  Loading...
                                                </ST.SBtnLoadding>
                                                <Tooltip
                                                  placement="right"
                                                  title="Countdown time will be reset if you stake more without claiming the rewards"
                                                >
                                                  <ST.SQuestion
                                                    src={IconQuestion}
                                                  />
                                                </Tooltip>
                                              </ST.SBtnUnStakeStart>
                                            </Col>
                                          </>
                                        ) : (
                                          <>
                                            <Col
                                              xs={{ span: 24 }}
                                              lg={{ span: 12 }}
                                            >
                                              <ST.SBtnUnStakeStart>
                                                <ST.SBtnStake
                                                  disabled={
                                                    disabledBtn ||
                                                    Number(val) === 0
                                                  }
                                                  onClick={handleStake}
                                                >
                                                  Stake
                                                </ST.SBtnStake>
                                                <Tooltip
                                                  placement="right"
                                                  title="Countdown time will be reset if you stake more without claiming the rewards"
                                                >
                                                  <ST.SQuestion
                                                    src={IconQuestion}
                                                  />
                                                </Tooltip>
                                              </ST.SBtnUnStakeStart>
                                            </Col>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </ST.SBtnUn>
                                </Col>
                              </ST.SBoxUnState>
                            </>
                          )}
                          {/* Approve */}
                          {address && !isApproveLP ? (
                            <>
                              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                <ST.SBtn>
                                  <ST.SBtnApprove onClick={handleApproveLp}>
                                    Approve Staking
                                  </ST.SBtnApprove>
                                </ST.SBtn>
                              </Col>
                            </>
                          ) : (
                            <>
                              <></>
                            </>
                          )}
                        </ST.SRowColumn>
                      </Col>
                    </Row>
                  </Col>
                  {/* Unstake */}
                  <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Row>
                      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                        <ST.SInputUnStake>
                          <input
                            type="text"
                            value={valUnStake}
                            inputMode="decimal"
                            pattern="^[0-9]*[.,]?[0-9]*$"
                            min={0}
                            minLength={1}
                            spellCheck="false"
                            autoComplete="off"
                            autoCorrect="off"
                            maxLength={79}
                            placeholder="Enter a number"
                            onChange={event => handleChangeValueUnstake(event)}
                            onBlur={event => {
                              if (event.target.value !== '') {
                                setValUnStake(event.target.value);
                              }
                              replaceValue(event.target.value);
                            }}
                          />
                          <ST.SMaxUn
                            disabled={userInfo.amountNumber === 0 || !address}
                            onClick={handleMaxValueStaked}
                          >
                            MAX
                          </ST.SMaxUn>
                        </ST.SInputUnStake>
                      </Col>
                      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                        {messErrUnStake?.show === true && (
                          <ST.SErrorUn>{messErrUnStake.mess}</ST.SErrorUn>
                        )}
                        {messErrUnStake?.noLP === true && (
                          <ST.SLinkErrUn
                            target="_blank"
                            href={constants.SUPPORT_URL}
                          >
                            {messErrUnStake.mess}
                            <ST.SLinkErr>
                              <ST.SImgErr src={IconLink} />
                            </ST.SLinkErr>
                          </ST.SLinkErrUn>
                        )}
                      </Col>
                      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                        <ST.SInforNotBorder>
                          <ST.SInforTextUn>Staked</ST.SInforTextUn>
                          {address ? (
                            <ST.SInforValueUn>
                              <ST.SIconSmall>
                                <ST.SImgFlashSmall src={IconFlashSmall} />
                                <ST.SImgLpSmall src={IconLpSmall} />
                              </ST.SIconSmall>
                              {userInfo.amountNumber > 0
                                ? userInfo.amount
                                : '0.0'}
                            </ST.SInforValueUn>
                          ) : (
                            <ST.SInforValueUn>
                              <ST.SIconSmall>
                                <ST.SImgFlashSmall src={IconFlashSmall} />
                                <ST.SImgLpSmall src={IconLpSmall} />
                              </ST.SIconSmall>
                              -
                            </ST.SInforValueUn>
                          )}
                        </ST.SInforNotBorder>
                      </Col>
                      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                        {/* Unstake lp */}
                        <ST.SBoxUnState>
                          <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                            {address && isApproveLP && (
                              <>
                                {isUnStakeLp ? (
                                  <>
                                    {/* check appove nft */}
                                    {isAprroveVstrk ? (
                                      <>
                                        {isLoadingUnStake ? (
                                          <>
                                            <Col
                                              xs={{ span: 24 }}
                                              lg={{ span: 24 }}
                                            >
                                              <ST.SBtnUnStakeStart>
                                                <ST.SBtnLoadding disabled>
                                                  Loading...
                                                </ST.SBtnLoadding>
                                                <Tooltip
                                                  placement="right"
                                                  title="Countdown time will be reset if you unstake a part without claiming the rewards"
                                                >
                                                  <ST.SQuestion
                                                    src={IconQuestion}
                                                  />
                                                </Tooltip>
                                              </ST.SBtnUnStakeStart>
                                            </Col>
                                          </>
                                        ) : (
                                          <>
                                            <Col
                                              xs={{ span: 24 }}
                                              lg={{ span: 24 }}
                                            >
                                              <ST.SBtnUnStakeStartNotBorder>
                                                <ST.SBtnUnstake
                                                  className="mg-10"
                                                  disabled={
                                                    disabledBtnUn ||
                                                    Number(valUnStake) === 0
                                                  }
                                                  onClick={handleUnStake}
                                                >
                                                  Unstake
                                                </ST.SBtnUnstake>
                                                <Tooltip
                                                  placement="right"
                                                  title="Countdown time will be reset if you unstake a part without claiming the rewards"
                                                >
                                                  <ST.SQuestion
                                                    src={IconQuestion}
                                                  />
                                                </Tooltip>
                                              </ST.SBtnUnStakeStartNotBorder>
                                            </Col>
                                          </>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <Col
                                          xs={{ span: 24 }}
                                          lg={{ span: 24 }}
                                        >
                                          <ST.SBtnUnStakeStartNotBorder>
                                            <ST.SBtnStake
                                              onClick={handleApproveVstrk}
                                            >
                                              Approve Staking
                                            </ST.SBtnStake>
                                          </ST.SBtnUnStakeStartNotBorder>
                                        </Col>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                                      {expiryTimeUnstakeLP &&
                                      isShowCountDownUnStake &&
                                      userInfo.amountNumber > 0 &&
                                      address ? (
                                        <>
                                          <ST.SCountDown>
                                            <CountDownClaim
                                              times={expiryTimeUnstakeLP}
                                              address={address}
                                              txh={txhash}
                                              type={UNSTAKE}
                                              handleUnStake={handleUnStake}
                                              valUnStake={valUnStake}
                                              isAprroveVstrk={isAprroveVstrk}
                                              handleApproveVstrk={
                                                handleApproveVstrk
                                              }
                                              isShowCountDownUnStake={
                                                isShowCountDownUnStake
                                              }
                                            />
                                          </ST.SCountDown>
                                        </>
                                      ) : (
                                        <>
                                          <ST.SBtnUnStakeStartNotBorder>
                                            <ST.SSUnTake
                                              className="mg-10"
                                              disabled={
                                                isShowCountDownUnStake ||
                                                !valUnStake
                                              }
                                              onClick={handleUnStake}
                                            >
                                              Unstake
                                            </ST.SSUnTake>
                                            <Tooltip
                                              placement="right"
                                              title="Countdown time will be reset if you unstake a part without claiming the rewards"
                                            >
                                              <ST.SQuestion
                                                src={IconQuestion}
                                              />
                                            </Tooltip>
                                          </ST.SBtnUnStakeStartNotBorder>
                                        </>
                                      )}
                                    </Col>
                                  </>
                                )}
                              </>
                            )}
                          </Col>
                        </ST.SBoxUnState>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </ST.SDivPadding>
              <ST.SDivPaddingMT>
                <ST.SDivHarvest>
                  <ST.SText>STRK-ETH Harvest</ST.SText>
                  <ST.SInforTextVSTRK>
                    <ST.SInforTextVSTRKDetail>
                      STRK claimed
                    </ST.SInforTextVSTRKDetail>
                    {address ? (
                      <>
                        <ST.STotalClaim>
                          <ST.SIconSmall>
                            <ST.SImgLpSmall src={IconFlashSmall} />
                          </ST.SIconSmall>
                          {userInfo.totalClaim ?? '0.0'}
                        </ST.STotalClaim>
                      </>
                    ) : (
                      <>
                        <ST.STotalClaim>
                          <ST.SIconSmall>
                            <ST.SImgLpSmall src={IconFlashSmall} />
                          </ST.SIconSmall>
                          -
                        </ST.STotalClaim>
                      </>
                    )}
                  </ST.SInforTextVSTRK>
                </ST.SDivHarvest>
                {/* Base reward */}
                <ST.SBoxHarvest>
                  <Row>
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                      <ST.SInforClaimNotBorder>
                        <ST.SInforText>Base Reward</ST.SInforText>
                        {address ? (
                          <ST.SInforValue>
                            <ST.SIconSmall>
                              <ST.SImgFlashSmall src={IconFlashSmall} />
                            </ST.SIconSmall>

                            {userInfo.accBaseReward ?? '0.0'}
                          </ST.SInforValue>
                        ) : (
                          <ST.SInforValue>
                            <ST.SIconSmall>
                              <ST.SImgFlashSmall src={IconFlashSmall} />
                            </ST.SIconSmall>
                            -
                          </ST.SInforValue>
                        )}
                      </ST.SInforClaimNotBorder>
                      {address && isApproveLP && !isShowCountDownClaimBase && (
                        <ST.SInforClaim>
                          <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                            <ST.SBtnClaim>
                              {isClaimBaseReward ? (
                                <ST.SClaim onClick={handleClainBaseReward}>
                                  Claim
                                </ST.SClaim>
                              ) : (
                                <>
                                  <ST.SClaim
                                    disabled={
                                      isShowCountDownClaimBase ||
                                      Number(userInfo.accBaseReward) === 0
                                    }
                                    onClick={handleClainBaseReward}
                                  >
                                    Claim
                                  </ST.SClaim>
                                </>
                              )}
                              <Tooltip
                                placement="right"
                                title="You can only claim reward once daily"
                              >
                                <ST.SQuestionClaim src={IconQuestion} />
                              </Tooltip>
                            </ST.SBtnClaim>
                          </Col>
                        </ST.SInforClaim>
                      )}

                      {expiryTimeBase &&
                      isShowCountDownClaimBase &&
                      userInfo.depositedDate > 0 &&
                      address &&
                      userInfo.accBaseReward &&
                      isApproveLP ? (
                        <ST.SInforClaim>
                          <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                            <ST.SCountDown>
                              <CountDownClaim
                                times={expiryTimeBase}
                                address={address}
                                type={CLAIMBASE}
                                handleClainBaseReward={handleClainBaseReward}
                                isClaimBaseReward={isClaimBaseReward}
                              />
                            </ST.SCountDown>
                          </Col>
                        </ST.SInforClaim>
                      ) : (
                        <></>
                      )}
                    </Col>

                    {/* Boost reward */}
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                      <Row>
                        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                          <ST.SInforClaimNotBorder>
                            <ST.SInforTextMargin>
                              Boost Reward
                            </ST.SInforTextMargin>
                            {address ? (
                              <ST.SInforValueNoMargin>
                                <ST.SIconSmall>
                                  <ST.SImgFlashSmall src={IconFlashSmall} />
                                </ST.SIconSmall>
                                {userInfo.accBoostReward ?? '0.0'}
                              </ST.SInforValueNoMargin>
                            ) : (
                              <ST.SInforValueNoMargin>
                                <ST.SIconSmall>
                                  <ST.SImgFlashSmall src={IconFlashSmall} />
                                </ST.SIconSmall>
                                -
                              </ST.SInforValueNoMargin>
                            )}
                          </ST.SInforClaimNotBorder>
                          {address &&
                            isApproveLP &&
                            !isShowCountDownClaimBoost && (
                              <ST.SInforClaimNotBorder>
                                <ST.SBoxState>
                                  <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                                    <ST.SBtnClaimStart>
                                      {isClaimBootReward ? (
                                        <ST.SClaim
                                          onClick={handleClainBootReward}
                                        >
                                          Claim
                                        </ST.SClaim>
                                      ) : (
                                        <ST.SClaim
                                          disabled={
                                            isShowCountDownClaimBoost ||
                                            Number(userInfo.accBoostReward) ===
                                              0
                                          }
                                          onClick={handleClainBootReward}
                                        >
                                          Claim
                                        </ST.SClaim>
                                      )}
                                      <Tooltip
                                        placement="right"
                                        title="You can only claim reward once monthly"
                                      >
                                        <ST.SQuestion src={IconQuestion} />
                                      </Tooltip>
                                    </ST.SBtnClaimStart>
                                  </Col>
                                </ST.SBoxState>
                              </ST.SInforClaimNotBorder>
                            )}
                          {expiryTimeBoost &&
                          isShowCountDownClaimBoost &&
                          userInfo.boostedDate > 0 &&
                          address &&
                          userInfo.accBoostReward &&
                          isApproveLP ? (
                            <ST.SInforClaimCountDown>
                              <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                                <ST.SCountDown>
                                  <CountDownClaim
                                    times={expiryTimeBoost}
                                    address={address}
                                    type={CLAIMBOOST}
                                    handleClainBootReward={
                                      handleClainBootReward
                                    }
                                    isClaimBootReward={isClaimBootReward}
                                  />
                                </ST.SCountDown>
                              </Col>
                            </ST.SInforClaimCountDown>
                          ) : (
                            <></>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </ST.SBoxHarvest>
              </ST.SDivPaddingMT>

              <ST.SDiv>
                <Row>
                  <ST.SRowFlex>
                    <ST.SFlex>
                      <ST.SText>
                        NFT Staking
                        <Tooltip
                          placement="right"
                          title="Only display all NFTs that can be staked into this pool"
                        >
                          <ST.SQuestion src={IconQuestion} />
                        </Tooltip>
                      </ST.SText>
                    </ST.SFlex>
                    {address ? (
                      <>
                        {isApproveNFT ? (
                          <>
                            <ST.SSTake
                              disabled={
                                itemStaking.length === MAX_STAKE_NFT ||
                                dataNFT.length === 0 ||
                                userInfo.amountNumber === 0
                              }
                              onClick={handleStakeNFT}
                            >
                              Stake
                            </ST.SSTake>
                            <Tooltip
                              placement="top"
                              title="You must stake STRK-ETH LP Token before staking NFT"
                            >
                              <ST.SQuestionNFT src={IconQuestion} />
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <ST.SSTake onClick={handleApproveNFT}>
                              Approve Staking
                            </ST.SSTake>
                          </>
                        )}
                      </>
                    ) : (
                      <> </>
                    )}
                  </ST.SRowFlex>
                </Row>
                {isLoading ? (
                  <Row>
                    <Loadding />
                  </Row>
                ) : (
                  <>
                    <ST.SSlider>
                      {dataNFT.length === 0 && (
                        <ST.SSliderNoData>
                          <ST.SSliderNoDataImg src={IconNoData} />
                          <ST.SSliderNoDataText>
                            {address
                              ? 'You don’t own any NFTs'
                              : 'Connect wallet to see your NFTs'}
                          </ST.SSliderNoDataText>
                        </ST.SSliderNoData>
                      )}

                      <Slider {...AUDITOR_SETTING}>
                        {dataNFT &&
                          dataNFT?.map(item => {
                            return (
                              <ST.SItemSlider key={item.id}>
                                <ST.SImgSlider src={item.img} />
                                <ST.SBoxSlider>
                                  <ST.STitleSlider>{item.name}</ST.STitleSlider>
                                  <ST.SDescriptionSlider>
                                    {item.description}
                                  </ST.SDescriptionSlider>
                                </ST.SBoxSlider>
                              </ST.SItemSlider>
                            );
                          })}
                      </Slider>
                    </ST.SSlider>
                  </>
                )}
              </ST.SDiv>
              <ST.SDiv>
                <Row>
                  <ST.SRowFlexNFTStaking>
                    <ST.SWrapperNFTStake>
                      <ST.SWrapperTitle>
                        <ST.SFlex>
                          <ST.SText>NFT Staked</ST.SText>
                        </ST.SFlex>

                        {yourBoostAPR &&
                        yourBoostAPR !== 0 &&
                        dataNFTUnState.length > 0 ? (
                          <ST.SDetailsColor>
                            {' '}
                            Your Boost APR:
                            <ST.SDetailsColorBold>
                              {yourBoostAPR}%{' '}
                            </ST.SDetailsColorBold>
                          </ST.SDetailsColor>
                        ) : (
                          <ST.SDetailsColor>
                            Your Boost APR:{' '}
                            <ST.SDetailsColorNotBold>-</ST.SDetailsColorNotBold>
                          </ST.SDetailsColor>
                        )}
                      </ST.SWrapperTitle>

                      <ST.SUnstakeCountDownWeb>
                        {address && (
                          <ST.SFlexEnd>
                            {expiryTimeUnstakeNFT &&
                            isShowCountDownUnStakeNFT &&
                            dataNFTUnState.length > 0 &&
                            isApproveNFT ? (
                              <ST.SWrapperCountDownWeb>
                                <CountDownClaim
                                  times={expiryTimeUnstakeLP}
                                  address={address}
                                  type={UNSTAKENFT}
                                  handleUnStakeNFT={handleUnStakeNFT}
                                />
                              </ST.SWrapperCountDownWeb>
                            ) : (
                              <>
                                <ST.SSUnSTakedWeb
                                  disabled={dataNFTUnState.length === 0}
                                  onClick={handleUnStakeNFT}
                                >
                                  Unstake
                                </ST.SSUnSTakedWeb>
                              </>
                            )}
                          </ST.SFlexEnd>
                        )}
                      </ST.SUnstakeCountDownWeb>
                    </ST.SWrapperNFTStake>

                    {address && (
                      <>
                        {expiryTimeUnstakeNFT &&
                        isShowCountDownUnStakeNFT &&
                        dataNFTUnState.length > 0 &&
                        isApproveNFT ? (
                          <ST.SWrapperCountDownMobile>
                            <CountDownClaim
                              times={expiryTimeUnstakeLP}
                              address={address}
                              type={UNSTAKENFT}
                              handleUnStakeNFT={handleUnStakeNFT}
                            />
                          </ST.SWrapperCountDownMobile>
                        ) : (
                          <ST.SWrapperUnStake>
                            <ST.SSUnSTakedMobile
                              disabled={dataNFTUnState.length === 0}
                              onClick={handleUnStakeNFT}
                            >
                              Unstake
                            </ST.SSUnSTakedMobile>
                          </ST.SWrapperUnStake>
                        )}
                      </>
                    )}
                  </ST.SRowFlexNFTStaking>
                </Row>

                {isLoading ? (
                  <Row>
                    <Loadding />
                  </Row>
                ) : (
                  <>
                    <ST.SSlider>
                      {dataNFTUnState.length === 0 && (
                        <ST.SSliderNoData>
                          <ST.SSliderNoDataImg src={IconNoData} />
                          <ST.SSliderNoDataText>
                            {address
                              ? 'You don’t own any NFTs'
                              : 'Connect wallet to see your NFTs'}
                          </ST.SSliderNoDataText>
                        </ST.SSliderNoData>
                      )}
                      <Slider {...AUDITOR_SETTING}>
                        {dataNFTUnState &&
                          dataNFTUnState?.map(item => {
                            return (
                              <ST.SItemSlider key={item.id}>
                                <ST.SImgSlider src={item.img} />
                                <ST.SBoxSlider>
                                  <ST.STitleSlider>{item.name}</ST.STitleSlider>
                                  <ST.SDescriptionSlider>
                                    {item.description}
                                  </ST.SDescriptionSlider>
                                </ST.SBoxSlider>
                              </ST.SItemSlider>
                            );
                          })}
                      </Slider>
                    </ST.SSlider>
                  </>
                )}
              </ST.SDiv>
            </Col>
          </Row>
        </ST.SMain>
      </MainLayout>
      {/* Stake */}
      <DialogStake
        isStakeNFT={isStakeNFT}
        close={handleCloseStake}
        itemStaking={itemStaking}
        listStake={dataNFT}
        listUnStake={dataNFTUnState}
        valueNFTStake={valueNFTStake}
        currentNFT={countNFT}
        handleStakeDialog={handleStakeDialog}
        address={address}
      />

      {/* UnStake */}
      <DialogUnStake
        isUnStakeNFT={isUnStakeNFT}
        close={handleCloseUnStake}
        itemStaked={itemStaked}
        list={dataNFTUnState}
        valueNFTUnStake={valueNFTUnStake}
        currentNFT={countNFT}
        handleUnStakeDialog={handleUnStakeDialog}
        address={address}
      />
      {/* err */}
      <DialogErr isShow={isShowCancel} close={handleCloseErr} text={textErr} />
      {/* Confirm */}
      <DialogConfirm isConfirm={isConfirm} close={handleCloseConfirm} />
      {isSuccess && (
        <DialogSuccess
          isSuccess={isSuccess}
          close={handleCloseSuccess}
          address={settings?.selectedAddress}
          text={textSuccess}
          txh={txhash}
        />
      )}
    </>
  );
}
Staking.propTypes = {
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired
};

Staking.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { setSetting, getVoterAccounts } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting,
      getVoterAccounts
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Staking);
