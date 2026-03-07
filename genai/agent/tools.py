"""
Function interfaces for the Agentic AI layer tools.
These functions define the tools available to the LangChain agent.
"""

from langchain_core.tools import tool

@tool
def get_highest_risk_inverter() -> str:
    """
    Returns the inverter with the highest predicted failure risk.
    """
    try:
        from genai.fetch_predictions import get_high_risk_predictions
        predictions = get_high_risk_predictions(limit=5)
        
        if not predictions:
            return "Every inverter is in good function"
            
        # Format the predictions into a readable string
        result_lines = ["The following inverters have a high predicted failure risk (>= 0.70):"]
        for p in predictions:
            inv_id = p.get("inverter_id", "Unknown")
            score = p.get("risk_score", "N/A")
            
            # Extract top contributing features if they exist in the DB
            features_info = ""
            if "top_features" in p:
                features_info = f" (Top Features: {p['top_features']})"
                
            result_lines.append(f"- Inverter ID: {inv_id}, Risk Score: {score}{features_info}")
            
        return "\n".join(result_lines)
    except Exception as e:
        return f"Error retrieving inverter risk data: {e}"

# @tool
# def get_high_risk_inverters_by_block(block: str) -> list[str]:
#     """
#     Returns inverters in a specific block with risk score above threshold.
    
#     Args:
#         block (str): The identifier of the block (e.g., 'B').
#     """
#     # TODO: Implement filtering logic by block with a risk threshold
#     return ["INV23", "INV05"]

# @tool
# def get_inverter_details(inverter_id: str) -> dict:
#     """
#     Returns prediction details including risk score and feature importance.
    
#     Args:
#         inverter_id (str): The unique identifier of the solar inverter (e.g., 'INV23').
#     """
#     # TODO: Implement detail retrieval logic including risk score and features
#     return {"inverter_id": inverter_id, "risk_score": 0.85, "status": "High Risk"}

@tool
def retrieve_knowledge(query: str) -> str:
    """
    Retrieves technical knowledge from inverter documentation (RAG).
    
    Args:
        query (str): The technical query to search in the knowledge base.
    """
    try:
        from genai.rag.retriever import retrieve_from_faiss
        return retrieve_from_faiss(query)
    except Exception as e:
        return f"Error searching knowledge base: {e}"
