import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DynamicButton from '../../DynamicButton';

function ProductDetails({ products, addToCart }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px',
                textAlign: 'center'
            }}>
                <h2>Product not found</h2>
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
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '40px',
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                {/* Product video */}
                <div>
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    >
                        <source src={product.videoUrl} type="video/mp4" />
                    </video>
                </div>

                {/* Product Info */}
                <div>
                    <span style={{
                        backgroundColor: '#f0f0f0',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        marginBottom: '20px',
                        display: 'inline-block'
                    }}>
                        {product.category}
                    </span>

                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        marginBottom: '20px'
                    }}>
                        {product.name}
                    </h1>

                    <p style={{
                        color: '#666',
                        fontSize: '1.1rem',
                        marginBottom: '30px',
                        lineHeight: '1.6'
                    }}>
                        {product.description}
                    </p>

                    <div style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#E31837',
                        marginBottom: '30px'
                    }}>
                        ${product.price}/mo
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <DynamicButton
                            variant="primary"
                            onClick={() => {
                                addToCart(product);
                                navigate('/cart');
                            }}
                        >
                            Add to Cart
                        </DynamicButton>
                        <DynamicButton
                            variant="secondary"
                            onClick={() => navigate('/explore')}
                        >
                            View Similar
                        </DynamicButton>
                    </div>

                    {/* Additional Info */}
                    <div style={{
                        marginTop: '40px',
                        padding: '20px',
                        backgroundColor: '#f8f8f8',
                        borderRadius: '8px'
                    }}>
                        <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>
                            Package Features
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                ✓ No annual contract required
                            </li>
                            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                ✓ Professional installation included
                            </li>
                            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                ✓ 24/7 customer support
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center' }}>
                                ✓ 30-day money-back guarantee
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;