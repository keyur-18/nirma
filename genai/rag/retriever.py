"""
RAG implementation for the Solar Inverter assistant.
Provides semantic search capabilities over locally stored PDFs.
"""

import os
import sys
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Paths to data directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Store the FAISS database strictly inside the genai folder
FAISS_INDEX_DIR = os.path.join(BASE_DIR, "genai", "faiss_index")

def get_vector_store():
    """
    Loads the FAISS vector store.
    """
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    if os.path.exists(FAISS_INDEX_DIR):
        try:
            vector_store = FAISS.load_local(
                FAISS_INDEX_DIR, 
                embeddings, 
                allow_dangerous_deserialization=True
            )
            return vector_store
        except Exception as e:
            print(f"[RAG] Error loading index: {e}.")
            return None
    return None

def retrieve_from_faiss(query: str, k: int = 3) -> str:
    """
    Searches the FAISS index for relevant document chunks and returns them as a single string.
    """
    vector_store = get_vector_store()
    
    if not vector_store:
        return "Knowledge base is currently empty or not built. Please run python genai/create_vector_db.py first."
        
    docs = vector_store.similarity_search(query, k=k)
    if not docs:
        return "No relevant information found in the knowledge base."
        
    context = "\n\n".join([f"Excerpt:\n{doc.page_content}" for doc in docs])
    return context
