import React, { useState, useEffect, useRef } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { TextureLoader, SphereGeometry } from "three";
import { OrbitControls, Stars } from "@react-three/drei";
import "./PetImageTo3D.css";

extend({ SphereGeometry });

const AnimatedSphere = ({ texture, normalMap, displacementMap }) => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[2, 128, 128]} />
      <meshStandardMaterial
        map={texture}
        normalMap={normalMap}
        displacementMap={displacementMap} // Add displacement for geometry variation
        displacementScale={0.1} // Adjust this value for more/less protrusion
        roughness={0.4}
        metalness={0.1}
        bumpMap={texture}
        bumpScale={0.05}
        envMapIntensity={0.5}
      />
    </mesh>
  );
};

const PetImageTo3D = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [texture, setTexture] = useState(null);
  const [normalMap, setNormalMap] = useState(null);
  const [displacementMap, setDisplacementMap] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } else {
      alert("Please upload a valid JPEG or PNG image.");
    }
  };

  useEffect(() => {
    if (imageUrl) {
      const loader = new TextureLoader();
      loader.load(
        imageUrl,
        (loadedTexture) => {
          setTexture(loadedTexture);
          // Use the image itself as a simple displacement map (grayscale effect)
          setDisplacementMap(loadedTexture);
          loader.load(
            "https://threejs.org/examples/textures/normalmap.jpg",
            (normalTexture) => {
              normalTexture.repeat.set(1, 1);
              setNormalMap(normalTexture);
            },
            undefined,
            (error) => console.error("Error loading normal map:", error)
          );
        },
        undefined,
        (error) => console.error("Error loading texture:", error)
      );

      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [imageUrl]);

  return (
    <div className="pet-container">
      <h2 className="pet-heading">Upload Your Pet Image for a 3D-Like Preview</h2>
      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleImageUpload}
        className="pet-upload"
      />
      <div className="canvas-wrapper">
        <Canvas shadows camera={{ position: [0, 1, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />
          <pointLight position={[-5, 3, -5]} intensity={1} color="#ffddaa" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {texture && (
            <AnimatedSphere
              texture={texture}
              normalMap={normalMap}
              displacementMap={displacementMap}
            />
          )}

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial opacity={0.3} />
          </mesh>

          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={3} maxDistance={10} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        </Canvas>
      </div>
      <p className="pet-note">Note: This enhances the sphere with displacement and lighting effects.</p>
    </div>
  );
};

export default PetImageTo3D;