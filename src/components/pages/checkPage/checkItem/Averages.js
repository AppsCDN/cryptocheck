import React, { useContext, useEffect, useState } from 'react';
import { TickersContext } from '../../../context/TickersContext';

function Averages({ symbol, price, tradingAssetStyle, color }) {
  const { tickers24h, streamedTickers } = useContext(TickersContext);
  const [volume, setVolume] = useState('');

  useEffect(() => {
    if (tickers24h) {
      tickers24h.forEach((element) => {
        if (element.symbol === symbol) {
          let volNumber = parseFloat(element.quoteVolume).toFixed(0);
          let volToString = volNumber.toString(); // .slice(0, -6)
          setVolume(volToString);
        }
      });
    }
  }, [streamedTickers, tickers24h]);

  return (
    <div className='card-content top-line'>
      <div>
        <p className={color}>
          <span className={tradingAssetStyle}>{symbol}</span> Price:{' '}
          <span>{price}</span>
        </p>
        <p>MarketCap: 0</p>
        <p>Volume: {volume && volume}</p>
      </div>
    </div>
  );
}

export default Averages;
