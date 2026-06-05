# import mlflow
# import dagshub
# import os
# from dotenv import load_dotenv

# load_dotenv()

# def setup_mlflow():
#     os.environ["DAGSHUB_USER_TOKEN"] = os.getenv("DAGSHUB_TOKEN", "")
#     dagshub.init(
#         repo_owner="ar3080331",
#         repo_name="enterprise-doc-intelligence",
#         mlflow=True
#     )
#     mlflow.set_experiment("rag-experiments")
    
# def log_rag_experiment(chunk_size, chunk_overlap, k, question, answer):
#     with mlflow.start_run():
#         mlflow.log_param("chunk_size", chunk_size)
#         mlflow.log_param("chunk_overlap", chunk_overlap)
#         mlflow.log_param("k", k)
#         mlflow.log_param("model", "llama-3.3-70b-versatile")
#         mlflow.log_text(question, "question.txt")
#         mlflow.log_text(answer, "answer.txt")
#         mlflow.log_metric("answer_length", len(answer))
#         mlflow.log_metric("question_length", len(question))
import mlflow
import os
from dotenv import load_dotenv

load_dotenv()

def setup_mlflow():
    # Token env se lo
    token = os.getenv("DAGSHUB_TOKEN", "")
    
    # MLflow ko directly DagsHub se connect karo
    # dagshub.init() nahi — wo browser maangta hai!
    mlflow.set_tracking_uri(
        "https://dagshub.com/ar3080331/enterprise-doc-intelligence.mlflow"
    )
    
    # Credentials set karo
    os.environ["MLFLOW_TRACKING_USERNAME"] = "ar3080331"
    os.environ["MLFLOW_TRACKING_PASSWORD"] = token
    
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