import gql from 'graphql-tag'

export const ACCOUNT_MARKET_INFO = gql`
  query accounts($id: ID!) {
    accounts(
      where: {
        id: $id
      }
    ) {
    	tokens(first: 10) {
        symbol
        enteredMarket
        sTokenBalance
        storedBorrowBalance
      }
    }
  }
`;

export const VOTE_INFO = gql`
  query delegate($id: ID!) {
    delegate(id: $id) {
      id
      delegatedVotes
    }
  }
`;

export const STRK_BALANCE = gql`
  query tokenHolder($id: ID!) {
    tokenHolder(id: $id) {
      id
      tokenBalance
      delegate {
        id
      }
    }
  }
`;
