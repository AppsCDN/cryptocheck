import { queryByAttribute } from '@testing-library/dom';
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
      <p className='pt-10 text-center'>
        <span className='p-r-5'>Favorite assets</span>{' '}
        <span className='badge'>{storageTickers && storageTickers.length}</span>
      </p>
      <div className='small-font current-assets'>
        {storageTickers &&
          storageTickers.map((item) => (
            <button
              // style={{ color: '#fff' }
              className={`btn-primary  cursor-pointer ${
                item.selected ? 'bg-primary' : 'bg-dark scale-90'
              }`}
              key={item.symbol}
              onClick={() => selectTicker(item)}
            >
              {item.selected ? 'Close ' : 'Open '}
              {item.symbol}
            </button>
          ))}
      </div>
    </div>
  );
}

export default CurrentAssets;
