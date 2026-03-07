const BASE_URL = import.meta.env.VITE_AI_API_URL;


// GET API -> read_root__get
export const getAIResponse = async () => {

  const res = await fetch(`http://127.0.0.1:8000/read_root__get`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error("AI GET request failed");
  }

  return await res.json();
};


// POST API -> generator
export const generateAI = async (question) => {

  const res = await fetch(`http://127.0.0.1:8000/generator`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: question
    })
  });

  if (!res.ok) {
    throw new Error("AI generator request failed");
  }

  return await res.json();
};