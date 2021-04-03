import React, { useContext, useEffect, useState } from 'react';
import './checkPage.scss';
import ChooseToTrade from './checkItem/ChooseToTrade';
import { TickersContext } from '../../context/TickersContext';

function CheckItem({ item }) {
  const { streamedTickers } = useContext(TickersContext);
  const [newItem, setNewItem] = useState(item);
  useEffect(() => {
    streamedTickers.forEach((element) => {
      if (element.symbol === item.symbol) {
        setNewItem({
          ...item,
          price: element.price,
        });
      }
    });
  }, [streamedTickers]);
  return (
    <li className='card'>
      <ChooseToTrade baseItem={newItem} />
    </li>
  );
}

export default CheckItem;
