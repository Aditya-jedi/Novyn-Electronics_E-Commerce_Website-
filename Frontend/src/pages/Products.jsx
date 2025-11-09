import { useState, useEffect } from "react";
import api from "../utils/api"; // ✅ your centralized API config
import FilterBar from "../components/FilterBar";
import SortMenu from "../components/SortMenu";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";

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

  // ✅ Fetch products + categories
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);

        const limit = searchQuery.trim() ? 0 : 10; // 0 means no pagination limit
        const categoryParam = category !== "all" ? `&category=${category}` : "";

        // ✅ Using api (axios instance) for all backend requests
        const [pRes, cRes] = await Promise.all([
          fetch(`/products?page=${currentPage}&limit=${limit}${categoryParam}`),
          fetch("/categories"),
        ]);

        if (!cancelled) {
          const data = pRes.data;
          const cats = cRes.data;

          setProducts(Array.isArray(data.products) ? data.products : []);
          setPagination(data.pagination || null);
          setCategories(Array.isArray(cats) ? cats : []);
        }
      } catch (err) {
        console.error("❌ Error fetching products or categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [currentPage, searchQuery, category]);

  // ✅ Handle seeding (for dev)
  const handleSeed = async () => {
    try {
      const res = await api.get("/seed");
      console.log("✅ Seed response:", res.data);

      // Re-fetch products after seeding
      const p = await api.get("/products");
      const list = p.data.products || p.data || [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("❌ Seed failed:", err);
    }
  };

  // ✅ Filtering, searching, sorting
  useEffect(() => {
    let temp = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      temp = temp.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(query) ||
          (p.category &&
            typeof p.category === "object" &&
            p.category.name &&
            p.category.name.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (category !== "all") {
      temp = temp.filter((p) => {
        const prodCatId = p.category && (p.category._id || p.category);
        return String(prodCatId) === String(category);
      });
    }

    // Sort logic
    if (sortOption === "price_low_high") {
      temp.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "price_high_low") {
      temp.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === "name_a_z") {
      temp.sort((a, b) =>
        (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase())
      );
    } else if (sortOption === "name_z_a") {
      temp.sort((a, b) =>
        (b.name || "").toLowerCase().localeCompare((a.name || "").toLowerCase())
      );
    }

    setFiltered(temp);
  }, [products, category, sortOption, searchQuery]);

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
        <div
          className="search-results-info"
          style={{
            textAlign: "center",
            margin: "1rem 0",
            color: "var(--text-muted)",
          }}
        >
          <p>
            Showing results for "{searchQuery}" ({filtered.length} products found)
          </p>
        </div>
      )}

      <div className="top-bar">
        <FilterBar
          categories={categories}
          selectedCategory={category}
          onCategoryChange={(newCategory) => {
            setCategory(newCategory);
            setCurrentPage(1);
          }}
        />
        <SortMenu sortOption={sortOption} onSortChange={setSortOption} />
      </div>

      {loading && <div className="spinner">Loading...</div>}

      <ProductGrid products={filtered} />

      {pagination && !searchQuery.trim() && (
        <div
          className="pagination"
          style={{ marginTop: "2rem", textAlign: "center" }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrev}
            style={{ margin: "0 0.5rem" }}
          >
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
            style={{ margin: "0 0.5rem" }}
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