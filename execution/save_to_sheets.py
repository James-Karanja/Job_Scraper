import os
import json
import gspread
from google.oauth2.service_account import Credentials
from dotenv import load_dotenv

load_dotenv()

INPUT_FILE = ".tmp/enriched_jobs.json"
CREDENTIALS_PATH = os.getenv("GOOGLE_SHEETS_CREDENTIALS_PATH", "credentials.json")
# Spreadsheet ID extracted from URL: https://docs.google.com/spreadsheets/d/1jE_OLzb_2DKKY19HVNU642DZQ45NM7PuOQWG4hvChlA/edit?gid=0#gid=0
SPREADSHEET_KEY = "1jE_OLzb_2DKKY19HVNU642DZQ45NM7PuOQWG4hvChlA"

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

def save_to_sheets():
    if not os.path.exists(INPUT_FILE):
        print(f"Input file {INPUT_FILE} not found.")
        return

    with open(INPUT_FILE, "r") as f:
        jobs = json.load(f)

    if not jobs:
        print("No jobs to save.")
        return

    if not os.path.exists(CREDENTIALS_PATH):
        print(f"ERROR: Google Credentials file not found at {CREDENTIALS_PATH}")
        print("Please place your 'credentials.json' (Service Account) in the project root.")
        print("Creating a backup CSV instead...")
        import pandas as pd
        df = pd.DataFrame(jobs)
        df.to_csv(".tmp/filtered_jobs_backup.csv", index=False)
        print("Backup saved to .tmp/filtered_jobs_backup.csv")
        return

    print("Authenticating with Google...")
    creds = Credentials.from_service_account_file(CREDENTIALS_PATH, scopes=SCOPES)
    client = gspread.authorize(creds)

    print(f"Opening spreadsheet with key {SPREADSHEET_KEY}...")
    try:
        sh = client.open_by_key(SPREADSHEET_KEY)
    except Exception as e:
        print(f"Error opening spreadsheet: {e}")
        print("Make sure the Service Account email is shared with the Sheet!")
        return


    worksheet = sh.get_worksheet(0) # First sheet

    # Define specific headers we want
    HEADERS = [
        "Job Posting URL", "Title", "Company", "Location", "Remote", "Salary", "Posted Date", "Platform", "Job Description", "Outreach Message"
    ]

    # Helper to format salary
    def format_salary(job):
        min_sal = job.get("salary_minimum")
        max_sal = job.get("salary_maximum")
        currency = job.get("salary_currency", "")
        if min_sal and max_sal:
            return f"{min_sal} - {max_sal} {currency}"
        elif min_sal:
            return f"{min_sal}+ {currency}"
        return "N/A"

    # Prepare rows
    rows_to_add = [HEADERS]
    for job in jobs:
        row = [
            str(job.get("official_url") or job.get("platform_url", "")),
            str(job.get("title", "")),
            str(job.get("company_name", "")),
            str(job.get("location", "")),
            "Yes" if job.get("is_remote") else "No",
            format_salary(job),
            str(job.get("posted_date", "")),
            str(job.get("platform", "")),
            str(job.get("description", ""))[:5000], # Truncate description slightly to avoid cell limits if needed
            str(job.get("outreach_message", ""))
        ]
        rows_to_add.append(row)

    print(f"Clearing sheet and writing {len(rows_to_add)} rows (including header)...")
    worksheet.clear()
    worksheet.update(values=rows_to_add)
    print("Done.")

if __name__ == "__main__":
    save_to_sheets()
