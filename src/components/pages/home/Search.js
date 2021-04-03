import React from 'react';

function Search({ searchTerm, searchTermHandler }) {
  return (
    <div className='mt-10 mb-10 small-input'>
      <label>Symbol</label>
      <input
        type='text'
        placeholder='find asset'
        value={searchTerm}
        onChange={(e) => searchTermHandler(e)}
      />
    </div>
  );
}

export default Search;
