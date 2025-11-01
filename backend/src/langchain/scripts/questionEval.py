import os
import sys
import json
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Load environment variables
load_dotenv("../../../.env")

question = str(sys.argv[1])
userAnswer = str(sys.argv[2])
userLanguage = str(sys.argv[3])
correctAnswerExample = str(sys.argv[4])

# Initialize LLM
llm = ChatOpenAI(model="gpt-4", temperature=0)

# Define output schema
response_schemas = [
    ResponseSchema(name="evaluation", description="The evaluation of the user's answer: 'correct' or 'incorrect'"),
    ResponseSchema(name="explanation", description="Explanation for the evaluation.")
]

output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
format_instructions = output_parser.get_format_instructions()

# Define prompt
quiz_prompt_template = """
Given the question:
{question}

User's answer:
{userAnswer}

Example of a correct answer: {correctAnswerExample}

All text is in {userLanguage}. Be strict and fair.
Output your response in the following format:
{format_instructions}
"""

prompt = PromptTemplate(
    input_variables=["question", "userAnswer", "userLanguage", "correctAnswerExample", "format_instructions"],
    template=quiz_prompt_template
)

# Run chain
chain = LLMChain(llm=llm, prompt=prompt)
response = chain.run(
    question=question,
    userAnswer=userAnswer,
    userLanguage=userLanguage,
    correctAnswerExample=correctAnswerExample,
    format_instructions=format_instructions
)

# Parse safely
try:
    parsed_response = output_parser.parse(response)
except Exception:
    parsed_response = {"evaluation": "error", "explanation": response}

print(json.dumps(parsed_response, ensure_ascii=False))
sys.stdout.flush()
