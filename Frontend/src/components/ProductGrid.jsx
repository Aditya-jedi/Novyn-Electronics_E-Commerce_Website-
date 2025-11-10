import ProductCard from "./ProductCard";

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

  return (
    <div className="product-grid">
      {products.length > 0 ? (
        products.map((p) => {
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