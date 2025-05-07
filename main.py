ai_fixer.py — ToolMemeX AI Assistant

World-Class Professional AI Code Fixer & Feature Engineer

import os import openai import requests from github import Github

Load environment variables

from dotenv import load_dotenv load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN") REPO_OWNER = os.getenv("REPO_OWNER") REPO_NAME = os.getenv("REPO_NAME") OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("DEEPSEEK_API_KEY")

Load AI behavior rules

RULES_PATH = "rules.txt" with open(RULES_PATH, "r") as f: RULES = f.read()

Initialize GitHub access

g = Github(GITHUB_TOKEN) repo = g.get_repo(f"{REPO_OWNER}/{REPO_NAME}")

def get_open_issues(): return repo.get_issues(state='open')

def fetch_repo_tree(): return repo.get_git_tree("main", recursive=True).tree

def fetch_file_content(file_path): try: contents = repo.get_contents(file_path) return contents.decoded_content.decode() except: return ""

def update_file(file_path, new_content, message): contents = repo.get_contents(file_path) repo.update_file(contents.path, message, new_content, contents.sha)

def create_file(file_path, content, message): repo.create_file(file_path, message, content)

def fix_error(error_message): prompt = f""" You are ToolMemeX AI Fixer. Act as a world-class senior AI assistant. Follow these RULES strictly:

{RULES}

Analyze this error and determine the professional fix:

ERROR:
{error_message}

Provide a list of updated or new files and professional-level code inside each.
Be precise, consistent, and do not fix anything not related to this error unless approved by rules.
"""

headers = {
    "Authorization": f"Bearer {OPENAI_API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "model": "deepseek-coder:latest",
    "messages": [
        {"role": "system", "content": "You are a professional AI engineer."},
        {"role": "user", "content": prompt}
    ],
    "temperature": 0.2
}

response = requests.post(
    "https://api.deepseek.com/v1/chat/completions",
    headers=headers,
    json=payload
)

if response.status_code == 200:
    result = response.json()["choices"][0]["message"]["content"]
    print("\nAI RESPONSE:\n")
    print(result)
    return result
else:
    print("Error from DeepSeek API:", response.text)
    return ""

# === Static Error Message for Easy Paste ===
error_input = """
Paste your error message here between the triple quotes
"""

fix_error(error_input)