# main.py — ToolMemeX AI Assistant
# World-Class Professional AI Code Fixer & Feature Engineer

import os
import re
import requests
from github import Github
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_OWNER = os.getenv("REPO_OWNER")
REPO_NAME = os.getenv("REPO_NAME")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("DEEPSEEK_API_KEY")

# Load AI behavior rules
RULES_PATH = "rules.txt"
with open(RULES_PATH, "r") as f:
    RULES = f.read()

# Initialize GitHub access
g = Github(GITHUB_TOKEN)
repo = g.get_repo(f"{REPO_OWNER}/{REPO_NAME}")

# === GitHub Utility Functions ===

def get_open_issues():
    return repo.get_issues(state='open')

def fetch_repo_tree():
    return repo.get_git_tree("main", recursive=True).tree

def fetch_file_content(file_path):
    try:
        contents = repo.get_contents(file_path)
        return contents.decoded_content.decode()
    except:
        return ""

def update_file(file_path, new_content, message):
    contents = repo.get_contents(file_path)
    repo.update_file(contents.path, message, new_content, contents.sha)

def create_file(file_path, content, message):
    repo.create_file(file_path, message, content)

# === AI Fix Logic ===

def fix_error(error_message):
    prompt = f"""
You are ToolMemeX AI Fixer. Act as a world-class senior AI assistant. Follow these RULES strictly:

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
        "model": "deepseek-coder",
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

    print("\n=== DEBUG RESPONSE ===")
    print("Status Code:", response.status_code)
    print("Raw Response:", response.text)

    if response.status_code == 200:
        result = response.json()["choices"][0]["message"]["content"]
        print("\n=== AI RESPONSE ===\n")
        print(result)
        return result
    else:
        print("Error from DeepSeek API:", response.text)
        return ""

# === Apply Fix to GitHub ===

def apply_fix(ai_response):
    matches = re.findall(r"File: (.+?)\n```[a-z]*\n(.*?)\n```", ai_response, re.DOTALL)

    for raw_path, code in matches:
        file_path = raw_path.strip()

        # Auto-correct client/ prefix if not real
        if file_path.startswith("client/") and not fetch_file_content(file_path):
            corrected = file_path.replace("client/", "")
            print(f"Correcting path: {file_path} → {corrected}")
            file_path = corrected

        existing = fetch_file_content(file_path)
        action = "Updated" if existing else "Created"
        print(f"\n{action} file: {file_path}")

        try:
            if existing:
                update_file(file_path, code, f"{action} by ToolMemeX AI Assistant")
            else:
                create_file(file_path, code, f"{action} by ToolMemeX AI Assistant")
        except Exception as e:
            print(f"ERROR: Could not apply fix to {file_path}: {e}")

# === Static Error Message (Paste Here for Local Test) ===
error_input = """
3:02:19 PM: Failed during stage 'building site': Build script returned non-zero exit code: 2 (https://ntl.fyi/exit-code-2)
3:02:18 PM: Netlify Build                                                 
3:02:18 PM: $ npm run build
3:02:18 PM: > rest-express@1.0.0 build
3:02:18 PM: > vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
3:02:18 PM: sh: 1: vite: not found
3:02:18 PM: Command failed with exit code 127: npm run build (https://ntl.fyi/exit-code-127)
"""

# === Execute AI Fixer & Apply to Repo ===
fix = fix_error(error_input)
apply_fix(fix)
print("\n=== FINAL AI FIX APPLIED ===")