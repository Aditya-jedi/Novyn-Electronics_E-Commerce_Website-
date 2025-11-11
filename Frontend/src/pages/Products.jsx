import { useState, useEffect } from "react";
import FilterBar from "../components/FilterBar";
import SortMenu from "../components/SortMenu";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";
import "./Products.css";


function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch products and categories on mount
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);

        // If searching, fetch all products; otherwise use pagination
        const limit = searchQuery.trim() ? 0 : 10; // 0 means no limit
        const categoryParam = category !== "all" ? `&category=${category}` : "";
        const [pRes, cRes] = await Promise.all([
          fetch(`/api/products?page=${currentPage}&limit=${limit}${categoryParam}`),
          fetch("/api/categories"),
        ]);

        if (!pRes.ok) throw new Error("Failed to fetch products");

        const data = await pRes.json();
        const cats = cRes.ok ? await cRes.json() : [];

        if (!cancelled) {
          setProducts(Array.isArray(data.products) ? data.products : []);
          setPagination(data.pagination);
          const catArray = Array.isArray(cats) ? cats : cats ? [cats] : [];
          // store category objects so we can filter by _id
          setCategories(catArray);
        }
      } catch (err) {
        console.error("Failed to fetch products or categories", err);
        // leave products empty so dev seed button is shown
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [currentPage, searchQuery, category]);

  const handleSeed = async () => {
    try {
      const res = await fetch("/api/seed");
      try {
        const json = await res.json();
        console.log("seed response", json);
      } catch {
        console.log("seed triggered");
      }
      // re-fetch products
      const p = await fetch("/api/products");
      if (p.ok) {
        const list = await p.json();
        setProducts(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error("Seed failed", err);
    }
  };

  useEffect(() => {
    let temp = [...products];

    // Search filter (only when searching, since category is now server-side)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      temp = temp.filter((p) =>
        (p.name || "").toLowerCase().includes(query) ||
        (p.category && typeof p.category === 'object' && p.category.name
          ? p.category.name.toLowerCase().includes(query)
          : false)
      );
    }

    // Category filter removed - now handled server-side

    // Sort
    if (sortOption === "price_low_high") {
      temp.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "price_high_low") {
      temp.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === "name_a_z") {
      temp.sort((a, b) => (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase()));
    } else if (sortOption === "name_z_a") {
      temp.sort((a, b) => (b.name || "").toLowerCase().localeCompare((a.name || "").toLowerCase()));
    }

    setFiltered(temp);
  }, [products, sortOption, searchQuery]); // Removed category from dependencies

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="products-page">
      <h1>All Products</h1>
      <div className="search-section">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search products by name or category..."
        />
      </div>
      {searchQuery && (
        <div className="search-results-info" style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)' }}>
          <p>Showing results for "{searchQuery}" ({filtered.length} products found)</p>
        </div>
      )}
      <div className="top-bar">
        <FilterBar
          categories={categories}
          selectedCategory={category}
          onCategoryChange={(newCategory) => {
            setCategory(newCategory);
            setCurrentPage(1); // Reset to page 1 when category changes
          }}
        />
        <div className="sort-container">
          <SortMenu sortOption={sortOption} onSortChange={setSortOption} />
        </div>
      </div>

      {loading && <div className="spinner"></div>}

      <ProductGrid products={filtered} />

      {pagination && !searchQuery.trim() && (
        <div className="pagination" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrev}
            style={{ margin: '0 0.5rem' }}
          >
            Previous
          </button>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
            style={{ margin: '0 0.5rem' }}
          >
            Next
          </button>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div style={{ marginTop: 16 }}>
          <button onClick={handleSeed}>Seed products (dev)</button>
        </div>
      )}
    </div>
  );
}

export default Products;