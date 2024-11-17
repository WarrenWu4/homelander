import React from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicButton from '../../DynamicButton';

function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    navigate('/aftercheck', {
      state: {
        cartItems: cart,
        total: total
      }
    });
    setCart([]);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Shopping Cart</h2>
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p>Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#E31837',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginTop: '20px',
              cursor: 'pointer'
            }}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                borderBottom: '1px solid #ddd',
                backgroundColor: 'white',
                marginBottom: '10px',
                borderRadius: '4px'
              }}
            >
              <div>
                <h3>{item.name}</h3>
                <p style={{ color: '#666' }}>{item.category}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <p style={{ fontWeight: 'bold' }}>${item.price}/mo</p>
                <button
                  onClick={() => removeFromCart(index)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ff4d4f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Cart Summary */}
          <div style={{
            marginTop: '30px',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '4px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3>Cart Total:</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#E31837' }}>
                ${cartTotal.toFixed(2)}/mo
              </p>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <DynamicButton
                variant="secondary"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </DynamicButton>
              <DynamicButton
                variant="primary"
                onClick={handleCheckout}
              >
                Finish Checking Out!
              </DynamicButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;