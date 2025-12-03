from sqlalchemy import Column , Integer , String
from Database.db import Base
from datetime import  datetime
from sqlalchemy.sql import text
from sqlalchemy import TIMESTAMP

class UsersModel(Base):
    __tablename__ = "USERS"
    id = Column(Integer , primary_key= True , index = True)
    username = Column(String , index = True)
    email = Column(String , unique = True , index = True)
    password = Column(String , index = True)
    user_rating = Column(Integer , default = 0)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, default=text('now()'))