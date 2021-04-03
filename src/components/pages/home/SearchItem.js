import React, { useContext } from 'react';
import { TickersContext } from '../../context/TickersContext';

function SearchItem({ item, clearSearchTerm }) {
  const {
    // tickers,
    // getTickers,
    // streamedTickers,
    // getStreamedTickers,
    saveTickerToLocalStorage,
  } = useContext(TickersContext);

  return (
    <li key={item.symbol} className='mt-5 mb-5'>
      <span className='symbol'>{item.symbol}</span>
      <span className='price'>{item.price}</span>
      <button
        className='btn-primary'
        onClick={() => {
          saveTickerToLocalStorage(item);
          clearSearchTerm();
        }}
      >
        Add
      </button>
    </li>
  );
}

export default SearchItem;
