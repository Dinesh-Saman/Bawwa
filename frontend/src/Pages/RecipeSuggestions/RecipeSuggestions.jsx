import React, { useState } from 'react';
import './RecipeSuggestions.css';

const RecipeSuggestions = () => {
  const [petType, setPetType] = useState('');
  const [dietType, setDietType] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePetTypeChange = (e) => setPetType(e.target.value);
  const handleDietTypeChange = (e) => setDietType(e.target.value);

  const getRecipeSuggestion = () => {
    const recipes = {
      Dog: {
        'weight-loss': 'Lean Turkey and Brown Rice with Steamed Carrots',
        'muscle-gain': 'Chicken and Sweet Potato Power Bowl',
        'allergies': 'Hypoallergenic Salmon with Pumpkin Puree'
      },
      Cat: {
        'weight-loss': 'Low-Calorie Tuna and Zucchini Mix',
        'muscle-gain': 'Protein-Rich Chicken and Egg Scramble',
        'allergies': 'Allergy-Friendly Turkey and Pea Blend'
      },
      Rabbit: {
        'weight-loss': 'Timothy Hay with Limited Pellets',
        'muscle-gain': 'High-Fiber Hay Mix with Oat Supplement',
        'allergies': 'Organic Hay with Hypoallergenic Herbs'
      }
    };

    return recipes[petType]?.[dietType] || 'Please select both pet type and diet type';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setRecipe(getRecipeSuggestion());
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="recipe-app">
      <div className="recipe-card">
        <div className="recipe-header">
          <h2>Pet Recipe Suggestions</h2>
          <p>Get customized meal ideas for your pet's specific needs</p>
        </div>
        
        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-group">
            <label htmlFor="petType">Pet Type</label>
            <select 
              id="petType"
              value={petType}
              onChange={handlePetTypeChange}
              required
            >
              <option value="">Select your pet</option>
              <option value="Dog">🐕 Dog</option>
              <option value="Cat">🐈 Cat</option>
              <option value="Rabbit">🐇 Rabbit</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dietType">Dietary Need</label>
            <select 
              id="dietType"
              value={dietType}
              onChange={handleDietTypeChange}
              required
            >
              <option value="">Select dietary need</option>
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="allergies">Allergy-Friendly</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              'Get Recipe Suggestion'
            )}
          </button>
        </form>
      </div>

      {recipe && (
        <div className="recipe-result">
          <div className="result-header">
            <h3>Recommended Recipe</h3>
            <div className="pet-icon">
              {petType === 'Dog' ? '🐕' : petType === 'Cat' ? '🐈' : '🐇'}
            </div>
          </div>
          
          <div className="recipe-content">
            <div className="recipe-icon">🍽️</div>
            <p className="recipe-text">{recipe}</p>
          </div>
          
          <div className="recipe-tip">
            <span>💡 Tip:</span> Always consult with your vet before changing your pet's diet
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSuggestions;