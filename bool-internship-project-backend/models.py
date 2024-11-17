from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import engine
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class RoleModel(Base):
    __tablename__ = "user_roles"
    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String, index=True)

    users = relationship("UserModel", back_populates="role")

class UserModel(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    role_id_FK = Column(Integer, ForeignKey("user_roles.role_id"))

    role = relationship("RoleModel", back_populates="users")

# Create the tables in the database
Base.metadata.create_all(bind=engine)
