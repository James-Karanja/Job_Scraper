import os
import subprocess
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import datetime

app = FastAPI()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
