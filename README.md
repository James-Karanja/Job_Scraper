# Job Scraper & Outreach Automation

This tool automates the process of finding Executive Assistant jobs from various job boards (via Apify), filtering them for specific criteria (Remote, English, Role), generating personalized outreach messages using AI, and saving everything to a Google Sheet.

## Prerequisites

1. **Python 3.9+**
2. **Apify Account** (for scraping)
3. **Google Cloud Project** (for Sheets API)
4. **OpenAI API Key** (for outreach generation)

## Installation

1. Clone the repository:
   ```bash
   git clone <repo_url>
   cd job-scraper
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: Requires `apify-client`, `google-auth`, `gspread`, `openai`, `python-dotenv`, `pandas`)*

3. Set up environment variables in `.env`:
   ```bash
   APIFY_API_KEY=your_apify_key
   OPENAI_API_KEY=your_openai_key
   GOOGLE_SHEETS_CREDENTIALS_PATH=credentials.json
   ```

4. Place your Google Service Account JSON file as `credentials.json` in the root folder and share your target Google Sheet with the service account email.

## Usage

Run the full workflow manually:
```bash
python run_workflow.py
```

### What it does:
1. **Scrapes** jobs using Apify (`execution/scrape_from_apify.py`).
2. **Filters** jobs for Remote/English/EA roles (`execution/filter_jobs.py`).
3. **Generates** outreach messages using OpenAI (`execution/generate_outreach.py`).
4. **Saves** enriched data to Google Sheets (`execution/save_to_sheets.py`).

## Automation (Scheduling)

To run this daily, use a **cron job** (Linux/Mac) or **Task Scheduler** (Windows).

### macOS / Linux (Cron)

1. Open crontab:
   ```bash
   crontab -e
   ```

2. Add a line to run daily at 9:00 AM:
   ```bash
   0 9 * * * cd /path/to/job-scraper && /usr/bin/python3 run_workflow.py >> output.log 2>&1
   ```
   *(Replace `/path/to/job-scraper` and `/usr/bin/python3` with your actual paths)*

## Troubleshooting

- **Scraper fails?** Check Apify console for run logs. Ensure sufficient credits.
- **No Google Sheets update?** Check `credentials.json` permissions (share sheet with client_email).
- **No Outreach Message?** Ensure `OPENAI_API_KEY` is valid. If missing, it uses a mock message.
