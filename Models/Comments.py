from sqlalchemy import Column , Integer , String , ForeignKey
from Database.db import Base
from sqlalchemy.sql import text
from sqlalchemy import TIMESTAMP

class CommentsModel(Base):
    __tablename__ = "COMMENTS"
    id = Column(Integer , primary_key= True , index = True)
    comment_text = Column(String , index = True)
    comment_rating = Column(Integer , default = 0)
    post_id = Column(Integer , ForeignKey("POSTS.id"))
    user_id = Column(Integer , ForeignKey("USERS.id"))
    solution_id = Column(Integer , ForeignKey("SOLUTIONS.id"))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, default=text('now()'))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, default=text('now()'))