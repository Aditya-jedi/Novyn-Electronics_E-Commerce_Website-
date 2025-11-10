import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cartItems, removeFromCart, decreaseQuantity, addToCart, clearCart, getTotalPrice } = useContext(CartContext);

  const total = getTotalPrice();

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty. Add some products to get started.</p>
      ) : (
        <>
          <div>
            {cartItems.map((item) => (
              <div key={item.id || item._id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <img src={item.image || "/placeholder.jpg"} alt={item.name} style={{ width: 80, height: 80, objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold" }}>{item.name}</div>
                  <div>Price: ₹{item.price}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => decreaseQuantity(item.id || item._id)}>-</button>
                  <span style={{ minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                  <button onClick={() => addToCart(item)}>+</button>
                  <button onClick={() => removeFromCart(item.id || item._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc3545" }}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <hr />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <div style={{ fontWeight: "bold" }}>Total: ₹{total}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/checkout">
                <button>Proceed to Checkout</button>
              </Link>
              <button onClick={() => clearCart()}>Clear Cart</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;