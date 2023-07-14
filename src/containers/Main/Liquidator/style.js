import styled from 'styled-components';
import { Table, Modal } from 'antd';

export const Wrapper = styled.div`
  margin: 0 16px;
`;

export const STableWrapper = styled.div`
  @media only screen and (max-width: 768px) {
    margin: 0 12px;
  }
`;

export const STable = styled(Table)`
  background: var(--color-bg-primary);
  border-radius: 6px;
  overflow-x: auto;
  overflow-y: auto;
  width: 100%;
  max-height: ${props => (props.liquidatorTable ? '430px' : 'unset')};
  margin-bottom: ${props => (props.liquidatorTable ? 'unset' : '60px')};

  table {
    padding-left: 40px;
    padding-right: 40px;
  }

  .ant-table-thead {
    tr {
      th {
        position: sticky;
        top: 0;
        color: var(--color-text-secondary);
        font-size: 16px;
        line-height: 24px;
        font-weight: normal;
        background: var(--color-bg-primary);
        text-align: left;
        padding: 14px;
        white-space: nowrap;

        &:nth-child(1) {
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
        }
      }
    }
  }

  .ant-table-tbody {
    tr {
      cursor: pointer;
      td {
        font-weight: normal;
        text-align: left;
        white-space: nowrap;
        padding: ${props =>
          props.liquidatorTable ? '10px 14px' : '20px 14px'};

        &:nth-child(1) {
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
        }
      }
    }

    tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
      background: var(--color-bg-primary);
    }
  }

  /* width */
  &::-webkit-scrollbar {
    width: 7px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    -webkit-border-radius: 3px;
    background-color: #e5e5e5;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #539ef9;
  }

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }
`;

export const THeadWrapper = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
  cursor: ${props => (props.sorted ? 'pointer' : 'unset')};

  .asc {
    transform: rotate(180deg);
  }
`;

export const SearchBar = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 20px;
  margin-bottom: 28px;

  .label {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: var(--color-text-main);
    margin-bottom: 12px;
  }

  .address {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    margin-bottom: 16px;

    .message {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #f84960;
    }

    .text-green {
      color: #06c270;
    }

    .refresh {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      text-decoration-line: underline;
      color: var(--color-text-main);
      align-self: flex-end;
      cursor: pointer;
    }

    .text-input {
      display: flex;
      align-items: center;
      height: 50px;
      width: 100%;

      input {
        padding-left: 20px;
        height: 50px;
        background: var(--color-bg-main);
        color: var(--color-text-main);
        border: 1px solid #e5e5e5;
        box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.03);
        border-radius: 6px 0 0 6px;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        border-right: 0;
      }

      .search-btn {
        width: 50px;
        height: 50px;
        background: #107def;
        border-radius: 0px 6px 6px 0px;
        border-left: 0;
      }
    }

    .recent-btn {
      width: 228px;
      height: 50px;
      background: linear-gradient(
        242deg,
        #246cf9 0%,
        #1e68f6 0.01%,
        #0047d0 100%,
        #0047d0 100%
      );
      border-radius: 6px;
      font-style: normal;
      font-weight: 900;
      font-size: 18px;
      line-height: 25px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0px;

      &:hover,
      &:active,
      &:visited,
      &:focus {
        background: linear-gradient(
          242deg,
          #246cf9 0%,
          #1e68f6 0.01%,
          #0047d0 100%,
          #0047d0 100%
        ) !important;
        opacity: 0.8;
      }
    }
  }

  .recent-btn-mob {
    display: none;
  }

  @media only screen and (max-width: 768px) {
    padding: 24px 0 0;
    margin: 0 12px 32px;

    .address {
      .recent-btn {
        display: none;
      }
    }

    .recent-btn-mob {
      display: flex;
      width: 100%;
      height: 50px;
      background: linear-gradient(
        242deg,
        #246cf9 0%,
        #1e68f6 0.01%,
        #0047d0 100%,
        #0047d0 100%
      );
      border-radius: 6px;
      font-style: normal;
      font-weight: 900;
      font-size: 18px;
      line-height: 25px;
      color: #ffffff;
      align-items: center;
      justify-content: center;
      border: 0px;

      &:hover,
      &:active,
      &:visited,
      &:focus {
        background: linear-gradient(
          242deg,
          #246cf9 0%,
          #1e68f6 0.01%,
          #0047d0 100%,
          #0047d0 100%
        );
        color: #ffffff;
        opacity: 0.8;
      }
    }
  }
`;

export const WalletInfo = styled.div`
  display: grid;
  column-gap: 28px;
  grid-template-columns: 2fr 3fr;
  margin-bottom: 30px;

  .details {
    background: var(--color-bg-primary);
    border-radius: 6px;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    color: #6d6f7b;
    padding: 24px 40px;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
      color: var(--color-text-secondary);

      .flex-gap6 {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 6px;

        img {
          width: 32px;
          height: 32px;
        }

        .dropdown {
          width: 11px;
        }
      }

      .gray-value {
        color: #6d6f7b;
      }

      .green-value {
        color: #06c270;
      }

      .red-value {
        color: #f84960;
      }

      .blue-value {
        color: #107def;
      }

      .flex-value {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
    }

    .item:last-child {
      margin-bottom: 0;
    }

    .item:nth-child(4),
    .item:nth-child(5) {
      align-items: flex-start;
    }
  }

  .liquidate-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: var(--color-bg-primary);
    border-radius: 6px;

    .mess-liquidator {
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 28px;
      color: #6d6f7b;
      padding: 120px 0;
    }

    .liquidate {
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 28px;
      color: #6d6f7b;
      padding: 24px 40px;
      width: 100%;
      height: 100%;

      .title {
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: var(--color-text-main);
        margin-bottom: 12px;

        img {
          width: 24px;
        }
      }

      .text-input {
        position: relative;
        margin-bottom: 16px;

        input {
          height: 50px;
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          background: var(--color-bg-main);
          color: var(--color-text-main);
          border: 0px;
          box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.03);
          border-radius: 6px;
        }

        .max-btn {
          position: absolute;
          font-style: normal;
          font-weight: 500;
          font-size: 12px;
          background: #107def;
          border-radius: 6px;
          color: #fff;
          font-size: 14px;
          padding: 5px 15px;
          right: 8px;
          top: 6px;
          cursor: pointer;
        }
      }

      .balance {
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 40px;

        span {
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          color: #107def;
        }
      }

      .liquidate-btn-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 60px;

        .err {
          color: #f84960;
          font-style: normal;
          font-weight: 500;
        }

        div {
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          color: var(--color-text-main);
        }

        button {
          width: 140px;
          height: 50px;
          background: linear-gradient(
            242deg,
            #246cf9 0%,
            #1e68f6 0.01%,
            #0047d0 100%,
            #0047d0 100%
          );
          border: 0px;
          border-radius: 6px;
          font-style: normal;
          font-weight: 900;
          font-size: 18px;
          color: #ffffff;
        }

        .text-blue {
          color: #107def;
        }

        .text-gray {
          color: #9d9fa7;
        }
      }

      .gas-price {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #9d9fa7;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .details {
      padding: 28px 20px;
      width: 100%;
    }

    .liquidate-wrapper {
      .liquidate {
        padding: 24px 20px;

        .title {
          margin-bottom: 16px;
        }

        .balance {
          margin-bottom: 24px;
        }

        .liquidate-btn-wrapper {
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }
      }
    }
  }
`;

export const BlockLabel = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #6d6f7b;
  margin-bottom: 14px;

  @media only screen and (max-width: 768px) {
    padding: 0 12px;
    margin-bottom: 8px;
  }
`;

export const Address = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  color: #107def;
`;

export const Health = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  color: ${props => (props.health <= '1' ? '#f84960' : '#06c270')};
`;

export const TdWithImg = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  color: var(--color-text-main);
  display: flex;
  align-items: center;
  gap: 6px;
  img {
    width: 36px;
    height: 36px;
  }
`;

export const CustomModal = styled(Modal)`
  .ant-modal-content {
    background-color: unset;
    border-radius: ${props => (props.loading ? '6px' : 'unset')};
  }
  .ant-modal-body {
    padding: 70px 24px;
    background: ${props => (props.loading ? '#141518' : '#141518')};
    border-radius: ${props => (props.loading ? '6px' : 'unset')};
  }

  .ant-modal-close {
    color: var(--color-text-main);
  }

  .ant-modal-close:hover {
    background-color: transparent !important;
    color: var(--color-text-main);
  }

  @media only screen and (max-width: 768px) {
    .ant-modal-body {
      padding: 70px 16px;
    }
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-style: normal;
    font-weight: 500;
    font-size: 31px;
    line-height: 120%;
    color: var(--color-text-main);
    margin-bottom: 36px;
  }

  .search-label {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: var(--color-text-main);
    margin-bottom: 12px;
    align-self: flex-start;
  }

  .error-mess {
    color: #f84960;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 16px;
    margin-top: -16px;
    align-self: flex-start;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 24px;
    margin-bottom: 32px;

    .search-input {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 50px;
      width: 100%;
      flex: 1;

      .error-mess-mobile {
        display: none;
      }

      input {
        padding-left: 20px;
        height: 50px;
        background: var(--color-bg-main);
        border: 1px solid #e5e5e5;
        box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.03);
        border-radius: 6px;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: var(--color-text-main);
      }
    }

    .date-picker-wrapper {
      display: flex;
      align-items: center;
      gap: 24px;
      flex: 1;
      width: 100%;

      .date-picker {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;

        .date-picker-label {
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          color: #0b0f23;
        }

        .ant-calendar-picker {
          width: 100%;
        }

        .ant-calendar-picker-icon {
          color: white !important;
        }

        input {
          background: var(--color-bg-main);
          height: 50px;
          border: 1px solid #e5e5e5;
          box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.03);
          border-radius: 6px;
        }
      }
    }

    .search-btn {
      width: 120px;
      height: 50px;
      background: linear-gradient(
        242deg,
        #246cf9 0%,
        #1e68f6 0.01%,
        #0047d0 100%,
        #0047d0 100%
      );
      border: 0px;
      border-radius: 6px;
      color: #ffffff;
      font-style: normal;
      font-weight: 900;
      font-size: 18px;
      line-height: 25px;
    }
  }

  @media only screen and (max-width: 992px) {
    .title {
      font-size: 20px;
      line-height: 120%;
      margin-bottom: 24px;
    }

    .search-label {
      margin-bottom: 16px;
    }

    .input-wrapper {
      flex-direction: column;
      gap: 25px;
      margin-bottom: 24px;

      .search-input {
        .error-mess-mobile {
          display: block;
          color: #f84960;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 22px;
          margin-top: 16px;
          align-self: flex-start;
        }
      }

      .date-picker-wrapper {
        gap: 16px;

        .date-picker {
          flex-direction: column;
          gap: 6px;
          align-items: flex-start;
        }
      }
    }

    .error-mess {
      display: none;
    }
  }
`;

export const ModalLoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;

  .title {
    font-style: normal;
    font-weight: 500;
    font-size: 31px;
    line-height: 120%;
    color: var(--color-text-main);
  }

  .content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-direction: column;

    .title {
      font-style: normal;
      font-weight: 500;
      font-size: 31px;
      line-height: 120%;
      color: var(--color-text-main);
    }

    .sub-title {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #9d9fa7;
    }
  }

  .txh-wrapper {
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    color: var(--color-text-main);
    padding: 16px 0;
    background: #eeeeee;
    border-radius: 6px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    .icon-copy {
      cursor: pointer;
    }
  }

  .link {
    font-weight: 900;
    font-size: 16px;
    line-height: 24px;
    color: #107def;
    text-align: center;
    width: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`;

export const Timestamp = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  color: var(--color-text-main);
`;

export const BorrowerAndLiquidator = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  color: #107def;
`;

export const SeizedAndRepay = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  img {
    width: 36px;
    height: 36px;
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;

    .black {
      color: var(--color-text-main);
    }

    .gray {
      color: #6d6f7b;
    }
  }
`;

export const DropdownAsset = styled.div`
  background: var(--color-bg-main);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  border: 1px solid var(--color-text-secondary);

  div {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 16px;
    padding-right: 40px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    img {
      width: 32px;
    }

    span {
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 28px;
      color: var(--color-text-main);
    }
  }
`;

export const SButton = styled.button`
  background-color: transparent;
  padding: 0;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: transparent !important;
  }
`;

export const NoData = styled.div`
  display: flex;
  flex-direction: column;
  margin: 100px auto;
  gap: 24px;
  align-items: center;

  div {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 27px;
    color: #9d9fa7;
  }

  @media only screen and (max-width: 768px) {
    div {
      font-weight: 900;
      font-size: 12px;
      line-height: 19px;
    }
    img {
      width: 200px;
    }
  }
`;
