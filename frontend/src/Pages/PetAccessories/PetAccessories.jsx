import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Preload } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartPage/CartContext';
import axios from 'axios';
import './PetAccessories.css';

// Model cache for loaded GLTF assets
const modelCache = new Map();

const PreloadAccessoryModels = ({ accessories }) => {
  useEffect(() => {
    accessories.forEach(accessory => {
      const modelPath = accessory.filePath.startsWith('http') 
        ? accessory.filePath 
        : `http://localhost:5000${accessory.filePath}`;
      
      if (!modelCache.has(modelPath)) {
        useGLTF.preload(modelPath);
        modelCache.set(modelPath, true);
      }
    });
  }, [accessories]);

  return null;
};

const AccessoryModel = ({ file }) => {
  const modelPath = useMemo(() => {
    return file && file.startsWith('http') ? file : `http://localhost:5000${file}`;
  }, [file]);

  const { scene } = useGLTF(modelPath);
  
  return (
    <primitive 
      object={scene} 
      scale={[2, 2, 2]}
      position={[0, -1, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  );
};

const ModelPlaceholder = () => (
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[2, 2, 2]} />
    <meshStandardMaterial color="#f0f0f0" />
  </mesh>
);

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
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ height: '300px', width: '100%' }}
        >
          <ambientLight intensity={0.8} />
          <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} />
          <directionalLight position={[0, 10, 5]} intensity={1} />
          <Suspense fallback={<ModelPlaceholder />}>
            <AccessoryModel file={accessory.filePath} />
          </Suspense>
          <OrbitControls 
            enableZoom={true} 
            minDistance={3} 
            maxDistance={10} 
            autoRotate
            autoRotateSpeed={0.5}
          />
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
        let filteredAccessories = response.data;

        if (selectedPet) {
          filteredAccessories = response.data.filter(
            (accessory) => accessory.petType === selectedPet
          );
        }

        setAccessories(filteredAccessories);
      } catch (err) {
        console.error('Error fetching accessories:', err);
        setError('Failed to load accessories. Please check the server connection.');
        setAccessories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, [selectedPet]);

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
      <PreloadAccessoryModels accessories={accessories} />
      
      <h2>
        {selectedPet 
          ? `${selectedPet.charAt(0).toUpperCase() + selectedPet.slice(1)} Accessories` 
          : "All Pet Accessories"
        }
      </h2>
      
      {loading && <div className="loading-overlay">
        <p className="loading-message">Loading accessories...</p>
      </div>}
      
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
          !loading && <p className="no-items-message">No accessories available for this pet.</p>
        )}
      </div>

      {renderDialog()}
    </div>
  );
};

export default PetAccessories;