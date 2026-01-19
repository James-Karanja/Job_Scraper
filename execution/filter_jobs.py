import json
import os

INPUT_FILE = ".tmp/scraped_jobs.json"
OUTPUT_FILE = ".tmp/filtered_jobs.json"

TARGET_ROLES = ["executive assistant", "virtual assistant"]
TARGET_LANGUAGE = "english"

def is_remote(job):
    # Check common fields for remote status
    # This depends on the scraper output schema. adapting to common patterns.
    # We look for 'remote', 'location', 'isRemote', etc.
    
    # Simple check: look for 'remote' in string values of keys like 'location', 'type', 'remote'
    search_text = str(job.get("location", "")).lower() + " " + \
                  str(job.get("description", "")).lower() + " " + \
                  str(job.get("employmentType", "")).lower() + " " + \
                  str(job.get("job_type", "")).lower() + " " + \
                  str(job.get("isRemote", "")).lower()
                  
    return "remote" in search_text

def is_target_role(job):
    title = str(job.get("title", "")).lower()
    return any(role in title for role in TARGET_ROLES)

def is_english(job):
    # If the scraper provides language, use it.
    # Otherwise, simple heuristic: check description for common English words?
    # Or just assume yes if not specified, as "Language is English" is a requirement.
    # Implementing a simple check if 'language' field exists.
    lang = job.get("language")
    if lang:
        return "en" in str(lang).lower()
    
    # Fallback: check if description contains common English words
    desc = str(job.get("description", "")).lower()
    common_words = ["the", "and", "to", "of", "in", "is"]
    match_count = sum(1 for word in common_words if f" {word} " in desc)
    
    # If match count is high enough, assume English. If description is short/empty, assume yes (don't filter out false negatives).
    if len(desc) < 50: 
        return True
        
    return match_count >= 2

def filter_jobs():
    if not os.path.exists(INPUT_FILE):
        print(f"Input file {INPUT_FILE} not found.")
        return

    with open(INPUT_FILE, "r") as f:
        jobs = json.load(f)

    print(f"Loaded {len(jobs)} jobs. Filtering...")

    filtered_jobs = []
    for job in jobs:
        if is_remote(job) and is_target_role(job) and is_english(job):
            filtered_jobs.append(job)

    print(f"Filtered down to {len(filtered_jobs)} jobs.")

    with open(OUTPUT_FILE, "w") as f:
        json.dump(filtered_jobs, f, indent=2)

    print(f"Saved filtered jobs to {OUTPUT_FILE}")

if __name__ == "__main__":
    filter_jobs()
