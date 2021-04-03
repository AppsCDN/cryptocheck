import React, { useContext, useEffect, useState } from 'react';
import { TickersContext } from '../../../context/TickersContext';

function GenerateTradeCollective({ timeInterval }) {
  const { storageTickers } = useContext(TickersContext);
  const [symbols, setSymbols] = useState('');
  const [generatedTickers, setGeneratedTickers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // const [
  //   activeCoinstByChangingRangeDifferences,
  //   setActiveCoinstByChangingRangeDifferences,
  // ] = useState(null);candlesChangingDifferenceRangeBySorting

  // const [
  //   slowestCoinstByChangingRangeDifferences,
  //   setSlowestCoinstByChangingRangeDifferences,
  // ] = useState(null);

  const [
    candlesChangingDifferenceRangeBySorting,
    setCandlesChangingDifferenceRangeBySorting,
  ] = useState(null);

  const getHistoryData = (symbol) => {
    setSymbols(symbol);
  };

  const getCandlestickHistoryData = () => {
    if (storageTickers) {
      let interval = 1000;

      let storageTickersSymbolsList;
      if (storageTickers) {
        storageTickersSymbolsList = storageTickers.map((item) => item.symbol);

        if (storageTickersSymbolsList.length > 0) {
          storageTickersSymbolsList.forEach((storageSymbol, index) => {
            setTimeout(() => {
              getHistoryData(storageSymbol);
            }, index * 1000 + interval);
          });
        }
      }
    }
  };

  useEffect(() => {
    // console.log(symbols);

    if (symbols.length > 0) {
      fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbols}&interval=1m`
      )
        .then((res) => res.json())
        .then((data) => {
          setGeneratedTickers([
            ...generatedTickers,
            { symbol: symbols, data: data },
          ]);
        });
    }
  }, [symbols]);

  useEffect(() => {
    if (storageTickers) {
      if (storageTickers.length === generatedTickers.length) {
        // console.log('History data collected');
        // console.log(timeInterval);

        // console.log(calculateByTimeInterval(generatedTickers[0].data, timeInterval));
        //
        const countedData = generatedTickers.map((item) => {
          const minMaxAvg = calculateByTimeInterval(
            item.data,
            timeInterval,
            calculateMinMax
          );
          const volume = calculateByTimeInterval(
            item.data,
            timeInterval,
            calculateVolumes
          );

          let minProcDown =
            100 - (minMaxAvg.minClose * 100) / minMaxAvg.avgClose;
          let maxProcUp = (minMaxAvg.maxClose * 100) / minMaxAvg.avgClose - 100;
          let trend;

          if (minProcDown > maxProcUp) {
            trend = { value: minProcDown, went: 'down', predition: true }; //true go up
          } else if (maxProcUp > minProcDown) {
            trend = { value: maxProcUp, went: 'up', predition: false }; //false go down
          } else {
            trend = { value: 0, goes: '' };
          }

          let candleChangingRange = minProcDown + maxProcUp;
          let candlesChangingDifferenceRange = maxProcUp - minProcDown;

          let consolidation;
          if (candleChangingRange < 3.5) {
            consolidation = true;
          } else {
            consolidation = false;
          }

          item = {
            ...item,
            minMaxAvg,
            volume,
            minProcDown,
            maxProcUp,
            trend,
            candleChangingRange: { candleChangingRange, consolidation },
            candlesChangingDifferenceRange,
            timeInterval,
          };

          return item;
        });

        // most active assets by trading, min max differences, by candle changing difference range.

        const sortedByCandlesChangingDifferenceRange = [...countedData];
        sortedByCandlesChangingDifferenceRange.sort(
          (a, b) =>
            a.candlesChangingDifferenceRange - b.candlesChangingDifferenceRange
        );

        setCandlesChangingDifferenceRangeBySorting(
          sortedByCandlesChangingDifferenceRange
        );

        // const activeBiggestChangingDifferences = sortedByCandlesChangingDifferenceRange.slice(
        //   -2
        // );

        // const slowestChangingDifferences = sortedByCandlesChangingDifferenceRange.slice(
        //   0,
        //   2
        // );

        // setActiveCoinstByChangingRangeDifferences(
        //   activeBiggestChangingDifferences
        // );
        // setSlowestCoinstByChangingRangeDifferences(slowestChangingDifferences);

        // console.log(activeBiggestChangingDifferences);
        // console.log(slowestChangingDifferences);

        setIsLoading(false);
      }
    }
  }, [generatedTickers]);
  return (
    <div>
      <button
        className='btn-success mt-10'
        onClick={() => {
          if (timeInterval.length > 0) {
            setGeneratedTickers([]);
            getCandlestickHistoryData();
          } else {
            alert('Set First Time Interval ');
          }
        }}
      >
        Gererate
      </button>
      <button
        className='btn-primary'
        onClick={() => {
          setGeneratedTickers([]);
          setIsLoading(true);
        }}
      >
        Refresh
      </button>
      {isLoading && (
        <span>
          {' '}
          ...{' '}
          {storageTickers &&
            storageTickers.length - generatedTickers.length}{' '}
        </span>
      )}
      {!isLoading && <span className='font-bold bg-light'></span>}
      <div className='small-font-10'>
        <h6>Change diff high </h6>
        {candlesChangingDifferenceRangeBySorting &&
          candlesChangingDifferenceRangeBySorting.map((item) => {
            return (
              <p key={item.symbol}>
                <span>{item.symbol}</span>{' '}
                <span>
                  Diff range:{' '}
                  {parseFloat(item.candlesChangingDifferenceRange).toFixed(3)}
                </span>{' '}
                <span className='primary-color'>
                  {item.candleChangingRange.consolidation && 'Consolidation'}
                </span>
                <span className='font-bold'>
                  {item.trend.value ? ' Go Down' : ' Go Up'}
                </span>
              </p>
            );
          })}

        {/* <h1>Change diff low</h1>
        {slowestCoinstByChangingRangeDifferences &&
          slowestCoinstByChangingRangeDifferences.map((item) => {
            return (
              <p key={item.symbol}>
                <span>{item.symbol}</span>{' '}
                <span>
                  Diff range:{' '}
                  {parseFloat(item.candlesChangingDifferenceRange).toFixed(3)}
                </span>{' '}
                <span className='primary-color'>
                  {item.candleChangingRange.consolidation && 'Consolidation'}
                </span>
                <span className='font-bold'>
                  {item.trend.value ? ' Go Down' : ' Go Up'}
                </span>
              </p>
            );
          })} */}
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

export default GenerateTradeCollective;

const calculateByTimeInterval = (data, minutes, calculate) => {
  switch (minutes) {
    case '5m':
      minutes = 5;
      return calculate(data, minutes);
    case '10m':
      minutes = 10;
      return calculate(data, minutes);
    case '15m':
      minutes = 15;
      return calculate(data, minutes);
    case '30m':
      minutes = 30;
      return calculate(data, minutes);
    case '1h':
      minutes = 60;
      return calculate(data, minutes);
    case '2h':
      minutes = 120;
      return calculate(data, minutes);
    case '3h':
      minutes = 180;
      return calculate(data, minutes);
    case '4h':
      minutes = 240;
      return calculate(data, minutes);
    case '5h':
      minutes = 300;
      return calculate(data, minutes);
    case '6h':
      minutes = 360;
      return calculate(data, minutes);
    case '7h':
      minutes = 420;
      return calculate(data, minutes);
    case '8h':
      minutes = 480;
      return calculate(data, minutes);

    default:
      break;
  }
};

export const calculateMinMax = (data, minutes) => {
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

  return {
    minClose,
    maxClose,
    avgClose,
  };
};

const calculateVolumes = (data, minutes) => {
  // console.log(data);
  const closeVolumes = data.map((item) => parseFloat(item[5]));
  const dataArrLength = closeVolumes.length;
  const numberToSplice = dataArrLength - minutes;
  const volumes = closeVolumes.splice(numberToSplice);

  let avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;

  if (avgVolume > 10) {
    avgVolume = avgVolume.toFixed(2);
  }

  if (avgVolume > 1 && avgVolume < 10) {
    avgVolume = avgVolume.toFixed(2);
  }

  if (avgVolume < 1) {
    avgVolume = avgVolume.toFixed(2);
  }

  return {
    avgVolume,
  };
};
