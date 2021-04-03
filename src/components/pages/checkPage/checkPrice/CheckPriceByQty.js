import React, { useContext, useState } from 'react';
import { TickersContext } from '../../../context/TickersContext';

function CheckPriceByQty({ countPrice, countQty }) {
  const { tickers, getTickers, storageTickers } = useContext(TickersContext);
  const [qty, setQty] = useState('');
  const [counting, setCounting] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');

  const longPricesShorter = (price) => {
    let newPrice = price;
    if (price < 1) {
      newPrice = newPrice.toFixed(6);
    }

    if (price > 1 && price < 10) {
      newPrice = newPrice.toFixed(4);
    }

    if (price > 10) {
      newPrice = newPrice.toFixed(2);
    }
    return newPrice;
  };

  const calculatePriceHandler = (e) => {
    getTickers();
    e.preventDefault();
    setCounting(qty * 10);

    if (tickers) {
      const findedTicker = tickers.filter(
        (item) => item.symbol === selectedSymbol
      );

      let [findedSymbol] = findedTicker;

      let qtyPriceCalculations = 0;

      if (countQty) {
        qtyPriceCalculations = parseFloat(findedSymbol.price) * qty;
      }

      if (countPrice) {
        qtyPriceCalculations = qty / parseFloat(findedSymbol.price);
      }

      setCounting(longPricesShorter(qtyPriceCalculations));
    }
  };

  const getAssetHandler = (e) => {
    setSelectedSymbol(e.target.value);
  };

  return (
    <div className='check-price-count-qty'>
      {countQty && <p className='font-bold'>Coins</p>}
      {countPrice && <p className='font-bold'>Amount</p>}
      <form className='check-price-form'>
        <select className='btn-primary' onChange={(e) => getAssetHandler(e)}>
          <option value='0'>Select asset</option>
          {storageTickers &&
            storageTickers.map((item) => (
              <option value={item.symbol} key={item.symbol}>
                {item.symbol}
              </option>
            ))}
        </select>
        <div className='small-input'>
          <input
            type='text'
            value={qty}
            placeholder={countQty ? 'Qty coins' : countPrice ? 'Amount $' : ''}
            onChange={(e) => setQty(e.target.value)}
          />
        </div>
        <button
          className='btn-primary'
          onClick={(e) => calculatePriceHandler(e)}
        >
          Check price
        </button>
        {countQty && <p className='price'>Price: {counting}$ </p>}
        {countPrice && <p className='price'>Coins: {counting} </p>}
      </form>
    </div>
  );
}

export default CheckPriceByQty;
