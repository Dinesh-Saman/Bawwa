import React, { useState, Suspense } from 'react';
import { useCart } from '../CartPage/CartContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiCheck, FiX, FiShoppingCart } from 'react-icons/fi';
import './CartPage.css';

const CartPage = () => {
  const { cart, setCart } = useCart();
  const [selectedItems, setSelectedItems] = useState(cart.map((item) => item.file));
  const [isRemoveDialogOpen, setRemoveDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const navigate = useNavigate();

  const initiateRemoveItem = (file) => {
    setItemToRemove(file);
    setRemoveDialogOpen(true);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      setCart((prevCart) => prevCart.filter((item) => item.file !== itemToRemove));
      setSelectedItems((prevSelected) => prevSelected.filter((item) => item !== itemToRemove));
      setRemoveDialogOpen(false);
      setSuccessDialogOpen(true);
      setTimeout(() => setSuccessDialogOpen(false), 2000);
    }
  };

  const updateQuantity = (file, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.file === file ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleItemSelection = (file) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(file)
        ? prevSelected.filter((item) => item !== file)
        : [...prevSelected, file]
    );
  };

  const totalPrice = cart
    .filter((item) => selectedItems.includes(item.file))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
    }).format(price);
  };

  return (
    <div className="cart-page-container">
      <motion.div 
        className="cart-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="cart-title">Your Shopping Cart</h1>
        <div className="cart-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</div>
      </motion.div>

      <div className="cart-content">
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <motion.div
              className="empty-cart-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FiShoppingCart size={48} className="empty-cart-icon" />
              <p className="empty-cart-message">Your cart is empty</p>
              <motion.button
                className="continue-shopping-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </motion.button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={item.file}
                  className="cart-item-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  layout
                >
                  <div className="cart-item-selector">
                    <input
                      type="checkbox"
                      id={`select-${item.file}`}
                      checked={selectedItems.includes(item.file)}
                      onChange={() => toggleItemSelection(item.file)}
                      className="cart-checkbox"
                    />
                    <label htmlFor={`select-${item.file}`} className="checkbox-label" />
                  </div>

                  <div className="cart-item-preview">
                    <Suspense fallback={<div className="model-loading-spinner" />}>
                      <Canvas>
                        <ambientLight intensity={0.7} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                        <OrbitControls enableZoom={false} enablePan={false} />
                        <AccessoryModel file={item.file} />
                      </Canvas>
                    </Suspense>
                  </div>

                  <div className="cart-item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-description">{item.description}</p>
                    
                    <div className="item-price-info">
                      <span className="unit-price">{formatPrice(item.price)} each</span>
                      <span className="total-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>

                    <div className="item-quantity-controls">
                      <motion.button
                        className="quantity-btn-cart"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.file, item.quantity - 1)}
                      >
                        -
                      </motion.button>
                      <span className="quantity-display">{item.quantity}</span>
                      <motion.button
                        className="quantity-btn-cart"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.file, item.quantity + 1)}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    className="remove-item-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => initiateRemoveItem(item.file)}
                  >
                    <FiTrash2 size={18} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {cart.length > 0 && (
          <motion.div
            className="order-summary-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="grand-total">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <motion.button
              className="checkout-btn"
              disabled={selectedItems.length === 0}
              whileHover={{ scale: selectedItems.length > 0 ? 1.02 : 1 }}
              whileTap={{ scale: selectedItems.length > 0 ? 0.98 : 1 }}
              onClick={() => navigate('/paymentPortal', { state: { total: totalPrice } })}
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isRemoveDialogOpen && (
          <>
            <motion.div
              className="dialog-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRemoveDialogOpen(false)}
            />
            <motion.div
              className="confirmation-dialog"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="dialog-header">
                <FiTrash2 size={24} className="dialog-icon" />
                <h4>Remove Item</h4>
              </div>
              <p>Are you sure you want to remove this item from your cart?</p>
              <div className="dialog-actions">
                <button className="cancel-btn" onClick={() => setRemoveDialogOpen(false)}>
                  <FiX size={18} /> Cancel
                </button>
                <button className="confirm-btn" onClick={confirmRemoveItem}>
                  <FiCheck size={18} /> Confirm
                </button>
              </div>
            </motion.div>
          </>
        )}

        {isSuccessDialogOpen && (
          <motion.div
            className="success-notification"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="success-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <p>Item removed successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AccessoryModel = ({ file }) => {
  const { scene } = useGLTF(`http://localhost:5000/uploads/${file}`);
  return <primitive object={scene} scale={3} position={[0, -1, 0]} rotation={[0, Math.PI / 4, 0]} />;
};

export default CartPage;