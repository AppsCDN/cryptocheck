import React, { useState, useEffect } from 'react';
import Message from './Message';

function QtySellWatch({
  baseSymbol,
  basePrice,
  collectiveSymbol,
  collectivePrice,
  baseLow,
  baseHigh,
  baseAvrg,
  collectiveLow,
  collectiveHigh,
  collectiveAvrg,
  getHistoricalDataCollective,
  getHistoricalDataBase,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [collectiveQty, setCollectiveQty] = useState('');
  const [averageCollectiveQty, setAverageCollectiveQty] = useState('');

  const [baseCoinsToGet, setBaseCoinsToGet] = useState(0);
  const [collectiveCoinsToGet, setCollectiveCoinsToGet] = useState(0);

  // colors sell or buy
  const [side, setSide] = useState(false);

  useEffect(() => {
    const collectiveCoinsQty = (
      (parseFloat(searchTerm) * basePrice) /
      collectivePrice
    ).toFixed(6);
    setCollectiveQty(collectiveCoinsQty);

    // count average for collective Qty
    const countAverageQtyCoins = (
      (parseFloat(searchTerm) * baseAvrg) /
      collectiveAvrg
    ).toFixed(6);

    // static value it is not changing
    setAverageCollectiveQty(countAverageQtyCoins);

    if (!isNaN(countAverageQtyCoins)) {
      const howMuchBaseCoin = (
        (countAverageQtyCoins * collectivePrice) /
        basePrice
      ).toFixed(5);

      const howMuchCollectiveCoin = parseFloat(collectiveCoinsQty).toFixed(5);

      // set states , how much coins you can get
      setBaseCoinsToGet(howMuchBaseCoin);
      setCollectiveCoinsToGet(howMuchCollectiveCoin);

      howMuchCollectiveCoin > countAverageQtyCoins
        ? setSide(true)
        : setSide(false);
    }
  }, [baseAvrg, basePrice, collectiveAvrg, collectivePrice, searchTerm]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div className='card-footer'>
      <div>
        <div className='small-input'>
          <label>{baseSymbol} QTY</label>
          <input
            placeholder={`Sell ${baseSymbol} qty`}
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='border small-font'>
          <p className={side ? 'primary-color' : 'success-color'}>
            {baseCoinsToGet !== 0 && baseCoinsToGet} {baseSymbol}{' '}
            {!side && (
              <span>
                {' '}
                To Get:{' '}
                {!isNaN(averageCollectiveQty) &&
                  (baseCoinsToGet - parseFloat(searchTerm)).toFixed(5)}
              </span>
            )}
          </p>
          <p className={side ? 'success-color' : 'primary-color'}>
            {collectiveCoinsToGet !== 0 && collectiveCoinsToGet}{' '}
            {collectiveSymbol}{' '}
            {side && (
              <span>
                To Get:{' '}
                {!isNaN(averageCollectiveQty) &&
                  (collectiveCoinsToGet - averageCollectiveQty).toFixed(5)}
              </span>
            )}
          </p>
        </div>

        {/* hidden message */}
        <div className='border counter-averages small-font '>
          {searchTerm.length > 0 && (
            <div>
              {parseFloat(collectiveQty) < averageCollectiveQty * 0.93 && (
                <p className='bg-dark'>
                  SELL{' '}
                  <span className='danger-color font-bold'>
                    {collectiveSymbol}
                  </span>
                  {(
                    100 -
                    (parseFloat(collectiveQty) * 100) /
                      parseFloat(averageCollectiveQty)
                  ).toFixed(2)}{' '}
                  % up
                  <br />
                  BUY{' '}
                  <span className='green-color font-bold'>{baseSymbol}</span>
                </p>
              )}
              {parseFloat(collectiveQty) > averageCollectiveQty * 1.07 && (
                <p className='bg-dark'>
                  SELL{' '}
                  <span className='danger-color font-bold'>{baseSymbol}</span>
                  <br />
                  <span></span>
                  BUY{' '}
                  <span className='green-color font-bold'>
                    {collectiveSymbol}
                  </span>
                </p>
              )}

              <div>
                {!isNaN(averageCollectiveQty) && (
                  <div>
                    <span className='pr-10 primary-color'>
                      {averageCollectiveQty * 0.97} 3%
                    </span>
                    <p>
                      {averageCollectiveQty}{' '}
                      <span className='pl-5'>Average</span>
                    </p>
                    <span className='success-color'>
                      {averageCollectiveQty * 1.03} 3%{' '}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          <button
            className='btn-primary'
            onClick={(e) => {
              getHistoricalDataCollective(e);
              getHistoricalDataBase(e);
            }}
          >
            Watch
          </button>
          <span className='pl-10'>
            {collectiveSymbol}{' '}
            <span className='font-bold bg-dark'>
              {!isNaN(averageCollectiveQty) &&
                (
                  100 -
                  (collectiveCoinsToGet * 100) / averageCollectiveQty
                ).toFixed(2) + '%'}
            </span>
          </span>
        </div>
      </div>
      <Message
        collectivePrice={collectivePrice}
        collectiveHigh={collectiveHigh}
        collectiveLow={collectiveLow}
        collectiveSymbol={collectiveSymbol}
        basePrice={basePrice}
        baseHigh={baseHigh}
        baseLow={baseLow}
        baseSymbol={baseSymbol}
      />
    </div>
  );
}
export default QtySellWatch;
