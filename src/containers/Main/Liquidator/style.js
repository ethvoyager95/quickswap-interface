import styled from 'styled-components';
import { Table, Modal } from 'antd';

export const STable = styled(Table)`
  background: #ffffff;
  border-radius: 5px;
  padding-left: 40px;
  padding-right: 40px;
  overflow-x: auto;
  overflow-y: auto;
  width: 100%;
  max-height: ${props => (props.liquidatorTable ? '430px' : 'unset')};
  margin-bottom: ${props => (props.liquidatorTable ? 'unset' : '60px')};

  .ant-table-thead {
    tr {
      th {
        color: var(--color-text-secondary);
        font-size: 16px;
        line-height: 24px;
        font-weight: normal;
        background: var(--color-bg-primary);
        text-align: left;
        padding: 14px;

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
      td {
        font-weight: normal;
        text-align: left;
        white-space: nowrap;
        padding: ${props => (props.liquidatorTable ? '10px' : '20px')};

        &:nth-child(1) {
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
        }
      }
    }

    tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
      background: #ffffff;
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
  color: #9d9fa7;
`;

export const SearchBar = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 30px;
  margin-bottom: 28px;

  .label {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #0b0f23;
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
      color: #06c270;
    }

    .refresh {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      text-decoration-line: underline;
      color: #6d6f7b;
      align-self: flex-end;
    }

    .text-input {
      display: flex;
      align-items: center;
      height: 50px;
      width: 100%;

      input {
        padding-left: 20px;
        height: 50px;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.03);
        border-radius: 8px 0 0 8px;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #6d6f7b;
        border-right: 0;
      }

      .search-btn {
        width: 50px;
        height: 50px;
        background: #107def;
        border-radius: 0px 8px 8px 0px;
        border-left: 0;
      }
    }
    .recent-btn {
      width: 228px;
      height: 50px;
      background: #3b54b5;
      border-radius: 8px;
      font-style: normal;
      font-weight: 900;
      font-size: 18px;
      line-height: 25px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #3b54b5 !important;
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
    background: #ffffff;
    border-radius: 5px;
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

      .flex-gap6 {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 6px;

        img:nth-child(1) {
          width: 32px;
          height: 32px;
        }

        img:last-child {
          width: 11px;
        }
      }

      .black-value {
        color: #0b0f23;
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

    .liquidate {
      background: #ffffff;
      border-radius: 5px;
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
        color: #0b0f23;
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
          background: #ffffff;
          border: 1px solid #e5e5e5;
          box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.03);
          border-radius: 8px;
        }

        .max-btn {
          position: absolute;
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 50px;
          text-decoration-line: underline;
          color: #6d6f7b;
          right: 20px;
          bottom: 0;
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

        div {
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          color: #0b0f23;
        }

        button {
          width: 140px;
          height: 50px;
          background: #107def;
          box-shadow: 0px 3px 20px rgba(18, 114, 236, 0.4);
          border-radius: 8px;
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
        justify-content: space-between;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #9d9fa7;
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
  color: #0b0f23;
`;

export const TdWithImg = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  color: #0b0f23;
  display: flex;
  align-items: center;
  gap: 6px;
  img {
    width: 36px;
    height: 36px;
  }
`;

export const CustomModal = styled(Modal)`
  .ant-modal-body {
    padding: 70px 60px;
    background: #eceff9;
  }
  .ant-modal-close:hover {
    background-color: transparent !important;
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
    color: #0b0f23;
    margin-bottom: 36px;
  }

  .search-label {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #0b0f23;
    margin-bottom: 12px;
    align-self: flex-start;
  }

  .search-input {
    display: flex;
    align-items: center;
    height: 50px;
    width: 100%;
    margin-bottom: 32px;

    input {
      padding-left: 20px;
      height: 50px;
      background: #ffffff;
      border: 1px solid #e5e5e5;
      box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.03);
      border-radius: 8px 0 0 8px;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #6d6f7b;
      border-right: 0;
    }

    .search-btn {
      width: 50px;
      height: 50px;
      background: #107def;
      border-radius: 0px 8px 8px 0px;
      border-left: 0;
    }
  }
`;

export const Timestamp = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  color: #0b0f23;
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

    span:nth-child(1) {
      color: #0b0f23;
    }

    span:last-child {
      color: #6d6f7b;
    }
  }
`;
