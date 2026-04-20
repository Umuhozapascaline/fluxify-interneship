// CartSummary.jsx - Component to display cart summary
const CartSummary = ({ totalItems, cartItems }) => {
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <div className="cart-summary">
      <h2>🛒 Cart Summary</h2>
      <div className="cart-details">
        <div className="cart-info">
          <span className="cart-icon">📦</span>
          <span className="cart-count">
            Total Items: <strong>{totalItems}</strong>
          </span>
        </div>
        <div className="cart-total">
          <span>Total Price: </span>
          <strong>${calculateTotalPrice()}</strong>
        </div>
        {totalItems > 0 && (
          <div className="cart-items-list">
            <h4>Items in Cart:</h4>
            <ul>
              {cartItems.map((item, index) => (
                <li key={index}>
                  {item.name} - ${item.price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSummary;