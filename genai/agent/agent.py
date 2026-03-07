"""
Agent definition using the LangChain and local Ollama.
"""
import re
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage
from .tools import (
    get_highest_risk_inverter,
    # get_high_risk_inverters_by_block,
    # get_inverter_details,
    retrieve_knowledge
)
from config import OLLAMA_BASE_URL, MODEL_NAME

class InverterFailureAgent:
    def __init__(self, model_name: str = MODEL_NAME, base_url: str = OLLAMA_BASE_URL):
        """
        Initializes the LangChain agent with local Ollama model and tools.
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
        
        # System instructions
        self.system_instruction = (
"""You are an AI assistant for a Solar Inverter Failure Prediction System.

CRITICAL INSTRUCTION: If the user's message is a greeting or casual conversation, DO NOT use any tools.
CRITICAL INSTRUCTION: Do NOT hallucinate or pretend the user asked a technical question. Answer ONLY the exact question they asked.

Your role is to answer user questions about solar inverter performance, faults, and predicted failures using the provided CONTEXT, MODEL OUTPUT, and external tools.
Before generating a response, classify the user's query into one of the following categories:

1. Greeting / Casual conversation
   Examples:
   - "hi"
   - "hello"
   - "how are you"
   - "thanks"

   For these messages:
   - Respond like a normal chatbot.
   - Be friendly and conversational.
   - DO NOT call any tools.
   - DO NOT use the structured response format.

2. General knowledge question about solar inverters
   Example:
   - "Why do solar inverters fail?"
   - "What causes inverter overheating?"

   For these:
   - Use retrieve_knowledge tool.
   - Provide technical explanation.
   - Use the structured response format.

3. System-specific diagnostic question
   Example:
   - "Why is inverter INV23 at risk?"
   - "Which inverter may fail in the next 7 days?"

   For these:
   - Use MODEL OUTPUT.
   - Call retrieve_knowledge tool.
   - Generate the full structured analysis.

Only use the structured diagnostic format when the question is related to inverter performance, faults, or predictions.
Follow these strict rules:

1. Always use the provided CONTEXT as the primary source of knowledge.
 if user asked about risk inverter but there are not inverter with risk than reply like "Hello! It looks like all the inverters are currently functioning properly. If you have any questions about their performance or would like to know more about their status, feel free to ask!""
2. Do NOT invent information that is not present in the context.
3. If the answer is not in the context, clearly say:
   "The available data does not contain enough information to answer this question."

4. If MODEL OUTPUT is provided (failure prediction results), you MUST analyze it to determine:
   - Which inverter may fail
   - Failure probability or risk level
   - Prediction time horizon

5. For identifying **Possible Causes** and **Recommended Actions**, you MUST call the tool:

retrieve_knowledge

The tool will return relevant technical knowledge from the knowledge base based on:
- inverter condition
- detected anomalies
- predicted failure patterns.

Use the retrieved information to generate the sections:
- 🧠 Possible Causes
- 🛠 Recommended Actions
- 📚 Supporting Knowledge

Do NOT generate causes or actions without consulting the retrieve_knowledge tool.

6. Your answer must always follow this structured format:

-----------------------------------------------------

🔎 Question
{user_question}

📊 System Analysis
Explain what the system analyzed using context or prediction data.

⚠️ Risk Assessment
- Affected inverter(s)
- Failure probability or risk level
- Time horizon (if available)

🧠 Possible Causes
List technical reasons retrieved from the knowledge base using retrieve_knowledge.

🛠 Recommended Actions
Provide preventive or corrective steps retrieved from the knowledge base.

📚 Supporting Knowledge
Summarize relevant technical knowledge retrieved from the system knowledge base.

-----------------------------------------------------

7. If the question is general (example: "Why do solar inverters fail?"):
   - Retrieve relevant knowledge using retrieve_knowledge.
   - Provide a technical explanation.
   - Mention common causes and monitoring indicators.

8. Keep answers:
   - Clear
   - Technical
   - Concise
   - Useful for engineers and operators.

9. Never mention internal system details such as embeddings, vector databases, RAG pipelines, or internal architecture.

10. If multiple inverters exist in the data, analyze and report them separately.

11. Always prioritize safety, preventive maintenance, and operational reliability in your recommendations.
12. Do NOT mention internal document names, file names, or knowledge sources 
(such as manuals, PDFs, vector databases, or retrieved documents).
Instead, summarize the knowledge as general system knowledge."""
        )
        
        # Keep a short history memory for iterative conversation
        self.chat_history = [SystemMessage(content=self.system_instruction)]

    def send_message(self, message: str) -> str:
        """
        Sends a message to the local Ollama agent and retrieves its response.
        """
        try:
            # Handle casual greetings directly to prevent tool-calling hallucinations or out-of-context answers
            # clean_msg = message.strip().lower()
            # if re.match(r'^(hi+|hello+|hey+|good morning|good afternoon|good evening|how are you|test|ping|greetings)[^a-z0-9]*$', clean_msg) or (len(clean_msg) < 6 and "inv" not in clean_msg and "fail" not in clean_msg and "risk" not in clean_msg):
            #     reply = "Hello! I am the Solar Inverter assistant. How can I help you regarding inverter faults, predictions, or performance today?"
            #     self.chat_history.append(HumanMessage(content=message))
            #     self.chat_history.append(AIMessage(content=reply))
            #     return reply

            self.chat_history.append(HumanMessage(content=message))
            
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
                    
                    print(f"  [Agent Tool Execution] -> {tool_name}({tool_args})")
                    
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
                self.chat_history.append(final_response)
                return final_response.content
                
            else:
                # Normal chat response
                self.chat_history.append(response)
                
            # Maintain chat history limit (keep system message + last 10 messages)
            if len(self.chat_history) > 11:
                self.chat_history = [self.chat_history[0]] + self.chat_history[-10:]
                
            return self.chat_history[-1].content

        except Exception as e:
            return f"Error communicating with local Ollama agent: {str(e)}"
