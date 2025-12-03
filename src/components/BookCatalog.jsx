import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchFilterSort from './SearchFilterSort';
import CardSidebar from './CardSidebar';
import './BookCatalog.css';
import { FaCartArrowDown } from "react-icons/fa";


const BookCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  // Încarcă produsele și totalul coșului la montarea componentei
  useEffect(() => {
    fetchProducts();
    fetchCartTotal();
  }, []);

  useEffect(() => {
  const checkRecentPayment = async () => {
    const sessionId = localStorage.getItem('lastCheckoutSession');
    const timestamp = localStorage.getItem('checkoutTimestamp');

    if (sessionId && timestamp) {
      // 5 minute
      const isRecent = (Date.now() - parseInt(timestamp)) < 300000; 

      if (isRecent) {
        try {
          const response = await fetch(`http://localhost:3000/api/check-payment-status/${sessionId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.paymentStatus === 'paid') {
              await fetch('http://localhost:3000/api/clear-cart', {
                method: 'POST'
              });
            }
            fetchCartTotal(); 
            localStorage.removeItem('lastCheckoutSession');
            localStorage.removeItem('checkoutTimestamp');
          }
        } catch (error) {
          console.error('Error checking payment:', error);
        }
      } else {
        localStorage.removeItem('lastCheckoutSession');
        localStorage.removeItem('checkoutTimestamp');
      }
    }
  };

  // Verifică la încărcarea paginii
  checkRecentPayment();
}, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      console.log('Răspuns API:', response);
      if (response.data.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      }
    } catch (error) {
      setError('Eroare la încărcarea produselor');
      console.error('Eroare la obținerea produselor:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartTotal = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/cart');
      if (response.data.success) {
        setCartTotal(response.data.cart.totalItems);
      }
    } catch (error) {
      console.error('Eroare la încărcarea coșului:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await axios.post('http://localhost:3000/api/cart', {
        productId,
        quantity: 1,
      });

      if (response.data.success) {
        setCartTotal(response.data.cart.totalItems);
        console.log('Produs adăugat în coș:', response.data.cart);
      }
    } catch (error) {
      console.error('Eroare la adăugarea în coș:', error);
      alert('Eroare la adăugarea produsului în coș');
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => {
    setIsCartOpen(false);
    fetchCartTotal();
  } 

  if (loading) return <div className="loading">Se încarcă produsele...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app">
      {/* Header-ul aplicației cu logo și navigare */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            MERN BookStore
            <span className="version-badge">E-Commerce</span>
          </div>

          {/* Buton coș cu badge */}
          <button className="cart-button" onClick={openCart}>
            <FaCartArrowDown />
            {cartTotal > 0 && <span className="cart-badge">{cartTotal}</span>}
          </button>
        </div>
      </header>

      {/* Componenta de căutare și filtrare */}
      <SearchFilterSort
        products={products}
        onFilteredProducts={setFilteredProducts}
      />

      {/* Afișează numărul de produse filtrate */}
      <div className="results-count">
        {filteredProducts.length} produse găsite
      </div>

      {/* Grid-ul pentru afișarea produselor */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            {/* Imagine + overlay */}
            <div className="product-image-container">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="product-image"
              />
              <div className="hover-overlay">
                <div className="hover-content">
                  <p>
                    <strong>ISBN:</strong> {product.isbn || 'N/A'}
                  </p>
                  <p>
                    <strong>Editura:</strong>{' '}
                    {product.specifications.publisher || 'N/A'}
                  </p>
                  <p>
                    <strong>Pagini:</strong>{' '}
                    {product.specifications.pages || 'N/A'}
                  </p>
                  <p>
                    <strong>An publicare:</strong>{' '}
                    {product.specifications.year || 'N/A'}
                  </p>
                  <p>
                    <strong>Stoc disponibil:</strong> {product.stock} bucăți
                  </p>
                  {product.rating && (
                    <p>
                      <strong>Evaluare:</strong>{' '}
                      {'★'.repeat(Math.floor(product.rating))} (
                      {product.reviewCount} recenzii)
                    </p>
                  )}
                  <p className="description">
                    <strong>Descriere:</strong> {product.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Informațiile produsului */}
            <div className="product-info">
              <h3>{product.title}</h3>
              <p className="author">de {product.author}</p>

              <div className="price-section">
                {product.discountPrice ? (
                  <>
                    <span className="original-price">
                      {product.price} RON
                    </span>
                    <span className="current-price">
                      {product.discountPrice} RON
                    </span>
                  </>
                ) : (
                  <span className="current-price">{product.price} RON</span>
                )}
              </div>

              <button
                className="btn btn-primary"
                onClick={() => addToCart(product.id)}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Stoc epuizat' : 'Adaugă în coș'}
              </button>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <h2>Nu sunt produse disponibile</h2>
            <p>Magazinul este în curs de actualizare. Reveniti curând!</p>
          </div>
        )}
      </div>

      {/* Componenta CardSidebar */}
      <CardSidebar isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
};

export default BookCatalog;
