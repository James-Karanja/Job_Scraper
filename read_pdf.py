from pypdf import PdfReader

pdf_path = "/Users/dev/AnitGravity Codes/Job Scraper/Executive Assistant Job Outreach Automation.pdf"

try:
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    print(text)
except Exception as e:
    print(f"Error reading PDF: {e}")
