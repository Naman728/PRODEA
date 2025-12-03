from fastapi import FastAPI , Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware            
from Database.db import Base, engine, get_db
from Models.Users import UsersModel
from Schemas.Users import UsersSchema, UserSignupSchema, UserLoginSchema
from sqlalchemy.orm import Session
from typing import List
import bcrypt
from Models.Solutions import SolutionsModel
from Schemas.Solutions import SolutionsSchema
from Models.Posts import PostsModel
from Schemas.Posts import PostsSchema
from Models.Comments import CommentsModel
from Schemas.Comments import CommentsSchema
from routers import auth, Users, Solutions, Posts, Comments


app = FastAPI() 

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev server ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)




app.include_router(Users.router, prefix="/api/users", tags=["users"])
app.include_router(Solutions.router, prefix="/api/solutions", tags=["solutions"])
app.include_router(Posts.router, prefix="/api/posts", tags=["posts"])
app.include_router(Comments.router, prefix="/api/comments", tags=["comments"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])