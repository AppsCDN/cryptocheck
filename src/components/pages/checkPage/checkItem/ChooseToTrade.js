import React, { useContext, useEffect, useState } from 'react';
import { TickersContext } from '../../../context/TickersContext';
import Averages from './Averages';
import QtySellWatch from './QtySellWatch';
import { calculate, calculations } from './calculateAvrgHigLow';
import GenerateTradeCollective from './GenerateTradeCollective';

// collective
function ChooseToTrade({ baseItem }) {
  const [historicalDataBase, setHistoricalDataBase] = useState([]);
  const [historicalDataCollective, setHistoricalDataCollective] = useState([]);
  const [timeInterval, setTimeInterval] = useState('');
  const [collectiveSymbol, setCollectiveSymbol] = useState('');
  const [collectivePrice, setCollectivePrice] = useState('0');
  const [minimize, setMinimize] = useState(false);

  // for styling if price less than average display red..
  const [baseAssetColor, setBaseAssetCollor] = useState('');
  const [collectiveAssetColor, setCollectiveAssetCollor] = useState('');

  // updating base asset after calculations
  const [baseAssetAfterCalculations, setBaseAssetAfterCalculations] = useState({
    average: 0,
    high: 0,
    low: 0,
  });

  // updating collective asset after calculations
  const [
    collectiveAssetAfterCalculations,
    setCollectiveAssetAfterCalculations,
  ] = useState({
    average: 0,
    high: 0,
    low: 0,
  });

  // Tickers Context
  const {
    storageTickers,
    streamedTickers,
    updateTickerToLocalStorage,
  } = useContext(TickersContext);

  // history
  const getCandlestickHistoryData = (symbol, isAssetBase) => {
    fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m`)
      .then((res) => res.json())
      .then((data) => {
        // if base Item
        if (isAssetBase) {
          setHistoricalDataBase(data);
        }

        // if collective Item
        if (!isAssetBase) {
          setHistoricalDataCollective(data);
        }
      });
  };

  // get base historical data
  const getHistoricalDataBase = (e) => {
    getCandlestickHistoryData(baseItem.symbol, true);
  };

  // get collective historical data
  const getHistoricalDataCollective = (e) => {
    getCandlestickHistoryData(collectiveSymbol, false);
  };

  // make calculations after historical data arrived
  useEffect(() => {
    if (baseItem.selected) {
      if (
        historicalDataBase.length > 0 &&
        historicalDataCollective.length > 0
      ) {
        calculations(
          historicalDataBase,
          true,
          calculateHighLowAvg,
          timeInterval
        );
        calculations(
          historicalDataCollective,
          false,
          calculateHighLowAvg,
          timeInterval
        );
        console.log('fetch ONCE');
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historicalDataBase, historicalDataCollective]);

  useEffect(() => {
    if (streamedTickers) {
      const collectiveTickerFromStream = streamedTickers.filter(
        (item) => item.symbol === collectiveSymbol
      );

      if (collectiveTickerFromStream.length > 0) {
        setCollectivePrice(collectiveTickerFromStream[0].price);
      }
    }

    if (collectivePrice > 0) {
      const collectiveAverage = parseFloat(
        collectiveAssetAfterCalculations.average
      );
      if (parseFloat(collectivePrice) > collectiveAverage) {
        setCollectiveAssetCollor('success-color');
      } else {
        setCollectiveAssetCollor('danger-color');
      }
    }

    if (baseItem.price > 0) {
      const baseAverage = parseFloat(baseAssetAfterCalculations.average);
      if (parseFloat(baseItem.price) > baseAverage) {
        setBaseAssetCollor('success-color');
      } else {
        setBaseAssetCollor('danger-color');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamedTickers]);

  // set collecti symbol
  const setCollectiveAssetSymbol = (e) => {
    setCollectiveSymbol(e.target.value);
  };

  const calculateHighLowAvg = (data, minutes, isBaseAsset) => {
    const lowHighArvgObj = calculate(data, minutes);
    let minClose = lowHighArvgObj.minClose;
    let maxClose = lowHighArvgObj.maxClose;
    let avgClose = lowHighArvgObj.avgClose;

    if (isBaseAsset) {
      setBaseAssetAfterCalculations({
        average: avgClose,
        high: maxClose,
        low: minClose,
      });
    }

    if (!isBaseAsset) {
      setCollectiveAssetAfterCalculations({
        average: avgClose,
        high: maxClose,
        low: minClose,
      });
    }
  };

  const hideChekPriceCard = (baseItem) => {
    let newItem = {
      ...baseItem,
      selected: false,
    };

    updateTickerToLocalStorage(newItem);
  };

  return (
    <div className='card-header '>
      <button className='btn-dark'>Base {baseItem.symbol}</button>
      <select
        className='btn-primary'
        onChange={(e) => setCollectiveAssetSymbol(e)}
      >
        <option value='0'>Collective</option>
        {storageTickers &&
          storageTickers.map((baseItem) => (
            <option value={baseItem.symbol} key={baseItem.symbol}>
              {baseItem.symbol}
            </option>
          ))}
      </select>
      <select
        className='btn-primary'
        onChange={(e) => setTimeInterval(e.target.value)}
      >
        <option value='0'>Interval</option>
        <option value='5m'>5m</option>
        <option value='10m'>10m</option>
        <option value='15m'>15m</option>
        <option value='30m'>30m</option>
        <option value='1h'>1h</option>
        <option value='2h'>2h</option>
        <option value='3h'>3h</option>
        <option value='4h'>4h</option>
        <option value='5h'>5h</option>
        <option value='6h'>6h</option>
        <option value='7h'>7h</option>
        <option value='8h'>8h</option>
      </select>
      <button
        className='btn-primary'
        onClick={(e) => {
          getHistoricalDataCollective(e);
          getHistoricalDataBase(e);
        }}
      >
        Check
      </button>
      <div>
        <button
          className='btn-primary'
          onClick={() => {
            if (minimize) {
              setMinimize(false);
            } else {
              setMinimize(true);
            }
          }}
        >
          {minimize ? 'Maximize' : 'Minimize'}
        </button>
        <button
          className='btn-primary '
          onClick={() => hideChekPriceCard(baseItem)}
        >
          Hide Card
        </button>

        <hr className='mt-10' />
        <GenerateTradeCollective timeInterval={timeInterval} />
      </div>

      <div className={minimize ? 'hide' : ''}>
        {/* base symbol */}
        <Averages
          minimize={minimize}
          color={baseAssetColor}
          symbol={baseItem.symbol}
          price={baseItem.price}
          tradingAssetStyle={'base'}
          baseAssetAfterCalculations={baseAssetAfterCalculations}
        />
        <div className='no-visible'>
          <p>Low: {baseAssetAfterCalculations.low}</p>
          <p>High: {baseAssetAfterCalculations.high}</p>
          <p>Avrg: {baseAssetAfterCalculations.average} </p>
        </div>

        {/* collective symbol averages */}
        <Averages
          minimize={minimize}
          color={collectiveAssetColor}
          symbol={collectiveSymbol}
          price={collectivePrice}
          tradingAssetStyle={'collective'}
          collectiveAssetAfterCalculations={collectiveAssetAfterCalculations}
        />
        <div>
          <p>Low: {collectiveAssetAfterCalculations.low}</p>
          <p>High: {collectiveAssetAfterCalculations.high}</p>
          <p>Avrg: {collectiveAssetAfterCalculations.average} </p>
        </div>
      </div>

      <QtySellWatch
        timeInterval={timeInterval}
        baseSymbol={baseItem.symbol}
        basePrice={baseItem.price}
        collectiveSymbol={collectiveSymbol}
        collectivePrice={collectivePrice}
        baseLow={baseAssetAfterCalculations.low}
        baseHigh={baseAssetAfterCalculations.high}
        baseAvrg={baseAssetAfterCalculations.average}
        collectiveLow={collectiveAssetAfterCalculations.low}
        collectiveHigh={collectiveAssetAfterCalculations.high}
        collectiveAvrg={collectiveAssetAfterCalculations.average}
        getHistoricalDataCollective={getHistoricalDataCollective}
        getHistoricalDataBase={getHistoricalDataBase}
      />
    </div>
  );
}

export default ChooseToTrade;
