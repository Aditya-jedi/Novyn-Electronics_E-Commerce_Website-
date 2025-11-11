import ProductCard from "./ProductCard";
import "./ProductGrid.css";

function ProductGrid({ products }) {
  const CardAvailable = typeof ProductCard === 'function' || typeof ProductCard === 'object';

  if (!CardAvailable) {
    // Defensive: avoid throwing 'Element type is invalid' and show diagnostic UI
    console.error('ProductGrid: ProductCard is not available (invalid import).', ProductCard);
    return (
      <div className="product-grid">
        <p style={{ color: 'red' }}>Product component failed to load. Check console for details.</p>
      </div>
    );
  }

  // Limit to 10 products per page for better performance and UX
  const displayedProducts = products.slice(0, 10);

  return (
    <div className="product-grid">
      {displayedProducts.length > 0 ? (
        displayedProducts.map((p) => {
          const key = p._id || p.id || `${p.name}-${Math.random()}`;
          try {
            return <ProductCard key={key} product={p} />;
          } catch (err) {
            console.error('Error rendering ProductCard for product', p, err);
            return (
              <div key={key} className="product-card error">
                <h3>{p.name}</h3>
                <p>Failed to render product card.</p>
              </div>
            );
          }
        })
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default ProductGrid;
