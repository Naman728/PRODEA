from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class PostsSchema(BaseModel):
    post_title : str
    post_description : str
    post_category : str
    post_difficulty : str
    user_id : int
    post_created_at : Optional[datetime] = None
    post_updated_at : Optional[datetime] = None

class PostsResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id : int
    post_title : str
    post_description : str
    post_category : str
    post_difficulty : str
    user_id : int
    post_created_at : Optional[datetime] = None
    post_updated_at : Optional[datetime] = None