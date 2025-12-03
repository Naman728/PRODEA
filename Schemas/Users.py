from pydantic import BaseModel, EmailStr


class UsersSchema(BaseModel):
    username : str
    email : str
    password : str
    user_rating : int


class UserSignupSchema(BaseModel):
    username : str
    email : EmailStr
    password : str


class UserLoginSchema(BaseModel):
    email : EmailStr
    password : str

