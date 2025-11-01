import os
import sys
import json
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import openai

# -----------------------------
# Load API Key
# -----------------------------
load_dotenv("../../../.env")
openai.api_key = os.getenv("OPENAI_API_KEY")

# -----------------------------
# Initialize LLM
# -----------------------------
llm = ChatOpenAI(temperature=0.4, model_name='gpt-4')

# -----------------------------
# Read Command-line Arguments
# -----------------------------
username = str(sys.argv[1])
location_name = str(sys.argv[2])
friend_name = str(sys.argv[3])
friend_type = str(sys.argv[4])
module_name = str(sys.argv[5])
current_lesson_ind = int(sys.argv[6])
current_minilesson_ind = int(sys.argv[7])
user_age = int(sys.argv[8])
user_language = str(sys.argv[9])
userMessage = str(sys.argv[10])
historyContext = str(sys.argv[11])

# -----------------------------
# Load Lesson JSON
# -----------------------------
file_path = f"src/langchain/docs/{location_name}.json"

with open(file_path, "r", encoding="utf-8") as file:
    lessons = json.load(file)

lesson = lessons[current_lesson_ind]
lesson_name = lesson["name"]

# ✅ Corrected mini-lesson indexing
mini_lesson_name = lesson["mini_lessons"][current_minilesson_ind]["name"]
mini_lesson_goal = lesson["mini_lessons"][current_minilesson_ind]["content"]

# -----------------------------
# Define Prompt
# -----------------------------
prompt = PromptTemplate(
    input_variables=[
        "username", "user_age", "user_language", "location_name",
        "friend_name", "friend_type", "module_name",
        "lesson_name", "mini_lesson_name", "mini_lesson_goal",
        "userMessage", "historyContext"
    ],
    template="""
You are interacting with {username}, who is {user_age} years old. RESPOND IN: {user_language}.

User's Question: "{userMessage}"

Context:
- You are {friend_name}, the {friend_type}, living in {location_name}.
- You are currently discussing the topic '{module_name}'.
- The current mini-lesson is '{mini_lesson_name}', which is part of the lesson '{lesson_name}'.
- The goal of this mini-lesson is: '{mini_lesson_goal}'.

Guidelines:
- Remember, {username} is a child. Use simple, creative language that is easy to understand.
- Your response should be engaging and encourage {username} to continue learning about the topic.
- If the user's question is off-topic:
  - Briefly answer if appropriate.
  - Gently remind {username} to focus back on '{module_name}'.

Chat History: {historyContext}

Note:
Directly provide the answer related to the mini-lesson content without introductory greetings or welcome phrases.
The response should be straightforward and focused on the subject.
"""
)

# -----------------------------
# Run Chain
# -----------------------------
chain = LLMChain(llm=llm, prompt=prompt)
response = chain.run(
    username=username,
    user_age=user_age,
    user_language=user_language,
    location_name=location_name,
    friend_name=friend_name,
    friend_type=friend_type,
    module_name=module_name,
    lesson_name=lesson_name,
    mini_lesson_name=mini_lesson_name,
    mini_lesson_goal=mini_lesson_goal,
    userMessage=userMessage,
    historyContext=historyContext
).strip()

# -----------------------------
# Output Result
# -----------------------------
print(json.dumps(response, ensure_ascii=False))
sys.stdout.flush()
