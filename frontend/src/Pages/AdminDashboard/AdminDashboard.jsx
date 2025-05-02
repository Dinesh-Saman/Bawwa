import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './AdminDashboard.css';

const ModelViewer = ({ filePath }) => {
  const { scene } = useGLTF(filePath);
  return (
    <Canvas style={{ width: '150px', height: '150px' }}>
      <ambientLight intensity={1} />
      <directionalLight position={[2, 2, 2]} />
      <OrbitControls />
      <primitive object={scene} scale={1.5} />
    </Canvas>
  );
};

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    petType: 'dog',
    name: '',
    description: '',
    price: '',
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [accessories, setAccessories] = useState([]);
  const [filteredAccessories, setFilteredAccessories] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ petType: '', search: '' });

  useEffect(() => {
    fetchAccessories();
    fetchSalesData();
  }, []);

  const fetchAccessories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/accessories');
      console.log('Fetched accessories:', response.data);
      setAccessories(response.data);
      applyFilter(response.data, filter);
    } catch (error) {
      console.error('Error fetching accessories:', error);
      setMessage('Failed to load accessories.');
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/order');
      console.log('Fetched sales data:', response.data);
      setSalesData(response.data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const applyFilter = (data, currentFilter) => {
    let result = [...data];
    if (currentFilter.petType) {
      result = result.filter((acc) => acc.petType === currentFilter.petType);
    }
    if (currentFilter.search) {
      const searchLower = currentFilter.search.toLowerCase();
      result = result.filter(
        (acc) =>
          acc.name.toLowerCase().includes(searchLower) ||
          acc.description.toLowerCase().includes(searchLower)
      );
    }
    setFilteredAccessories(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => {
      const newFilter = { ...prev, [name]: value };
      applyFilter(accessories, newFilter);
      return newFilter;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('petType', formData.petType);
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    if (file) data.append('file', file);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/accessories/${editingId}`, data);
        setMessage('Accessory updated successfully!');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/accessories', data);
        setMessage('Accessory added successfully!');
      }
      setFormData({ petType: 'dog', name: '', description: '', price: '' });
      setFile(null);
      setShowForm(false);
      fetchAccessories();
      fetchSalesData();
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (accessory) => {
    setFormData({
      petType: accessory.petType,
      name: accessory.name,
      description: accessory.description,
      price: accessory.price,
    });
    setFile(null);
    setEditingId(accessory._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this accessory?')) {
      try {
        await axios.delete(`http://localhost:5000/api/accessories/${id}`);
        setMessage('Accessory deleted successfully!');
        fetchAccessories();
        fetchSalesData();
      } catch (error) {
        setMessage('Error deleting accessory: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(price);
  };

  // Single definition of enrichedAccessories
  const enrichedAccessories = filteredAccessories.map(acc => {
    const sales = salesData.find(sale => sale.accessoryId === acc._id.toString()) || {
      totalQuantity: 0,
      totalRevenue: 0,
    };
    console.log(`Merging accessory ${acc._id} with sales:`, sales);
    return { ...acc, totalQuantity: sales.totalQuantity, totalRevenue: sales.totalRevenue };
  });

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1 style={{marginLeft:'10px', color:'white'}}>Admin Dashboard</h1>
        <div className="header-controls">
          <button className="add-btn" onClick={() => setShowForm(true)}>
            Add New Accessory
          </button>
          <div className="filter-section">
            <select
              name="petType"
              value={filter.petType}
              onChange={handleFilterChange}
              className="filter-select"
              style={{width:'700%'}}
            >
              <option value="">All Pet Types</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="rabbit">Rabbit</option>
            </select>
            <input
              type="text"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="Search by name or description"
              className="filter-input"
              style={{width:'1000%'}}
            />
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {showForm ? (
          <div className="form-container">
            <h2>{editingId ? 'Edit Accessory' : 'Add New Accessory'}</h2>
            <form onSubmit={handleSubmit} className="accessory-form">
              <div className="form-group">
                <label>Pet Type:</label>
                <select name="petType" value={formData.petType} onChange={handleInputChange}>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="rabbit">Rabbit</option>
                </select>
              </div>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (LKR):</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={(e) => {
                      const rawValue = e.target.value;

                      // If input is empty, allow clearing
                      if (rawValue === "") {
                        handleInputChange(e); // Updates state with ""
                        return;
                      }

                      // If input is just "-", block it (reset to last valid value)
                      if (rawValue === "-") {
                        e.preventDefault(); // Optional (not always needed)
                        return;
                      }

                      const numericValue = parseFloat(rawValue);

                      // Only update if valid number and within range
                      if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 1000000) {
                        handleInputChange(e);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Block the '-' key from being pressed at all
                      if (e.key === "-") {
                        e.preventDefault();
                      }
                    }}
                    step="0.01"
                    min="0"
                    max="1000000"
                    required
                  />
              </div>
              <div className="form-group">
                <label>3D Model (.glb):</label>
                <input
                  type="file"
                  accept=".glb"
                  onChange={handleFileChange}
                  required={!editingId}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="admin-submit-btn">
                  {editingId ? 'Update Accessory' : 'Add Accessory'}
                </button>
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        ) : (
          <div className="dashboard-content">
            {message && <p className="message">{message}</p>}
            {enrichedAccessories.length > 0 ? (
              <table className="accessory-table">
                <thead>
                  <tr>
                    <th>Pet Type</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price (LKR)</th>
                    <th>3D Model</th>
                    <th>Qty Sold</th>
                    <th>Revenue (LKR)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedAccessories.map((accessory) => (
                    <tr key={accessory._id}>
                      <td>{accessory.petType}</td>
                      <td>{accessory.name}</td>
                      <td>{accessory.description}</td>
                      <td>{accessory.price.toFixed(2)}</td>
                      <td>
                        {accessory.filePath ? (
                          <ModelViewer filePath={`http://localhost:5000${accessory.filePath}`} />
                        ) : (
                          'No model'
                        )}
                      </td>
                      <td>{accessory.totalQuantity || 0}</td>
                      <td>{formatPrice(accessory.totalRevenue || 0)}</td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEdit(accessory)}>
                          Edit
                        </button>
                        <button style={{backgroundColor:'red'}} className="admin-delete-btn" onClick={() => handleDelete(accessory._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No accessories match the filter.</p>
            )}
          </div>
        )}
      </main>

      <footer className="dashboard-footer" style={{color:'white'}}>
        <p>© 2025 Pet Accessories Admin Dashboard</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;