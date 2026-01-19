import subprocess
import sys
import os

SCRIPTS = [
    "execution/scrape_from_apify.py",
    "execution/filter_jobs.py",
    "execution/generate_outreach.py",
    "execution/save_to_sheets.py"
]

def run_step(script_path):
    print(f"\n--- Running {script_path} ---")
    try:
        # Run script and capture output to show in real-time or just let it print to stdout
        subprocess.check_call([sys.executable, script_path])
        print(f"--- {script_path} completed successfully ---")
    except subprocess.CalledProcessError as e:
        print(f"--- {script_path} FAILED with exit code {e.returncode} ---")
        return False
    return True

def main():
    print("Starting Job Scraper Workflow...")
    
    # Ensure directories exist
    os.makedirs(".tmp", exist_ok=True)
    os.makedirs("execution", exist_ok=True)
    
    for script in SCRIPTS:
        if not run_step(script):
            print("Workflow stopped due to error.")
            sys.exit(1)
            
    print("\nJob Scraper Workflow completed successfully!")

if __name__ == "__main__":
    main()
