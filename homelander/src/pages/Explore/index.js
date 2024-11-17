import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicButton from '../../DynamicButton';

const VideoPlayer = React.memo(({ videoUrl }) => (
  <video
    key={videoUrl}
    autoPlay
    loop
    muted
    playsInline
    style={{
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    }}
  >
    <source src={videoUrl} type="video/mp4" />
  </video>
));

function Explore({ products }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(products.map(product => product.category))];
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '20px',
          color: '#333'
        }}>
          Explore Our Products
        </h2>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <DynamicButton
              variant={selectedCategory === category ? "primary" : "secondary"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </DynamicButton>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '30px',
        padding: '10px'
      }}>
        {filteredProducts.map(product => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            style={{
              border: '1px solid #ddd',
              borderRadius: '12px',
              backgroundColor: 'white',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{
              position: 'relative',
              height: '200px',
              overflow: 'hidden',
              borderRadius: '12px 12px 0 0'
            }}>
              <VideoPlayer videoUrl={product.videoUrl} />
            </div>

            <div style={{
              padding: '20px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <span style={{
                  backgroundColor: '#f0f0f0',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  color: '#666'
                }}>
                  {product.category}
                </span>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#E31837'
                }}>
                  ${product.price}/mo
                </span>
              </div>

              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#333'
              }}>
                {product.name}
              </h3>

              {product.description && (
                <p style={{
                  color: '#666',
                  marginBottom: '15px',
                  fontSize: '0.9rem',
                  flex: 1
                }}>
                  {product.description}
                </p>
              )}

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 20px 0'
              }}>
                {product.features.slice(0, 3).map((feature, index) => (
                  <li
                    key={index}
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
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;