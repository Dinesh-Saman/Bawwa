import React, { useState, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './PetModel.css';
import PetAccessories from '../PetAccessories/PetAccessories.jsx';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../CartPage/CartContext';

export function PetModel() {
  const [selectedPet, setSelectedPet] = useState('dog');
  const { scene } = useGLTF(`/models/${selectedPet}.glb`);
  const modelRef = useRef();
  const containerRef = useRef();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const { cart } = useCart();
  const [activeAccessory, setActiveAccessory] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scaleFactor = Math.min(containerSize.width, containerSize.height) / 15;

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  const handleDrop = (e) => {
    e.preventDefault();
    const accessoryData = JSON.parse(e.dataTransfer.getData('application/json'));

    // Adjust positions for different accessories
    const petAccessoryPositions = {
      dog: {
        collar: [0, 0.8, -0.1], // Adjusted for dog's neck
        hat: [0, 2.2, 0], // Adjusted for dog's head
      },
      cat: {
        collar: [0, 0.7, -0.1],
        hat: [0, 1.8, 0],
      },
      rabbit: {
        collar: [0, 0.6, -0.1],
        hat: [0, 1.5, 0],
      },
    };

    const position = petAccessoryPositions[selectedPet][accessoryData.type] || [0, 1.5, 0];

    setActiveAccessory({
      file: accessoryData.filePath,
      position,
      _id: accessoryData._id,
      name: accessoryData.name,
      price: accessoryData.price,
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="pet-model-container" ref={containerRef}>
      <div className="pet-content flex flex-wrap justify-center items-center">

        {/* 3D Model Canvas */}
        <div
          className="pet-canvas-container w-full md:w-1/2 p-4"
          style={{ marginBottom: '250px' }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Canvas camera={{ position: [0, 2, 40], fov: 60, near: 0.1, far: 1000 }} className="pet-canvas">
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} intensity={2} angle={0.15} />
            <OrbitControls target={[0, -3, 0]} />
            <group ref={modelRef} position={[0, -3, 0]} scale={scaleFactor}>
              <primitive object={scene} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />
              {activeAccessory && (
                <AccessoryModel
                  file={activeAccessory.file}
                  position={activeAccessory.position}
                />
              )}
            </group>
          </Canvas>

          {/* Pet Selection Buttons */}
          <div className="pet-buttons flex justify-center mt-4 space-x-2">
            {['dog', 'cat', 'rabbit'].map((pet) => (
              <button
                key={pet}
                onClick={() => {
                  setSelectedPet(pet);
                  setActiveAccessory(null);
                }}
                className={`pet-button px-4 py-2 rounded-md transition ${
                  selectedPet === pet ? 'bg-orange-500 text-white' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                {pet.charAt(0).toUpperCase() + pet.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Pet Accessories */}
        <div className="pet-accessories-container w-full md:w-1/2 p-6" style={{marginLeft:'20px'}}>
          <PetAccessories selectedPet={selectedPet} />
        </div>
      </div>
    </div>
  );
}

const AccessoryModel = ({ file, position }) => {
  const { scene } = useGLTF(`http://localhost:5000${file}`);
  return <primitive object={scene} scale={1} position={position} />;
};

export default PetModel;
