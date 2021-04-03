import React, { useState } from 'react';

function History({ symbol }) {
  const [timeInterval, setTimeInterval] = useState('');
  const [historyTickers, setHistoryTickers] = useState({
    average: 0,
    high: 0,
    low: 0,
  });

  const getAveragePriceHandler = (e) => {
    getHistory(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m`
    );
  };

  const getHistory = (interval) => {
    fetch(interval)
      .then((res) => res.json())
      .then((data) => {
        calculations(data);
      });
  };

  const calculate = (data, minutes) => {
    const closePrices = data.map((item) => parseFloat(item[4]));
    const dataArrLength = closePrices.length;
    const numberToSplice = dataArrLength - minutes;
    const closes = closePrices.splice(numberToSplice);

    let minClose = Math.min(...closes);
    let maxClose = Math.max(...closes);
    let avgClose = closes.reduce((a, b) => a + b, 0) / closes.length;

    if (avgClose > 10) {
      minClose = minClose.toFixed(2);
      maxClose = maxClose.toFixed(2);
      avgClose = avgClose.toFixed(2);
    }

    if (avgClose > 1 && avgClose < 10) {
      minClose = minClose.toFixed(4);
      maxClose = maxClose.toFixed(4);
      avgClose = avgClose.toFixed(4);
    }

    if (avgClose < 1) {
      minClose = minClose.toFixed(6);
      maxClose = maxClose.toFixed(6);
      avgClose = avgClose.toFixed(6);
    }

    setHistoryTickers({
      average: avgClose,
      high: maxClose,
      low: minClose,
    });
  };

  const calculations = (data) => {
    let minutes;
    switch (timeInterval) {
      case '5m':
        minutes = 5;
        calculate(data, minutes);
        break;
      case '15m':
        minutes = 15;
        calculate(data, minutes);
        break;
      case '30m':
        minutes = 30;
        calculate(data, minutes);
        break;
      case '1h':
        minutes = 60;
        calculate(data, minutes);
        break;
      case '2h':
        minutes = 120;
        calculate(data, minutes);
        break;
      case '4h':
        minutes = 240;
        calculate(data, minutes);
        break;
      case '8h':
        minutes = 480;
        calculate(data, minutes);
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <div className='candlestick-history'>
        <hr />
        <p>Select time interval</p>
        <div className='flex'>
          <select
            className='btn-primary'
            onChange={(e) => setTimeInterval(e.target.value)}
          >
            <option value='interval'>Select time</option>
            <option value='5m'>5m</option>
            <option value='15m'>15m</option>
            <option value='30m'>30m</option>
            <option value='1h'>1h</option>
            <option value='2h'>2h</option>
            <option value='4h'>4h</option>
            <option value='8h'>8h</option>
          </select>
          <button className='btn-primary' onClick={getAveragePriceHandler}>
            Check
          </button>
        </div>
        <p className='pt-5 pb-5'>Average {historyTickers.average}</p>
        <p className='pb-5'>
          High{' '}
          {`${historyTickers.high} || ${(
            historyTickers.high - historyTickers.average
          ).toFixed(4)}`}
        </p>
        <p>
          Low{' '}
          {`${historyTickers.low} || ${(
            historyTickers.average - historyTickers.low
          ).toFixed(4)}`}
        </p>
      </div>
    </div>
  );
}

// [
//   [
//     1499040000000,      // Open time
//     "0.01634790",       // Open
//     "0.80000000",       // High
//     "0.01575800",       // Low
//     "0.01577100",       // Close
//     "148976.11427815",  // Volume
//     1499644799999,      // Close time
//     "2434.19055334",    // Quote asset volume
//     308,                // Number of trades
//     "1756.87402397",    // Taker buy base asset volume
//     "28.46694368",      // Taker buy quote asset volume
//     "17928899.62484339" // Ignore.
//   ]
// ]

export default History;
