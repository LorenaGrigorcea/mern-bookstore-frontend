import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Goleste coșul când pagina se încarcă (după plată reușită)
    const clearCart = async () => {
      try {
        await fetch('http://localhost:3000/api/clear-cart', {
          method: 'POST'
        });
        console.log('✅ Coș golit după plată reușită');
      } catch (error) {
        console.error('Eroare la golirea coșului:', error);
      }
    };

    clearCart();
  }, []);

  const sessionId = searchParams.get('session_id');

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <div className="success-icon"></div>
        <h1>Plată efectuată cu succes!</h1>
        <p className="success-message">
          Mulțumim pentru comanda ta. Coșul a fost golit și vei primi un email de confirmare în curând.
        </p>

        {sessionId && (
          <div className="order-details">
            <div className="detail-item">
              <span className="detail-label">Număr comandă:</span>
              <span className="detail-value">{sessionId.substring(0, 8)}...</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="status-badge">Confirmată</span>
            </div>
          </div>
        )}

        <div className="success-actions">
          <Link to="/" className="btn-primary">
            ← Înapoi la magazin
          </Link>
          <Link to="/" className="btn-secondary">
            Continuă cumpărăturile
          </Link>
        </div>

        <div className="security-notice">
          <div className="lock-icon">🔒</div>
          <span>Plata a fost procesată securizat prin Stripe</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;