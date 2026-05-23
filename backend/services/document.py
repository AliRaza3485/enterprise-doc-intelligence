import os
import shutil
from fastapi import UploadFile
from sqlalchemy.orm import Session
from models.document import Document

UPLOAD_DIR = "./data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_TYPES = ["pdf", "docx", "txt"]

def save_file(file: UploadFile, user_id: int, db: Session):
    # Extension check karo
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_TYPES:
        return None, "File type not allowed!"

    # File save karo
    file_path = f"{UPLOAD_DIR}/{user_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # File size nikalo
    file_size = os.path.getsize(file_path) / (1024 * 1024)  # MB mein

    doc = Document(
        filename=file.filename,
        file_type=ext,
        file_size=round(file_size, 2),
        user_id=user_id,
        status="uploaded"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc, None