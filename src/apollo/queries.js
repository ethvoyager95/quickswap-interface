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
