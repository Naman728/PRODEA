import React, { useState, useEffect } from 'react';
import { solutionsAPI } from '../services/api';
import '../index.css';

function Solutions() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSolution, setEditingSolution] = useState(null);
  const [formData, setFormData] = useState({
    solution_text: '',
    post_id: 1,
    user_id: 1,
    solution_rating: 0,
  });

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const response = await solutionsAPI.getAll();
      setSolutions(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch solutions: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSolution) {
        await solutionsAPI.update(editingSolution.id, formData);
      } else {
        await solutionsAPI.createMultiple([formData]);
      }
      setShowModal(false);
      setEditingSolution(null);
      setFormData({ solution_text: '', post_id: 1, user_id: 1, solution_rating: 0 });
      fetchSolutions();
    } catch (err) {
      setError('Failed to save solution: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleEdit = (solution) => {
    setEditingSolution(solution);
    setFormData({
      solution_text: solution.solution_text,
      post_id: solution.post_id,
      user_id: solution.user_id,
      solution_rating: solution.solution_rating || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this solution?')) {
      try {
        await solutionsAPI.delete(id);
        fetchSolutions();
      } catch (err) {
        setError('Failed to delete solution: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const handleLike = async (id) => {
    try {
      await solutionsAPI.like(id);
      fetchSolutions();
    } catch (err) {
      setError('Failed to like solution: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDislike = async (id) => {
    try {
      await solutionsAPI.dislike(id);
      fetchSolutions();
    } catch (err) {
      setError('Failed to dislike solution: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return <div className="loading">Loading solutions...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Solutions</h1>
      
      {error && <div className="error">{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <button className="button" onClick={() => {
          setEditingSolution(null);
          setFormData({ solution_text: '', post_id: 1, user_id: 1, solution_rating: 0 });
          setShowModal(true);
        }}>
          + Create New Solution
        </button>
      </div>

      <div className="grid">
        {solutions.map((solution) => (
          <div key={solution.id} className="card">
            <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{solution.solution_text}</p>
            <div className="meta-info">
              <p><strong>Rating:</strong> <span className="rating-value">{solution.solution_rating || 0}</span></p>
              <p><strong>Post ID:</strong> {solution.post_id}</p>
              <p><strong>User ID:</strong> {solution.user_id}</p>
              {solution.created_at && (
                <p><strong>Created:</strong> {new Date(solution.created_at).toLocaleDateString()}</p>
              )}
            </div>
            <div className="rating">
              <button className="rating-button" onClick={() => handleLike(solution.id)}>
                👍 Like
              </button>
              <button className="rating-button" onClick={() => handleDislike(solution.id)}>
                👎 Dislike
              </button>
            </div>
            <div className="actions">
              <button className="button button-secondary" onClick={() => handleEdit(solution)}>
                Edit
              </button>
              <button className="button button-danger" onClick={() => handleDelete(solution.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingSolution ? 'Edit Solution' : 'Create Solution'}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label">Solution Text</label>
                <textarea
                  className="textarea"
                  value={formData.solution_text}
                  onChange={(e) => setFormData({ ...formData, solution_text: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Post ID</label>
                <input
                  className="input"
                  type="number"
                  value={formData.post_id}
                  onChange={(e) => setFormData({ ...formData, post_id: parseInt(e.target.value) || 1 })}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">User ID</label>
                <input
                  className="input"
                  type="number"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: parseInt(e.target.value) || 1 })}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Solution Rating</label>
                <input
                  className="input"
                  type="number"
                  value={formData.solution_rating}
                  onChange={(e) => setFormData({ ...formData, solution_rating: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="actions">
                <button type="submit" className="button">
                  {editingSolution ? 'Update' : 'Create'}
                </button>
                <button type="button" className="button button-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Solutions;

