import styled from 'styled-components';

export const SMain = styled.div`
  width: 100%;
  .all-section {
    width: 100%;
    padding: 15px;
  }
`;
export const SDivPadding = styled.div`
  width: 100%;
  background: #fff;
  margin-top: 20px;
  padding: 10px 15px;
  border-radius: 8px;
  box-sizing: content-box;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 3%);
  .box-staking {
    text-align: center;
  }
  @media only screen and (max-width: 768px) {
    margin-top: 0;
    padding: 20px 5px;
  }
`;
export const SDiv = styled.div`
  width: 100%;
  background: #fff;
  padding: 10px 15px;
  margin-top: 20px;
  border-radius: 8px;
  box-sizing: content-box;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 3%);
  .box-staking {
    text-align: center;
  }
  :last-child {
    margin-bottom: 50px;
  }
  @media only screen and (max-width: 768px) {
    padding: 20px 5px;
  }
`;
export const SHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 10px;
`;
export const SText = styled.div`
  color: #000000;
  font-weight: 700;
  font-size: 20px;
  line-height: 27px;
  margin-top: 10px;
  min-width: 200px;
  img {
    margin-left: 10px;
  }
  @media only screen and (max-width: 768px) {
    font-size: 17px;
    margin: 0;
  }
`;
export const SHref = styled.a`
  color: #107def;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
    margin-right: 10px;
  }
`;
export const SInput = styled.div`
  position: relative;
  margin-bottom: 10px;
  input {
    border: 1px solid #ccc !important;
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    outline: none;
    &:hover,
    &:active,
    &:focus,
    &:focus-visible {
      border: 1px solid #ccc !important;
      outline: none;
    }
  }
`;
export const SError = styled.div`
  color: #e80e0e;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 23px;
`;
export const SHrefErr = styled.div`
  color: #e80e0e;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 23px;
`;
export const SLinkErr = styled.a``;
export const SImgErr = styled.img`
  margin-left: 10px;
  width: 18px;
  height: 18px;
`;
export const SMax = styled.div`
  margin-left: 10px;
  cursor: pointer;
  color: #107def;
  font-weight: 700;
  background: #107def;
  border-radius: 5px;
  color: #fff;
  font-size: 12px;
  padding: 0px 15px;
`;
export const SBoxOne = styled.div`
  width: 100%;
  :last-child {
    margin-top: 10px;
  }
  @media only screen and (max-width: 768px) {
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e5e5;
    :last-child {
      margin-top: 20px;
    }
  }
`;
export const SBtnDisabled = styled.div`
  position: absolute;
  top: 5px;
  right: 10px;
  cursor: pointer;
  color: #107def;
  font-weight: 700;
  background: #9d9fa7;
  border-radius: 5px;
  color: #fff;
  padding: 5px;
  cursor: not-allowed;
`;
export const SBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 768px) {
    margin-top: 0;
    margin-left: 5px;
    margin-left: 10px;
  }
`;
export const SBtnUn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media only screen and (max-width: 768px) {
    justify-content: flex-start;
    margin-top: 10px;
    margin-left: 5px;
    margin-right: 10px;
    flex-direction: column;
  }
`;
export const SBtnStake = styled.button`
  cursor: pointer;
  background: #107def;
  color: #fff;
  border-radius: 5px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  margin-right: 10px;
  border: none;
  outline: none;
  margin-right: 15px;
  @media only screen and (max-width: 768px) {
    min-width: 150px;
    margin-left: 0px !important;
  }
  :disabled {
    color: #fff !important;
    cursor: not-allowed;
    margin: 0 15px 0 10px;
  }
`;
export const SBtnLoadding = styled.button`
  cursor: pointer;
  background: #107def;
  color: #fff;
  border-radius: 5px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  border: none;
  outline: none;
  margin-top: 10px;
  margin-right: 15px;
  @media only screen and (max-width: 768px) {
    min-width: 150px;
    margin-left: 0px !important;
  }
  :disabled {
    color: #fff !important;
    cursor: not-allowed;
  }
`;
export const SBtnUnstake = styled.div`
  cursor: pointer;
  color: #f84960;
  background: #fff;
  border-radius: 5px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  border: 1px solid #f84960;
  margin-right: 15px;
  @media only screen and (max-width: 768px) {
    min-width: 150px;
  }
`;
export const SSTake = styled.button`
  cursor: pointer;
  background: #107def;
  color: #fff;
  border-radius: 5px;
  padding: 8px 20px;
  min-width: 150px;
  text-align: center;
  margin-left: 30px;
  border: none;
  outline: none;
  :disabled {
    color: #fff !important;
    cursor: not-allowed;
  }
  @media only screen and (max-width: 768px) {
    min-width: 150px;
    margin-left: 0;
  }
`;
export const SSUnTake = styled.button`
  cursor: pointer;
  background: #fff;
  color: #f84960;
  border-radius: 5px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  border: 1px solid #f84960;
  outline: none;
  margin-right: 15px;
  :disabled {
    color: #fff !important;
    cursor: not-allowed;
  }
  @media only screen and (max-width: 768px) {
    min-width: 150px;
  }
`;
export const SBtnUnStakeStart = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media only screen and (max-width: 768px) {
    justify-content: center;
  }
`;
export const SBoxState = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
export const SBoxUnState = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
export const SBoxUnStateDetails = styled.div`
  // float: right;
  // margin-right: 15px;
  @media only screen and (max-width: 768px) {
    margin: auto;
    float: none;
    text-align: center;
    margin-top: 10px;
    button {
      margin-left: 10px;
      margin-right: 0;
    }
    img {
      margin-left: 10px;
    }
  }
`;
export const SInfor = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 15px;
  align-items: center;
  @media only screen and (max-width: 768px) {
    border-bottom: none;
  }
`;
export const SInforNotBorder = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  align-items: center;
`;
export const SInforClaim = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 10px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 15px;
  :last-child {
    border-bottom: none !important;
  }
`;
export const SInforText = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #6d6f7b;
  display: flex;
`;
export const SVSTRKTootip = styled.div`
  margin-left: 10px;
`;
export const SInforValue = styled.div`
  font-weight: 900;
  font-size: 16px;
  line-height: 24px;
  color: #0b0f23;
  display: flex;
`;
export const SIconSmall = styled.div`
  margin-right: 10px;
  display: block;
`;
export const SImgFlashSmall = styled.img``;
export const SImgLpSmall = styled.img`
  margin-left: -5px;
`;
export const SQuestion = styled.img`
  width: 23px;
  height: 23px;
  margin-right: 10px;
  @media only screen and (max-width: 768px) {
    width: 15px;
    height: 15px;
  }
`;
export const SQuestionClaim = styled.img`
  width: 23px;
  height: 23px;
  margin-right: 10px;
  @media only screen and (max-width: 768px) {
    width: 15px;
    height: 15px;
  }
`;
export const SBtnClaim = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
  @media only screen and (max-width: 768px) {
    justify-content: center;
  }
`;
export const SBtnClaimStart = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
  @media only screen and (max-width: 768px) {
    justify-content: center;
  }
`;
export const SClaim = styled.button`
  cursor: pointer;
  background: #107def;
  color: #fff;
  font-weight: 700;
  border-radius: 8px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  margin-right: 15px;
  outline: none;
  border: none;
  @media only screen and (max-width: 768px) {
    min-width: 150px;
  }
`;
export const SUnClaim = styled.div`
  cursor: pointer;
  background: #9d9fa7;
  font-weight: 700;
  color: #fff;
  opacity: 0.5;
  border-radius: 8px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  margin-right: 15px;
  cursor: not-allowed;
  @media only screen and (max-width: 768px) {
    min-width: 150px;
  }
`;
export const STimeClaim = styled.div`
  margin-left: 10px;
  display: block;
  width: 100%;
`;
export const STimeNumer = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const STimeText = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const SItemTime = styled.div``;
export const SFlash = styled.img`
  margin-right: 10px;
`;
export const SDetails = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #6d6f7b;
  margin-top: 20px;
  @media only screen and (max-width: 768px) {
    font-size: 18px;
  }
`;
export const SSelected = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  color: ##6d6f7b;
  margin-top: 20px;
  min-width: 200px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
    margin-top: 0;
  }
`;
export const SDetailsColor = styled.div`
  font-size: 16px;
  line-height: 24px
  line-height: 35px;
  color: ##6d6f7b;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
  }
`;
export const SRowFlex = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 20px;
`;
export const SRowColumn = styled.div`
  display: flex;
  margin-bottom: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
export const SRowRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  @media only screen and (max-width: 768px) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
`;
export const SFlex = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
export const SFlexEnd = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  @media only screen and (max-width: 768px) {
    justify-content: flex-end;
  }
`;

export const SSlider = styled.div`
  width: 100%;
  .slick-slide img {
    margin: auto;
  }
`;
export const SSliderNoData = styled.div`
  display: block;
  width: 100%;
`;
export const SSliderNoDataImg = styled.img`
  display: block;
  margin: auto;
`;
export const SSliderNoDataText = styled.div`
  width: 100%;
  display: block;
  margin: auto;
  text-align: center;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 27px;
  color: #9d9fa7;
  margin-bottom: 20px;
`;
export const SItemSlider = styled.div`
  width: 100%;
  padding: 10px;
  position: relative;
`;
export const SImgSlider = styled.img``;
export const SBoxSlider = styled.div`
  width: 100%;
  background: #3e3f4d;
  padding: 15px;
`;
export const STitleSlider = styled.div`
  color: #fff;
`;
export const SDescriptionSlider = styled.div`
  color: #ff897e;
`;
export const SNexSlider = styled.img`
  color: #fff !important;
  cursor: pointer;
  border-radius: 50%;
`;
export const SPrevSlider = styled.img`
  cursor: pointer;
  color: #fff !important;
  border-radius: 50%;
`;
export const SSactive = styled.img`
  position: absolute;
  width: 25px !important;
  height: 25px !important;
  top: 25px;
  right: 25px;
`;
export const SSUnactive = styled.img`
  position: absolute;
  width: 25px !important;
  height: 25px !important;
  top: 25px;
  right: 25px;
`;
export const SDivBlack = styled.div`
  background: #333;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0.5;
`;
export const STextSelecT = styled.div`
  width: 100%;
  text-align: center;
  margin: auto;
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
  color: #27282b;
  margin-top: 15px;
`;
