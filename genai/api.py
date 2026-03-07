from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from genai.agent.agent import InverterFailureAgent
from genai.agent.summary_agent import InverterSummaryAgent

app = FastAPI(
    title="Solar Inverter Failure Agentic API",
    description="API for the Inverter Failure Q&A Agent and Narrative Summary Agent.",
    version="1.0.0"
)

# ✅ Allow frontend (Vite) to access backend
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # allowed frontend
    allow_credentials=True,
    allow_methods=["*"],            # allow all methods (GET, POST, etc.)
    allow_headers=["*"],            # allow all headers
)

# Instantiate agents
try:
    generator_agent = InverterFailureAgent()
except Exception as e:
    print(f"Warning: Failed to initialize Generator Agent: {e}")
    generator_agent = None

try:
    summary_agent = InverterSummaryAgent()
except Exception as e:
    print(f"Warning: Failed to initialize Summary Agent: {e}")
    summary_agent = None


class QueryRequest(BaseModel):
    query: str


class AgentResponse(BaseModel):
    response: str | None


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Solar Inverter Agent API running."}


@app.post("/generator", response_model=AgentResponse)
async def ask_generator_agent(request: QueryRequest):

    if not generator_agent:
        raise HTTPException(status_code=500, detail="Generator Agent not initialized properly.")

    try:
        response_text = generator_agent.send_message(request.query)
        return AgentResponse(response=response_text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error executing generator agent: {str(e)}")


@app.post("/summary", response_model=AgentResponse)
async def generate_summary(request: QueryRequest):

    if not summary_agent:
        raise HTTPException(status_code=500, detail="Summary Agent not initialized properly.")

    try:
        response_text = summary_agent.generate_summary(request.query)
        return AgentResponse(response=response_text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error executing summary agent: {str(e)}")