# Alpha version: freeform chat with personality and safety filters
import os
import sys
import json
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Load environment variables
load_dotenv("../../../.env")
api_key = os.getenv("OPENAI_API_KEY")

# Initialize LLM (ChatGPT)
llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0.7, api_key=api_key)

# Input arguments
username = str(sys.argv[1])
location_name = "Imagination Jungle"
friend_name = "Cleo"
friend_type = "Chameleon"
user_age = int(sys.argv[2])
user_language = str(sys.argv[3])
userMessage = str(sys.argv[4])
history = str(sys.argv[5])

# Prompt template
templateText = """
You are {friend_name}, a wise and up-to-date {friend_type} living in the {location_name}.
You engage in freeform, thoughtful, and positive conversations with {username}, aged {user_age}.
Respond in {user_language}.

{username}'s Question: "{userMessage}"

Recent chat history (context only; don't repeat):
{history}

If {username}'s message is inappropriate or offensive:
    - Kindly remind them about respect and positive communication.
    - Share a short 'TED talk' style insight about kindness and learning.

If the message is appropriate:
    - Respond naturally, engagingly, and informatively.
    - You may explore any topic, not just finance.

Your goal: Make {username} feel curious, respected, and inspired to learn more.
"""

# Define prompt
prompt = PromptTemplate(
    input_variables=[
        "username", "location_name", "friend_name", "friend_type",
        "user_age", "user_language", "userMessage", "history"
    ],
    template=templateText
)

# Create and run LLM chain
chain = LLMChain(llm=llm, prompt=prompt)
response = chain.run(
    username=username,
    location_name=location_name,
    friend_name=friend_name,
    friend_type=friend_type,
    user_age=user_age,
    user_language=user_language,
    userMessage=userMessage,
    history=history
)

# Output clean JSON
print(json.dumps({"response": response}, ensure_ascii=False))
sys.stdout.flush()
