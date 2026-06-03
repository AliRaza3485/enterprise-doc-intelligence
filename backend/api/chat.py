from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from services.auth import verify_token
from services.rag import process_document, ask_question
from models.document import Document

router = APIRouter(prefix="/chat", tags=["Chat"])

class QuestionRequest(BaseModel):
    doc_id: int
    question: str

@router.post("/process/{doc_id}")
def process_doc(doc_id: int, token: str = "", db: Session = Depends(get_db)):
    # Token verify karo
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Please login first!")
    

    # Document dhundo
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found!")
   
    # File path banao
    file_path = f"./data/uploads/{doc.user_id}_{doc.filename}"


    # RAG pipeline chalao
    chunks = process_document(file_path, doc_id)

    # Status update karo
    doc.status = "processed"
    db.commit()

    return {
        "message": "Document processed!",
        "chunks_created": chunks
    }
   

@router.post("/ask")
def ask(request: QuestionRequest, token: str = "", db: Session = Depends(get_db)):
    # Token verify karo
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Please login first!")

    # Jawab lo
    answer = ask_question(request.doc_id, request.question)

    return {
        "question": request.question,
        "answer": answer
    }
