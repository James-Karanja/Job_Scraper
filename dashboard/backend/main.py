import os
import subprocess
import sys
import json
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv

# Load env from root
load_dotenv()
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import datetime

app = FastAPI()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WORKFLOW_SCRIPT = os.path.abspath("run_workflow.py")
LAST_RUN_FILE = ".tmp/last_run_status.txt"

class ScheduleRequest(BaseModel):
    hour: int
    minute: int
    active: bool

@app.post("/run")
async def run_workflow():
    try:
        # Run properly in background or blocking? Blocking for simplicity for now to return result
        # Ideally this should be a background task, but for a simple dashboard, blocking is okay-ish 
        # provided it doesn't timeout. Let's run it and wait.
        result = subprocess.run([sys.executable, WORKFLOW_SCRIPT], capture_output=True, text=True)
        
        status = "success" if result.returncode == 0 else "failed"
        timestamp = datetime.datetime.now().isoformat()
        
        # Save status
        os.makedirs(".tmp", exist_ok=True)
        with open(LAST_RUN_FILE, "w") as f:
            f.write(f"{status}|{timestamp}")
            
        if result.returncode != 0:
             return {"status": "error", "message": result.stderr}
             
        return {"status": "success", "message": "Workflow completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/status")
async def get_status():
    if not os.path.exists(LAST_RUN_FILE):
        return {"last_run": "Never", "status": "unknown"}
        
    with open(LAST_RUN_FILE, "r") as f:
        content = f.read().strip()
        
    try:
        status, timestamp = content.split("|")
        return {"last_run": timestamp, "status": status}
    except:
        return {"last_run": "Unknown", "status": "unknown"}

def get_current_cron_job():
    try:
        # List current cron jobs
        output = subprocess.check_output(["crontab", "-l"], text=True)
        # Look for our script
        for line in output.splitlines():
            if WORKFLOW_SCRIPT in line:
                # Parse: "0 9 * * * command"
                parts = line.split()
                if len(parts) >= 2:
                    return {"hour": int(parts[1]), "minute": int(parts[0]), "active": True}
        return {"hour": 9, "minute": 0, "active": False}
    except subprocess.CalledProcessError:
        # No crontab for user
        return {"hour": 9, "minute": 0, "active": False}

@app.get("/schedule")
async def get_schedule():
    return get_current_cron_job()

@app.post("/schedule")
async def update_schedule(req: ScheduleRequest):
    try:
        # 1. Get existing crontab
        try:
            current_cron = subprocess.check_output(["crontab", "-l"], text=True)
        except subprocess.CalledProcessError:
            current_cron = ""

        # 2. Filter out our script
        new_lines = [line for line in current_cron.splitlines() if WORKFLOW_SCRIPT not in line and line.strip()]

        # 3. Add new line if active
        if req.active:
            # Cron format: min hour * * * command
            new_line = f"{req.minute} {req.hour} * * * cd {os.path.dirname(WORKFLOW_SCRIPT)} && {sys.executable} {WORKFLOW_SCRIPT} >> output.log 2>&1"
            new_lines.append(new_line)

        # 4. Write back
        cron_content = "\n".join(new_lines) + "\n"
        process = subprocess.Popen(["crontab", "-"], stdin=subprocess.PIPE, text=True)
        process.communicate(cron_content)
        
        return {"status": "success", "schedule": req}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- LinkedIn Autofill Endpoint (Backend Specialist Additions) ---
from apify_client import ApifyClient

class ProfileRequest(BaseModel):
    linkedin_url: str

@app.post("/api/profile/autofill")
async def autofill_profile(req: ProfileRequest):
    """
    Fetches LinkedIn profile data via Apify and returns structured JSON.
    """
    api_key = os.getenv("APIFY_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="APIFY_API_KEY not configured in backend")

    # Initialize Client
    client = ApifyClient(api_key)
    
    # Run the Actor
    # Using 'apimaestro/linkedin-profile-detail' found in store.
    actor_id = "apimaestro/linkedin-profile-detail" 
    
    run_input = {
        "username": req.linkedin_url
    }
    
    try:
        # Start the run
        run = client.actor(actor_id).call(run_input=run_input)
        
        if not run:
             raise HTTPException(status_code=500, detail="Apify run failed to start")

        # Fetch results
        dataset_items = client.dataset(run["defaultDatasetId"]).list_items().items
        
        if not dataset_items:
             raise HTTPException(status_code=404, detail="No profile data found")
             
        raw_data = dataset_items[0]
        print(f"DEBUG: raw_data type: {type(raw_data)}")
        print(f"DEBUG: raw_data content: {raw_data}")

        if not isinstance(raw_data, dict):
             # If it's a string, likely an error message from the actor
             raise HTTPException(status_code=502, detail=f"Invalid data format from scraper: {raw_data}")
        
        # --- MAPPING LOGIC FOR APIMAESTRO/LINKEDIN-PROFILE-DETAIL ---
        # Structure is:
        # {
        #   "basic_info": { "first_name": "...", "last_name": "...", "headline": "...", "summary": "...", ... },
        #   "experience": [ { "title": "...", "company": "...", ... } ],
        #   "education": [ { "school": "...", "degree": "...", ... } ],
        #   "skills": [ "Skill 1", "Skill 2" ] (or list of objects, handled robustly below)
        # }

        basic_info = raw_data.get("basic_info", {})
        
        # Helper mapping functions
        def get_skills(data):
            # Skills might be at top level or nested. 
            # In the debug output, they appeared inside experience items too, but there is usually a top level 'skills' or 'languages_and_skills'
            # Let's check top level 'skills' first
            skills = data.get("skills", [])
            
            # Fallback: sometimes basic_info has it? Unlikely.
            
            if not skills: return []
            
            # Handle list of strings vs list of objects
            results = []
            for s in skills[:5]:
                if isinstance(s, str):
                    results.append(s)
                elif isinstance(s, dict):
                    results.append(s.get("name", str(s)))
            return results

        def get_experience(data):
            positions = data.get("experience", []) or data.get("positions", [])
            results = []
            for role in positions[:3]:
                if isinstance(role, str):
                    results.append(role)
                    continue
                
                title = role.get("title") or role.get("jobTitle") or ""
                company = role.get("company", "") or role.get("companyName", "")
                if title and company:
                    results.append(f"{title} at {company}")
                elif title:
                    results.append(title)
                elif company:
                   results.append(company)
            return results

        def get_education(data):
            educations = data.get("education", []) or data.get("educations", [])
            if not educations: return {"degree": "", "institution": ""}
            
            edu = educations[0]
            if isinstance(edu, str): return {"degree": edu, "institution": ""}
            
            return {
                "degree": edu.get("degree", "") or edu.get("degreeName", "") or "",
                "institution": edu.get("school", "") or edu.get("schoolName", "") or ""
            }

        # Construct final object
        mapped_data = {
            "fullName": f"{basic_info.get('first_name', '')} {basic_info.get('last_name', '')}".strip() or raw_data.get("name") or "",
            "bio": basic_info.get("summary") or basic_info.get("about") or raw_data.get("summary") or "",
            "currentTitle": basic_info.get("headline") or raw_data.get("headline") or "",
            "experience": get_experience(raw_data),
            "skills": get_skills(raw_data),
            "education": get_education(raw_data)
        }
        
        # --- GEMINI OPTIMIZATION ---
        try:
            import google.generativeai as genai
            
            gemini_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
            
            if gemini_key:
                print("DEBUG: Optimizing profile with Gemini...")
                genai.configure(api_key=gemini_key)
                model = genai.GenerativeModel('gemini-1.5-flash')
                
                prompt = f"""
                You are an expert LinkedIn profile consultant. Optimize the following JSON profile data to be more professional, engaging, and impactful.
                
                Input Data:
                {json.dumps(mapped_data)}
                
                Instructions:
                1. Bio: Rewrite the 'bio' to be a professional, first-person summary (approx 50-80 words) that highlights expertise and leadership. Use an engaging tone.
                2. Experience: For each experience item, keep the "Title at Company" format, but if possible, ensure it sounds professional. (Note: The input experience is a list of strings "Title at Company"). If you can't improve it, leave it. 
                3. Skills: Curate the 'skills' list to the top 5 most high-impact/marketable skills based on the bio/experience.
                
                Return ONLY valid JSON with the exact same keys: "fullName", "bio", "currentTitle", "experience", "skills", "education".
                Do not add markdown formatting like ```json.
                """
                
                response = model.generate_content(prompt)
                
                cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
                optimized_data = json.loads(cleaned_text)
                
                # Merge verified fields to ensure we don't lose critical data like name/edu if AI hallucinates
                mapped_data["bio"] = optimized_data.get("bio", mapped_data["bio"])
                mapped_data["skills"] = optimized_data.get("skills", mapped_data["skills"])
                # We trust the AI for these, but fallback to original if missing
                
                print("DEBUG: Gemini optimization successful.")
                return mapped_data
            else:
                print("DEBUG: Skipping Gemini optimization (No API Key found).")
                return mapped_data
                
        except Exception as e:
            print(f"DEBUG: Gemini optimization failed: {e}")
            # Fallback to mapped_data (raw)
            return mapped_data
            
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Scraping error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
