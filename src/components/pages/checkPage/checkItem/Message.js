import React from 'react';

function Message({
  collectivePrice,
  collectiveHigh,
  collectiveLow,
  collectiveSymbol,
  basePrice,
  baseHigh,
  baseLow,
  baseSymbol,
}) {
  return (
    <div className='pb-10 pt-10'>
      {parseFloat(collectivePrice) > parseFloat(collectiveHigh) ? (
        <h1 className='success-color'>{collectiveSymbol} HIGH !!!</h1>
      ) : (
        ''
      )}
      {parseFloat(collectivePrice) < parseFloat(collectiveLow) ? (
        <h1 className='danger-color'>{collectiveSymbol} LOW !!!</h1>
      ) : (
        ''
      )}

      {parseFloat(basePrice) > parseFloat(baseHigh) ? (
        <h1 className='success-color'>{baseSymbol} HIGH !!!</h1>
      ) : (
        ''
      )}
      {parseFloat(basePrice) < parseFloat(baseLow) ? (
        <h1 className='danger-color'>{baseSymbol} LOW !!!</h1>
      ) : (
        ''
      )}
    </div>
  );
}

export default Message;
