import styled from 'styled-components';

export const SDiv = styled.div`
  width: 100%;
  background: #fff;
  padding: 15px;
  margin-top: 10px;
  border-radius: 8px;
  box-sizing: content-box;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 3%);
  .box-staking {
    text-align: center;
  }
`;
export const SHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const SText = styled.div`
  color: #000000;
  font-weight: 900;
  font-size: 20px;
  line-height: 27px;
  margin-top: 10px;
  img {
    margin-left: 10px;
  }
`;
export const SHref = styled.a`
  color: #107def;
  font-size: 16px;
  line-height: 24px;
`;
export const SInput = styled.div`
  position: relative;
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
`;
export const SMax = styled.div`
  position: absolute;
  top: 5px;
  right: 10px;
  cursor: pointer;
  color: #107def;
  font-weight: 700;
  background: #107def;
  border-radius: 5px;
  color: #fff;
  padding: 5px;
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
  justify-content: flex-end;
  @media only screen and (max-width: 768px) {
    justify-content: center;
  }
`;
export const SBtnUn = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  @media only screen and (max-width: 768px) {
    justify-content: center;
  }
`;
export const SBtnStake = styled.div`
  cursor: pointer;
  background: #107def;
  color: #fff;
  border-radius: 5px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  margin-right: 10px;
  @media only screen and (max-width: 768px) {
    min-width: 150px;
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
  margin-right: 10px;
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
  }
  @media only screen and (max-width: 768px) {
    min-width: 150px;
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
  margin-right: 10px;
  :disabled {
    color: #fff !important;
  }
  @media only screen and (max-width: 768px) {
    min-width: 150px;
  }
`;

export const SInfor = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;
export const SInforClaim = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 10px;
`;
export const SInforText = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #6d6f7b;
`;
export const SInforValue = styled.div`
  font-weight: 900;
  font-size: 16px;
  line-height: 24px;
  color: #0b0f23;
  display: flex;
`;
export const SIconSmall = styled.div`
  display: flex;
  margin-right: 20px;
`;
export const SImgFlashSmall = styled.img``;
export const SImgLpSmall = styled.img`
  margin-left: -5px;
`;
export const SQuestion = styled.img`
  widht: 23px;
  height: 23px;
`;
export const SBtnClaim = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  @media only screen and (max-width: 768px) {
    justify-content: center;
  }
`;
export const SBtnClaimStart = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  @media only screen and (max-width: 768px) {
    justify-content: center;
  }
`;
export const SClaim = styled.div`
  cursor: pointer;
  background: #107def;
  color: #fff;
  font-weight: 700;
  border-radius: 8px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  margin-right: 10px;
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
  margin-right: 10px;
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
  color: ##6d6f7b;
  margin-top: 20px;
  @media only screen and (max-width: 768px) {
    font-size: 18px;
  }
`;
export const SDetailsColor = styled.div`
  font-size: 16px;
  line-height: 24px
  line-height: 35px;
  color: ##6d6f7b;
  @media only screen and (max-width: 768px) {
    font-size: 18px;
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
    justify-content: flex-start;
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
