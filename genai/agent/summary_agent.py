"""
Agent definition using the LangChain and local Ollama for generating narrative summaries.
"""
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage
from .tools import (
    get_highest_risk_inverter,
    # get_high_risk_inverters_by_block,
    # get_inverter_details,
    retrieve_knowledge
)
from config import OLLAMA_BASE_URL, MODEL_NAME
from genai.fetch_predictions import get_high_risk_predictions

class InverterSummaryAgent:
    def __init__(self, model_name: str = MODEL_NAME, base_url: str = OLLAMA_BASE_URL):
        """
        Initializes the LangChain agent with local Ollama model and tools for summarizing.
        """
        self.tools = [
            get_highest_risk_inverter,
            # get_high_risk_inverters_by_block,
            # get_inverter_details,
            retrieve_knowledge
        ]
        
        # Initialize ChatOllama with function calling capability
        self.llm = ChatOllama(
            model=model_name,
            base_url=base_url,
            temperature=0
        )
        
        # Bind the tools directly to the LLM model instance
        self.llm_with_tools = self.llm.bind_tools(self.tools)
        
        # System instructions specific for creating narrative summaries
        self.system_instruction = (
"""You are an Executive Summary AI for a Solar Inverter Failure Prediction System.

Your role is to write clear, professional, narrative summaries regarding the current status and risks of solar inverters in the plant, utilizing the provided tools to gather realtime data and technical knowledge.

Follow these strict rules:

1. You MUST use the available tools to fetch data about high-risk inverters, specific inverter details, or technical knowledge when asked to provide a summary.
2. DO NOT invent information. If tools return no data, state that there are no high-risk issues or sufficient data currently available.
3. Your tone should be a professional, executive narrative. Use complete sentences and well-structured paragraphs.
4. If you identify high-risk inverters using tools, incorporate their details (risk score, related knowledge) smoothly into your narrative report.
5. In your summary, include:
   - An introductory overview of the current overall status based on what was requested.
   - Specific highlights of high-risk inverters and their predicted failure indications.
   - A synthesis of relevant technical knowledge regarding possible causes and recommended actions for those specific issues.
   - A concise conclusion or recommended next step for the engineering team.
   
6. Do NOT output structured JSON or rigid Q&A formats like the main diagnostic agent. Focus on a readable narrative report.
7. Do NOT mention internal system details like tools used, vector databases, or "RAG". Simply present the facts and knowledge seamlessly.
"""
        )
        
        # We start fresh for each summary generation
        self._reset_history()

    def _reset_history(self):
        self.chat_history = [SystemMessage(content=self.system_instruction)]

    def generate_summary(self, request_text: str = "Generate a narrative summary of the current inverter statuses and failure risks.") -> str | None:
        """
        Generates a narrative summary based on the provided request text.
        If there are no high-risk inverters found in the database, returns None.
        """
        # Fast check: If no high risk predictions exist, return None immediately as requested
        try:
            predictions = get_high_risk_predictions(limit=1)
            if not predictions:
                return None
        except Exception as e:
            print(f"Error checking predictions before summary: {e}")
            # Depending on requirements, we either proceed or return None on DB error. 
            # We'll proceed so the LLM can at least answer based on general knowledge if needed.

        self._reset_history()
        
        try:
            self.chat_history.append(HumanMessage(content=request_text))
            
            # Step 1: Query the LLM
            response = self.llm_with_tools.invoke(self.chat_history)
            
            # Step 2: Check if the LLM wants to call a tool
            if hasattr(response, "tool_calls") and response.tool_calls:
                self.chat_history.append(response) # Append the AI tool-calling intent
                
                # Execute all tools the LLM requested
                for tool_call in response.tool_calls:
                    tool_name = tool_call["name"]
                    tool_args = tool_call["args"]
                    tool_id = tool_call["id"]
                    
                    print(f"  [Summary Agent Tool Execution] -> {tool_name}({tool_args})")
                    
                    # Find and execute the requested tool
                    tool_result = "Tool not found or failed."
                    for tool in self.tools:
                        if tool.name == tool_name:
                            try:
                                tool_result = str(tool.invoke(tool_args))
                            except Exception as tool_e:
                                tool_result = f"Error executing tool: {tool_e}"
                            break
                    
                    # Store the result back into memory
                    self.chat_history.append(ToolMessage(content=tool_result, tool_call_id=tool_id))
                    
                # Step 3: Get the final interpreted answer back from the LLM
                final_response = self.llm_with_tools.invoke(self.chat_history)
                return final_response.content
                
            else:
                # Normal response when no tools were needed
                return response.content

        except Exception as e:
            return f"Error communicating with local Ollama agent: {str(e)}"
