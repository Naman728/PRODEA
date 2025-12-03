# PRODEA - Frontend React Application

A modern React frontend application for the PRODEA (Project Idea Connection) platform. This application connects to your FastAPI backend and provides a beautiful UI for managing Users, Posts, Comments, and Solutions.

## Features

- 🎨 Modern, responsive UI with gradient design
- 👥 User management (Create, Read, Update, Delete)
- 📝 Post management with categories and difficulty levels
- 💬 Comment system with rating
- 💡 Solution management with rating
- 👍 Like/Dislike functionality for Posts, Comments, and Solutions
- 🔄 Real-time data fetching and updates

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Your FastAPI backend running on `http://localhost:8000`

## Installation

1. Navigate to the PRODEA directory:
```bash
cd PRODEA
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Make sure your FastAPI backend is running on `http://localhost:8000`

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
PRODEA/
├── src/
│   ├── components/
│   │   ├── Users.jsx          # User management component
│   │   ├── Posts.jsx          # Post management component
│   │   ├── Comments.jsx       # Comment management component
│   │   └── Solutions.jsx      # Solution management component
│   ├── services/
│   │   └── api.js             # API service layer
│   ├── App.jsx                # Main application component
│   ├── App.css                # Application styles
│   ├── index.css              # Global styles
│   └── main.jsx               # Application entry point
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
└── README.md                  # This file
```

## API Endpoints Used

### Users (`/api/users`)
- `GET /get_users` - Get all users
- `GET /get_user_by_id?id={id}` - Get user by ID
- `POST /create_user` - Create a new user
- `PUT /update_user_by_id?id={id}` - Update user
- `DELETE /delete_user_by_id?id={id}` - Delete user

### Posts (`/api/posts`)
- `GET /get_posts` - Get all posts
- `GET /get_post_by_id?id={id}` - Get post by ID
- `POST /create_multiple_posts` - Create posts
- `PUT /update_post_by_id?id={id}` - Update post
- `DELETE /delete_post_by_id?id={id}` - Delete post
- `GET /like_post/{id}` - Like a post
- `GET /dislike_post/{id}` - Dislike a post

### Comments (`/api/comments`)
- `GET /get_comments` - Get all comments
- `GET /get_comment_by_id?id={id}` - Get comment by ID
- `POST /create_multiple_comments` - Create comments
- `PUT /update_comment_by_id?id={id}` - Update comment
- `DELETE /delete_comment_by_id?id={id}` - Delete comment
- `GET /like_comment/{id}` - Like a comment
- `GET /dislike_comment/{id}` - Dislike a comment

### Solutions (`/api/solutions`)
- `GET /get_solutions` - Get all solutions
- `GET /get_solution_by_id?id={id}` - Get solution by ID
- `POST /create_multiple_solutions` - Create solutions
- `PUT /update_solution_by_id?id={id}` - Update solution
- `DELETE /delete_solution_by_id?id={id}` - Delete solution
- `GET /like_solution/{id}` - Like a solution
- `GET /dislike_solution/{id}` - Dislike a solution

## Technologies Used

- **React 18** - UI library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern gradients and animations

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## Notes

- The application expects the backend to be running on `http://localhost:8000`
- CORS is configured in your FastAPI backend to allow requests from `http://localhost:3000`
- All API calls are made through the centralized API service in `src/services/api.js`

## Troubleshooting

If you encounter CORS errors:
- Make sure your FastAPI backend has CORS middleware configured
- Verify the backend is running on port 8000
- Check that `allow_origins` includes `http://localhost:3000` in your FastAPI app

If the API calls fail:
- Verify the backend is running
- Check the browser console for error messages
- Ensure the API endpoints match your backend routes

