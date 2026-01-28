from apify_client import ApifyClient
from dotenv import load_dotenv
import os
import json

# Load env
load_dotenv()

api_key = os.getenv("APIFY_API_KEY")
if not api_key:
    print("Error: APIFY_API_KEY not found")
    exit(1)

client = ApifyClient(api_key)

# Test Variables
actor_id = "apimaestro/linkedin-profile-detail"
target_url = "https://www.linkedin.com/in/james-njenga-karanja/"

# Try 1: As 'username' (Full URL)
print(f"--- Attempt 1: Sending full URL as 'username' to {actor_id} ---")
run_input = {
    "username": target_url
}

try:
    run = client.actor(actor_id).call(run_input=run_input)
    print(f"Run ID: {run.get('id')}")
    print(f"Run Status: {run.get('status')}")
    
    dataset_id = run["defaultDatasetId"]
    items = client.dataset(dataset_id).list_items().items
    
    if items:
        data = items[0]
        import pprint
        print("--- FULL RAW DATA ---")
        pprint.pprint(data)
    else:
        print("No items returned in dataset.")

except Exception as e:
    print(f"Error: {e}")
