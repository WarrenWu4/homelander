import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AfterCheck() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, total } = location.state || { cartItems: [], total: 0 };

  useEffect(() => {
    // Trigger animation after component mounts
    setVisible(true);
    
    // Automatically return to home after 8 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: `translateY(${visible ? 0 : '50px'})`,
          transition: 'all 1s ease-out',
        }}
      >
        <h1 style={{
          fontSize: '3rem',
          color: '#E31837',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Thank You for Your Purchase!
        </h1>
      </div>

      <div style={{
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : '30px'})`,
        transition: 'all 1s ease-out',
        transitionDelay: '0.5s',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          color: '#333',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Order Summary
        </h2>

        <div style={{
          marginBottom: '20px',
          borderBottom: '1px solid #eee',
          paddingBottom: '20px'
        }}>
          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                opacity: visible ? 1 : 0,
                transform: `translateY(${visible ? 0 : '20px'})`,
                transition: 'all 1s ease-out',
                transitionDelay: `${0.7 + index * 0.1}s`
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#333' }}>{item.name}</h3>
                <p style={{ color: '#666' }}>{item.category}</p>
              </div>
              <p style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                color: '#E31837'
              }}>
                ${item.price}/mo
              </p>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          opacity: visible ? 1 : 0,
          transform: `translateY(${visible ? 0 : '20px'})`,
          transition: 'all 1s ease-out',
          transitionDelay: '1.2s'
        }}>
          <span>Total Monthly Cost:</span>
          <span style={{ color: '#E31837' }}>${total.toFixed(2)}/mo</span>
        </div>

        <p style={{
          marginTop: '30px',
          textAlign: 'center',
          color: '#666',
          opacity: visible ? 1 : 0,
          transform: `translateY(${visible ? 0 : '20px'})`,
          transition: 'all 1s ease-out',
          transitionDelay: '1.4s'
        }}>
          You will be redirected to the home page in a few seconds...
        </p>
      </div>
    </div>
  );
}

export default AfterCheck;