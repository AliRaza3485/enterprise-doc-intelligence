# from langchain_community.document_loaders import PyPDFLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_community.embeddings import HuggingFaceEmbeddings
# from langchain_community.vectorstores import Chroma
# from langchain_groq import ChatGroq
# from langchain_core.prompts import PromptTemplate
# from langchain_core.runnables import RunnablePassthrough
# from langchain_core.output_parsers import StrOutputParser
# from services.tracking import setup_mlflow, log_rag_experiment
# import os
# from dotenv import load_dotenv


# load_dotenv()

# embeddings = HuggingFaceEmbeddings(
#     model_name="all-MiniLM-L6-v2"
# )

# llm = ChatGroq(
#     api_key=os.getenv("GROQ_API_KEY"),
#     model_name="llama-3.3-70b-versatile"
# )
# CHROMA_DIR = "./data/chroma"

# def process_document(file_path: str, doc_id: int):
#     loader = PyPDFLoader(file_path)
#     documents = loader.load()

#     splitter = RecursiveCharacterTextSplitter(
#         chunk_size=500,
#         chunk_overlap=50
#     )
#     chunks = splitter.split_documents(documents)

#     Chroma.from_documents(
#         documents=chunks,
#         embedding=embeddings,
#         persist_directory=CHROMA_DIR,
#         collection_name=f"doc_{doc_id}"
#     )

#     return len(chunks)

# def ask_question(doc_id: int, question: str):
#     vectorstore = Chroma(
#         persist_directory=CHROMA_DIR,
#         embedding_function=embeddings,
#         collection_name=f"doc_{doc_id}"
#     )


#     retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

#     prompt = PromptTemplate.from_template("""
#     Context se jawab do:
#     {context}
    
#     Sawal: {question}
#     Jawab:
#     """)

#     chain = (
#         {"context": retriever, "question": RunnablePassthrough()}
#         | prompt
#         | llm
#         | StrOutputParser()
#     )

#     return chain.invoke(question)



from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from services.tracking import setup_mlflow, log_rag_experiment
import os
from dotenv import load_dotenv


load_dotenv()

embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)
# Yeh line add karo
setup_mlflow()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)
CHROMA_DIR = "./data/chroma"

def process_document(file_path: str, doc_id: int):
    loader = PyPDFLoader(file_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.split_documents(documents)

    Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DIR,
        collection_name=f"doc_{doc_id}"
    )

    return len(chunks)

def ask_question(doc_id: int, question: str):
    vectorstore = Chroma(
        persist_directory=CHROMA_DIR,
        embedding_function=embeddings,
        collection_name=f"doc_{doc_id}"
    )


    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    # prompt = PromptTemplate.from_template("""
    # Context se jawab do:
    # {context}
    
    # Sawal: {question}
    # Jawab:
    # """)
    prompt = PromptTemplate.from_template("""
You are a helpful assistant. Answer the question ONLY based on the context below.
If the answer is not in the context, say "I don't know based on the provided document."

Context:
{context}

Question: {question}
Answer:
""")

    chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    answer = chain.invoke(question)

    # Yeh add karo
    log_rag_experiment(
        chunk_size=500,
        chunk_overlap=50,
        k=3,
        question=question,
        answer=answer
    )
    return answer


