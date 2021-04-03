import React, { useContext } from 'react';
import { TickersContext } from '../../../context/TickersContext';

function CurrentAssets() {
  const {
    storageTickers,
    // streamedTickers,
    updateTickerToLocalStorage,
  } = useContext(TickersContext);

  // useEffect(() => {
  //   if (streamedTickers) {
  //     const newTickers = storageTickers.map((item) => {
  //       return {
  //         ...item,
  //         selected: true,
  //       };
  //     });
  //   }
  // }, [streamedTickers, storageTickers]);

  const selectTicker = (item) => {
    // updateTickerToLocalStorage(item);
    let updateItem = {};
    if (item.selected === false) {
      updateItem = {
        ...item,
        selected: true,
      };
    } else if (item.selected === true) {
      updateItem = {
        ...item,
        selected: false,
      };
    }

    updateTickerToLocalStorage(updateItem);
  };
  return (
    <div>
      <p className='font-bold pt-10 text-center'>
        Favorite assets
        {storageTickers && storageTickers.length}
      </p>
      <div className='small-font current-assets'>
        {storageTickers &&
          storageTickers.map((item) => (
            <p
              className={`cursor-pointer ${
                item.selected ? 'bg-success' : 'bg-light'
              }`}
              key={item.symbol}
              onClick={() => selectTicker(item)}
            >
              {item.symbol}
            </p>
          ))}
      </div>
    </div>
  );
}

export default CurrentAssets;
