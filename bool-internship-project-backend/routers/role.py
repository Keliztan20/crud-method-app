from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models import RoleModel
from database import get_db

router = APIRouter()

# Route to get all roles from the user_roles table
@router.get("/roles", response_model=List[dict])
def read_all_roles(db: Session = Depends(get_db)):
    roles = db.query(RoleModel).all()
    result = [{"role_id": role.role_id, "role_name": role.role_name} for role in roles]
    return result

# Route to get a user by role type
@router.get("/get-roles/{role_name}")
def get_users_with_role_name(role_name: str, db: Session = Depends(get_db)):
    user_role = db.query(RoleModel).filter(RoleModel.role_name == role_name).all()
    if not user_role:
        raise HTTPException(status_code=404, detail="User role not found")
    return user_role

# Route to create a new role
@router.post("/create-role")
def create_role(role_name: str, db: Session = Depends(get_db)):
    db_role = RoleModel(role_name=role_name)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

# Route to update a role
@router.put("/update-role/{role_id}")
def update_user_role(role_id: int, role_name: str = None, db: Session = Depends(get_db)):
    db_user_role = db.query(RoleModel).filter(RoleModel.role_id == role_id).first()
    if not db_user_role:
        raise HTTPException(status_code=404, detail="User not found")
    
    if role_name is not None:
        db_user_role.role_name = role_name

    db.commit()
    print("Database commit successful")
    print(f"Role to update: {db_user_role.role_id}, {db_user_role.role_name}")
    return {"Message": "Role details updated"}

# Route to delete a role by ID
@router.delete("/delete-role/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    db_role = db.query(RoleModel).filter(RoleModel.role_id == role_id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    db.delete(db_role)
    db.commit()
    return {"Message": "Role deleted successfully"}
