import os
import json
from dotenv import load_dotenv

# Try importing openai, handle if not installed
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("OpenAI library not found. Running in mock mode.")

load_dotenv()

INPUT_FILE = ".tmp/filtered_jobs.json"
OUTPUT_FILE = ".tmp/enriched_jobs.json"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def generate_outreach_message(job, client):
    title = job.get("title", "Candidate")
    company = job.get("company_name", "your company")
    description = job.get("description", "")
    
    # Prompt engineering
    prompt = f"""
    You are an expert recruiter assistant. Write a personalized, professional outreach email to the hiring manager at {company} for the position of {title}.
    
    Job Description Snippet:
    {description[:500]}...
    
    The email should be strict to business professional tone, 
    mention specific details from the description, and express strong interest.
    Keep it under 150 words.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful recruitment assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating message for {company}: {e}")
        return "[Error generating message]"

def mock_outreach_message(job):
    title = job.get("title", "Role")
    company = job.get("company_name", "Company")
    return f"(MOCK) Dear Hiring Manager at {company}, I am very interested in the {title} position. Your job description aligns perfectly with my skills..."

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"Input file {INPUT_FILE} not found.")
        return

    with open(INPUT_FILE, "r") as f:
        jobs = json.load(f)

    if not jobs:
        print("No jobs to process.")
        return

    client = None
    if OPENAI_AVAILABLE and OPENAI_API_KEY:
        print("OpenAI API Key found. Using real LLM.")
        client = OpenAI(api_key=OPENAI_API_KEY)
    else:
        print("WARNING: OPENAI_API_KEY not found or library missing. Using MOCK generation.")

    enriched_jobs = []
    print(f"Generating outreach for {len(jobs)} jobs...")
    
    for job in jobs:
        if client:
            message = generate_outreach_message(job, client)
        else:
            message = mock_outreach_message(job)
        
        job["outreach_message"] = message
        enriched_jobs.append(job)

    with open(OUTPUT_FILE, "w") as f:
        json.dump(enriched_jobs, f, indent=2)

    print(f"Saved enriched jobs to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
