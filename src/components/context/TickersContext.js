import React, { createContext, useState, useEffect } from 'react';

export const TickersContext = createContext();

export const TickersProvider = (props) => {
  const [tickers, setTickers] = useState(null);
  const [streamedTickers, setStreamedTickers] = useState(null);
  const [storageTickers, setStorageTickers] = useState(null);

  const [tickers24h, setTickers24h] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // first init local storage
  useEffect(() => {
    // handle storage
    if (localStorage.getItem('tickers') === null) {
      localStorage.setItem('tickers', JSON.stringify([]));
      setStorageTickers([]);
    } else {
      const storageTickers = JSON.parse(localStorage.getItem('tickers'));

      if (storageTickers) {
        setIsLoading(true);
        fetch('https://api.binance.com/api/v3/ticker/price')
          .then((res) => res.json())
          .then((data) => {
            // console.log('storage tickers fetched once');
            let newTickersWithLiveChanginPrices = [];
            storageTickers.forEach((storageItem) => {
              data.forEach((dataItem) => {
                if (storageItem.symbol === dataItem.symbol) {
                  let streamObj = {
                    ...storageItem,
                    price: dataItem.price,
                  };

                  newTickersWithLiveChanginPrices.push(streamObj);
                }
              });
            });
            setIsLoading(false);
            setStorageTickers(newTickersWithLiveChanginPrices);
          });
      }
    }

    // setup streaming tickers
    getStreamedTickers();
  }, []);

  // get tickers streaming data, based by setInterval
  const getStreamedTickers = () => {
    setInterval(() => {
      fetch('https://api.binance.com/api/v3/ticker/price')
        .then((res) => res.json())
        .then((data) => {
          // console.log('stream tickers fetched');
          setStreamedTickers(data);
        });
    }, 5000);
  };

  // get tickers once
  const getTickers = () => {
    fetch('https://api.binance.com/api/v3/ticker/price')
      .then((res) => res.json())
      .then((data) => {
        // console.log('tickers price get tickers fetched');
        const newData = data.map((item) => {
          return {
            minimize: false,
            hide: true,
            selected: false,
            favorite: false,
            ...item,
          };
        });
        setTickers(newData);
      });
  };

  // from search save ticker to home screen (search item, click add btn, display new card in home screen)
  const saveTickerToLocalStorage = (item) => {
    const storage = JSON.parse(localStorage.getItem('tickers'));

    if (storage.length > 0) {
      const itemIsNotInStorage = storage.filter(
        (element) => element.symbol === item.symbol
      );

      if (itemIsNotInStorage.length === 0) {
        const newStorage = [...storage, { ...item, favorite: true }];
        localStorage.setItem('tickers', JSON.stringify(newStorage));
        setStorageTickers(newStorage);
      }
    }

    if (storage.length === 0) {
      const newStorage = [...storage, { ...item, favorite: true }];
      localStorage.setItem('tickers', JSON.stringify(newStorage));
      setStorageTickers(newStorage);
    }
  };

  const updateTickerToLocalStorage = (item) => {
    const storage = JSON.parse(localStorage.getItem('tickers'));
    const updateItem = storage.map((storageItem) => {
      if (item.symbol === storageItem.symbol) {
        storageItem = {
          ...storageItem,
          selected: item.selected,
        };
      }

      return storageItem;
    });

    localStorage.setItem('tickers', JSON.stringify(updateItem));
    setStorageTickers(updateItem);
  };

  const getTickerFromLoacalStorage = () => {
    const storage = JSON.parse(localStorage.getItem('tickers'));
    return storage;
  };

  const deleteTickerFromLocalStorage = (symbol) => {
    const storage = JSON.parse(localStorage.getItem('tickers'));
    const newStorage = storage.filter((item) => item.symbol !== symbol);

    // set state
    setStorageTickers(newStorage);

    // save local storage
    localStorage.setItem('tickers', JSON.stringify(newStorage));
  };

  // const
  const getStreamDayTickers = () => {
    if (tickers24h) {
      fetch('https://api.binance.com/api/v3/ticker/24hr')
        .then((res) => res.json())
        .then((data) => {
          setTickers24h(data);
          // console.log('24h tickers interval data first time ');
        });
    }
  };

  const streamDayTickers = () => {
    console.log(tickers24h);
    if (!tickers24h) {
      setInterval(() => {
        fetch('https://api.binance.com/api/v3/ticker/24hr')
          .then((res) => res.json())
          .then((data) => {
            setTickers24h(data);
            // console.log('24h tickers interval data fetched ');
          });
      }, 15000);
    }

    // askPrice: "0.03116500"
    // askQty: "1.86600000"
    // bidPrice: "0.03116400"
    // bidQty: "9.04000000"
    // closeTime: 1616266075640
    // count: 230327
    // firstId: 243707858
    // highPrice: "0.03149400"
    // lastId: 243938184
    // lastPrice: "0.03116400"
    // lastQty: "1.86600000"
    // lowPrice: "0.03090000"
    // openPrice: "0.03100000"
    // openTime: 1616179675640
    // prevClosePrice: "0.03100000"
    // priceChange: "0.00016400"
    // priceChangePercent: "0.529"
    // quoteVolume: "5616.68821541"
    // symbol: "ETHBTC"
    // volume: "180092.40300000"
    // weightedAvgPrice: "0.03118781"
  };

  return (
    <TickersContext.Provider
      value={{
        // call and get tickers once
        tickers,
        getTickers,

        // streamed tickers
        streamedTickers,
        getStreamedTickers,

        // storage
        saveTickerToLocalStorage,
        storageTickers,
        getTickerFromLoacalStorage,

        // delete symbol from local storage
        deleteTickerFromLocalStorage,

        // isLoading
        isLoading,

        // update tikcer
        updateTickerToLocalStorage,

        // day tickers data
        getStreamDayTickers,
        streamDayTickers,
        tickers24h,
      }}
    >
      {props.children}
    </TickersContext.Provider>
  );
};
