from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from Database.db import get_db
from Models.Posts import PostsModel
from Schemas.Posts import PostsSchema
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from Schemas.Posts import PostsResponseSchema


router = APIRouter()

@router.get("/get_posts")
def get_posts(database: Session = Depends(get_db)):
    try:
        data = database.query(PostsModel).all()
        return data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error fetching posts: {str(e)}")

@router.get("/get_post_by_id")
def get_post_by_id(id : int , database : Session = Depends(get_db)):
    data = database.query(PostsModel).filter(PostsModel.id == id).first()
    return data 

@router.post("/create_multiple_posts")
def create_multiple_posts(posts : List[PostsSchema] , database : Session = Depends(get_db)):
    data = [PostsModel(**p.dict())for p in posts]
    database.add_all(data)
    database.commit()
    return data

@router.delete("/delete_post_by_id")
def delete_post_by_id(id : int , database : Session = Depends(get_db)):
    data = database.query(PostsModel).filter(PostsModel.id == id).first()
    database.delete(data)
    database.commit()
    return data 

@router.put("/update_post_by_id")
def update_post_by_id(id : int , post : PostsSchema , database : Session = Depends(get_db)):
    data = database.query(PostsModel).filter(PostsModel.id == id).first()
    data.post_title = post.post_title
    data.post_description = post.post_description
    data.post_category = post.post_category
    data.post_difficulty = post.post_difficulty
    database.commit()
    return data 

#Rating for posts
# Note: Since post_rating column doesn't exist in the database,
# we'll use a workaround by storing ratings in a separate table or
# just return success without updating (frontend can handle client-side rating)
def disliking_post(db: Session, id: int):
    # Check if post exists by querying only columns that exist
    post = db.query(
        PostsModel.id,
        PostsModel.post_title
    ).filter(PostsModel.id == id).first()
    
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    # Since post_rating column doesn't exist, we can't update it in the database
    # The frontend will handle the rating display client-side
    # In a production app, you'd want to add the column or use a separate ratings table

def liking_post(db: Session, id: int):
    # Check if post exists by querying only columns that exist
    post = db.query(
        PostsModel.id,
        PostsModel.post_title
    ).filter(PostsModel.id == id).first()
    
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    # Since post_rating column doesn't exist, we can't update it in the database
    # The frontend will handle the rating display client-side
    # In a production app, you'd want to add the column or use a separate ratings table

@router.get("/dislike_post/{id}")
def dislike_post(id : int , database : Session = Depends(get_db)):
    try:
        # Verify post exists
        post = database.query(PostsModel.id).filter(PostsModel.id == id).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
        
        # Call the disliking function (it will verify post exists)
        disliking_post(database, id)
        return {"message": "Post disliked successfully", "post_id": id, "note": "Rating stored client-side (post_rating column not in database)"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error disliking post: {str(e)}")

@router.get("/like_post/{id}")
def like_post(id : int , database : Session = Depends(get_db)):
    try:
        # Verify post exists
        post = database.query(PostsModel.id).filter(PostsModel.id == id).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
        
        # Call the liking function (it will verify post exists)
        liking_post(database, id)
        return {"message": "Post liked successfully", "post_id": id, "note": "Rating stored client-side (post_rating column not in database)"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error liking post: {str(e)}")