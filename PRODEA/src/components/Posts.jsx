import React, { useState, useEffect } from 'react';
import { postsAPI, solutionsAPI, commentsAPI } from '../services/api';
import { testBackendConnection } from '../utils/testConnection';
import '../index.css';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(null); // post_id
  const [showCommentModal, setShowCommentModal] = useState(null); // solution_id
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [expandedSolutions, setExpandedSolutions] = useState(new Set());
  const [postRatings, setPostRatings] = useState({}); // Client-side ratings for posts
  
  const [postFormData, setPostFormData] = useState({
    post_title: '',
    post_description: '',
    post_category: '',
    post_difficulty: '',
    user_id: 1,
  });

  const [solutionFormData, setSolutionFormData] = useState({
    solution_text: '',
    post_id: null,
    user_id: 1,
    solution_rating: 0,
  });

  const [commentFormData, setCommentFormData] = useState({
    comment_text: '',
    post_id: null,
    user_id: 1,
    solution_id: null,
    comment_rating: 0,
  });

  useEffect(() => {
    // Test connection on mount
    testBackendConnection().then(result => {
      if (result.success) {
        if (result.failed && result.failed.length > 0) {
          console.warn('Some endpoints are not working:', result.failed);
        }
        // Clear any previous errors if connection is successful
        if (result.working && result.working.length > 0) {
          setError(null);
        }
      } else {
        setError(result.error || 'Cannot connect to backend. Make sure it\'s running on http://localhost:8000');
      }
    });
    
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching all data...');
      
      const [postsRes, solutionsRes, commentsRes] = await Promise.all([
        postsAPI.getAll().catch(err => {
          console.error('Error fetching posts:', err);
          throw new Error(`Posts: ${err.response?.data?.detail || err.message || 'Network error'}`);
        }),
        solutionsAPI.getAll().catch(err => {
          console.error('Error fetching solutions:', err);
          throw new Error(`Solutions: ${err.response?.data?.detail || err.message || 'Network error'}`);
        }),
        commentsAPI.getAll().catch(err => {
          console.error('Error fetching comments:', err);
          throw new Error(`Comments: ${err.response?.data?.detail || err.message || 'Network error'}`);
        }),
      ]);
      
      console.log('Data fetched successfully:', {
        posts: postsRes.data?.length || 0,
        solutions: solutionsRes.data?.length || 0,
        comments: commentsRes.data?.length || 0,
      });
      
      const postsData = postsRes.data || [];
      setPosts(postsData);
      // Initialize ratings for posts (client-side only)
      const initialRatings = {};
      postsData.forEach(post => {
        initialRatings[post.id] = 0;
      });
      setPostRatings(prev => ({ ...prev, ...initialRatings }));
      setSolutions(solutionsRes.data || []);
      setComments(commentsRes.data || []);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch data. Make sure the backend is running on http://localhost:8000';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await postsAPI.create(postFormData);
      setShowPostModal(false);
      setPostFormData({ post_title: '', post_description: '', post_category: '', post_difficulty: '', user_id: 1 });
      fetchAllData();
    } catch (err) {
      setError('Failed to create post: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleCreateSolution = async (e) => {
    e.preventDefault();
    try {
      await solutionsAPI.create(solutionFormData);
      setShowSolutionModal(null);
      setSolutionFormData({ solution_text: '', post_id: null, user_id: 1, solution_rating: 0 });
      fetchAllData();
    } catch (err) {
      setError('Failed to create solution: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    try {
      await commentsAPI.create(commentFormData);
      setShowCommentModal(null);
      setCommentFormData({ comment_text: '', post_id: null, user_id: 1, solution_id: null, comment_rating: 0 });
      fetchAllData();
    } catch (err) {
      setError('Failed to create comment: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.delete(id);
        fetchAllData();
      } catch (err) {
        setError('Failed to delete post: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const handleDeleteSolution = async (id) => {
    if (window.confirm('Are you sure you want to delete this solution?')) {
      try {
        await solutionsAPI.delete(id);
        fetchAllData();
      } catch (err) {
        setError('Failed to delete solution: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const handleDeleteComment = async (id) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentsAPI.delete(id);
        fetchAllData();
      } catch (err) {
        setError('Failed to delete comment: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const handleLikePost = async (id) => {
    try {
      const response = await postsAPI.like(id);
      // Update client-side rating state
      setPostRatings(prev => ({
        ...prev,
        [id]: (prev[id] || 0) + 1
      }));
      console.log('Post liked:', response.data);
    } catch (err) {
      setError('Failed to like post: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDislikePost = async (id) => {
    try {
      const response = await postsAPI.dislike(id);
      // Update client-side rating state
      setPostRatings(prev => ({
        ...prev,
        [id]: Math.max(0, (prev[id] || 0) - 1)
      }));
      console.log('Post disliked:', response.data);
    } catch (err) {
      setError('Failed to dislike post: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleLikeSolution = async (id) => {
    try {
      await solutionsAPI.like(id);
      fetchAllData();
    } catch (err) {
      setError('Failed to like solution: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDislikeSolution = async (id) => {
    try {
      await solutionsAPI.dislike(id);
      fetchAllData();
    } catch (err) {
      setError('Failed to dislike solution: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleLikeComment = async (id) => {
    try {
      await commentsAPI.like(id);
      fetchAllData();
    } catch (err) {
      setError('Failed to like comment: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDislikeComment = async (id) => {
    try {
      await commentsAPI.dislike(id);
      fetchAllData();
    } catch (err) {
      setError('Failed to dislike comment: ' + (err.response?.data?.detail || err.message));
    }
  };

  const togglePost = (postId) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const toggleSolution = (solutionId) => {
    const newExpanded = new Set(expandedSolutions);
    if (newExpanded.has(solutionId)) {
      newExpanded.delete(solutionId);
    } else {
      newExpanded.add(solutionId);
    }
    setExpandedSolutions(newExpanded);
  };

  const getSolutionsForPost = (postId) => {
    return solutions.filter(s => s.post_id === postId);
  };

  const getCommentsForSolution = (solutionId) => {
    return comments.filter(c => c.solution_id === solutionId);
  };

  if (loading) {
    return (
      <div>
        <div className="loading">Loading posts...</div>
        <div style={{ textAlign: 'center', color: 'white', marginTop: '20px' }}>
          <p>If this takes too long, check:</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>1. Backend is running on http://localhost:8000</li>
            <li>2. Check browser console for errors</li>
            <li>3. Check network tab in browser dev tools</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Problem Posts & Solutions</h1>
      
      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
          <br />
          <small style={{ marginTop: '10px', display: 'block' }}>
            Make sure your FastAPI backend is running on http://localhost:8000
            <br />
            You can test the connection by visiting: <a href="http://localhost:8000/api/posts/get_posts" target="_blank" rel="noopener noreferrer">http://localhost:8000/api/posts/get_posts</a>
          </small>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button className="button" onClick={() => setShowPostModal(true)}>
          + Post a New Problem
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {posts.map((post) => {
          const postSolutions = getSolutionsForPost(post.id);
          const isExpanded = expandedPosts.has(post.id);
          
          return (
            <div key={post.id} className="card" style={{ marginBottom: '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ marginBottom: '10px' }}>{post.post_title}</h2>
                  <p style={{ color: '#666', marginBottom: '15px', lineHeight: '1.6' }}>
                    {post.post_description}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                    <span className={`badge badge-${post.post_category === 'Tech' ? 'primary' : post.post_category === 'Business' ? 'success' : 'info'}`}>
                      {post.post_category}
                    </span>
                    <span className={`badge badge-${post.post_difficulty === 'Easy' ? 'success' : post.post_difficulty === 'Medium' ? 'warning' : 'danger'}`}>
                      {post.post_difficulty}
                    </span>
                    <span className="rating-value">⭐ {postRatings[post.id] || 0}</span>
                  </div>
                  <div className="rating" style={{ marginBottom: '15px' }}>
                    <button className="rating-button" onClick={() => handleLikePost(post.id)}>
                      👍 Like
                    </button>
                    <button className="rating-button" onClick={() => handleDislikePost(post.id)}>
                      👎 Dislike
                    </button>
                    <button className="button button-danger" onClick={() => handleDeletePost(post.id)}>
                      Delete Post
                    </button>
                  </div>
                </div>
                <button 
                  className="button button-secondary" 
                  onClick={() => togglePost(post.id)}
                  style={{ marginLeft: '15px' }}
                >
                  {isExpanded ? '▼ Hide Solutions' : '▶ Show Solutions'}
                </button>
              </div>

              {isExpanded && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #e0e0e0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ color: '#667eea' }}>Solutions ({postSolutions.length})</h3>
                    <button 
                      className="button button-success" 
                      onClick={() => {
                        setSolutionFormData({ ...solutionFormData, post_id: post.id });
                        setShowSolutionModal(post.id);
                      }}
                    >
                      + Add Solution
                    </button>
                  </div>

                  {postSolutions.length === 0 ? (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>No solutions yet. Be the first to add one!</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {postSolutions.map((solution) => {
                        const solutionComments = getCommentsForSolution(solution.id);
                        const isSolutionExpanded = expandedSolutions.has(solution.id);
                        
                        return (
                          <div key={solution.id} style={{ 
                            background: '#f8f9fa', 
                            padding: '15px', 
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div style={{ flex: 1 }}>
                                <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>{solution.solution_text}</p>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                  <span className="rating-value">⭐ {solution.solution_rating || 0}</span>
                                  {solution.created_at && (
                                    <span className="meta-info">
                                      {new Date(solution.created_at).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <div className="rating">
                                  <button className="rating-button" onClick={() => handleLikeSolution(solution.id)}>
                                    👍 Like
                                  </button>
                                  <button className="rating-button" onClick={() => handleDislikeSolution(solution.id)}>
                                    👎 Dislike
                                  </button>
                                  <button className="button button-danger" onClick={() => handleDeleteSolution(solution.id)}>
                                    Delete
                                  </button>
                                </div>
                              </div>
                              <button 
                                className="button button-secondary" 
                                onClick={() => toggleSolution(solution.id)}
                                style={{ marginLeft: '15px', fontSize: '12px', padding: '6px 12px' }}
                              >
                                {isSolutionExpanded ? '▼ Hide' : '▶ Show'} Comments ({solutionComments.length})
                              </button>
                            </div>

                            {isSolutionExpanded && (
                              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                  <h4 style={{ color: '#764ba2', fontSize: '16px' }}>Comments ({solutionComments.length})</h4>
                                  <button 
                                    className="button button-success" 
                                    onClick={() => {
                                      setCommentFormData({ 
                                        ...commentFormData, 
                                        post_id: post.id, 
                                        solution_id: solution.id 
                                      });
                                      setShowCommentModal(solution.id);
                                    }}
                                    style={{ fontSize: '12px', padding: '6px 12px' }}
                                  >
                                    + Add Comment
                                  </button>
                                </div>

                                {solutionComments.length === 0 ? (
                                  <p style={{ color: '#999', fontStyle: 'italic', fontSize: '14px' }}>
                                    No comments yet. Be the first to comment!
                                  </p>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {solutionComments.map((comment) => (
                                      <div key={comment.id} style={{ 
                                        background: 'white', 
                                        padding: '12px', 
                                        borderRadius: '6px',
                                        border: '1px solid #e0e0e0'
                                      }}>
                                        <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '8px' }}>
                                          {comment.comment_text}
                                        </p>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                          <span className="rating-value" style={{ fontSize: '14px' }}>
                                            ⭐ {comment.comment_rating || 0}
                                          </span>
                                          {comment.created_at && (
                                            <span className="meta-info" style={{ fontSize: '12px' }}>
                                              {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                          )}
                                          <button 
                                            className="rating-button" 
                                            onClick={() => handleLikeComment(comment.id)}
                                            style={{ fontSize: '12px', padding: '4px 8px' }}
                                          >
                                            👍
                                          </button>
                                          <button 
                                            className="rating-button" 
                                            onClick={() => handleDislikeComment(comment.id)}
                                            style={{ fontSize: '12px', padding: '4px 8px' }}
                                          >
                                            👎
                                          </button>
                                          <button 
                                            className="button button-danger" 
                                            onClick={() => handleDeleteComment(comment.id)}
                                            style={{ fontSize: '12px', padding: '4px 8px' }}
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {posts.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#999', fontSize: '18px' }}>No posts yet. Create the first problem post!</p>
        </div>
      )}

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="modal" onClick={() => setShowPostModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Post a New Problem</h2>
              <button className="close-button" onClick={() => setShowPostModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label className="label">Problem Title</label>
                <input
                  className="input"
                  type="text"
                  value={postFormData.post_title}
                  onChange={(e) => setPostFormData({ ...postFormData, post_title: e.target.value })}
                  required
                  placeholder="Enter problem title"
                />
              </div>
              <div className="form-group">
                <label className="label">Problem Description</label>
                <textarea
                  className="textarea"
                  value={postFormData.post_description}
                  onChange={(e) => setPostFormData({ ...postFormData, post_description: e.target.value })}
                  required
                  placeholder="Describe your problem in detail"
                />
              </div>
              <div className="form-group">
                <label className="label">Category</label>
                <select
                  className="select"
                  value={postFormData.post_category}
                  onChange={(e) => setPostFormData({ ...postFormData, post_category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Tech">Tech</option>
                  <option value="Business">Business</option>
                  <option value="Science">Science</option>
                  <option value="Arts">Arts</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Difficulty</label>
                <select
                  className="select"
                  value={postFormData.post_difficulty}
                  onChange={(e) => setPostFormData({ ...postFormData, post_difficulty: e.target.value })}
                  required
                >
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">User ID</label>
                <input
                  className="input"
                  type="number"
                  value={postFormData.user_id}
                  onChange={(e) => setPostFormData({ ...postFormData, user_id: parseInt(e.target.value) || 1 })}
                  min="1"
                  required
                />
              </div>
              <div className="actions">
                <button type="submit" className="button">Create Post</button>
                <button type="button" className="button button-secondary" onClick={() => setShowPostModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Solution Modal */}
      {showSolutionModal && (
        <div className="modal" onClick={() => setShowSolutionModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add a Solution</h2>
              <button className="close-button" onClick={() => setShowSolutionModal(null)}>×</button>
            </div>
            <form onSubmit={handleCreateSolution}>
              <div className="form-group">
                <label className="label">Solution Text</label>
                <textarea
                  className="textarea"
                  value={solutionFormData.solution_text}
                  onChange={(e) => setSolutionFormData({ ...solutionFormData, solution_text: e.target.value })}
                  required
                  placeholder="Describe your solution"
                />
              </div>
              <div className="form-group">
                <label className="label">User ID</label>
                <input
                  className="input"
                  type="number"
                  value={solutionFormData.user_id}
                  onChange={(e) => setSolutionFormData({ ...solutionFormData, user_id: parseInt(e.target.value) || 1 })}
                  min="1"
                  required
                />
              </div>
              <div className="actions">
                <button type="submit" className="button">Add Solution</button>
                <button type="button" className="button button-secondary" onClick={() => setShowSolutionModal(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Comment Modal */}
      {showCommentModal && (
        <div className="modal" onClick={() => setShowCommentModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add a Comment</h2>
              <button className="close-button" onClick={() => setShowCommentModal(null)}>×</button>
            </div>
            <form onSubmit={handleCreateComment}>
              <div className="form-group">
                <label className="label">Comment Text</label>
                <textarea
                  className="textarea"
                  value={commentFormData.comment_text}
                  onChange={(e) => setCommentFormData({ ...commentFormData, comment_text: e.target.value })}
                  required
                  placeholder="Write your comment"
                />
              </div>
              <div className="form-group">
                <label className="label">User ID</label>
                <input
                  className="input"
                  type="number"
                  value={commentFormData.user_id}
                  onChange={(e) => setCommentFormData({ ...commentFormData, user_id: parseInt(e.target.value) || 1 })}
                  min="1"
                  required
                />
              </div>
              <div className="actions">
                <button type="submit" className="button">Add Comment</button>
                <button type="button" className="button button-secondary" onClick={() => setShowCommentModal(null)}>
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

export default Posts;
