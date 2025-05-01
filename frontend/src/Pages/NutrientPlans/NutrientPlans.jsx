import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NutrientPlans.css';

const NutrientPlans = () => {
  const [nutritionData, setNutritionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/nutrition');
        setNutritionData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch nutrition data. Please try again later.');
        console.error('Error fetching nutrition data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, []);

  const filteredPlans = nutritionData.filter(plan =>
    plan.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.petId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading nutrition plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="nutrient-plans-app">
      <div className="nutrient-plans-header">
        <h1>
          <span className="header-icon">🍽️</span>
          Pet Nutrition Plans
        </h1>
        <p>Customized meal plans for your pets' health and wellness</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by food or pet ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      {filteredPlans.length > 0 ? (
        <div className="nutrient-cards-grid">
          {filteredPlans.map((plan) => (
            <div key={plan._id} className="nutrient-card">
              <div className="card-header">
                <h3 className="food-name">{plan.foodName}</h3>
                <div className="pet-id-badge">
                  <span className="pet-icon">🐾</span>
                  <span>Pet #{plan.petId}</span>
                </div>
              </div>
              
              <div className="card-body">
                <div className="detail-row">
                  <span className="detail-label">Portion Size</span>
                  <span className="detail-value">
                    {plan.portionSize}g
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Feeding Frequency</span>
                  <span className={`frequency-badge ${plan.feedingFrequency}`}>
                    {plan.feedingFrequency}
                  </span>
                </div>
              </div>
              
              <div className="card-footer">
                <div className="calories-display">
                  <span className="calories-label">Calories per serving</span>
                  <span className="calories-value">
                    {plan.calories} kcal
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No nutrition plans found</h3>
          <p>{searchTerm ? 'Try a different search term' : 'No plans available yet'}</p>
        </div>
      )}
    </div>
  );
};

export default NutrientPlans;