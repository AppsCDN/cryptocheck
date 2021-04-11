import './checkPage.scss';

import React, { useEffect, useContext } from 'react';
import CheckPrice from './checkPrice/CheckPrice';
import CoinCheckTrade from './CoinCheckTrade';
import { TickersContext } from '../../context/TickersContext';

function CheckPage() {
  const { streamDayTickers, getStreamDayTickers } = useContext(TickersContext);
  useEffect(() => {
    getStreamDayTickers();
    streamDayTickers();
  }, []);
  return (
    <div className='check-page'>
      <CheckPrice />
      {/* <hr /> */}
      <CoinCheckTrade />
    </div>
  );
}

export default CheckPage;
