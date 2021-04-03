import React from 'react';

import CheckPriceByQty from './CheckPriceByQty';
import CurrentAssets from './CurrentAssets';
function CheckPrice() {
  return (
    <div>
      <h1 className='text-center mt-5'>Calculator</h1>
      <div className='prices-calculations'>
        <CheckPriceByQty countQty={true} countPrice={false} />
        <CheckPriceByQty countQty={false} countPrice={true} />
      </div>
      <CurrentAssets />
    </div>
  );
}

export default CheckPrice;
