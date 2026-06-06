import mlflow
import os
from dotenv import load_dotenv

load_dotenv()

def setup_mlflow():
    token = os.getenv("DAGSHUB_TOKEN", "")
    
    if token:
        mlflow.set_tracking_uri(
            "https://dagshub.com/ar3080331/enterprise-doc-intelligence.mlflow"
        )
        os.environ["MLFLOW_TRACKING_USERNAME"] = "ar3080331"
        os.environ["MLFLOW_TRACKING_PASSWORD"] = token
    else:
        mlflow.set_tracking_uri("sqlite:///mlflow.db")
    
    mlflow.set_experiment("rag-experiments")

def log_rag_experiment(chunk_size, chunk_overlap, k, question, answer):
    with mlflow.start_run():
        mlflow.log_param("chunk_size", chunk_size)
        mlflow.log_param("chunk_overlap", chunk_overlap)
        mlflow.log_param("k", k)
        mlflow.log_param("model", "llama-3.3-70b-versatile")
        mlflow.log_text(question, "question.txt")
        mlflow.log_text(answer, "answer.txt")
        mlflow.log_metric("answer_length", len(answer))
        mlflow.log_metric("question_length", len(question))