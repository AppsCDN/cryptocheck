import React, { useContext, useEffect, useState } from 'react';
import Card from './Card';
import { TickersContext } from '../../context/TickersContext';

function CardsList() {
  const {
    storageTickers,
    streamedTickers,
    deleteTickerFromLocalStorage,
  } = useContext(TickersContext);
  const [newTickers, setNewTickers] = useState([]);

  useEffect(() => {
    if (storageTickers) {
      setNewTickers(storageTickers);
    }

    if (streamedTickers) {
      let newTickersWithLiveChanginPrices = [];
      storageTickers.forEach((storageItem) => {
        streamedTickers.forEach((streamItem) => {
          if (storageItem.symbol === streamItem.symbol) {
            let streamObj = {
              ...storageItem,
              price: streamItem.price,
            };

            newTickersWithLiveChanginPrices.push(streamObj);
          }
        });
      });
      setNewTickers(newTickersWithLiveChanginPrices);
    }
  }, [storageTickers, streamedTickers]);

  return (
    <div>
      <p className='cards-counter'>Assets</p>
      <div className='cards'>
        {storageTickers &&
          newTickers.map((item) => (
            <Card
              key={item.symbol}
              ticker={item}
              deleteTickerFromLocalStorage={deleteTickerFromLocalStorage}
            />
          ))}
      </div>
    </div>
  );
}

export default CardsList;
