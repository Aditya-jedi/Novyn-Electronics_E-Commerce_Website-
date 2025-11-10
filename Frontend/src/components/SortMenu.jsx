function SortMenu({ sortOption, onSortChange }) {
  return (
    <div className="sort-menu">
      <label>Sort By:</label>
      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="default">Default</option>
        <option value="price_low_high">Price: Low → High</option>
        <option value="price_high_low">Price: High → Low</option>
        <option value="name_a_z">Name: A → Z</option>
      </select>
    </div>
  );
}

export default SortMenu;