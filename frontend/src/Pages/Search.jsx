import React from 'react';
import { useLocation } from 'react-router-dom';
import './Search.css';
import Item from '../Components/Item/Item';

const Search = () => {
  const { state } = useLocation();
  const results = state?.results || [];
  const query = state?.query || '';

  return (
    <div className="search-page">
      <div className="search-header">
        <p>Search Results</p>
        <h2>"{query}" — {results.length} item{results.length !== 1 ? 's' : ''} found</h2>
      </div>
      {results.length > 0 ? (
        <div className="search-grid">
          {results.map(item => <Item key={item._id} {...item} />)}
        </div>
      ) : (
        <div className="search-empty">
          <p>No products found for "{query}". Try a different search.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
