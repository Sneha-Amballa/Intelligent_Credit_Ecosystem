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

# -----------------------------
# Collect command-line arguments
# -----------------------------
location_name = str(sys.argv[1])
friend_name = str(sys.argv[2])
friend_type = str(sys.argv[3])
module_name = str(sys.argv[4])
current_lesson_ind = int(sys.argv[5])
current_minilesson_ind = int(sys.argv[6])
current_block_ind = int(sys.argv[7])
user_age = int(sys.argv[8])
user_language = str(sys.argv[9])

# -----------------------------
# Define block templates
# -----------------------------
block = []

block.append(f"""
We are just starting to talk about this part of the lesson, so first thing you should explain to the user is:
- WRITE IN {user_language.upper()}
- Playfully explain the mini-lesson's content from a theoretical standpoint, ensuring it's understandable and engaging.
- Announce that if the student is curious about anything in the mini-lesson, they can ask you about it. 
  If they have no further questions, tell them to click on the "Next" button to hear about a scenario where the mini-lesson content is applied.
""")

block.append(f"""
Let's say that the student is already familiar with the concept of the current mini-lesson. Continue your conversation with the following:
- WRITE IN {user_language.upper()}
- Your name is {friend_name}, you are a {friend_type}, and you are guiding the user through the exciting world of {location_name}.
- Create an imaginative scenario in {location_name} where the mini-lesson content is applied.
- The scenario should be playful and relevant, encouraging interactive learning and problem-solving.
- Announce that if the student is curious about anything in the scenario, they can ask you about it. 
  If they have no further questions, tell them to click on the "Next" button to start with a quiz and test their knowledge.
""")

# -----------------------------
# Load lesson content
# -----------------------------
file_path = f"src/langchain/docs/{location_name}.json"

try:
    with open(file_path, "r", encoding="utf-8") as file:
        lessons = json.load(file)
except FileNotFoundError:
    print(json.dumps({"error": f"Lesson file not found: {file_path}"}))
    sys.exit(1)
except json.JSONDecodeError:
    print(json.dumps({"error": f"Invalid JSON format in {file_path}"}))
    sys.exit(1)

lesson = lessons[current_lesson_ind]
lesson_name = lesson["name"]
mini_lesson = lesson["mini_lessons"][current_minilesson_ind]
mini_lesson_name = mini_lesson["name"]
mini_lesson_goal = mini_lesson["content"]
current_block = block[current_block_ind]

# -----------------------------
# Define prompt
# -----------------------------
templateText = """
Output answers without any introductory or concluding text, greeting, or welcoming phrases.
Always directly provide an explanation of the mini-lesson content. The answer should be straightforward and focused on the subject.

You are responding to a {user_age}-year-old and WRITE IN {user_language}.
You are teaching children about finance and {module_name}.

Current mini-lesson is: {mini_lesson_name} and it is a part of {lesson_name}.
Learning outcomes of this mini-lesson are: {mini_lesson_goal}

{current_block}

Always denote currency exclusively in Euros (€).
Ensure that the answer does not include greetings or phrases like “Hello” or “Welcome”.
They must not know that you are a generative AI or chatbot of any kind!
"""

prompt = PromptTemplate(
    input_variables=[
        "lesson_name", "mini_lesson_name", "mini_lesson_goal",
        "module_name", "current_block", "user_age", "user_language",
    ],
    template=templateText,
)

# -----------------------------
# Run LLM Chain
# -----------------------------
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2, api_key=api_key)
chain = LLMChain(llm=llm, prompt=prompt)

response = chain.run(
    lesson_name=lesson_name,
    mini_lesson_name=mini_lesson_name,
    mini_lesson_goal=mini_lesson_goal,
    module_name=module_name,
    current_block=current_block,
    user_age=user_age,
    user_language=user_language.upper(),
)

# -----------------------------
# Output JSON result
# -----------------------------
print(json.dumps({"response": response}, ensure_ascii=False))
sys.stdout.flush()
