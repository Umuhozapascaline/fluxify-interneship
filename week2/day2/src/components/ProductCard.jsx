// ProductCard.jsx - Child component for product display
const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <div className="image-placeholder">
          🛍️
        </div>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">
          <span className="price">${product.price}</span>
        </div>
        <button onClick={handleAddToCart} className="add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;