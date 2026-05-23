from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.user import User
from services.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Check karo email already exist toh nahi
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered!")
    
    # Naya user banao
    user = User(
        username=request.username,
        email=request.email,
        hashed_password=hash_password(request.password)
    )
    db.add(user)
    db.commit()
    return {"message": "User registered successfully!"}

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # User dhundo
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found!")
    
    # Password check karo
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Wrong password!")
    
    # Token banao
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}