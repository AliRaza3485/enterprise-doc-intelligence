from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from services.document import save_file
from services.auth import verify_token

router = APIRouter(prefix="/documents", tags=["Documents"])

def get_current_user(token: str, db: Session):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token!")
    return payload

@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    token: str = "",
    db: Session = Depends(get_db)
):
    # Token verify karo 
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Please login first!")

    user_email = payload.get("sub")
    # File save karo 
    doc, error = save_file(file, user_email, db)
    if error:
        raise HTTPException(status_code=400, detail=error)
    
    return {
        "message": "File uploaded successfully!",
        "filename": doc.filename,
        "file_type": doc.file_type,
        "file_size": f"{doc.file_size} MB"
    }


@router.get("/list")
def list_documents(token: str = "", db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Please login first!")
    from models.document import Document
    docs = db.query(Document).all()
    return {"documents": [{"id": d.id, "filename": d.filename, "status": d.status} for d in docs]}