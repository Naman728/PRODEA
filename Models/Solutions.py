from sqlalchemy import Column , Integer , String , ForeignKey
from Database.db import Base
from datetime import datetime
from sqlalchemy.sql import text
from sqlalchemy import TIMESTAMP

class SolutionsModel(Base):
    __tablename__ = "SOLUTIONS"
    id = Column(Integer , primary_key= True , index = True)
    solution_text = Column(String , index = True)
    solution_rating = Column(Integer , default = 0)
    post_id = Column(Integer , ForeignKey("POSTS.id"))
    user_id = Column(Integer , ForeignKey("USERS.id"))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, default=text('now()'))