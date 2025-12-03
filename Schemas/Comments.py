from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CommentsSchema(BaseModel):
    comment_text : str
    post_id : int
    user_id : int
    solution_id : int
    comment_rating : Optional[int] = 0
    created_at : Optional[datetime] = None
    updated_at : Optional[datetime] = None