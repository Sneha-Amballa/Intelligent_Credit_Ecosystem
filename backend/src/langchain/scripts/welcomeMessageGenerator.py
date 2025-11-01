import os
import sys
import json
import openai
import logging
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI  # ✅ modern import path
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# ---------------------------------------
# Load environment variables
# ---------------------------------------
load_dotenv("../../../.env")
openai.api_key = os.getenv("OPENAI_API_KEY")

# ---------------------------------------
# Configure logging
# ---------------------------------------
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

# ---------------------------------------
# Read command-line arguments
# ---------------------------------------
try:
    username = str(sys.argv[1])
    location_name = str(sys.argv[2])
    friend_name = str(sys.argv[3])
    friend_type = str(sys.argv[4])
    module_name = str(sys.argv[5])
    module_description_kids = str(sys.argv[6])
    module_description_parents = str(sys.argv[7])
    progress = float(sys.argv[8])
    current_lesson_ind = int(sys.argv[9])
    current_minilesson_ind = int(sys.argv[10])
    current_block_ind = int(sys.argv[11])  # (not used but included)
    user_age = int(sys.argv[12])
    user_language = str(sys.argv[13])
except (IndexError, ValueError):
    print(json.dumps({"error": "Invalid or missing command-line arguments."}))
    sys.exit(1)

# ---------------------------------------
# Load lesson data
# ---------------------------------------
file_path = os.path.join("src", "langchain", "docs", f"{location_name}.json")

try:
    with open(file_path, "r", encoding="utf-8") as file:
        lessons = json.load(file)
except FileNotFoundError:
    print(json.dumps({"error": f"File not found: {file_path}"}))
    sys.exit(1)
except json.JSONDecodeError:
    print(json.dumps({"error": f"Invalid JSON format in {file_path}"}))
    sys.exit(1)

# ---------------------------------------
# Extract lesson info safely
# ---------------------------------------
try:
    lesson_name = lessons[current_lesson_ind]["name"]
    mini_lesson = lessons[current_lesson_ind]["mini_lessons"][current_minilesson_ind]
    mini_lesson_name = mini_lesson["name"]
    mini_lesson_goal = mini_lesson["content"]
except (IndexError, KeyError) as e:
    print(json.dumps({"error": f"Invalid lesson index: {e}"}))
    sys.exit(1)

# ---------------------------------------
# Initialize model
# ---------------------------------------
llm = ChatOpenAI(
    temperature=0.7,
    model_name="gpt-3.5-turbo-1106",
    max_tokens=512
)

# ---------------------------------------
# Define message templates
# ---------------------------------------
if progress == 0:
    template_text = """
    Create an engaging and age-appropriate message for {username}, a {user_age}-year-old starting their journey in the {module_name} module. 
    The message should be written in {user_language}.

    Introduce yourself as {friend_name}, the {friend_type}, guiding {username} through the exciting world of {location_name}. 
    For the child-friendly part, make the message lively and fun, similar to: {module_description_kids}.

    Also include a short, parent-focused explanation of the educational value and learning outcomes of {module_name}, 
    similar in tone to: '{module_description_parents}'.

    End the message by encouraging {username} to begin their learning adventure by clicking the "Next" button. Keep it short and cheerful.
    """
    input_vars = [
        "username", "location_name", "friend_name", "friend_type", "module_name",
        "module_description_kids", "module_description_parents", "user_age", "user_language"
    ]
else:
    template_text = """
    Create a motivational and engaging message for {username}, a {user_age}-year-old resuming their journey in the {module_name} module, 
    written in {user_language}.

    Warmly welcome back {username} to {location_name}. Mention they’re currently in lesson {lesson_name}, mini-lesson {mini_lesson_name}, 
    learning about {mini_lesson_goal}.

    Highlight how much they’ve already learned about {module_description_kids}, encouraging them to keep up their great work. 
    Remind them that fun and interactive activities await in the next lessons.

    Keep the message short, friendly, and encouraging.
    """
    input_vars = [
        "username", "location_name", "friend_name", "friend_type", "lesson_name",
        "mini_lesson_name", "mini_lesson_goal", "module_name",
        "module_description_kids", "user_age", "user_language"
    ]

# ---------------------------------------
# Prepare prompt and LLM chain
# ---------------------------------------
prompt = PromptTemplate(input_variables=input_vars, template=template_text)
chain = LLMChain(llm=llm, prompt=prompt)

# ---------------------------------------
# Generate the message
# ---------------------------------------
try:
    if progress == 0:
        response = chain.run(
            username=username,
            location_name=location_name,
            friend_name=friend_name,
            friend_type=friend_type,
            module_name=module_name,
            module_description_kids=module_description_kids,
            module_description_parents=module_description_parents,
            user_age=user_age,
            user_language=user_language,
        )
    else:
        response = chain.run(
            username=username,
            location_name=location_name,
            friend_name=friend_name,
            friend_type=friend_type,
            lesson_name=lesson_name,
            mini_lesson_name=mini_lesson_name,
            mini_lesson_goal=mini_lesson_goal,
            module_name=module_name,
            module_description_kids=module_description_kids,
            user_age=user_age,
            user_language=user_language,
        )
except Exception as e:
    print(json.dumps({"error": f"Model call failed: {e}"}))
    sys.exit(1)

# ---------------------------------------
# Output result safely
# ---------------------------------------
final_output = response.strip().encode("utf-8", "ignore").decode("utf-8")
print(final_output)
sys.stdout.flush()
