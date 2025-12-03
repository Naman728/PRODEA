from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from Database.db import get_db
from Models.Users import UsersModel
from Schemas.Users import UsersSchema
import utils
from typing import List

router = APIRouter()

@router.get("/")
def read_root():
    return {"message": "Hello Welcome to the PRODEA Project!"}



#API Rutes for Users
#1. Read Root
@router.get("/")
def read_root():
    return {"message": "Hello Welcome to the PRODEA Project!"}

#2. Get All Users
@router.get("/get_users")
def get_users(database : Session = Depends(get_db)):
    data = database.query(UsersModel).all()
    return data

#3. Get User by ID
@router.get("/get_user_by_id")
def get_user_by_id(id : int , database : Session = Depends(get_db)):
    data = database.query(UsersModel).filter(UsersModel.id == id).first()
    return data


#Create Single User
@router.post("/create_user")
def create_user(user : UsersSchema , database : Session = Depends(get_db)):


    # Hash the password
    hashed_password = utils.hash(user.password)  #here we hash the password
    user.password = hashed_password              #here we store the password in the userschema 


    data = UsersModel(**user.dict())
    database.add(data)
    database.commit()
    database.refresh(data)
    return data 

#4. Create Multiple Users
@router.post("/create_multiple_users")
def create_multiple_users(users : List[UsersSchema] , database : Session = Depends(get_db)):
    hashed_passwords = [utils.hash(u.password) for u in users]
    users_with_hashed = [UsersSchema(username=u.username,
     email=u.email, 
     password=hashed_password , 
     user_rating=u.user_rating) 
     for u, hashed_password in zip(users, hashed_passwords)]
    data = [UsersModel(**u.dict()) for u in users_with_hashed]
    database.add_all(data)
    database.commit()
    return data 

#5. Delete User by ID
@router.delete("/delete_user_by_id")
def delete_user_by_id(id : int , database : Session = Depends(get_db)):
    data = database.query(UsersModel).filter(UsersModel.id == id).first()
    database.delete(data)
    database.commit()
    return data 


#6. Update User by ID
@router.put("/update_user_by_id")
def update_user_by_id(id : int , user : UsersSchema , database : Session = Depends(get_db)):
    data = database.query(UsersModel).filter(UsersModel.id == id).first()
    data.username = user.username
    data.email = user.email
    data.password = user.password
    database.commit()
    database.refresh(data)
    return data 
