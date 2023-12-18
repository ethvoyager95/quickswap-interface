import { useState, useEffect } from 'react';
import axios from 'axios';
import * as constants from 'utilities/constants';
import useRefresh from 'hooks/useRefresh';

export const useSoldInfo = () => {
  const { mediumRefresh } = useRefresh();
  const [totalSold, setTotalSold] = useState({
    usdAmount: 0,
    strkAmount: 0
  });

  useEffect(() => {
    async function getRaiseAmount() {
      const totalData0 = await axios.post(
        constants.SALE_THE_GRAPH,
        {
          query: `{
            saleStats {
              usdAmount
              soldAmount
              }
            }`
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setTotalSold({
        usdAmount: Number(totalData0.data.data.saleStats[0].usdAmount),
        strkAmount: Number(totalData0.data.data.saleStats[0].soldAmount)
      });
    }
    getRaiseAmount();
  }, [mediumRefresh]);

  return { totalSold };
};
