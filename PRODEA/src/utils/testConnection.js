// Utility to test backend connection
export const testBackendConnection = async () => {
  // Try multiple endpoints to see which ones work
  const endpoints = [
    { url: '/api/users/get_users', name: 'Users' },
    { url: '/api/solutions/get_solutions', name: 'Solutions' },
    { url: '/api/comments/get_comments', name: 'Comments' },
    { url: '/api/posts/get_posts', name: 'Posts' },
  ];

  let workingEndpoints = [];
  let failedEndpoints = [];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        workingEndpoints.push(endpoint.name);
        console.log(`✅ ${endpoint.name} endpoint is working`);
      } else {
        failedEndpoints.push(`${endpoint.name} (${response.status})`);
        console.warn(`⚠️ ${endpoint.name} endpoint returned status ${response.status}`);
      }
    } catch (err) {
      failedEndpoints.push(`${endpoint.name} (${err.message})`);
      console.error(`❌ ${endpoint.name} endpoint failed:`, err.message);
    }
  }

  if (workingEndpoints.length > 0) {
    console.log(`✅ Backend is running! Working endpoints: ${workingEndpoints.join(', ')}`);
    if (failedEndpoints.length > 0) {
      console.warn(`⚠️ Some endpoints failed: ${failedEndpoints.join(', ')}`);
    }
    return { success: true, working: workingEndpoints, failed: failedEndpoints };
  }

  // If proxy fails, try direct connection
  try {
    const directResponse = await fetch('http://localhost:8000/api/users/get_users');
    if (directResponse.ok) {
      console.log('✅ Direct connection to backend works! (Proxy might not be configured)');
      return { success: true, method: 'direct', working: ['Users'], failed: [] };
    }
  } catch (err) {
    console.log('❌ Direct connection also failed:', err.message);
  }

  return { 
    success: false, 
    error: 'Cannot connect to backend. Make sure it\'s running on http://localhost:8000',
    failed: failedEndpoints 
  };
};

