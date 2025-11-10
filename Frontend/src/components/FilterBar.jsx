function FilterBar({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="filter-bar">
      <label>Category:</label>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="all">All</option>
        {categories.map((cat) => (
          // categories expected as objects: { _id, name }
          <option key={cat._id || cat.id || cat} value={cat._id || cat.id || cat}>
            {cat.name || cat}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterBar;