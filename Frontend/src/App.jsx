import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";


// Contexts
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";


import "./style.css";
import "./index.css";
import { ToastContainer, toast } from './utils/toast';
import ErrorBoundary from './components/ErrorBoundary';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const onError = (msg, url, line, col, error) => {
      console.error('Global error caught:', { msg, url, line, col, error });
      try {
        toast.error(`Runtime error: ${error?.message || msg}`);
      } catch (err) {
        void err;
      }
    };

    const onUnhandledRejection = (ev) => {
      console.error('Unhandled rejection:', ev.reason);
      try {
        toast.error(`Unhandled rejection: ${ev.reason?.message || ev.reason}`);
      } catch (err) {
        void err;
      }
    };

    window.onerror = onError;
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    return () => {
      window.onerror = null;
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);
  return (
    <CartProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <Router>
            <AuthProvider>
              <div className="app">
                <Navbar />

            <main>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected: everything else */}
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
                <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />

                {/* Protected admin route */}
                <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

                {/* Protected catch-all */}
                <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
              </Routes>
            </main>

            <ToastContainer />

            <Footer />
            </div>
          </AuthProvider>
        </Router>
      </ErrorBoundary>
      </ThemeProvider>
    </CartProvider>
  );
}

export default App;