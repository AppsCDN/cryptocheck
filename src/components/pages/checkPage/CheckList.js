import React, { useContext, useState, useEffect } from 'react';
import CheckItem from './CheckItem';
import { TickersContext } from '../../context/TickersContext';

function CheckList() {
  const { streamedTickers, storageTickers } = useContext(TickersContext);
  const [newTickers, setNewTickers] = useState([]);

  useEffect(() => {
    if (storageTickers) {
      setNewTickers(storageTickers);
    }
  }, [streamedTickers]);
  return (
    <ul className='card-list'>
      {streamedTickers &&
        newTickers
          .filter((item) => item.selected === true)
          .map((item) => (
            <CheckItem item={item} key={item.symbol + item.price} />
          ))}
    </ul>
  );
}

export default CheckList;
