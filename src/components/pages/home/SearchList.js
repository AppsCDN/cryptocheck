import React from 'react';
import SearchItem from './SearchItem';

function SearchList({ tickers, searchTerm, clearSearchTerm }) {
  // style for filtering list
  const filterStyle = {
    display: searchTerm.length === 0 ? 'none' : 'flex',
  };
  return (
    <ul style={filterStyle}>
      {tickers &&
        tickers
          .filter((item) =>
            item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => (
            <SearchItem
              item={item}
              key={item.symbol}
              clearSearchTerm={clearSearchTerm}
            />
          ))}
    </ul>
  );
}

export default SearchList;
