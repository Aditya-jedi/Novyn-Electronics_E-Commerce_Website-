import { useState } from "react";
import "./SearchBar.css";

function SearchBar({ searchQuery, onSearchChange, placeholder = "Search products..." }) {
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSearchChange(value);
  };

  const handleClear = () => {
    setInputValue("");
    onSearchChange("");
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;