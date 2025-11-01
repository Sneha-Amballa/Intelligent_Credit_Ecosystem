import os
import sys
import json
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# -----------------------------
# Load API key
# -----------------------------
load_dotenv("../../../.env")
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("❌ OPENAI_API_KEY not found in .env file!")

# -----------------------------
# Read command-line arguments
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
# Load JSON content
# -----------------------------
file_path = f"src/langchain/docs/{location_name}.json"
with open(file_path, "r", encoding="utf-8") as file:
    lessons = json.load(file)

lesson = lessons[current_lesson_ind]
mini_lesson = lesson["mini_lessons"][current_minilesson_ind]
mini_lesson_goal = mini_lesson["content"]

# -----------------------------
# Initialize model
# -----------------------------
llm = ChatOpenAI(model="gpt-4", temperature=0).bind(max_output_tokens=2048)

# -----------------------------
# Define prompt
# -----------------------------
quiz_prompt_template = """
You are {friend_name}, a {friend_type} from {location_name}, teaching children about finance and {module_name}.

Generate exactly 5 quiz questions based on the following content:
"{mini_lesson_goal}"

Follow this format strictly:
[
  {{
    "type": "True/False" | "Multiple Choice" | "Open-ended",
    "question": "string",
    "options": ["string", ...],    // Empty list if not applicable
    "correct_answer": "string"
  }},
  ...
]

Rules:
- Include 2 True/False, 2 Multiple Choice (4 options each), and 1 Open-ended question.
- Ensure only one correct answer for multiple-choice.
- For open-ended, leave "options": [].
- Currency should be in Euros (€) only.
- Tailor to {user_age}-year-olds.
- Write everything in {user_language}.
- Return ONLY a JSON array (no text before or after).
"""

prompt = PromptTemplate(
    input_variables=[
        "friend_name",
        "friend_type",
        "location_name",
        "module_name",
        "mini_lesson_goal",
        "user_age",
        "user_language",
    ],
    template=quiz_prompt_template,
)

chain = LLMChain(llm=llm, prompt=prompt)

# -----------------------------
# Run the model
# -----------------------------
response = chain.run(
    friend_name=friend_name,
    friend_type=friend_type,
    location_name=location_name,
    module_name=module_name,
    mini_lesson_goal=mini_lesson_goal,
    user_age=user_age,
    user_language=user_language,
)

# -----------------------------
# Parse and clean output
# -----------------------------
try:
    parsed_response = json.loads(response)
    if not isinstance(parsed_response, list):
        raise ValueError("Expected a JSON array of quiz questions.")
except Exception:
    parsed_response = {"error": "Invalid JSON output", "raw_output": response}

# -----------------------------
# Output final JSON
# -----------------------------
print(json.dumps(parsed_response, ensure_ascii=False, indent=2))
sys.stdout.flush()
