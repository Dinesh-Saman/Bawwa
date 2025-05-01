import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartPage/CartContext';
import axios from 'axios';
import './PetAccessories.css';

// Pre-load models to avoid errors
useGLTF.preload('http://localhost:5000/models/default.glb');

const PetAccessories = ({ selectedPet }) => {
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/accessories');
        console.log('API Response:', response.data);
        
        // Display all accessories without filtering
        setAccessories(response.data);
        console.log('Showing all accessories:', response.data);
      } catch (err) {
        console.error('Error fetching accessories:', err);
        setError('Failed to load accessories. Please check the server connection.');
        setAccessories([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Always fetch accessories, regardless of selectedPet
    fetchAccessories();
  }, []);

  const handleDragStart = (e, accessory) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        _id: accessory._id,
        name: accessory.name,
        price: accessory.price,
        filePath: accessory.filePath,
      })
    );
  };

  const handleAddToCart = () => {
    if (selectedAccessory) {
      const item = {
        _id: selectedAccessory._id,
        name: selectedAccessory.name,
        description: selectedAccessory.description,
        price: selectedAccessory.price,
        file: selectedAccessory.filePath.split('/').pop(),
        quantity,
      };
      addToCart(item);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setDialogOpen(false);
        setQuantity(1);
        navigate('/cart');
      }, 2000);
    }
  };

  // Dialog for adding items to cart
  const renderDialog = () => {
    if (!isDialogOpen || !selectedAccessory) return null;
    
    return (
      <div className="dialog-overlay">
        <div className="dialog-content">
          <h3>Add to Cart</h3>
          <p>{selectedAccessory.name} - LKR {selectedAccessory.price.toFixed(2)}</p>
          
          <div className="quantity-selector">
            <label>Quantity: </label>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          
          <div className="dialog-buttons">
            <button onClick={() => setDialogOpen(false)}>Cancel</button>
            <button onClick={handleAddToCart} className="primary-button">
              {showSuccess ? 'Added!' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="accessory-container">
      <h2>All Pet Accessories</h2>
      
      {loading && <p className="loading-message">Loading accessories...</p>}
      {error && <p className="error-message">{error}</p>}
      
      <div className="accessory-list">
        {accessories.length > 0 ? (
          accessories.map((accessory) => (
            <AccessoryItem
              key={accessory._id}
              accessory={accessory}
              isSelected={selectedAccessory?._id === accessory._id}
              onSelect={() => setSelectedAccessory(accessory)}
              onAddToCart={() => {
                setSelectedAccessory(accessory);
                setDialogOpen(true);
              }}
              onDragStart={(e) => handleDragStart(e, accessory)}
            />
          ))
        ) : (
          !loading && <p className="no-items-message">No accessories available. Please check your database connection.</p>
        )}
      </div>

      {renderDialog()}
    </div>
  );
};

const AccessoryItem = ({ accessory, isSelected, onSelect, onAddToCart, onDragStart }) => {
  return (
    <div
      className={`accessory-item ${isSelected ? 'selected' : ''}`}
      draggable
      onDragStart={onDragStart}
    >
      <h3>{accessory.name}</h3>
      <p>{accessory.description}</p>
      <p className="accessory-price">LKR {accessory.price.toFixed(2)}</p>
      <div className="accessory-display">
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <directionalLight position={[0, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <AccessoryModel file={accessory.filePath} />
          </Suspense>
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
      <div className="accessory-buttons">
        <button
          className={`select-button ${isSelected ? 'active' : ''}`}
          onClick={onSelect}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
        <button className="cart-button" onClick={onAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const AccessoryModel = ({ file }) => {
  // Add error handling for the model loading
  try {
    const modelPath = file && file.startsWith('http') 
      ? file 
      : `http://localhost:5000${file}`;
      
    const { scene } = useGLTF(modelPath);
    
    return (
      <primitive 
        object={scene} 
        scale={1} 
        position={[0, 0, 0]} 
        rotation={[0, Math.PI / 4, 0]} 
      />
    );
  } catch (error) {
    console.error("Error loading 3D model:", error);
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }
};

export default PetAccessories;