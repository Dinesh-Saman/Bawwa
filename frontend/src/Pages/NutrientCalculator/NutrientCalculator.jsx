import React, { useState } from 'react';
import './NutrientCalculator.css';

const NutrientCalculator = () => {
  const [petType, setPetType] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [nutrients, setNutrients] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handlePetTypeChange = (e) => setPetType(e.target.value);
  
  // Prevent minus sign and limit age to 100
  const handleAgeChange = (e) => {
    const value = e.target.value;
    // Only allow digits and ensure value is between 0 and 100
    if (value === '' || (/^\d*$/.test(value) && parseInt(value || 0) <= 100)) {
      setAge(value);
    }
  };
  
  // Prevent minus sign and limit weight to 200
  const handleWeightChange = (e) => {
    const value = e.target.value;
    // Only allow digits and decimals and ensure value is between 0 and 200
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value || 0) <= 200)) {
      setWeight(value);
    }
  };
  
  // Prevent minus sign in number inputs
  const preventMinusSign = (e) => {
    if (e.key === '-' || e.key === 'e') {
      e.preventDefault();
    }
  };

  const calculateNutrients = (type, age, weight) => {
    let protein, carbohydrates, fat, fiber;
    
    if (type.toLowerCase() === 'dog') {
      protein = weight * 2.5;
      carbohydrates = weight * 5;
      fat = weight * 1.2;
      fiber = weight * 0.5;
    } else {
      protein = weight * 2.0;
      carbohydrates = weight * 4.5;
      fat = weight * 1.0;
      fiber = weight * 0.4;
    }
    
    return { protein, carbohydrates, fat, fiber };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCalculating(true);
    
    setTimeout(() => {
      const nutrientValues = calculateNutrients(petType, parseFloat(age), parseFloat(weight));
      setNutrients(nutrientValues);
      setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="nutrient-app">
      <div className="calculator-card">
        <div className="calculator-header">
          <h2>Pet Nutrient Calculator</h2>
          <p>Calculate optimal nutrition for your pet</p>
        </div>
        
        <form onSubmit={handleSubmit} className="calculator-form">
          <div className="form-group">
            <label htmlFor="petType">Pet Type</label>
            <select 
              id="petType"
              value={petType}
              onChange={handlePetTypeChange}
              required
            >
              <option value="">Select pet type</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="age">Age (years, max 100)</label>
            <input 
              type="number" 
              id="age"
              value={age}
              onChange={handleAgeChange}
              onKeyDown={preventMinusSign}
              min="0"
              max="100"
              step="0.5"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight (kg, max 200)</label>
            <input 
              type="number" 
              id="weight"
              value={weight}
              onChange={handleWeightChange}
              onKeyDown={preventMinusSign}
              min="0.1"
              max="200"
              step="0.1"
              required
            />
          </div>

          <button type="submit" className="calculate-btn" disabled={isCalculating}>
            {isCalculating ? (
              <span className="spinner"></span>
            ) : (
              'Calculate Nutrition'
            )}
          </button>
        </form>
      </div>

      {nutrients && (
        <div className="results-card">
          <div className="results-header">
            <h3>Nutrition Breakdown</h3>
            <div className="pet-icon">
              {petType.toLowerCase() === 'dog' ? '🐕' : '🐈'}
            </div>
          </div>
          
          <div className="nutrient-grid">
            <div className="nutrient-item">
              <span className="nutrient-icon">🍗</span>
              <div>
                <h4>Protein</h4>
                <p>{nutrients.protein.toFixed(2)} g</p>
              </div>
            </div>
            
            <div className="nutrient-item">
              <span className="nutrient-icon">🌾</span>
              <div>
                <h4>Carbs</h4>
                <p>{nutrients.carbohydrates.toFixed(2)} g</p>
              </div>
            </div>
            
            <div className="nutrient-item">
              <span className="nutrient-icon">🥑</span>
              <div>
                <h4>Fat</h4>
                <p>{nutrients.fat.toFixed(2)} g</p>
              </div>
            </div>
            
            <div className="nutrient-item">
              <span className="nutrient-icon">🥦</span>
              <div>
                <h4>Fiber</h4>
                <p>{nutrients.fiber.toFixed(2)} g</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutrientCalculator;