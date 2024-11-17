from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from models import UserModel, RoleModel
from database import get_db

router = APIRouter()

# Route to get all users
@router.get("/users", response_model=List[dict])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(UserModel).all()
    roles = db.query(RoleModel).all()
    result = []
    for user in users:
        for role in roles:
            if role.role_id == user.role_id_FK:
                result.append({
                    "user_id": user.user_id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role_name": role.role_name
                })
    return result

# Route to get users by user id, first name, last name, role type
@router.get("/get-user/by_filter")
def get_users(
    # user_id: Optional[int] = Query(None, description="Filter by User id"),
    first_name: Optional[str] = Query(None, description="Filter by first name"),
    last_name: Optional[str] = Query(None, description="Filter by last name"),
    role_name: Optional[str] = Query(None, description="Filter by role type"),
    db: Session = Depends(get_db)
):
    roles = db.query(RoleModel).all()
    query = db.query(UserModel)

    # Apply filters based on the optional query parameters
    # if user_id:
    #     query = query.filter(UserModel.user_id == user_id)
    if first_name:
        query = query.filter(UserModel.first_name == first_name)
    if last_name:
        query = query.filter(UserModel.last_name == last_name)
    if role_name:  
        result = []
        for role in roles:
            if role.role_name.lower() == role_name.lower():
                role_id = role.role_id
        if role_id:
            query = query.filter(UserModel.role_id_FK == role_id)
        else:
            return []
    
    users = query.all()

    roles = db.query(RoleModel).all()
    result = []
    for user in users:
        for role in roles:
            if role.role_id == user.role_id_FK:
                result.append({
                    # "id": user.user_id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role_name": role.role_name
                })
    return result

# Route to create a new user
@router.post("/create-user")
def create_user(first_name: str, last_name: str, role_id_FK: int, db: Session = Depends(get_db)):
    db_user = UserModel(first_name=first_name, last_name=last_name, role_id_FK=role_id_FK)
    db.add(db_user)
    db.commit()
    print("Database commit successful")
    db.refresh(db_user)
    return db_user

# Route to update a user
@router.put("/update-user/{user_id}")
def update_user(user_id: int, first_name: Optional[str] = None, last_name: Optional[str] = None, role_id_FK: Optional[int] = None, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if first_name is not None:
        db_user.first_name = first_name
    if last_name is not None:
        db_user.last_name = last_name
    if role_id_FK is not None:
        db_user.role_id_FK = role_id_FK

    db.commit()
    print("Database commit successful")
    print(f"User to update: {db_user.first_name}, {db_user.last_name}, {db_user.role_id_FK}")
    return {"Message": "User details updated"}

# Route to delete a user
@router.delete("/delete-user/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"Message": "User deleted successfully"}
