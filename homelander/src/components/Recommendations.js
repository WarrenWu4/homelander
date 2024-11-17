import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicButton from '../DynamicButton';

const RecommendationsSection = ({ recommendations, products, onAddToCart }) => {
  const navigate = useNavigate();

  const formatProductName = (name) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/\s+G$/, ' Gig');
  };

  const getProductDetails = (productName) => {
    const formattedName = formatProductName(productName);
    return products.find(p => 
      p.name.toLowerCase() === formattedName.toLowerCase() ||
      p.name.toLowerCase().replace(/\s+/g, '_') === productName.toLowerCase()
    );
  };

  if (!recommendations?.length) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      marginBottom: '40px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#333'
      }}>
        Recommended for You
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '30px',
        marginTop: '20px'
      }}>
        {recommendations.map((recommendation, index) => {
          const productDetails = getProductDetails(recommendation.name);
          
          if (!productDetails) {
            console.log(`Product not found for: ${recommendation.name}`);
            return null;
          }

          return (
            <div
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => navigate(`/product/${productDetails.id}`)}
            >
              <div style={{
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start'
              }}>
                <span style={{
                  backgroundColor: '#f0f0f0',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  color: '#666'
                }}>
                  {productDetails.category}
                </span>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#E31837'
                }}>
                  ${productDetails.price}/mo
                </span>
              </div>

              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#333'
              }}>
                {productDetails.name}
              </h3>

              <p style={{
                color: '#666',
                marginBottom: '15px',
                fontSize: '0.9rem',
                fontStyle: 'italic'
              }}>
                {recommendation.reason}
              </p>

              <div style={{ marginBottom: '20px' }}>
                {productDetails.features.slice(0, 2).map((feature, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                      fontSize: '0.9rem',
                      color: '#666'
                    }}
                  >
                    <span style={{ color: '#E31837', marginRight: '8px' }}>✓</span>
                    {feature}
                  </div>
                ))}
              </div>

              <DynamicButton
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(productDetails);
                }}
                fullWidth
              >
                Add to Cart
              </DynamicButton>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendationsSection;
