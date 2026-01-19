# Job Scraper SOP

**Goal**: Scrape jobs from Apify, filter for "Remote Executive/Virtual Action" roles in English, and append them to a Google Sheet.

## Inputs
- **Apify Scraper ID**: `agentx/all-jobs-scraper`
- **Apify API Key**: From `.env` (`APIFY_API_KEY`)
- **Google Sheet URL**: `https://docs.google.com/spreadsheets/d/1jE_OLzb_2DKKY19HVNU642DZQ45NM7PuOQWG4hvChlA/edit?gid=0#gid=0`

## Workflow Steps

1. **Scrape Jobs**
   - Tool: `execution/scrape_from_apify.py`
   - Description: Calls Apify Actor to get raw job data.
   - Output: `.tmp/scraped_jobs.json`

2. **Filter Jobs**
   - Tool: `execution/filter_jobs.py`
   - Description: Reads raw jobs. Filters for:
     - Remote == Yes
     - Job Title matches "Executive Assistant" or "Virtual Assistant" (fuzzy match)
     - Language == "English"
   - Output: `.tmp/filtered_jobs.json`

3. **Save to Google Sheets**
   - Tool: `execution/save_to_sheets.py`
   - Description: Uploads filtered jobs to the specified Google Sheet.
   - Auth: Requires `credentials.json` (Service Account or OAuth).
   - Action: Appends rows. Maps JSON fields to Columns.

## Error Handling
- If Scraper fails: Retry once, then log error.
- If Filter returns 0 jobs: Stop, log "No matching jobs found".
- If Sheets fails (auth/network): Log error, save to `.tmp/filtered_jobs.csv` as backup.
