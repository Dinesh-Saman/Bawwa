import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../Components/navbar/navbar';
import Footer from '../../Components/footer/footer';
import jsPDF from 'jspdf';
import '../../Pages/NutritionManagement/NutritionManagement.css';

const NutritionManagement = () => {
  const [nutritionData, setNutritionData] = useState([]);
  const [formData, setFormData] = useState({
    petId: '',
    foodName: '',
    portionSize: '',
    feedingFrequency: '',
    calories: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterTerm, setFilterTerm] = useState('');
  const [sortBy, setSortBy] = useState('petId');
  const [sortOrder, setSortOrder] = useState('asc');

  const API_BASE_URL = 'http://localhost:5000/api/nutrition';

  useEffect(() => {
    fetchNutritionData();
  }, []);

  const fetchNutritionData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setNutritionData(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch nutrition data.');
      setNutritionData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const dataToSend = {
      petId: formData.petId.trim(),
      foodName: formData.foodName.trim(),
      portionSize: Number(formData.portionSize),
      feedingFrequency: formData.feedingFrequency,
      calories: Number(formData.calories)
    };

    // Validation checks
    if (!dataToSend.petId) {
      setError('Pet ID is required.');
      setLoading(false);
      return;
    }
    if (!dataToSend.foodName) {
      setError('Food Name is required.');
      setLoading(false);
      return;
    }
    // New validation: Food Name must contain only letters (A-Z or a-z)
    if (!/^[A-Za-z]+$/.test(dataToSend.foodName)) {
      setError('Food Name must contain only letters (A-Z or a-z).');
      setLoading(false);
      return;
    }
    if (isNaN(dataToSend.portionSize) || dataToSend.portionSize <= 0) {
      setError('Portion Size must be a positive number.');
      setLoading(false);
      return;
    }
    if (!['daily', 'weekly', 'monthly'].includes(dataToSend.feedingFrequency)) {
      setError('Please select a valid feeding frequency.');
      setLoading(false);
      return;
    }
    if (isNaN(dataToSend.calories) || dataToSend.calories <= 0) {
      setError('Calories must be a positive number.');
      setLoading(false);
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, dataToSend);
        setSuccess('Nutrition record updated successfully!');
      } else {
        await axios.post(API_BASE_URL, dataToSend);
        setSuccess('Nutrition record created successfully!');
      }
      fetchNutritionData();
      resetForm();
    } catch (err) {
      console.error('Submit error:', err);
      console.log('Response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to save nutrition data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (nutrition) => {
    setEditingId(nutrition._id);
    setFormData({
      petId: nutrition.petId,
      foodName: nutrition.foodName,
      portionSize: nutrition.portionSize.toString(),
      feedingFrequency: nutrition.feedingFrequency,
      calories: nutrition.calories.toString()
    });
    setError(null);
    setSuccess(null);
    document.querySelector('.nutrition-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this nutrition record?')) {
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setSuccess('Nutrition record deleted successfully!');
      fetchNutritionData();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete nutrition data.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      petId: '',
      foodName: '',
      portionSize: '',
      feedingFrequency: '',
      calories: ''
    });
    setError(null);
    setSuccess(null);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Nutrition Management Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    let yPos = 50;
    filteredAndSortedData.forEach((item, index) => {
      doc.text(`Record ${index + 1}`, 20, yPos);
      doc.text(`Pet ID: ${item.petId}`, 30, yPos + 10);
      doc.text(`Food: ${item.foodName}`, 30, yPos + 20);
      doc.text(`Portion: ${item.portionSize}`, 30, yPos + 30);
      doc.text(`Frequency: ${item.feedingFrequency}`, 30, yPos + 40);
      doc.text(`Calories: ${item.calories}`, 30, yPos + 50);
      yPos += 70;
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save('nutrition_report.pdf');
  };

  const filteredAndSortedData = [...nutritionData]
    .filter(item =>
      item.petId.toLowerCase().includes(filterTerm.toLowerCase()) ||
      item.foodName.toLowerCase().includes(filterTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (['portionSize', 'calories'].includes(sortBy)) {
        return sortOrder === 'asc'
          ? a[sortBy] - b[sortBy]
          : b[sortBy] - a[sortBy];
      }
      return sortOrder === 'asc'
        ? a[sortBy].localeCompare(b[sortBy])
        : b[sortBy].localeCompare(a[sortBy]);
    });

  // Optional: Real-time input validation for foodName
  const handleFoodNameChange = (e) => {
    const value = e.target.value;
    // Only update if the value is empty or contains only letters
    if (value === '' || /^[A-Za-z]*$/.test(value)) {
      setFormData({ ...formData, foodName: value });
    }
  };

  return (
    <div className="nutrition-management">
      <br />
      <Navbar />

      {loading && <div className="loading-spinner"><div></div><div></div><div></div><div></div></div>}

      <div className="alert-container">
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}
      </div>

      <div className="container">
        <section className="nutrition-form-section">
          <h2>{editingId ? 'Update Nutrition Record' : 'Add New Nutrition Record'}</h2>
          <form onSubmit={handleSubmit} className="nutrition-form">
            <div className="form-group">
              <label htmlFor="petId">Pet ID</label>
              <input
                id="petId"
                type="text"
                placeholder="Enter pet ID"
                value={formData.petId}
                onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="foodName">Food Name</label>
              <input
                id="foodName"
                type="text"
                placeholder="Enter food name"
                value={formData.foodName}
                onChange={handleFoodNameChange} // Updated to use custom handler
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="portionSize">Portion Size</label>
                <input
                  id="portionSize"
                  type="number"
                  placeholder="Enter portion size"
                  value={formData.portionSize}
                  onChange={(e) => setFormData({ ...formData, portionSize: e.target.value })}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="feedingFrequency">Feeding Frequency</label>
                <select
                  id="feedingFrequency"
                  value={formData.feedingFrequency}
                  onChange={(e) => setFormData({ ...formData, feedingFrequency: e.target.value })}
                  required
                >
                  <option value="">Select Frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="calories">Calories</label>
              <input
                id="calories"
                type="number"
                placeholder="Enter calories"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                required
                min="1"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {editingId ? 'Update Record' : 'Add Record'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="nutrition-list-section">
          <h2>Nutrition Records</h2>

          <div className="filter-container">
            <input
              type="text"
              placeholder="Search by pet ID or food..."
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={fetchNutritionData} className="btn btn-refresh" title="Refresh data">
              ↻
            </button>
            <button onClick={generateReport} className="btn btn-report" title="Generate Report">
              📑
            </button>
          </div>

          {filteredAndSortedData.length > 0 ? (
            <>
              <div className="table-header">
                <div className="table-header-cell" onClick={() => handleSort('petId')}>
                  Pet ID {sortBy === 'petId' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-header-cell" onClick={() => handleSort('foodName')}>
                  Food {sortBy === 'foodName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-header-cell" onClick={() => handleSort('portionSize')}>
                  Portion {sortBy === 'portionSize' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-header-cell" onClick={() => handleSort('feedingFrequency')}>
                  Frequency {sortBy === 'feedingFrequency' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-header-cell" onClick={() => handleSort('calories')}>
                  Calories {sortBy === 'calories' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-header-cell">Actions</div>
              </div>

              <div className="nutrition-grid">
                {filteredAndSortedData.map((nutrition) => (
                  <div key={nutrition._id} className="nutrition-item">
                    <div className="nutrition-data">{nutrition.petId}</div>
                    <div className="nutrition-data">{nutrition.foodName}</div>
                    <div className="nutrition-data">{nutrition.portionSize}</div>
                    <div className="nutrition-data nutrition-frequency">
                      <span className={`badge badge-${nutrition.feedingFrequency}`}>
                        {nutrition.feedingFrequency}
                      </span>
                    </div>
                    <div className="nutrition-data">{nutrition.calories}</div>
                    <div className="nutrition-actions">
                      <button
                        onClick={() => handleEdit(nutrition)}
                        className="btn btn-edit"
                        title="Edit record"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(nutrition._id)}
                        className="btn btn-delete"
                        title="Delete record"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              {loading ? (
                <p>Loading records...</p>
              ) : (
                <>
                  <p>No nutrition records available</p>
                  <p className="empty-state-hint">Add your first record using the form</p>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default NutritionManagement;