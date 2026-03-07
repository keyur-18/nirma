import os

# Ollama local URL configuration (defaults to localhost)
OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")

# Using the local Llama model present on your machine
MODEL_NAME = "llama3.2:3b"
