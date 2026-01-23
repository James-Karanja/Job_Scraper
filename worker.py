import time
import subprocess
import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Use service role key for worker to write logs freely

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env")
    print("Please create a .env file with these credentials.")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def log_to_db(job_id, level, message):
    """Writes a log entry to Supabase."""
    try:
        supabase.table("logs").insert({
            "job_id": job_id,
            "level": level,
            "message": message
        }).execute()
        print(f"[{level}] {message}")
    except Exception as e:
        print(f"Failed to log to DB: {e}")

def run_job(job_request):
    job_id = job_request['id']
    print(f"Starting job {job_id}...")
    
    # Update status to processing
    supabase.table("job_requests").update({"status": "processing"}).eq("id", job_id).execute()
    log_to_db(job_id, "INFO", "Job started. Initializing workflow...")
    
    # Prepare arguments from preferences if needed
    # For now, we run the standard workflow
    
    try:
        # Run the workflow script
        # Using -u for unbuffered output to capture logs in real-time
        process = subprocess.Popen(
            [sys.executable, "-u", "run_workflow.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1 # Line buffered
        )
        
        # Stream output to DB
        for line in process.stdout:
            line = line.strip()
            if line:
                log_to_db(job_id, "INFO", line)
                
        process.wait()
        
        if process.returncode == 0:
            supabase.table("job_requests").update({"status": "completed", "result_summary": "Workflow completed successfully."}).eq("id", job_id).execute()
            log_to_db(job_id, "SUCCESS", "Workflow finished successfully.")
        else:
            supabase.table("job_requests").update({"status": "failed", "result_summary": f"Process exited with code {process.returncode}"}).eq("id", job_id).execute()
            log_to_db(job_id, "ERROR", f"Workflow failed with exit code {process.returncode}")
            
    except Exception as e:
        error_msg = str(e)
        supabase.table("job_requests").update({"status": "failed", "result_summary": error_msg}).eq("id", job_id).execute()
        log_to_db(job_id, "ERROR", f"Worker exception: {error_msg}")

def main():
    print("Worker started. Polling for jobs...")
    while True:
        try:
            # Poll for pending jobs
            response = supabase.table("job_requests").select("*").eq("status", "pending").limit(1).execute()
            jobs = response.data
            
            if jobs:
                run_job(jobs[0])
            else:
                # Sleep to avoid spamming the DB
                time.sleep(5)
                
        except Exception as e:
            print(f"Polling loop error: {e}")
            time.sleep(10)

if __name__ == "__main__":
    main()
