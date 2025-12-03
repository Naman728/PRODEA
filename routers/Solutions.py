from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from Database.db import get_db
from Models.Solutions import SolutionsModel
from Schemas.Solutions import SolutionsSchema
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
router = APIRouter()

@router.get("/get_solutions")
def get_solutions(database : Session = Depends(get_db)):
    data = database.query(SolutionsModel).all()
    return data 

@router.get("/get_solution_by_id")
def get_solution_by_id(id : int , database : Session = Depends(get_db)):
    data = database.query(SolutionsModel).filter(SolutionsModel.id == id).first()
    return data

@router.post("/create_multiple_solutions")
def create_multiple_solutions(solutions : List[SolutionsSchema] , database : Session = Depends(get_db)):
    data = [SolutionsModel(**s.dict())for s in solutions]
    database.add_all(data)
    database.commit()
    return data

@router.delete("/delete_solution_by_id")
def delete_solution_by_id(id : int , database : Session = Depends(get_db)):
    data = database.query(SolutionsModel).filter(SolutionsModel.id == id).first()
    database.delete(data)
    database.commit()
    return data 

@router.put("/update_solution_by_id")
def update_solution_by_id(id : int , solution : SolutionsSchema , database : Session = Depends(get_db)):
    data = database.query(SolutionsModel).filter(SolutionsModel.id == id).first()
    data.solution_text = solution.solution_text
    data.solution_rating = solution.solution_rating
    database.commit()
    return data 

#Rating for solutions
def disliking_solution(db: Session, id: int):
    solution = db.query(SolutionsModel).filter(SolutionsModel.id == id).first()
    if not solution:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT)
    else:
        solution.solution_rating -=1
        if solution.solution_rating<0:
            solution.solution_rating=0
        db.commit()
        db.refresh(solution)

def liking_solution(db: Session, id: int):
    solution = db.query(SolutionsModel).filter(SolutionsModel.id == id).first()
    if not solution:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT)
    else:
        solution.solution_rating +=1
        db.commit()
        db.refresh(solution)

@router.get("/dislike_solution/{id}")
def dislike_solution(id : int , database : Session = Depends(get_db)):
    solution = database.query(SolutionsModel).filter(SolutionsModel.id == id).first()
    if not solution:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT)
    else:
        disliking_solution(database, id)
        return {"message": "Solution disliked successfully"}

@router.get("/like_solution/{id}")
def like_solution(id : int , database : Session = Depends(get_db)):
    solution = database.query(SolutionsModel).filter(SolutionsModel.id == id).first()
    if not solution:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT)
    else:
        liking_solution(database, id)
        return {"message": "Solution liked successfully"}