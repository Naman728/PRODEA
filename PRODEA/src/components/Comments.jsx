import React, { useState, useEffect } from 'react';
import { commentsAPI } from '../services/api';
import '../index.css';

function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [formData, setFormData] = useState({
    comment_text: '',
    post_id: 1,
    user_id: 1,
    solution_id: 1,
    comment_rating: 0,
  });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentsAPI.getAll();
      setComments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch comments: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingComment) {
        await commentsAPI.update(editingComment.id, formData);
      } else {
        await commentsAPI.createMultiple([formData]);
      }
      setShowModal(false);
      setEditingComment(null);
      setFormData({ comment_text: '', post_id: 1, user_id: 1, solution_id: 1, comment_rating: 0 });
      fetchComments();
    } catch (err) {
      setError('Failed to save comment: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setFormData({
      comment_text: comment.comment_text,
      post_id: comment.post_id,
      user_id: comment.user_id,
      solution_id: comment.solution_id,
      comment_rating: comment.comment_rating || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentsAPI.delete(id);
        fetchComments();
      } catch (err) {
        setError('Failed to delete comment: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const handleLike = async (id) => {
    try {
      await commentsAPI.like(id);
      fetchComments();
    } catch (err) {
      setError('Failed to like comment: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDislike = async (id) => {
    try {
      await commentsAPI.dislike(id);
      fetchComments();
    } catch (err) {
      setError('Failed to dislike comment: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return <div className="loading">Loading comments...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Comments</h1>
      
      {error && <div className="error">{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <button className="button" onClick={() => {
          setEditingComment(null);
          setFormData({ comment_text: '', post_id: 1, user_id: 1, solution_id: 1, comment_rating: 0 });
          setShowModal(true);
        }}>
          + Create New Comment
        </button>
      </div>

      <div className="grid">
        {comments.map((comment) => (
          <div key={comment.id} className="card">
            <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{comment.comment_text}</p>
            <div className="meta-info">
              <p><strong>Rating:</strong> <span className="rating-value">{comment.comment_rating || 0}</span></p>
              <p><strong>Post ID:</strong> {comment.post_id}</p>
              <p><strong>User ID:</strong> {comment.user_id}</p>
              <p><strong>Solution ID:</strong> {comment.solution_id}</p>
              {comment.created_at && (
                <p><strong>Created:</strong> {new Date(comment.created_at).toLocaleDateString()}</p>
              )}
            </div>
            <div className="rating">
              <button className="rating-button" onClick={() => handleLike(comment.id)}>
                👍 Like
              </button>
              <button className="rating-button" onClick={() => handleDislike(comment.id)}>
                👎 Dislike
              </button>
            </div>
            <div className="actions">
              <button className="button button-secondary" onClick={() => handleEdit(comment)}>
                Edit
              </button>
              <button className="button button-danger" onClick={() => handleDelete(comment.id)}>
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
              <h2 className="modal-title">{editingComment ? 'Edit Comment' : 'Create Comment'}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label">Comment Text</label>
                <textarea
                  className="textarea"
                  value={formData.comment_text}
                  onChange={(e) => setFormData({ ...formData, comment_text: e.target.value })}
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
                <label className="label">Solution ID</label>
                <input
                  className="input"
                  type="number"
                  value={formData.solution_id}
                  onChange={(e) => setFormData({ ...formData, solution_id: parseInt(e.target.value) || 1 })}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Comment Rating</label>
                <input
                  className="input"
                  type="number"
                  value={formData.comment_rating}
                  onChange={(e) => setFormData({ ...formData, comment_rating: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="actions">
                <button type="submit" className="button">
                  {editingComment ? 'Update' : 'Create'}
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

export default Comments;

