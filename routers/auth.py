from fastapi import APIRouter , Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from Database.db import get_db
from Models.Users import UsersModel
from Schemas.Users import UserLoginSchema
import utils
import oauth
from Schemas.Users import UserSignupSchema


router = APIRouter(
    tags=["auth"]
)

@router.post("/login")
def login(user_credentials : OAuth2PasswordRequestForm = Depends(), database : Session = Depends(get_db)):

    # OAuth2PasswordRequestForm uses 'username' field (which will contain email)
    #Verify if the user exists
    user = database.query(UsersModel).filter(UsersModel.email == user_credentials.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # verify if the password is correct
    if not utils.verify(user_credentials.password , user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Return access token
    access_token = oauth.create_access_token(data={"user_id": user.id})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
        "email": user.email
    }

@router.post("/register")
def register(user_credentials : UserSignupSchema, database : Session = Depends(get_db)):
    # Check if user already exists
    existing_user = database.query(UsersModel).filter(
        (UsersModel.email == user_credentials.email) | 
        (UsersModel.username == user_credentials.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="User with this email or username already exists"
        )
    
    # Hash the password
    hashed_password = utils.hash(user_credentials.password)
    
    # Create new user
    new_user = UsersModel(
        username=user_credentials.username,
        email=user_credentials.email,
        password=hashed_password,
        user_rating=0  # Default rating for new users
    )
    
    database.add(new_user)
    database.commit()
    database.refresh(new_user)
    
    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "username": new_user.username,
        "email": new_user.email
    }
