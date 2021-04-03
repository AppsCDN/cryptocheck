import React from 'react';
import CandleHistory from './CandleHistory';
import { Link } from 'react-router-dom';

function Card({ ticker, deleteTickerFromLocalStorage }) {
  return (
    <div className='card'>
      <h1 className='card-title'>{ticker.symbol}</h1>
      <h1 className='mb-10 '>{ticker.price}</h1>
      <div className='card-header'></div>
      <CandleHistory symbol={ticker.symbol} />
      <div className='card-content'>
        <button
          className='btn-danger mt-20'
          onClick={() => deleteTickerFromLocalStorage(ticker.symbol)}
        >
          Delete Asset
        </button>
        <Link to='/check'>Check more</Link>
      </div>
    </div>
  );
}

export default Card;
