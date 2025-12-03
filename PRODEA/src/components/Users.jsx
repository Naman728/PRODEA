import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import '../index.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    user_rating: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usersAPI.update(editingUser.id, formData);
      } else {
        await usersAPI.create(formData);
      }
      setShowModal(false);
      setEditingUser(null);
      setFormData({ username: '', email: '', password: '', user_rating: 0 });
      fetchUsers();
    } catch (err) {
      setError('Failed to save user: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      user_rating: user.user_rating || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Users</h1>
      
      {error && <div className="error">{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <button className="button" onClick={() => {
          setEditingUser(null);
          setFormData({ username: '', email: '', password: '', user_rating: 0 });
          setShowModal(true);
        }}>
          + Create New User
        </button>
      </div>

      <div className="grid">
        {users.map((user) => (
          <div key={user.id} className="card">
            <h2>{user.username}</h2>
            <div className="meta-info">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rating:</strong> <span className="rating-value">{user.user_rating || 0}</span></p>
              {user.created_at && (
                <p><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
              )}
            </div>
            <div className="actions">
              <button className="button button-secondary" onClick={() => handleEdit(user)}>
                Edit
              </button>
              <button className="button button-danger" onClick={() => handleDelete(user.id)}>
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
              <h2 className="modal-title">{editingUser ? 'Edit User' : 'Create User'}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label">Username</label>
                <input
                  className="input"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Password</label>
                <input
                  className="input"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />
              </div>
              <div className="form-group">
                <label className="label">User Rating</label>
                <input
                  className="input"
                  type="number"
                  value={formData.user_rating}
                  onChange={(e) => setFormData({ ...formData, user_rating: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="actions">
                <button type="submit" className="button">
                  {editingUser ? 'Update' : 'Create'}
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

export default Users;

