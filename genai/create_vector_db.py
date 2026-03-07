"""
Script to intentionally create the FAISS vector database inside the genai folder
using local embeddings to avoid Google API errors.
"""

import os
import sys
import warnings

# Suppress HuggingFace warnings for cleaner output
warnings.filterwarnings('ignore')

# Ensure paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
sys.path.append(PROJECT_DIR)

from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

PDF_DIR = os.path.join(PROJECT_DIR, "data", "pdfs")
FAISS_INDEX_DIR = os.path.join(BASE_DIR, "faiss_index") # strictly in genai/faiss_index

def build_vector_store():
    print("=" * 60)
    print("      Building FAISS Vector Database for RAG      ".center(60))
    print("=" * 60)
    
    if not os.path.exists(PDF_DIR):
        print(f"[!] Please place your PDFs into {PDF_DIR} before running this.")
        os.makedirs(PDF_DIR)
        return
        
    print(f"\n[1] Loading PDFs from {PDF_DIR}...")
    loader = PyPDFDirectoryLoader(PDF_DIR)
    documents = loader.load()
    
    if not documents:
        print("[!] No PDFs found. Aborting.")
        return
        
    print(f"[2] Successfully loaded {len(documents)} document pages. Chunking text...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    chunks = text_splitter.split_documents(documents)
    
    print(f"[3] Loading local HuggingFace Embedding model ('all-MiniLM-L6-v2')...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    print(f"[4] Generating embeddings and building Vector DB...")
    vector_store = FAISS.from_documents(chunks, embeddings)
    
    # Save the DB
    vector_store.save_local(FAISS_INDEX_DIR)
    print(f"\n[SUCCESS] Vector DB created locally at: {FAISS_INDEX_DIR}")
    print("Agent is now ready to search it!")

if __name__ == "__main__":
    build_vector_store()
