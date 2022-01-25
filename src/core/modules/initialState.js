const auth = {
  user: null
};

const account = {
  setting: {
    selectedAddress: null,
    selectedENSName: null,
    selectedENSAvatar: null,
    marketType: 'supply',
    borrowMarket: [],
    supplyMarket: [],
    latestBlockNumber: '',
    decimals: {},
    assetList: [],
    totalLiquidity: '0',
    totalSupplyBalance: '0',
    totalBorrowBalance: '0',
    totalBorrowLimit: '0',
    pendingInfo: {
      type: '',
      status: false,
      amount: 0,
      symbol: ''
    },
    withSTRK: true,
    markets: []
  }
};
export const initialState = {
  auth,
  account
};
