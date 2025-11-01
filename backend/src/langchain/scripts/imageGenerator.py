import os
import sys
from dotenv import load_dotenv
from langchain_openai import OpenAI        # ✅ modern import
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from openai import OpenAI as OpenAIClient  # ✅ official OpenAI client

# Load environment variables
load_dotenv("../../../.env")
api_key = os.getenv("OPENAI_API_KEY")

# Initialize LangChain LLM (for refining the prompt)
llm = OpenAI(model="gpt-4o-mini", temperature=0.4, api_key=api_key)

# Get image description from command line
if len(sys.argv) < 2:
    print("Usage: python script.py <image_description>")
    sys.exit(1)

query = str(sys.argv[1])

# Create prompt template for refining image prompt
prompt = PromptTemplate(
    input_variables=["image_desc"],
    template="Generate a highly detailed, creative, and vivid DALL·E prompt for this description: {image_desc}"
)

# Run LLM chain to get refined image prompt
chain = LLMChain(llm=llm, prompt=prompt)
refined_prompt = chain.run(image_desc=query)

# Initialize OpenAI image client
client = OpenAIClient(api_key=api_key)

# Generate the image
response = client.images.generate(
    model="gpt-image-1",
    prompt=refined_prompt,
    size="1024x1024"
)

# Get the image URL
image_url = response.data[0].url
print(image_url)
