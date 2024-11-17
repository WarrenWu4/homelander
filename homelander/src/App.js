import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Cart from './pages/Cart';
import Explore from './pages/Explore';
import ProductDetails from './pages/ProductDetails';
import AfterCheck from './pages/AfterCheck';
import { FiShoppingCart } from 'react-icons/fi';
import DynamicButton from './DynamicButton';
import RecommendationsSection from './components/Recommendations';
import { getRecommendations } from './services/recommendationService';



// Idea could be to take whatever we get from the chatbot/recommendation
// And include keywords or something so it directs to the user to that/those specific product(s) for what they need
// Rn what I have is ecommerce but we can take it further and dive deeper into the user recommendations and that aspect 


// create basic schema idea for database - look into cloudflare
// add a checkout function so the user can purchase - done
// for recommendations, want to be able to display the top 5 most recommended when the recommendation is made
// can also display the most popular products
// also make sure all the pictures are ready and done - missing some items

const VideoPlayer = React.memo(({ videoUrl }) => (
  <video
    autoPlay
    key={videoUrl}
    loop
    muted
    playsInline
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }}
  >
    <source src={videoUrl} type="video/mp4" />
  </video>
));

const ProductCard = React.memo(({ product, onClick, onAddToCart }) => {
  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #ddd',
        borderRadius: '12px',
        backgroundColor: 'white',
        cursor: 'pointer',
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

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
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

        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 20px 0',
          flex: 1
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

        <DynamicButton
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          fullWidth
        >
          Add to Cart
        </DynamicButton>
      </div>
    </div>
  );
});

function App() {
  const [cart, setCart] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [accountId, setAccountId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://strength.thehomelander.tech/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Update recommendations state directly from the response
      setRecommendations(data.recommendations);
      setCurrentUser({
        id: accountId,
        data: data.metrics // Store metrics in user data
      });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const featuredProducts = [
    {
      id: 1,
      name: 'Internet Package',
      image: '/internetuse.jpg',
      description: 'High-speed internet for your home'
    },
    {
      id: 2,
      name: 'TV Bundle',
      image: '/tvpackage.webp',
      description: 'Premium channels and entertainment'
    },
    {
      id: 3,
      name: 'Phone Service',
      image: '/phoneservice.jpg',
      description: 'Reliable home phone service'
    }
  ];

  const Carousel = React.memo(({ featuredProducts }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handlePrevSlide = (e) => {
      e.preventDefault();
      setCurrentSlide(prev => prev === 0 ? featuredProducts.length - 1 : prev - 1);
    };

    const handleNextSlide = (e) => {
      e.preventDefault();
      setCurrentSlide(prev => prev === featuredProducts.length - 1 ? 0 : prev + 1);
    };

    const handleDotClick = (e, index) => {
      e.preventDefault();
      setCurrentSlide(index);
    };

    return (
      <div style={{
        position: 'relative',
        marginBottom: '40px',
        height: '400px',
        overflow: 'hidden',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {featuredProducts.map((product, index) => (
          <div
            key={product.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
              pointerEvents: currentSlide === index ? 'auto' : 'none'
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '20px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{product.name}</h2>
              <p>{product.description}</p>
            </div>
          </div>
        ))}

        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 1
        }}>
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={(e) => handleDotClick(e, index)}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: currentSlide === index ? '#E31837' : 'white',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                opacity: 0.8
              }}
            />
          ))}
        </div>

        <button
          onClick={handlePrevSlide}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.7)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            zIndex: 1
          }}
        >
          ←
        </button>
        <button
          onClick={handleNextSlide}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.7)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            zIndex: 1
          }}
        >
          →
        </button>
      </div>
    );
  });

  const productCategories = {
    INTERNET: 'Internet Plans',
    WIFI: 'WIFI Solutions',
    SECURITY: 'Security Services',
    TV: 'TV Services',
    ADDONS: 'Add-on Services'
  };

  const products = [
    {
      id: 1,
      name: 'Fiber 500',
      price: 45.00,
      category: productCategories.INTERNET,
      description: 'Perfect for small households and everyday internet use',
      features: [
        '500Mbps Connection',
        'Includes one standard WIFI router',
        'Symmetrical upload and download speeds',
        'No data caps'
      ],
      videoUrl: '/gamertype.mov',
    },
    {
      id: 2,
      name: 'Fiber 1 Gig',
      price: 65.00,
      category: productCategories.INTERNET,
      description: 'Ideal for gaming and 4K streaming',
      features: [
        '1Gbps Connection',
        'Includes one standard WIFI router',
        'Symmetrical upload and download speeds',
        'No data caps'
      ],
      videoUrl: '/typingvid.mov',
    },
    {
      id: 3,
      name: 'Fiber 2 Gig',
      price: 99.00,
      category: productCategories.INTERNET,
      description: 'Perfect for power users and large households',
      features: [
        '2Gbps Connection',
        'Includes one upgraded WIFI router and one extender',
        'Symmetrical upload and download speeds',
        'No data caps'
      ],
      videoUrl: '/ethernet.mov',
    },
    {
      id: 4,
      name: 'Additional Extender',
      price: 5.00,
      category: productCategories.ADDONS,
      description: 'Extend your WiFi coverage to eliminate dead spots',
      features: [
        'Compatible with all internet plans',
        'Easy self-installation',
        'Seamless WiFi mesh system',
        'Eliminates WiFi dead zones'
      ],
      videoUrl: '/wifiextend.mov',
    },
    {
      id: 5,
      name: 'Fiber 5 Gig',
      price: 129.00,
      category: productCategories.INTERNET,
      description: 'Ultra-fast internet for demanding users',
      features: [
        '5Gbps Connection',
        'Includes one premium router',
        'Symmetrical upload and download speeds',
        'No data caps'
      ],
      videoUrl: '/wifi.mov',
    },
    {
      id: 6,
      name: 'Fiber 7 Gig',
      price: 299.00,
      category: productCategories.INTERNET,
      description: 'Our fastest internet plan for ultimate performance',
      features: [
        '7Gbps Connection',
        'Includes one premium router and an extender at no charge',
        'Symmetrical upload and download speeds',
        'No data caps'
      ],
      videoUrl: '/fiber.mov',
    },
    {
      id: 7,
      name: 'Whole Home WIFI',
      price: 10.00,
      category: productCategories.WIFI,
      description: 'Consistent WiFi coverage throughout your home',
      features: [
        'Latest generation router',
        'Up to two additional extenders for Fiber 2 Gig and below',
        'One extender for 7 and 5 Gig',
        'Consistently strong Wi-Fi signal'
      ],
      videoUrl: '/wifihome.mov',
    },
    {
      id: 8,
      name: 'Unbreakable Wi-Fi',
      price: 25.00,
      category: productCategories.WIFI,
      features: [
        'Backup internet during outages',
        'Automatic switchover',
        '130GB of 4G LTE cellular data per month',
        'Self-install via mobile app'
      ],
      videoUrl: '/secure.mov',
    },
    {
      id: 9,
      name: 'Wi-Fi Security',
      price: 5.00,
      category: productCategories.SECURITY,
      features: [
        'Protects devices on home network',
        'Parental controls',
        'Ad blocking',
        'Internet activity reports'
      ],
      videoUrl: '/security.mov',
    },
    {
      id: 10,
      name: 'Wi-Fi Security Plus',
      price: 10.00,
      category: productCategories.SECURITY,
      features: [
        'Advanced security for home and mobile devices',
        'Guardian VPN for up to 5 devices',
        'Password Manager',
        'Parental controls'
      ],
      videoUrl: '/weefi.mov',
    },
    {
      id: 11,
      name: 'Total Shield',
      price: 10.00,
      category: productCategories.SECURITY,
      description: 'Complete security solution for all your devices',
      features: [
        'Security for up to 10 devices',
        'Real-time browsing protection',
        'Advanced parental controls',
        'Anti-virus protection'
      ],
      videoUrl: '/shield.mov',
    },
    {
      id: 12,
      name: 'My Premium Tech Pro',
      price: 10.00,
      category: productCategories.SECURITY,
      description: '24/7 technical support for all your devices',
      features: [
        'Remote technical support',
        'Device setup assistance',
        'Software installation help',
        'Network optimization'
      ],
      videoUrl: '/help.mov',
    },
    {
      id: 13,
      name: 'Identity Protection',
      price: 10.00,
      category: productCategories.SECURITY,
      description: 'Keep your personal information safe and secure',
      features: [
        'Personal information monitoring',
        'Up to $1M identity theft insurance',
        'Real-time alerts',
        'Credit monitoring'
      ],
      videoUrl: '/incog.mov',
    },
    {
      id: 14,
      name: 'Battery Backup',
      price: 79.99,
      category: productCategories.TV,
      features: [
        '100+ live channels',
        'No costly set-top-box',
        '3 simultaneous streams',
        'Unlimited DVR storage'
      ],
      videoUrl: '/battery.mov',
    }
  ];



  const addToCart = useCallback((product) => {
    setCart(prevCart => [...prevCart, product]);
  }, []);

  function Navigation({ cart, accountId, setAccountId }) {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin();
    };

    return (
      <nav style={{
        backgroundColor: '#E31837',
        padding: '15px 20px',
        marginBottom: '20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1
            onClick={() => navigate('/')}
            style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Homelander Connect
          </h1>

          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center'
          }}>
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}
            >
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="Enter Account ID"
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  width: '200px',
                  fontSize: '1rem'
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  color: '#E31837',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Loading...' : 'Login'}
              </button>
            </form>

            <div
              onClick={() => navigate('/cart')}
              style={{
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <FiShoppingCart
                size={24}
                color="white"
                style={{
                  cursor: 'pointer'
                }}
              />
              {cart.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: 'white',
                  color: '#E31837',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {cart.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }
  function HomePage({ products, addToCart, featuredProducts, accountId, recommendations }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px',
              width: '400px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1.1rem'
            }}
          />
        </div>

        {currentUser && recommendations && (
          <RecommendationsSection
            recommendations={recommendations}
            products={products}
            onAddToCart={addToCart}
          />
        )}

        <Carousel featuredProducts={featuredProducts} />

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <DynamicButton
            variant="primary"
            onClick={() => navigate('/explore')}
          >
            Explore Products
          </DynamicButton>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/product/${product.id}`)}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ backgroundColor: '#f5f5f5' }}>
        <Navigation
          cart={cart}
          accountId={accountId}
          setAccountId={setAccountId}
        />
        <Routes>
          <Route path="/" element={
            <HomePage
              products={products}
              featuredProducts={featuredProducts}
              addToCart={addToCart}
              accountId={accountId}
              recommendations={recommendations}
            />
          } />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/explore" element={<Explore products={products} />} />
          <Route path="/product/:id" element={<ProductDetails products={products} addToCart={addToCart} />} />
          <Route path="/aftercheck" element={<AfterCheck />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
