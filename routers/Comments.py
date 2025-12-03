from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from Database.db import get_db
from Models.Comments import CommentsModel
from Schemas.Comments import CommentsSchema
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException

router = APIRouter()

@router.get("/get_comments")
def get_comments(database : Session = Depends(get_db)):
    data = database.query(CommentsModel).all()
    return data 

@router.get("/get_comment_by_id")
def get_comment_by_id(id : int , database : Session = Depends(get_db)):
    data = database.query(CommentsModel).filter(CommentsModel.id == id).first()
    return data 

@router.post("/create_multiple_comments")
def create_multiple_comments(comments : List[CommentsSchema] , database : Session = Depends(get_db)):
    data = [CommentsModel(**c.dict())for c in comments]
    database.add_all(data)
    database.commit()
    return data

@router.delete("/delete_comment_by_id")
def delete_comment_by_id(id : int , database : Session = Depends(get_db)):
    data = database.query(CommentsModel).filter(CommentsModel.id == id).first()
    database.delete(data)
    database.commit()
    return data 

@router.put("/update_comment_by_id")
def update_comment_by_id(id : int , comment : CommentsSchema , database : Session = Depends(get_db)):
    data = database.query(CommentsModel).filter(CommentsModel.id == id).first()
    data.comment_text = comment.comment_text
    data.comment_rating = comment.comment_rating
    database.commit()
    return data 

#Rating for comments
def disliking_comment(db: Session, id: int):
    comment = db.query(CommentsModel).filter(CommentsModel.id == id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT)
    else:
        comment.comment_rating -=1
        if comment.comment_rating<0:
            comment.comment_rating=0
        db.commit()
        db.refresh(comment)
    
def liking_comment(db: Session, id: int):
        comment = db.query(CommentsModel).filter(CommentsModel.id == id).first()
        if not comment:
            raise HTTPException(status_code=status.HTTP_204_NO_CONTENT)
        else:
            comment.comment_rating +=1
            db.commit()
            db.refresh(comment)

@router.get("/dislike_comment/{id}")
def dislike_comment(id : int , database : Session = Depends(get_db)):
    comment = database.query(CommentsModel).filter(CommentsModel.id == id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT)
    else:
        disliking_comment(database, id)
        return {"message": "Comment disliked successfully"}

@router.get("/like_comment/{id}")
def like_comment(id : int , database : Session = Depends(get_db)):
    comment = database.query(CommentsModel).filter(CommentsModel.id == id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT)
    else:
        liking_comment(database, id)
        return {"message": "Comment liked successfully"}