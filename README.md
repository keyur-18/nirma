# Solar Inverter Failure Prediction & Insights System

This robust, intelligence-driven platform monitors, predicts, and explains solar inverter health. It utilizes advanced machine learning prediction models, a real-time telemetry simulator, a React-based frontend dashboard, an Express/Node.js API backend, and local LLM agents (powered by Ollama and LangChain) to provide deep, conversational insights and executive summaries about inverter performance.

## 🌟 Key Features
- **Real-Time Telemetry Simulation**: Continuously ingests data (temperature, voltage, power) from a CSV dataset and simulates live inverter readings into a MongoDB database.
- **Predictive Analytics (ML)**: Uses machine learning models to analyze telemetry and generate failure risk scores.
- **Agentic AI Assistant**: A local LLM agent (Llama 3.2 via Ollama) provides conversational Q&A capability, capable of fetching live database metrics and predicting root causes for specific inverters.
- **Executive Summaries**: A dedicated narrative agent synthesizes the system's current high-risk inverters into human-readable executive health summaries.
- **Interactive Dashboard**: A modern React frontend displaying risk cards, trend charts, and the AI narrative summary.

---

## 🏗️ Architecture Overview

The system is split into three main architectural pillars:

### 1. Frontend Client (`/web/Client`)
- **Tech Stack**: React, Vite, TailwindCSS
- **Key Components**:
  - `Dashboard.jsx`: Displays the latest risk scores, trend charts, and fetches the AI narrative summary.
  - `QA.jsx`: An interactive chat interface communicating with the AI agent.
  - `components/`: Reusable UI elements (RiskCards, TrendCards, SummaryPanel).
  - `api/`: Axios / Fetch wrappers (`aiApi.js`, `predictionApi.js`, etc.) to communicate with the backend and FastAPI services.
- **Run**: `npm run dev` (Runs on `http://localhost:5173`)

### 2. Backend Server (`/web/Server`)
- **Tech Stack**: Node.js, Express, MongoDB (Mongoose)
- **Key Components**:
  - `models/`: Mongoose schemas for `User`, `Telemetry`, `Inverter`, and `Prediction`.
  - `routes/` & `controllers/`: Handles API requests for authentication, inverters, and telemetry data.
  - `simulator/telemetrySimulation.js`: Reads `clean_inverter_dataset.csv` and continuously pushes simulated real-time data to MongoDB.
- **Run**: `npm start` or `node server.js` (Runs on `http://localhost:5000`)

### 3. Agentic AI & ML Service (`/genai` & Root)
- **Tech Stack**: Python, FastAPI, LangChain, Ollama, FAISS (Vector DB)
- **Key Components**:
  - `genai/api.py`: FastAPI application exposing `/generator` (Q&A Agent) and `/summary` (Narrative Agent) endpoints.
  - `genai/agent/agent.py`: LangChain ReAct agent equipped with tools to query MongoDB and retrieve predictions.
  - `genai/agent/summary_agent.py`: Agent designed to format current high-risk inverter data into actionable summaries.
  - `genai/tools.py`: Python tools (e.g., `fetch_prediction`) that allow the LLM to query the MongoDB database.
  - `main.py`: A CLI interface for testing the Agentic AI layer directly in the terminal.
- **Run**: `uvicorn genai.api:app --reload` (Runs on `http://127.0.0.1:8000`)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+
- **Python**: 3.10+
- **MongoDB**: Running locally or via Atlas.
- **Ollama**: Installed locally with the `llama3.2:3b` model pulled (`ollama run llama3.2:3b`).

### 1. Database Setup
1. Ensure MongoDB is running.
2. In `/web/Server/.env`, configure your `MONGO_URI` (e.g., `mongodb://localhost:27017/SolarInverter`).
3. To start testing with data, you may uncomment `startSimulator()` in `/web/Server/src/simulator/telemetrySimulation.js` and run the server to ingest the `clean_inverter_dataset.csv`.

### 2. Backend (Node.js)
```bash
cd web/Server
npm install
npm run dev
```

### 3. Frontend (React)
```bash
cd web/Client
npm install
npm run dev
```
*(Ensure `.env` in the Client points `VITE_AI_API_URL` to the FastAPI backend).*

### 4. AI Service (Python)
```bash
# From project root
pip install -r requirements.txt
uvicorn genai.api:app --reload
```
*(Ensure `.env` in the root contains the correct `MONGO_URI`).*

---

## 🧠 AI Agent Capabilities
The AI layer is built using **LangChain** and **Ollama**, giving it access to real database tools:
- **`fetch_prediction(inverter_id)`**: Checks the latest risk score for a specific unit.
- **`fetch_telemetry(inverter_id)`**: Retrieves recent voltage, power, and temperature readings.
- **`get_high_risk_predictions()`**: Identifies all inverters currently operating with a risk score > 0.70.
- **RAG via FAISS**: The agent has access to technical manuals and historical failure reports indexed in a local FAISS vector store.
