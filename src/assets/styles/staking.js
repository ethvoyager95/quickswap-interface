import styled from 'styled-components';

export const SDiv = styled.div`
  width: 100%;
  background: #fff;
  padding: 15px;
  margin-top: 10px;
  .box-staking {
    text-align: center;
  }
`;
export const SRow = styled.div`
  width: 100%;
  background: #fff;
  color: #107def;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;
export const SBox = styled.div`
  margin-top: 10px;
  width: 100%;
  color: #107def;
  display: flex;
  justify-content: space-between;
`;
export const SItems = styled.div`
  background: #fff;
  width: 100%;
  margin-right: 10px;
  text-align: center;
  padding: 20px;
`;
export const STitle = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  color: #107def;
  margin-top: 5px;
`;
export const SValue = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 23px;
  color: rgba(0, 28, 78, 0.87);
  margin-top: 5px;
`;
export const SCoin = styled.div`
  color: #8196bb;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  margin-top: 5px;
  line-height: 19px;
`;
export const SText = styled.div`
  color: rgba(0, 28, 78, 0.87);
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 35px;
  margin-top: 10px;
  img {
    margin-left: 10px;
  }
`;
export const SHref = styled.a`
  margin-left: 10px;
  color: #107def;
  font-size: 14px;
  cursoir: pointer;
  font-weight: 400;
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
export const SMax = styled.div`
  position: absolute;
  top: 8px;
  right: 10px;
  cursor: pointer;
  color: #107def;
  font-weight: 700;
`;
export const SBtn = styled.div`
  display: flex;
  justify-content: flex-end;
`;
export const SBtnUn = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;
export const SBtnStake = styled.div`
  cursor: pointer;
  background: #ffffff;
  color: #107def;
  border-radius: 50px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  margin-right: 10px;
  box-shadow: 0px 2px 6px rgba(68, 68, 68, 0.5);
`;
export const SSTake = styled.div`
  cursor: pointer;
  background: #ffffff;
  color: #107def;
  border-radius: 50px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  margin-right: 10px;
  min-width: 220px;
  box-shadow: 0px 2px 6px rgba(68, 68, 68, 0.5);
`;
export const SBtnUnstake = styled.div`
  cursor: pointer;
  color: #fff;
  background: #ff0606;
  border-radius: 50px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  margin-right: 10px;
  box-shadow: 0px 2px 6px rgba(68, 68, 68, 0.5);
`;
export const SInfor = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;
export const SInforText = styled.div`
  font-weight: 400;
  font-size: 18px;
  line-height: 29px;
  color: rgba(0, 28, 78, 0.87);
`;
export const SInforValue = styled.div`
  font-weight: 400;
  font-size: 18px;
  line-height: 29px;
  color: rgba(0, 28, 78, 0.87);
`;
export const SQuestion = styled.img`
  widht: 23px;
  height: 23px;
`;
export const SBtnClaim = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;
export const SBtnClaimStart = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;
export const SClaim = styled.div`
  cursor: pointer;
  background: #fff;
  font-weight: 700;
  color: #444444;
  opacity: 0.5;
  border-radius: 50px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  margin-right: 10px;
  box-shadow: 0px 2px 6px rgba(68, 68, 68, 0.5);
`;
export const SUnClaim = styled.div`
  cursor: pointer;
  background: #fff;
  color: #107def;
  font-weight: 700;
  border-radius: 50px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  margin-right: 10px;
  box-shadow: 0px 2px 6px rgba(68, 68, 68, 0.5);
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
export const SDetails = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
`;
export const SFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const SFlexEnd = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
export const SSUnTake = styled.div`
  cursor: pointer;
  background: #ff0606;
  color: #fff;
  border-radius: 50px;
  padding: 8px 20px;
  min-width: 220px;
  text-align: center;
  margin-right: 10px;
  min-width: 220px;
  box-shadow: 0px 2px 6px rgba(68, 68, 68, 0.5);
`;
export const SSlider = styled.div`
  width: 100%;
  .slick-slide img {
    margin: auto;
  }
`;
export const SItemSlider = styled.div``;
export const SImgSlider = styled.img``;
export const SBoxSlider = styled.div`
  width: 100%;
  padding: 10px;
`;
export const STitleSlider = styled.div``;
export const SDescriptionSlider = styled.div``;
