from pydantic import BaseModel
from typing import Optional

class SolutionsSchema(BaseModel):
    solution_text : str
    post_id : int
    user_id : int
    solution_rating : Optional[int] = None
    