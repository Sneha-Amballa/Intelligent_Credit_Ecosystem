import os
import sys
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableSequence

# Load environment variables
load_dotenv("../../../.env")

# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

# Initialize the Gemini model
llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    google_api_key=api_key,
    temperature=0.7
)


# Create prompt
prompt = PromptTemplate(
    input_variables=["user_input"],
    template="You are a helpful AI assistant. Answer this question clearly:\n\n{user_input}"
)

# Chain using the new Runnable API
chain = RunnableSequence(first=prompt, last=llm)

# Example user input
user_input = "Explain LangChain in simple words."
response = chain.invoke({"user_input": user_input})

print("\nAI Response:\n", response)
