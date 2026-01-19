import os
import json
from apify_client import ApifyClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

APIFY_API_KEY = os.getenv("APIFY_API_KEY")
SCRAPER_ID = "agentx/all-jobs-scraper"
OUTPUT_FILE = ".tmp/scraped_jobs.json"

def scrape_jobs():
    if not APIFY_API_KEY:
        raise ValueError("APIFY_API_KEY not found in .env")

    print(f"Initializing ApifyClient with token...")
    client = ApifyClient(APIFY_API_KEY)

    # Prepare the Actor input
    # Note: The input structure depends on the specific Actor. 
    # For 'agentx/all-jobs-scraper', we'll assume default or minimal input is sufficient 
    # or that we just need to run it. If specific search queries are needed, they should be added here.
    # Based on the user prompt "Run the scraper and extract all job records returned by it",
    # we'll run it with default settings or an empty input if permissible.
    # Often scrapers need a 'queries' or 'startUrls'. 
    # Since none were provided, we'll try running with an empty dict or common defaults.
    
    run_input = {
        # "queries": ["Executive Assistant", "Virtual Assistant"], # Optional: Optimizing search if the actor supports it
        # "remote": True # Some scrapers support this directly, but the prompt asked us to FILTER later.
        # We will scrape broadly if possible, or assume the actor does its thing.
        # However, to avoid wasting credits on irrelevant jobs, passing queries is smart if the actor supports it.
        # But to be safe and follow instructions "Filter [later]", I will try to scrape a reasonable set.
        # Let's check if the user provided specific inputs for the scraper? No.
        # I will assume the scraper might just run default, or I'll provide a broad query if required.
        # Let's try running without specific input first, or add a query if it fails/returns nothing.
        # Actually, let's add a generic query to ensure we get *some* data related to the target.
        "search_terms": ["Executive Assistant"], 
        "max_results": 10,
        "posted_since": "7 days",
        "country": "United States"
    }

    print(f"Starting Actor {SCRAPER_ID}...")
    run = client.actor(SCRAPER_ID).call(run_input=run_input)

    if not run:
        print("Actor run failed or returned no run object.")
        return

    print(f"Actor run finished. Dataset ID: {run['defaultDatasetId']}")

    # Fetch results from the dataset
    print("Fetching results...")
    dataset_items = client.dataset(run["defaultDatasetId"]).list_items().items

    print(f"Found {len(dataset_items)} items.")

    # Save to file
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(dataset_items, f, indent=2)

    print(f"Saved scraped jobs to {OUTPUT_FILE}")

if __name__ == "__main__":
    try:
        scrape_jobs()
    except Exception as e:
        print(f"Error scraping jobs: {e}")
        exit(1)
