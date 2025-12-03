from sqlalchemy import Column , Integer , String , ForeignKey
from Database.db import Base
from datetime import datetime
from sqlalchemy.sql import text
from sqlalchemy import TIMESTAMP

class PostsModel(Base):
    __tablename__ = "POSTS"
    id = Column(Integer , primary_key= True , index = True)
    post_title = Column(String , index = True)
    post_description = Column(String , index = True)
    post_category = Column(String , index = True)
    post_difficulty = Column(String , index = True)
    post_created_at = Column(TIMESTAMP(timezone=True), nullable=False, default=text('now()'))
    post_updated_at = Column(TIMESTAMP(timezone=True), nullable=False, default=text('now()'))
    user_id = Column(Integer , ForeignKey("USERS.id"))