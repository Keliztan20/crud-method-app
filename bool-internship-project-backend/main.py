import models
from fastapi import FastAPI
from routers import user, role
from database import engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables in the database if they don’t exist
models.Base.metadata.create_all(bind=engine)

# Include routers for different sections
app.include_router(user.router, tags=["Manage User"])
app.include_router(role.router, tags=["Manage User Roles"])


