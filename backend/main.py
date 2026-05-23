from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from api.auth import router as auth_router
from api.document import router as document_router
from models.document import Document

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Enterprise Doc Intelligence", version="1.0.0")
app.include_router(document_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/")
def root():
    return {"status": "running", "message": "API is live!"}

@app.get("/health")
def health():
    return {"status": "healthy"}