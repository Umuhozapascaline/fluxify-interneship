import { useState } from 'react';
import ProductCard from './ProductCard';
import CartSummary from './CartSummary';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 99.99
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Fitness tracker with heart rate monitor",
      price: 149.99
    },
    {
      id: 3,
      name: "Laptop Backpack",
      description: "Water-resistant backpack with laptop compartment",
      price: 49.99
    },
    {
      id: 4,
      name: "USB-C Hub",
      description: "7-in-1 multiport adapter for laptops",
      price: 39.99
    }
  ];

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const getTotalItems = () => {
    return cartItems.length;
  };

  return (
    <div className="shopping-cart">
      <div className="cart-layout">
        <div className="cart-summary-section">
          <CartSummary totalItems={getTotalItems()} cartItems={cartItems} />
        </div>
        
        <div className="products-section">
          <h2>
            <span>📦</span> Products
          </h2>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;